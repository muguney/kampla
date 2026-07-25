-- Kamp.la — locations (PRD 6.1, 6.3, 6.4, 6.5, 7.1)
-- Kullanıcı katkılı POI'ler + referans/bilgi katmanı (milli park, yayla, antik kent)
-- aynı tabloda tutulur; `is_reference_layer` + `reference_type` ile ayrılır (PRD 6.5).

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles (id) on delete set null,

  name text not null,
  description text,

  -- PRD 6.1 — 9 kategori (yalnızca kullanıcı POI'leri için zorunlu)
  location_type text check (
    location_type in (
      'paid-caravan', 'free-caravan',
      'paid-parking', 'free-parking',
      'paid-tent', 'free-tent',
      'water', 'laundry', 'shower'
    )
  ),

  -- PRD 6.5 — Referans/bilgi katmanı (milli park, yayla, antik/tarihi kent)
  is_reference_layer boolean not null default false,
  reference_type text check (reference_type in ('national-park', 'plateau', 'historic')),

  -- Konum: lat/lng elle yazılır, `geom` PostGIS geography olarak otomatik türetilir
  -- (PRD 7.1 — "geography(Point,4326) kolonu + GIST spatial index").
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  geom geography(Point, 4326) generated always as (
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  ) stored,

  phone text,
  website_url text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  x_url text,

  -- PRD 6.3 — Konaklama imkanları (bağımsız çoklu seçim katmanı)
  accommodation_types text[] not null default '{}',

  -- PRD 6.4 — Sezon
  season text check (season in ('summer', 'winter', 'all')),

  -- PRD 5.M / 7.1 — Moderasyon
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  source text not null default 'user' check (source in ('user', 'admin', 'import')),
  rejection_reason text,

  city text,
  region text,

  rating_avg numeric(2, 1) not null default 0,
  rating_count integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint locations_type_or_reference check (
    (is_reference_layer = false and location_type is not null)
    or (is_reference_layer = true and reference_type is not null)
  ),
  constraint locations_accommodation_types_valid check (
    accommodation_types <@ array['caravan', 'tent', 'bungalow']::text[]
  )
);

create index if not exists locations_geom_gist_idx on public.locations using gist (geom);
create index if not exists locations_status_idx on public.locations (status);
create index if not exists locations_location_type_idx on public.locations (location_type);
create index if not exists locations_created_by_idx on public.locations (created_by);

create trigger locations_set_updated_at
  before update on public.locations
  for each row execute function public.set_updated_at();

alter table public.locations enable row level security;

-- Herkes (misafir dahil) yalnızca yayınlanmış konumları görebilir (PRD 7.1 moderasyon notu).
create policy "locations_select_published"
  on public.locations for select
  using (status = 'published');

-- Kullanıcı kendi pending/rejected kayıtlarını da görebilir (PRD 5.M — "kullanıcı yalnızca kendi pending kayıtlarını görebilir").
create policy "locations_select_own"
  on public.locations for select
  using (auth.uid() = created_by);

-- Adminler tüm konumları (durum fark etmeksizin) görebilir.
create policy "locations_select_admin"
  on public.locations for select
  using (public.is_admin());

-- Giriş yapmış kullanıcılar konum ekleyebilir; kendi eklediği kayıtta source='user', status='pending' olmalı.
create policy "locations_insert_user"
  on public.locations for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and source = 'user'
    and status = 'pending'
  );

-- Adminler her durumda/kaynaktan (manuel + Excel/CSV import) konum ekleyebilir (PRD 5.M, 5.R).
create policy "locations_insert_admin"
  on public.locations for insert
  to authenticated
  with check (public.is_admin());

-- Kullanıcı kendi eklediği konumu düzenleyebilir (PRD 5.F "Düzenle").
create policy "locations_update_own"
  on public.locations for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- Adminler tüm konumları güncelleyebilir (moderasyon onay/red — PRD 5.R).
create policy "locations_update_admin"
  on public.locations for update
  using (public.is_admin());

create policy "locations_delete_admin"
  on public.locations for delete
  using (public.is_admin());
