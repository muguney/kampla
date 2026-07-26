-- Kamp.la — reports (PRD 6.10, 5.M "Hata Bildir")

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  reporter_id uuid references public.profiles (id) on delete set null,
  description text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reports_location_id_idx on public.reports (location_id);
create index if not exists reports_status_idx on public.reports (status);

create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

alter table public.reports enable row level security;

-- Kullanıcı yalnızca kendi gönderdiği bildirimleri görebilir; adminler hepsini görür (kuyruk — PRD 5.R).
create policy "reports_select_own_or_admin"
  on public.reports for select
  using (reporter_id = auth.uid() or public.is_admin());

create policy "reports_insert_authenticated"
  on public.reports for insert
  to authenticated
  with check (reporter_id = auth.uid());

-- Durum güncellemesi (open → reviewing → resolved) yalnızca admin tarafından yapılır.
create policy "reports_update_admin"
  on public.reports for update
  using (public.is_admin());

create policy "reports_delete_admin"
  on public.reports for delete
  using (public.is_admin());
