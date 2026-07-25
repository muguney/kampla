-- Kamp.la — Faz 4 Adım 5: Konum fotoğrafları (PRD 5.G madde 5)
-- DECISIONS.md (2026-07-25 "Faz 4 fotoğraf depolama yaklaşımı") — ayrı bir
-- `location_photos` tablosu yerine `locations.photo_urls text[]` kolonu +
-- Supabase Storage `location-photos` bucket'ı (R2 gelene kadar geçici çözüm).

alter table public.locations
  add column if not exists photo_urls text[] not null default '{}';

-- Storage bucket: herkes (misafir dahil) fotoğrafları görebilir (public read),
-- yalnızca giriş yapmış kullanıcılar yükleyebilir (PRD 5.G Adım 5).
insert into storage.buckets (id, name, public)
values ('location-photos', 'location-photos', true)
on conflict (id) do nothing;

-- storage.objects üzerindeki RLS zaten Supabase tarafından etkin geliyor;
-- burada yalnızca `location-photos` bucket'ına özgü policy'ler ekleniyor.
create policy "location_photos_select_public"
  on storage.objects for select
  using (bucket_id = 'location-photos');

create policy "location_photos_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'location-photos');

-- Kullanıcı yalnızca kendi yüklediği (ilk klasör segmenti kendi `auth.uid()`'ı
-- olan) dosyaları güncelleyebilir/silebilir — `WizardStep5Photos.vue` dosyaları
-- `${auth.uid()}/${uuid}.${ext}` yoluna yüklüyor (bkz. component yorumu).
create policy "location_photos_update_own"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'location-photos' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'location-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "location_photos_delete_own"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'location-photos' and (storage.foldername(name))[1] = auth.uid()::text);
