-- Kamp.la — reviews (PRD 6.8, 5.I "Yorum & Değerlendirme Sistemi")

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (location_id, user_id)
);

create index if not exists reviews_location_id_idx on public.reviews (location_id);
create index if not exists reviews_user_id_idx on public.reviews (user_id);

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

alter table public.reviews enable row level security;

-- Yayınlanmış bir konumun yorumları herkese açık.
create policy "reviews_select_for_published_location"
  on public.reviews for select
  using (
    exists (
      select 1 from public.locations l
      where l.id = location_id and l.status = 'published'
    )
    or user_id = auth.uid()
    or public.is_admin()
  );

create policy "reviews_insert_own"
  on public.reviews for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "reviews_update_own"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "reviews_delete_own"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- Adminler uygunsuz yorumları kaldırabilir (PRD 5.M "Yorum moderasyonu").
create policy "reviews_delete_admin"
  on public.reviews for delete
  using (public.is_admin());

-- Konumun rating_avg / rating_count alanlarını yorum eklendikçe güncelleyen tetikleyici.
create or replace function public.refresh_location_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_location_id uuid := coalesce(new.location_id, old.location_id);
begin
  update public.locations l
  set
    rating_avg = coalesce((select round(avg(r.rating)::numeric, 1) from public.reviews r where r.location_id = target_location_id), 0),
    rating_count = (select count(*) from public.reviews r where r.location_id = target_location_id)
  where l.id = target_location_id;
  return null;
end;
$$;

create trigger reviews_refresh_location_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_location_rating();
