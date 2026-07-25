# Blocker'lar — Kamp.la

Mustafa'dan aksiyon bekleyen maddeler. Kaynak: `Kurulum-Gereksinimleri.md`
(detaylı adımlar orada). CEO ajanı bu hesapları kendisi açmaz.

| # | Madde | Neden Gerekli | Durum | Not |
|---|---|---|---|---|
| 1 | Supabase projesi (URL, anon key, service_role key, PostGIS enable) | Faz 0-1: veritabanı, auth | ✅ Tamamlandı | Anahtarları `.env`'e sen gireceksin (kod hard-code etmeyecek) |
| 2 | Google Cloud OAuth client | Faz 1: Google ile giriş | Bekliyor | Ertelenebilir — e-posta/şifre girişi bağımsız çalışır |
| 3 | MapTiler API key | Faz 2: harita tile (topografik/uydu katmanı) | ✅ Tamamlandı | Mustafa root `app/.env`'e ekledi; CEO ajanı Faz 1'deki aynı sorunu (Nuxt paket bazında `.env` okuyor, kökü okumuyor) fark edip `apps/mobile-web/.env`'e kopyaladı — `useMap.ts` gerçek key'i otomatik algılayıp MapTiler stillerine geçecek |
| 4 | Cloudflare R2 bucket + API token | Faz 4: fotoğraf yükleme | Bekliyor | Geçici olarak Supabase Storage ile başlanabilir |
| 5 | Apple Developer Program + Google Play Console | Faz 9-10: Premium/mağaza paketleme | Bekliyor | Şimdilik gerekmez |
| 6 | RevenueCat hesabı | Faz 9: Premium ödeme altyapısı | Bekliyor | Şimdilik gerekmez |
| 7 | Faz 1 DoD manuel testi: kendi makinende `pnpm dev` ile kayıt ol + giriş yap + şifremi unuttum dene | Auth kodu sandbox'ta gerçek Supabase anahtarlarıyla test edilemiyor (sadece typecheck yapıldı) | ✅ Tamamlandı | `.env` dosyası monorepo kökündeydi, `apps/mobile-web/`+`apps/admin/` içine kopyalandıktan sonra çalıştı |
| 8 | Faz 2 DoD manuel testi: kendi makinende `pnpm dev` ile Ana Ekran'da harita/katman modalı/pin-özet kart/konumuma git, `/liste` (favori kalp, harita toggle), `/ara` (öneriye tıklayınca haritanın odaklanması), filtre modalı (2 kategori sınırı uyarısı) dene | Sandbox'ta typecheck + `nuxt dev` HTTP 200 doğrulandı ama gerçek tarayıcıda tıklama/görsel akış hiç test edilmedi | Bekliyor | MapTiler key olmadığı için harita OSM/demo tile ile placeholder görünecek — bu beklenen, key BLOCKERS #3'te ayrı bekliyor |

**Not:** Faz 0'da hesap eksikliği kodu bloklamıyor — Supabase zaten hazır
olduğu için gerçek migration'lar uygulanabilir; MapTiler/R2/OAuth
gerektiren kısımlar placeholder/mock ile ilerler, gerçek anahtar
girildiğinde çalışır hale gelir.
