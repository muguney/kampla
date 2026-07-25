-- Kamp.la — Faz 0: uzantılar ve yardımcı fonksiyonlar
-- PRD Bölüm 7.1 "Veritabanı — Supabase (PostgreSQL + PostGIS)"

create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "postgis";    -- geography(Point, 4326)

-- updated_at kolonlarını otomatik güncelleyen tetikleyici fonksiyonu
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Çağıran kullanıcının admin olup olmadığını kontrol eden yardımcı fonksiyon.
-- RLS politikalarında tekrar tekrar alt sorgu yazmamak için kullanılır.
-- `security definer` ile tanımlanır ki RLS'e takılmadan `profiles` tablosunu okuyabilsin.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
