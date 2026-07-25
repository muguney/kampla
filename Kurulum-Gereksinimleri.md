# Kamp.la — Kurulum Gereksinimleri (Senin Sağlaman Gerekenler)

Bu dosya, geliştirme sırasında **senin açman/sağlaman gereken hesapları ve bilgileri** listeler. Claude Code kod tarafını halleder; buradakiler üçüncü parti servis hesapları olduğu için senin tarafından yapılmalı. Her madde hangi fazda gerektiğine göre sıralandı — **hepsini baştan halletmene gerek yok.**

Değerlerin gireceği yer: `.env.example` → kopyala → `.env` → doldur.

---

## 🔴 Hemen Gerekli (Faz 0–1)

### 1. Supabase Projesi
- [supabase.com](https://supabase.com) → ücretsiz hesap → "New Project"
- Bölge olarak **eu-central (Frankfurt)** öner (Türkiye'ye en yakın)
- Alınacaklar (Project Settings → API):
  - `Project URL` → `.env` → `NUXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NUXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (gizli — sadece sunucu/admin)
- Veritabanı şemasını (tablolar, RLS, PostGIS) Claude Code SQL migration olarak üretecek; sen sadece projeyi açıyorsun.
- **PostGIS:** Dashboard → Database → Extensions → `postgis` → Enable (tek tık).

### 2. Google OAuth (Google ile Giriş — PRD 5.A)
- [console.cloud.google.com](https://console.cloud.google.com) → yeni proje → "OAuth consent screen" doldur → "Credentials" → OAuth Client ID (Web application)
- Redirect URI olarak Supabase'in verdiği adresi gir: `https://XXXX.supabase.co/auth/v1/callback`
- Alınan Client ID + Secret → **Supabase Dashboard → Authentication → Providers → Google** ekranına yapıştırılır (`.env`'e girilmez).
- İstersen bu adımı erteleyebilirsin; e-posta/şifre girişi Google olmadan da çalışır.

---

## 🟠 Faz 2'de Gerekli (Harita)

### 3. Harita Tile Kaynağı
MapLibre'nin kendisi ücretsiz/anahtarsızdır ama harita görüntüsü (tile) bir kaynaktan gelmeli. Önerilen kademeli yol:

| Katman | Başlangıç (ücretsiz, hesapsız) | Üretim önerisi |
|---|---|---|
| Klasik | **OpenFreeMap** (`tiles.openfreemap.org`) — anahtar gerektirmez | Aynı kalabilir veya MapTiler |
| Topografik | MapTiler ücretsiz plan (`outdoor` style) | MapTiler / self-hosted OpenTopoMap |
| Uydu | MapTiler ücretsiz plan (`satellite` style) veya ESRI World Imagery | MapTiler |

- **Yapılacak:** [maptiler.com](https://maptiler.com) → ücretsiz hesap → API key al → `NUXT_PUBLIC_MAPTILER_KEY`
- Ücretsiz plan ayda 100.000 tile yüklemesi verir; geliştirme ve ilk yayın için yeterli. İleride trafik artarsa self-hosted tile sunucusuna (OpenMapTiles + PMTiles) geçiş PRD 7.1'de zaten planlı.

---

## 🟠 Faz 4'te Gerekli (Fotoğraf Yükleme)

### 4. Cloudflare R2
- [dash.cloudflare.com](https://dash.cloudflare.com) → R2 → bucket oluştur: `kampla-media`
- "Manage R2 API Tokens" → token oluştur (Object Read & Write) → `.env`'deki `R2_*` alanları
- Bucket'a public erişim: ya `r2.dev` subdomain'ini aç ya da kendi alan adını bağla (örn. `media.kamp.la`) → `NUXT_PUBLIC_R2_PUBLIC_URL`
- **Not:** Geliştirmenin ilk günlerinde R2 yerine geçici olarak Supabase Storage da kullanılabilir; Claude Code'a "şimdilik Supabase Storage, R2'ye geçilecek" diyebilirsin. Ama baştan R2 kurmak geçiş maliyetini sıfırlar.

---

## 🟡 İleriki Fazlar (şimdilik gerekmez, bilgin olsun)

### 5. RevenueCat + Mağaza Hesapları (Faz 9 — Premium)
- Apple Developer Program (99$/yıl) + Google Play Console (25$ tek seferlik) — **Faz 10 mobil paketleme için de zaten gerekecek**
- [revenuecat.com](https://revenuecat.com) ücretsiz hesap → iOS/Android app tanımla → API key'ler → `.env`

### 6. Offline Harita Sunucusu (Faz 11)
- PMTiles paketlerini barındıracak bir yer (Cloudflare R2 bunun için de kullanılabilir — ek hesap gerekmez)

### 7. Rota Motoru (Faz 12)
- Valhalla/OSRM self-hosted → bir VPS gerekir (Hetzner vb.). Bu faza gelince konuşulur.

---

## Özet Kontrol Listesi (bugün yapılacaklar)

- [ ] Supabase projesi aç, 3 anahtarı `.env`'e gir, PostGIS extension'ı etkinleştir
- [ ] (Opsiyonel) Google Cloud'da OAuth client oluştur, Supabase'e tanımla
- [ ] MapTiler ücretsiz hesabı aç, API key'i `.env`'e gir
- [ ] Cloudflare hesabı aç, R2 bucket oluştur, anahtarları `.env`'e gir
- [ ] `.env.example` → `.env` kopyala, yukarıdakileri doldur

Bu 4 hesap (Supabase, Google Cloud, MapTiler, Cloudflare) MVP'nin tamamı (Faz 0–8) için yeterli. Hepsi ücretsiz planla başlar.
