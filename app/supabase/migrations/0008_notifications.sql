-- Kamp.la — notifications (PRD 6.11, 5.Q "Bildirimler — Uygulama İçi")
-- MVP'de push (FCM/APNs) yok; bu tablo doğrudan uygulama içi bildirim listesi olarak kullanılır.

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  type text not null, -- örn: 'location_approved' | 'location_rejected' | 'report_status_changed'
  content text not null,
  related_location_id uuid references public.locations (id) on delete set null,
  related_report_id uuid references public.reports (id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_recipient_id_idx on public.notifications (recipient_id);
create index if not exists notifications_is_read_idx on public.notifications (is_read);

alter table public.notifications enable row level security;

-- Kullanıcı yalnızca kendi bildirimlerini görebilir/okundu işaretleyebilir.
create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = recipient_id);

create policy "notifications_update_own"
  on public.notifications for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

-- Bildirim oluşturma yalnızca admin/sunucu tarafı (Edge Function, service_role) ile yapılır;
-- normal kullanıcılar kendine bildirim yazamaz.
create policy "notifications_insert_admin"
  on public.notifications for insert
  to authenticated
  with check (public.is_admin());

create policy "notifications_delete_own"
  on public.notifications for delete
  using (auth.uid() = recipient_id);
