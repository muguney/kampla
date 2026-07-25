# Görev Listesi — Kamp.la

Format: `[ ] Görev — Sahip — Not`
Durum kodları: `[ ]` bekliyor · `[~]` devam ediyor · `[x]` bitti · `[!]` bloklandı (BLOCKERS.md'ye bak)

## Faz 0 — İskelet
- [x] pnpm workspaces monorepo kur (`apps/mobile-web`, `apps/admin`, `packages/shared`) — general-purpose (kurulum doğrulaması npm ile yapıldı, ayrıntı için STATUS.md)
- [x] Nuxt 3 + Tailwind CSS + Pinia kurulumu (`apps/mobile-web`) — general-purpose
- [x] Tasarım sistemini Tailwind config'e işle (PRD 2.3 renk paleti, 6.1 kategori renkleri, Baloo 2 font) — general-purpose
- [x] Temel layout: üst bar (logo) + sabit alt nav (5 sekme, ortada turuncu FAB) — general-purpose
- [x] Supabase client kurulumu (env üzerinden) — general-purpose
- [x] SQL migration'lar (`supabase/migrations/`): profiles, locations (PostGIS+status+source), location_amenities, lists, list_items, reviews, reports, notifications, subscriptions + RLS — general-purpose
- [x] PRD 7.2'deki tüm route'lar için placeholder sayfalar, gezilebilir nav — general-purpose
- [x] i18n altyapısı (TR varsayılan + EN) — general-purpose
- [x] Light/Dark tema altyapısı (sadece iskelet, dark tasarım yok) — general-purpose
- [x] `.env.example` dosyasını oluştur (Kurulum-Gereksinimleri.md'deki tüm değişkenlerle) — general-purpose
- [x] `apps/admin` için boş Nuxt iskeleti — general-purpose
- [x] Faz 0 DoD doğrulaması: `pnpm dev` çalışıyor mu, nav geziliyor mu — CEO (CEO ajanı bizzat temiz bir kopya üzerinde `npm install` + `nuxt dev` çalıştırdı: mobile-web ve admin ikisi de HTTP 200, doğru `<title>` döndü, build hatasız. Kullanıcı onayı beklemeye gerek kalmadı.)

## Faz 1 — Kimlik Doğrulama (PRD 5.A)
- [x] Supabase Auth store/composable (`useAuthStore` — signUp/signIn/signOut, session state, `profiles` senkronu) — general-purpose (2026-07-25 otonom oturumda tamamlandı, typecheck temiz)
- [x] Login sayfası fonksiyonel: e-posta/şifre girişi, hata gösterimi, başarıda Ana Ekran'a yönlendirme, Google butonu "yakında" placeholder (OAuth client BLOCKERS #2'de bekliyor) — general-purpose (2026-07-25 otonom oturumda tamamlandı)
- [x] Register sayfası fonksiyonel: kullanıcı adı/e-posta/şifre + zorunlu sözleşme onay kutusu, signUp çağrısı, hata/başarı durumları — general-purpose (2026-07-25 otonom oturumda tamamlandı, e-posta onayı açık/kapalı iki senaryo da handle ediliyor)
- [x] Forgot Password sayfası: e-posta ile `resetPasswordForEmail`, başarı mesajı — general-purpose (2026-07-25 otonom oturumda tamamlandı)
- [x] Auth middleware/guard: misafir harita/arama gezebilir; yorum/konum ekleme/listeye kaydetme gibi aksiyonlar girişe yönlendirir; menüde durumsal "Giriş Yap"/"Çıkış Yap" — general-purpose (2026-07-25 otonom oturumda tamamlandı; liste/POI detay/listelerim'de yorum/kaydet butonları henüz Faz 0 placeholder olduğundan sadece konum-ekle sihirbazına uygulandı, inline pattern ileriki fazlar için not düşüldü)
- [x] Faz 1 DoD doğrulaması: kullanıcı kayıt olup giriş yapabiliyor mu — Mustafa (2026-07-25, kendi makinesinde `.env` sorunu çözüldükten sonra doğruladı: çalışıyor)

## Faz 2 — Harita & Keşif, salt okunur (PRD 5.B–E)
- [x] MapLibre GL JS kurulumu + Ana Ekran'a temel interaktif harita entegrasyonu (açık kaynak demo/raster tile ile — MapTiler key BLOCKERS #3'te hâlâ bekliyor, gerçek key gelince katman URL'leri değiştirilecek), kullanıcı konumu (mavi nokta) + "konumuma git" butonu — general-purpose (2026-07-25 otonom oturumda tamamlandı: `composables/useMap.ts`, `pages/index.vue`; typecheck/dev/build temiz doğrulandı)
- [x] 3 harita katmanı seçim modalı (Klasik/Topografik/Uydu, görsel önizlemeli, PRD 5.B) — key yokken 3 seçenek de aynı placeholder tile'ı kullanacak şekilde mock, gerçek MapTiler key girilince her biri kendi stiline bağlanacak — general-purpose (2026-07-25 otonom oturumda tamamlandı: `components/map/LayerSelectModal.vue` + `setMapLayer()`)
- [x] `packages/shared` içine statik/sahte POI veri seti (9 kategori, PRD Bölüm 6 renk kodlarıyla, en az 15-20 örnek nokta) + Ana Ekran'da kategori renkli pin gösterimi + pin'e dokununca özet kart (bottom sheet: fotoğraf, ad, mesafe, puan/yorum sayısı, "Detaylar"/"Yol Tarifi" butonları — mock veriyle) — general-purpose (2026-07-25 otonom oturumda tamamlandı: `packages/shared/src/mock-locations.ts` 20 POI, `components/map/PoiSummaryCard.vue`)
- [x] Liste Görünümü: harita ile senkron kart listesi (fotoğraf, başlık, kategori ikonu, mesafe, yıldız puanı, yorum sayısı, hızlı favori kalp ikonu) + Harita⇄Liste toggle — general-purpose (2026-07-25 otonom oturumda tamamlandı: `pages/liste.vue`; sonsuz kaydırma mock veri yeterli olduğundan ertelendi, TODO düşüldü)
- [x] Arama: konum/şehir arama kutusu + öneri listesi (mock öneri verisi), aramada haritayı ilgili bölgeye ortalama — general-purpose (2026-07-25 otonom oturumda tamamlandı: `pages/ara.vue`, `packages/shared/src/search-suggestions.ts`, `useMap.ts`'e `flyToCoordinates`)
- [x] Filtre: 9 konum türü çoklu/tekli filtre kartları ızgarası, seçili turuncu vurgulu, yüzen buton, hem harita hem liste görünümünde erişilebilir, ücretsiz kullanıcı sınırı 2 kategori — general-purpose (2026-07-25 otonom oturumda tamamlandı: `components/map/FilterModal.vue`, `stores/filters.ts` reuse edildi)
- [ ] Faz 2 DoD doğrulaması: harita açılıyor, pin'ler görünüyor, liste/harita geçişi çalışıyor — CEO/Mustafa (kod tarafı hazır ve typecheck/dev sunucusu sandbox'ta doğrulandı; gerçek tarayıcıda tıklama akışı ve MapTiler key'siz görsel kalite kontrolü için Mustafa'nın kendi makinesinde son onayı bekleniyor — bkz. BLOCKERS)
