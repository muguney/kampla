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

## Faz 3 — POI Detay, salt okunur (PRD 5.F)
- [x] `pages/konum/[id]/index.vue` temel yapı: kaydırılabilir fotoğraf galerisi (nokta göstergeli), başlık + kategori rozeti + yıldız puanı + "kim/ne zaman eklediği" bilgisi + ekleyen avatarı, Detaylar/Yorumlar iki sekmeli yapı (mock veriden, `mock-locations.ts`'e galeri foto URL dizisi + yorum mock verisi eklenerek) — general-purpose (2026-07-25 otonom oturumda tamamlandı: scroll-snap galeri, URL-senkron sekmeler `?tab=`)
- [x] Detaylar sekmesi: imkan/hizmet ikon grid'i (19 amenity, tooltip'li), açıklama metni, iletişim ikonları (telefon/web/FB/IG/YouTube/X), konaklama rozetleri (karavan/çadır/bungalov), sezon bilgisi, koordinat gösterimi + tek tıkla kopyalama, mini harita (useMap.ts reuse), "Hata Bildir"/"Düzenle" aksiyon butonları (UI only, henüz submit yok) — general-purpose (2026-07-25: `components/poi/PoiDetailsTab.vue`, bağımsız mini MapLibre instance'ı)
- [x] Yorumlar sekmesi: 1-5 yıldız dağılım grafiği + ortalama puan + toplam yorum sayısı, yorum kartları listesi (mock), "Yorum yazın" modalı (yıldız seçimi + serbest metin, UI only — henüz DB'ye yazmıyor, salt okuma fazı) — general-purpose (2026-07-25: `components/poi/PoiReviewsTab.vue` + `PoiReviewModal.vue`, `mock-reviews.ts` 6 yorum/3 POI, EmptyState "İlk yorumu sen yaz")
- [x] Alt aksiyon çubuğu (5 ikon: Fotoğraf ekle, Ziyaret/işaretle, Yol tarifi öne çıkan orta buton, Listeye kaydet, Paylaş) + Yol tarifi seçim modalı (Google Maps uygulama içi/harici) — UI only, aksiyonlar henüz backend'e bağlı değil — general-purpose (2026-07-25: `PoiDirectionsModal.vue`, tüm aksiyonlar misafir için `/giris?redirect=` guard'lı, zaman kalınca planlanandan erken tamamlandı)
- [ ] Faz 3 DoD doğrulaması: bir pin'e tıklayınca tam detay sayfası açılıyor mu (galeri, sekmeler, alt aksiyon çubuğu) — CEO/Mustafa (kod tarafı + typecheck/dev/build sandbox'ta doğrulandı — bkz. STATUS.md; gerçek tarayıcıda görsel/etkileşim onayı Mustafa'dan bekleniyor, BLOCKERS #9)

## Faz 4 — Kullanıcı Katkısı (PRD 5.G, 5.M)
- [x] Adım 1 — Konum Seç: `pages/konum-ekle/[step].vue` içinde step===1 için gerçek form — harita üzerinde pin sürükle/bırak (mini MapLibre instance, `useMap.ts`/POI detay mini harita deseni reuse), "GPS ile otomatik konumlandır" butonu (`requestUserLocation`), seçilen lat/lng `useLocationWizardStore`'a yazılır, adım geçişi lat/lng seçilmeden engellenir — general-purpose (2026-07-25 otonom oturumda tamamlandı: `components/wizard/WizardStep1Location.vue`, sabit merkez pin + harita kaydırma UX'i, kendi bağımsız `navigator.geolocation` GPS çağrısı)
- [x] Adım 2 — Konum Türü Seç: 9 kategoriden tekli seçim (radio kart ızgarası, PRD 6.1 `LOCATION_TYPES`/renk kodları, "hem karavan hem kamp alanıysa..." bilgi notu), wizard store'a `locationType` yazılır — general-purpose (2026-07-25: `components/wizard/WizardStep2Type.vue`)
- [x] Adım 3 — Hizmetleri Seç: 19 `AMENITIES` çoklu seçim checkbox grid'i (POI detay `PoiDetailsTab.vue`'daki ikon deseniyle tutarlı), wizard store'a `amenities[]` yazılır — general-purpose (2026-07-25: `components/wizard/WizardStep3Amenities.vue`, opsiyonel adım)
- [x] Adım 4 — Detayları Gir: ad/açıklama/telefon/web/sosyal medya (hepsi opsiyonel hariç ad zorunlu), `ACCOMMODATION_TYPES` çoklu seçim, `SEASONS` tekli seçim formu, wizard store'a yazılır — general-purpose (2026-07-25 otonom oturumda tamamlandı: `components/wizard/WizardStep4Details.vue`, store'a `facebookUrl/instagramUrl/youtubeUrl/xUrl` eklendi)
- [x] Adım 5 — Fotoğraf Ekle: Supabase Storage bucket migration (`location-photos`, public read + owner-only insert RLS), çoklu fotoğraf yükleme UI + kural uyarısı (selfie yasak, yatay çekim önerisi, uygunsuz görsel silinir notu), yüklenen URL'ler wizard store'a `photos[]` olarak yazılır — general-purpose (2026-07-25 otonom oturumda tamamlandı: `supabase/migrations/0010_location_photos.sql` — `locations.photo_urls text[]` kolonu + `location-photos` bucket + RLS policy'leri; `components/wizard/WizardStep5Photos.vue` gerçek `supabase.storage.from('location-photos').upload()` ile çalışıyor; foto silme yalnızca formdan kaldırıyor, storage'daki dosya kalıyor — orphan temizliği ileriye not düşüldü)
- [x] Adım 6 — Onayla ve Kaydet: sözleşme/doğruluk beyanı onay kutusu (işaretlenmeden kayıt engellenir), gerçek Supabase insert (`locations`: `status='pending'`, `source='user'`, `created_by=auth.uid()` + `location_amenities` + foto kolonu), "Yönetici incelemesinden sonra yayınlanır" başarı ekranı (mevcut `EmptyState`/başarı şablonunu reuse et), kayıt sonrası wizard store reset + Ana Ekran'a yönlendirme — general-purpose (2026-07-25 otonom oturumda tamamlandı: `components/wizard/WizardStep6Confirm.vue`, kendi başarı ekranını render ediyor (EmptyState yerine — moderasyon mesajı + otomatik 4sn sonra `/` yönlendirme + manuel buton); ayrıca `packages/shared/src/types.ts`'teki model tipleri `interface`'ten `type`'a çevrildi — `@supabase/postgrest-js` v2'nin `.insert()` tipi interface'lerde "örtük index signature" tanımıyor ve sessizce `never`'a düşüyordu, bu olmadan gerçek insert kodu typecheck'i geçemiyordu)
- [ ] Faz 4 DoD doğrulaması: kullanıcı yeni konum ekleyebiliyor, admin onayı bekliyor (Supabase dashboard'da `status='pending'` satır olarak görünüyor) — CEO/Mustafa

## Faz 5 — Etkileşim (PRD 5.H, 5.I)
> **Not (2026-07-26 otonom oturum):** Faz 2/3'teki POI verisi tamamen mock
> (`packages/shared/src/mock-locations.ts`, id'ler `mock-loc-001` gibi gerçek
> UUID değil). `reviews.location_id` ve `list_items.location_id` gerçek
> `locations.id`'ye FK'li olduğundan, mock POI'lere gerçek yorum/favori
> eklemek DB seviyesinde çalışmaz. Bkz. DECISIONS.md — Mustafa onayı bekleyen
> mimari karar. Bu yüzden Faz 5, POI'ye bağlı olmayan kısımlardan (liste
> yönetimi) başlıyor; POI'ye bağlı yorum/favori, gerçek konum entegrasyonu
> kararı netleşince yapılacak.
- [x] Harita Listelerim: `useListsStore`'u gerçek `lists` tablosuna bağla — sistem listelerini (Favorilerim/Ziyaret Edilen Yerler) ilk ihtiyaç anında lazy-create et, özel liste oluştur/adını değiştir/sil/`is_public` toggle, ücretsiz kullanıcı sınırı 3 özel liste (PRD 5.H) — general-purpose (2026-07-26 otonom oturumda tamamlandı: `stores/lists.ts` 5 action + getter'lar, `pages/listelerim/index.vue` + `[id].vue` gerçek veriye bağlandı, `FREE_TIER_LIMITS.maxCustomLists=3` eklendi, 37 yeni i18n key; `/tmp` kopyada typecheck sıfır yeni hata + `nuxt dev` ilgili route'lar HTTP 200; POI ekleme/`list_items` kapsam dışı bırakıldı, TODO düşüldü)
- [ ] Gerçek konum entegrasyonu kararı: Ana Ekran/Liste/Arama/POI Detay'ın mock veri yerine gerçek `locations` tablosuna (status='published' + kendi 'pending' kayıtları) bağlanması — **büyük mimari karar, DECISIONS.md'de Mustafa onayına sunuldu** — CEO/Mustafa
- [ ] (yukarıdaki karara bağlı) POI Detay → "Listeye Ekle" modalı: gerçek `list_items` insert/delete (yeşil +/- ikonları)
- [ ] (yukarıdaki karara bağlı) Yorum yazma: `PoiReviewModal`/`PoiReviewsTab`'ı gerçek `reviews` tablosuna bağla (insert + fetch + gerçek yıldız dağılımı `GROUP BY rating`)
- [ ] (yukarıdaki karara bağlı) Favoriye ekleme: `PoiSummaryCard`/`liste.vue` kalp ikonunu gerçek `Favorilerim` sistem listesine toggle et
- [ ] "Tüm Yorumlarım" (`hesabim/yorumlarim.vue`): kullanıcının kendi yorumlarını gerçek `reviews` tablosundan çek (arama kutulu, POI'ye göre gruplu) — POI adı/foto için mock veya gerçek veri kaynağına bağlı, karara göre netleşecek
- [x] Liste Sayfası (Paylaşılan/Public, PRD 5.K): `profil/[username].vue`'daki genel listeler + bağımsız public liste görünümü, "Listeyi Kaydet" (kopyalama) aksiyonu — general-purpose (2026-07-26 otonom oturumda tamamlandı: `pages/profil/[username].vue` fonksiyonel; **route `/liste/[id]` yerine `/listeler/[id]`'e taşındı** — mevcut `pages/liste.vue` ile Nuxt nested-route çakışması test edilerek doğrulandı, bkz. STATUS.md/DECISIONS.md; "Listeyi Kaydet" mevcut `createCustomList` limit mantığını reuse ediyor, liste İÇERİĞİ hâlâ kapsam dışı; `vue-tsc` sıfır yeni hata, `nuxt build` + `/liste` regresyon testi temiz)
- [ ] Faz 5 DoD doğrulaması: yorum/favori/liste akışları uçtan uca çalışıyor — CEO/Mustafa

## Faz 6 — Hesap & Ayarlar (PRD 5.J, 5.L)
> **Not (2026-07-26 otonom oturum):** Faz 5'in kalan görevleri BLOCKERS #11'deki
> mimari karara (mock POI vs. gerçek `locations`) bağlı olduğundan otonom
> ilerletilemiyor. `profiles` tablosunda Faz 6 için gereken tüm kolonlar zaten
> mevcut (`website_url/facebook_url/instagram_url/x_url/youtube_url/
> show_visited_places` — `0002_profiles.sql`), yani bu faz mock-vs-real
> kararından bağımsız, hemen ilerletilebilir. Bu yüzden sıra Faz 6'ya alındı.
- [x] Hesabım ana sayfa (`pages/hesabim/index.vue`): gerçek `authStore`/profil verisi (avatar, kullanıcı adı, e-posta), "Profili Paylaş" (POI/liste sayfalarındaki `navigator.share`/clipboard deseni reuse, `/profil/[username]`'e gerçek username ile), "Ziyaret ettiğim yerleri göster" toggle (`profiles.show_visited_places` update), "Favorilerim/Konum Listelerim" linki (`/listelerim`), "Tüm Yorumlarım" linki (mevcut route, veri bağlama Faz 5 kararına bağlı olduğundan kapsam dışı) — general-purpose (2026-07-26 otonom oturumda doğrulandı: dosya zaten fonksiyoneldi — profil kartı, paylaş, toggle, hesap silme UI'ı dahil tam; bkz. STATUS.md)
- [x] `hesabim/kullanici-adi.vue`: kullanıcı adı değiştirme formu, `profiles.username` update, unique constraint hata mesajı — general-purpose (2026-07-26 otonom oturumda doğrulandı, zaten fonksiyoneldi)
- [x] `hesabim/e-posta.vue`: e-posta değiştirme formu, `supabase.auth.updateUser({email})`, onay akışı mesajı — general-purpose (2026-07-26 otonom oturumda doğrulandı, zaten fonksiyoneldi; ayrıca bu oturumda i18n derleme hatası düzeltildi, bkz. STATUS.md)
- [x] `hesabim/sifre.vue`: şifre değiştirme formu (mevcut şifre ile re-auth + yeni şifre), `supabase.auth.updateUser({password})` — general-purpose (2026-07-26 otonom oturumda doğrulandı, zaten fonksiyoneldi)
- [x] `hesabim/sosyal-medya.vue`: web/Facebook/Instagram/X/YouTube URL formu, `profiles` ilgili kolonlarına update — general-purpose (2026-07-26 otonom oturumda doğrulandı, zaten fonksiyoneldi)
- [x] Hesabı kalıcı olarak sil: onay modalı + Nuxt server route (`server/api/hesap-sil.post.ts`, `SUPABASE_SERVICE_ROLE_KEY` ile server-side `auth.admin.deleteUser()`), client JWT doğrulaması, başarıda signOut + `/`'a yönlendirme — general-purpose (service_role key sandbox'ta yok, kod typecheck ile doğrulandı, gerçek silme testi Mustafa'nın kendi ortamında — BLOCKERS #12)
- [x] Ayarlar statik sayfalar: `ayarlar/hakkinda.vue` (Kamp.la Hakkında marka metni), `kullanim-kosullari.vue`, `gizlilik.vue` — düz metin taslak içerik (PRD 5.L deseniyle), açıkça "taslak, hukuki inceleme bekliyor" notu ile — general-purpose (2026-07-26 otonom oturumda doğrulandı, üçü de mevcut ve dolu; kullanim-kosullari/gizlilik'te taslak uyarı kutusu var)
- [ ] Faz 6 DoD doğrulaması: Hesabım'daki tüm alt sayfalar gerçek veriyle çalışıyor, statik sayfalar görüntüleniyor — CEO/Mustafa (kod tarafı + typecheck/`nuxt build` sandbox'ta doğrulandı; gerçek Supabase runtime testi Mustafa'dan bekleniyor — BLOCKERS #12)

## Faz 7 — Bildirimler (PRD 5.Q, 5.M)
> **Not (2026-07-26 otonom oturum):** Faz 5'in kalan görevleri BLOCKERS #11'deki
> mimari karara bağlı, Faz 2/3/4/6 DoD'ları Mustafa'nın manuel testine bağlı,
> Figma kotası hâlâ tükenmiş (BLOCKERS #13) — bu yüzden sıra, hiçbirine bağlı
> olmayan Faz 7'ye alındı. `notifications` tablosu zaten Faz 0'da migration
> olarak var (`0008_notifications.sql`), `pages/bildirimler.vue` şu an
> EmptyState placeholder. Admin paneli (Faz 8) henüz yok, bu yüzden "konum
> onay/red" ve "hata bildirimi durum değişikliği" bildirimleri normal admin
> panel aksiyonu yerine DB trigger ile (locations.status / reports.status
> UPDATE'inde) otomatik oluşturulacak — bu, `notifications_insert_admin` RLS
> politikasını bypass eder çünkü trigger fonksiyonu `security definer` ile
> çalışır, kullanıcı adına insert yapmaz.
- [x] DB trigger'lar: `locations.status` `pending`→`published`/`rejected` olduğunda `created_by`'a bildirim; `reports.status` değiştiğinde raporu açan kullanıcıya bildirim (yeni migration, `security definer` fonksiyon + trigger, mevcut `is_admin()`/`set_updated_at()` desenleriyle tutarlı) — general-purpose (2026-07-26 otonom oturumda tamamlandı: `supabase/migrations/0011_notification_triggers.sql`, `notify_on_location_status_change()` + `notify_on_report_status_change()`, `reports` için konum adı ayrıca sorgulanıyor çünkü `reports` tablosunda tutulmuyor; henüz gerçek Supabase'e push edilip canlı test edilmedi)
- [x] `useNotificationsStore` (veya composable): `notifications` tablosundan `recipient_id = auth.uid()` filtresiyle gerçek veri çekme, `is_read` update (tek/hepsini okundu işaretle), `related_location_id` varsa ilgili POI'ye yönlendirme — general-purpose (2026-07-26: `stores/notifications.ts`, `fetchNotifications`/`markAsRead`/`markAllAsRead`, `Notification` tipi zaten `packages/shared/src/types.ts`'te mevcuttu)
- [x] `pages/bildirimler.vue`: EmptyState yerine gerçek liste (tarih + içerik + okunmamış vurgusu + tıklayınca ilgili sayfaya git + okundu işaretle), boşsa mevcut EmptyState korunur — general-purpose (2026-07-26: `middleware:['auth']` eklendi, göreli zaman formatlama, sol turuncu şerit vurgusu, `/konum/{id}` yönlendirmesi, "Tümünü okundu işaretle")
- [x] Okunmamış sayısı rozeti: menü/nav'daki "Bildirimler" simgesine (PRD: çan ikonu) `unreadCount` rozeti — general-purpose (2026-07-26: BottomNav'da yer olmadığından `pages/menu.vue`'ya "Bildirimler" satırı + turuncu rozet (9+ sınırlı) eklendi, mount'ta bir kez `fetchNotifications()`, polling/Realtime yok — kapsam dışı bırakıldı)
- [ ] Faz 7 DoD doğrulaması: konum onaylanınca/reddedilince ilgili kullanıcıya bildirim düşüyor, rozet güncelleniyor, listeye tıklayınca ilgili ekrana gidiliyor — CEO/Mustafa (kod tarafı + typecheck/`nuxt dev`/`nuxt build` sandbox'ta doğrulandı — 6 baseline hata dışında yeni hata yok, `/bildirimler`+`/menu` HTTP 200; gerçek Supabase runtime testi — migration push + trigger'ın canlı çalışması — Mustafa'dan bekleniyor, BLOCKERS #14)
