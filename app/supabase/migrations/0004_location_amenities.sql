-- Kamp.la — location_amenities (PRD 6.2 — 19 hizmet/imkan, çoklu seçim join tablosu)

create table if not exists public.location_amenities (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  amenity text not null check (
    amenity in (
      'shower', 'electricity', 'fridge', 'vehicle-entry', 'hot-shower',
      'near-sea', 'campfire-grill', 'pet-friendly', 'washing-machine',
      'paid-general', 'gsm-signal', 'toilet-drain', 'water-fill',
      'caravan-waste-drain', 'free-wifi', 'toilet', 'market-nearby',
      'playground', 'dryer'
    )
  ),
  unique (location_id, amenity)
);

create index if not exists location_amenities_location_id_idx
  on public.location_amenities (location_id);

alter table public.location_amenities enable row level security;

-- Bir konumun imkanları, o konumun kendisi görünürse (RLS ile) görünür.
create policy "location_amenities_select"
  on public.location_amenities for select
  using (
    exists (
      select 1 from public.locations l
      where l.id = location_id
    )
  );

create policy "location_amenities_insert_owner_or_admin"
  on public.location_amenities for insert
  to authenticated
  with check (
    exists (
      select 1 from public.locations l
      where l.id = location_id
        and (l.created_by = auth.uid() or public.is_admin())
    )
  );

create policy "location_amenities_update_owner_or_admin"
  on public.location_amenities for update
  using (
    exists (
      select 1 from public.locations l
      where l.id = location_id
        and (l.created_by = auth.uid() or public.is_admin())
    )
  );

create policy "location_amenities_delete_owner_or_admin"
  on public.location_amenities for delete
  using (
    exists (
      select 1 from public.locations l
      where l.id = location_id
        and (l.created_by = auth.uid() or public.is_admin())
    )
  );
