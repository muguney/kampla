# Faz Planı — Kamp.la

Kaynak: `PRD.md` Bölüm 7.3. 13 fazlı plan; her faz kendi başına çalışan/test
edilebilir bir durumda bırakılmalı.

## Faz 0 — İskelet 🟡 Devam ediyor
pnpm workspaces monorepo (`apps/mobile-web`, `apps/admin`, `packages/shared`),
Nuxt 3 + Tailwind + Pinia, tasarım sistemi (renk/font) Tailwind config'e,
temel layout (üst bar + alt nav), Supabase bağlantısı + SQL migration'lar
(PRD Bölüm 6 veri modeli), placeholder route'lar, i18n (TR/EN) ve tema
(light/dark) altyapısı.
**DoD:** `pnpm dev` ile çalışan, alt navigasyonu gezilebilir bir iskelet.

## Faz 1 — Kimlik Doğrulama
Login/Register/Forgot Password, Supabase Auth (e-posta/şifre + Google OAuth).
**DoD:** Kullanıcı kayıt olup giriş yapabiliyor.

## Faz 2 — Harita & Keşif (salt okunur)
MapLibre entegrasyonu, 3 harita katmanı, statik/sahte veriyle pin gösterimi,
Liste görünümü, Arama, Filtre.
**DoD:** Harita açılıyor, pin'ler görünüyor, liste/harita geçişi çalışıyor.

## Faz 3 — POI Detay
Galeri, Detaylar sekmesi, Yorumlar sekmesi (salt okuma).
**DoD:** Bir pin'e tıklayınca tam detay sayfası açılıyor.

## Faz 4 — Kullanıcı Katkısı
Konum Ekle sihirbazı (6 adım) uçtan uca, PostGIS'e yazma, moderasyon
durum alanı (`pending`/`published`/`rejected`).
**DoD:** Kullanıcı yeni konum ekleyebiliyor, admin onayı bekliyor.

## Faz 5 — Etkileşim
Yorum yazma, favoriye ekleme, özel liste oluşturma/paylaşma.
**DoD:** Yorum/favori/liste akışları uçtan uca çalışıyor.

## Faz 6 — Hesap & Ayarlar
Hesabım, ayarlar, dil/tema, "Kamp.la Hakkında", paylaşılan profil/liste
sayfaları.
**DoD:** Hesap yönetimi ve public sayfalar tamam.

## Faz 7 — Bildirimler
`notifications` tablosu, uygulama içi bildirim ekranı, hata bildirimi ve
konum onay/red olaylarının bildirime bağlanması.
**DoD:** Kullanıcı uygulama içi bildirim alıyor.

## Faz 8 — Admin Paneli
Ayrı Nuxt uygulaması — moderasyon kuyruğu, manuel konum CRUD, Excel/CSV
içe aktarma, kullanıcı/tier yönetimi, statik içerik yönetimi.
**DoD:** Admin panelinden konum onaylanabiliyor.

## Faz 9 — Premium & Ödeme
`subscriptions` tablosu, RevenueCat entegrasyonu, özellik kısıtlamaları
(harita katmanı, filtre sayısı, liste sayısı).
**DoD:** Ücretsiz/Premium ayrımı gerçek satın alma ile çalışıyor.

## Faz 10 — Mobil Paketleme
Capacitor kurulumu, native plugin entegrasyonları, iOS/Android build.
**DoD:** iOS/Android cihazda çalışan build var.

## Faz 11 — Offline Harita
Bölgesel PMTiles paketleme + indirme akışı.
**DoD:** Kullanıcı bir bölgeyi indirip internetsiz kullanabiliyor.

## Faz 12 — Rota Motoru
Valhalla/OSRM entegrasyonu (karavan kısıtlamalı rotalama).
**DoD:** Uygulama içi karavan-güvenli rota önerisi çalışıyor.

---
**Not:** Faz 8-12 kapsamlı ve isteğe bağlı hızlandırılabilir/ertelenebilir;
MVP mantığı Faz 0-7'yi kapsıyor (bkz. PRD Bölüm 7.3 notu).
