-- Kamp.la — profiles.suspended (PRD 5.R "Kullanıcı Yönetimi" — hesap askıya alma)
-- Admin panelinden (apps/admin/pages/kullanicilar.vue) tek tuşla açılıp kapatılan
-- bir bayrak. Kapsam bilinçli olarak dar tutuldu: bu kolon login/RLS davranışını
-- DEĞİŞTİRMEZ (bkz. TASKS.md Faz 8 notu) — yalnızca admin panelinde görünen bir
-- durum rozeti/aksiyonu. `profiles_update_admin` policy'si (0002_profiles.sql)
-- `public.is_admin()` ile zaten tüm `profiles` update'lerine izin verdiği için
-- ekstra bir RLS policy'ye gerek yok.

alter table public.profiles
  add column if not exists suspended boolean not null default false;
