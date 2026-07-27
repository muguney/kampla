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

## Faz 8 — Admin Paneli (PRD 5.R, 7.1, 7.2)
> **Not (2026-07-26 otonom oturum):** Faz 0-7'nin kalan tüm görevleri ya Mustafa'nın
> manuel DoD testine ya da mimari karara (BLOCKERS #11) bağlı olduğundan, PHASES.md'de
> tanımlı bir sonraki bağımsız faz olan Faz 8'e geçildi. `apps/admin` şu ana kadar
> Faz 0'da kurulan boş iskelet (Nuxt+Tailwind+@nuxtjs/supabase kurulu, route'lar sadece
> "Faz 8'de geliştirilecek" placeholder metni). Bu fazın Figma'da ekranı yok (FIGMA.md'deki
> 44 ekran listesi yalnızca mobile-web'i kapsıyor), bu yüzden Figma kota kısıtından (#13)
> etkilenmiyor. Şema tarafı zaten hazır: `profiles.role` (`user`/`admin`), `public.is_admin()`
> helper fonksiyonu, `locations` üzerinde `locations_select_admin`/`locations_update_admin`/
> `locations_delete_admin`/`locations_insert_admin` RLS politikaları Faz 0'dan beri mevcut —
> yeni migration gerekmiyor.
- [x] Admin girişi + admin-only route guard: `apps/admin` için login sayfası (Supabase Auth e-posta/şifre, mobile-web'deki `useAuthStore` deseninden ilham alınabilir ama ayrı kod tabanı), giriş sonrası `profiles.role !== 'admin'` ise erişim reddi + signOut, temel nav layout (Konum Moderasyonu/Konumlar/Kullanıcılar/Raporlar/İçerik sekmeleri) — general-purpose (2026-07-26 otonom oturumda tamamlandı: `composables/useAdminAuth.ts` (Pinia yerine `useState`, admin'de Pinia kurulu değildi + yeni paket eklenmedi), `middleware/admin.ts`, `layouts/default.vue`, `pages/giris.vue`; tüm placeholder sayfalara `definePageMeta({middleware:'admin'})` eklendi)
- [x] Konum Moderasyon Kuyruğu: `status='pending'` konumları listele (ad, tür, şehir, ekleyen, tarih), satıra tıklayınca detay (foto/amenity/koordinat — mobile-web POI detay verisinden ilham), Onayla (`status='published'`) / Reddet (`status='rejected'` + `rejection_reason` zorunlu metin) aksiyonları — general-purpose (2026-07-26 otonom oturumda tamamlandı: `pages/index.vue`, `created_by→profiles.username` ayrı sorguyla çözülüyor (embed tiplemesi güvenilir değildi), reddet boş gerekçeyle engelleniyor, onay/red `notify_on_location_status_change` trigger'ını otomatik tetikleyecek; `~/kampla-admin-verify` temiz kopyada typecheck sıfır yeni hata (2 baseline hata hariç) + `nuxt build` başarılı + 6 route HTTP 200 doğrulandı — `ssr:false` olduğundan middleware redirect'i client-side, sunucu her zaman 200 SPA shell döndürüyor, bu Faz 0'dan gelen mevcut karar)
- [x] Manuel Konum Ekle/Düzenle: admin formu (mobile-web konum-ekle sihirbazının admin karşılığı, tek sayfada — adım adım olmasına gerek yok), `source='admin'`, `status='published'` doğrudan yayınlanabilir — general-purpose (2026-07-26 otonom oturumda tamamlandı: `pages/konumlar/index.vue` 698 satır — liste + ekle/düzenle formu, konum türü/hizmet/konaklama/sezon mobile-web sihirbaz buton-grid deseniyle, `location_amenities` delete-then-reinsert senkronu, düzenlemede status/source dropdown'ı da değiştirilebiliyor; lat/lng düz sayısal input (admin'de MapLibre kurulu değil, kapsam dışı bırakıldı), photo_urls basit virgülle-ayrılmış URL input'u; `~/kampla-verify-manual` kopyada typecheck sıfır yeni hata (2 baseline hariç) + `nuxt build`/`nuxt dev` `/konumlar` HTTP 200)
- [x] Excel/CSV toplu içe aktarma: şablon indirme (kolon başlıkları), dosya yükleme + satır doğrulama (zorunlu alanlar, kategori/enum değerleri) + toplu insert (`source='import'`) — general-purpose (2026-07-26 otonom oturumda tamamlandı: `pages/konumlar/import.vue` 493 satır — client-side CSV parser (quote/escape/BOM handling, harici paket yok), 16 kolonlu şablon indirme, satır bazlı enum/zorunlu-alan/lat-lng doğrulama, geçerli/geçersiz satır önizlemesi, toplu `locations`+`location_amenities` insert (`source:'import'`, `status:'published'`); parse/validate mantığı bağımsız Node scriptiyle 4 satırlık örnek CSV'de ayrıca test edildi; `~/kampla-verify-import` kopyada typecheck sıfır yeni hata + `nuxt build`/`nuxt dev` `/konumlar/import` HTTP 200)
- [x] Hata Bildirimi Kuyruğu: `reports` tablosu listesi (open/reviewing/resolved filtre), durum güncelleme — bu güncelleme zaten Faz 7'deki `notify_on_report_status_change` trigger'ını otomatik tetikleyecek — general-purpose (2026-07-26 otonom oturumda tamamlandı: `pages/raporlar.vue` 226 satır — `location_id`/`reporter_id` ayrı sorgularla çözümleniyor (embed kullanılmadı, `index.vue` deseniyle tutarlı), durum filtre pill-tab'ları, renkli durum rozeti, 3 durum butonu her zaman aktif (geri dönüş dahil kısıtlama yok), local state mutasyonu + toast; `packages/shared/src/constants.ts`'e `REPORT_STATUS_LABELS_TR` eklendi; `~/kampla-verify-reports` kopyada typecheck sıfır yeni hata + `nuxt build`/`nuxt dev` `/raporlar` HTTP 200; trigger'ın canlı çalışması bu ortamda test edilemedi, beklenen)
- [x] Kullanıcı Yönetimi: kullanıcı listesi (username/email/tier/role/suspended), arama, `tier` değiştirme, hesap askıya alma — general-purpose (2026-07-26 otonom oturumda tamamlandı: `supabase/migrations/0012_profiles_suspended.sql` — `profiles.suspended boolean default false`, ekstra RLS gerekmedi (`profiles_update_admin` zaten kapsıyor); `pages/kullanicilar.vue` raporlar.vue deseniyle; kendi admin hesabında askıya alma butonu disable; `packages/shared/src/types.ts` `Profile.suspended?: boolean` opsiyonel eklendi; `/tmp/kampla-verify-users` kopyada typecheck sıfır yeni hata (3 baseline) + `nuxt build`/`nuxt dev` `/kullanicilar` HTTP 200; gerçek DB testi Mustafa'dan bekleniyor)
- [x] Yorum Moderasyonu: uygunsuz yorumları listeleyip silme (`reviews` tablosu, admin DELETE RLS zaten `0006_reviews.sql`'de mevcuttu, yeni migration gerekmedi) — general-purpose (2026-07-26 otonom oturumda tamamlandı: yeni `pages/yorumlar.vue` — puan filtresi, konum/kullanıcı adı ayrı sorguyla çözümleniyor (raporlar.vue deseni), silme `confirm()` + local state; `layouts/default.vue`'a nav linki eklendi; `/tmp/kampla-verify-yorumlar` kopyada typecheck sıfır yeni hata + `nuxt build`/`nuxt dev` `/yorumlar` HTTP 200)
- [x] İçerik Yönetimi: "Kamp.la Hakkında"/Kullanım Koşulları/Gizlilik metinlerini düzenleme — general-purpose (2026-07-26 otonom oturumda tamamlandı: `supabase/migrations/0013_site_content.sql` — `site_content` tablosu (key/lang/title/body) + RLS (herkes okur, admin yazar) + mobile-web i18n `tr.json`'daki gerçek metinlerle 3 satır seed (`hakkinda`/`kullanim-kosullari`/`gizlilik`); `packages/shared/src/types.ts`'e `SiteContent` tipi + `Database` tablo tanımı eklendi; `pages/icerik/index.vue` fonksiyonel form (başlık+textarea, dirty-state, kaydet); mobile-web'in bu tablodan OKUMASI kapsam dışı bırakıldı, statik sayfalar hâlâ i18n'den render ediyor — ayrı bir görev olarak not düşüldü; `/tmp/kampla-verify-icerik` kopyada admin+mobile-web ikisinde de typecheck sıfır yeni hata + `nuxt build`/`nuxt dev` `/icerik` HTTP 200)
- [ ] Faz 8 DoD doğrulaması: admin girişi yapılabiliyor, en az bir konum admin panelinden onaylanıp mobile-web'de görünüyor (mock veri değil gerçek `locations`) — CEO/Mustafa (not: bu DoD'nin "mobile-web'de görünmesi" kısmı BLOCKERS #11'deki mimari karara bağlı olabilir, karar netleşmeden tam doğrulanamayabilir)

## Faz 9 — Premium & Ödeme (PRD 7.3)
> **Not (2026-07-26 otonom oturum):** Bu faz tamamen RevenueCat hesabı + Apple
> Developer Program + Google Play Console'a bağlı (Kurulum-Gereksinimleri.md
> madde 5, BLOCKERS #5/#6) — hesap açma/ödeme otonom sınırların dışında,
> hiçbir alt görev şu an ilerletilemez. PHASES.md notuna göre Faz 8-12
> ertelenebilir olduğundan, sıra bloklu olmayan Faz 10'a alındı.
- [ ] `subscriptions` tablosu + RevenueCat entegrasyonu — **Mustafa'nın önce
  RevenueCat/Apple/Google hesaplarını açması gerekiyor, bkz. BLOCKERS**

## Faz 10 — Mobil Paketleme (PRD 7.1/7.2)
> **Not (2026-07-26 otonom oturum):** Faz 0'da `capacitor.config.ts` yer
> tutucu olarak bırakılmıştı ("`@capacitor/core`/`@capacitor/cli` ve gerçek
> native proje (ios/, android/) Faz 10'da eklenecek" notu). Bu fazın ilk
> adımları (paket kurulumu, config, native proje iskeleti, izin manifestleri)
> hesap/ödeme gerektirmiyor — otonom ilerletilebilir. Gerçek cihazda
> build/çalıştırma (DoD) Xcode/Android Studio gerektirir, bu sandbox'ta yok;
> o kısım Mustafa'nın kendi Mac'inde yapılmalı.
- [x] `@capacitor/core` + `@capacitor/cli` + `@capacitor/ios` + `@capacitor/android` bağımlılıklarını `apps/mobile-web`'e ekle, `capacitor.config.ts`'i gerçek `CapacitorConfig` tipine bağla (yorum satırındaki import'u aktif et) — general-purpose (2026-07-26 otonom oturumda tamamlandı: paketler 8.4.2, `capacitor.config.ts` artık gerçek `CapacitorConfig` tipini kullanıyor; ayrıca reponun daha önce hiç `typescript`/`vue-tsc` bağımlılığı yokmuş, `cap` CLI'ın config'i okuyup typecheck'in çalışabilmesi için `typescript@^5.6.3`+`vue-tsc@^2.1.10` devDependency + `typecheck` script'i eklendi)
- [x] `npx cap add ios` + `npx cap add android` ile native proje iskeletlerini oluştur (bu sandbox'ta Xcode/Android SDK yok — sadece proje şablonu üretimi denendi, gerçek derleme denenmedi) — general-purpose (2026-07-26 otonom oturumda tamamlandı: `apps/mobile-web/ios/` (Xcode proje dosyaları, `App.xcodeproj`/`AppDelegate.swift`/`Info.plist`) + `apps/mobile-web/android/` (Gradle proje dosyaları) gerçekten mounted proje klasöründe oluşturuldu ve doğrulandı, build-artifact alt klasörleri `.gitignore`'a uygun olarak kopyalanmadı)
- [x] Native izin manifestleri: iOS `Info.plist`'e konum izni açıklaması (`NSLocationWhenInUseUsageDescription`), Android `AndroidManifest.xml`'e `ACCESS_FINE_LOCATION`/`ACCESS_COARSE_LOCATION` — general-purpose (2026-07-26 otonom oturumda tamamlandı, ikisi de bizzat CEO ajanı tarafından dosya içeriğiyle doğrulandı)
- [x] `@capacitor/geolocation` plugin kurulumu, `useMap.ts`'teki `requestUserLocation`'ı native ortamda çalışacak şekilde (web `navigator.geolocation` + Capacitor plugin fallback) güncelle — general-purpose (2026-07-26 otonom oturumda tamamlandı: `requestUserLocationNative()`/`requestUserLocationWeb()`'e bölündü, `Capacitor.isNativePlatform()` dispatcher'ı ile dallanıyor, web davranışı değişmedi, `npx cap sync` ile plugin'in iOS/Android'e doğru entegre olduğu doğrulandı)
- [ ] Faz 10 DoD doğrulaması: iOS/Android cihazda (veya simülatörde) çalışan build var — **Mustafa (Xcode/Android Studio + muhtemelen `pod install` gerektirir, bu ortamda yapılamaz — BLOCKERS #17)**

## Faz 11 — Offline Harita (PRD 5.B/5.P, 7.1)
> **Not (2026-07-26 otonom oturum):** Faz 9 (Premium/hesap) ve Faz 10 DoD
> (Xcode/Android) tamamen bloklu; Faz 0-8'in kalan tüm görevleri Mustafa'nın
> manuel testine veya BLOCKERS #11'deki mimari karara bağlı. PHASES.md'de
> tanımlı bir sonraki bağımsız faz olan Faz 11'e (Offline Harita, hesap/ödeme
> gerektirmiyor) geçildi. Bu fazda Figma ekranı yok (FIGMA.md yalnızca
> mobile-web'in mevcut 44 ekranını kapsıyor, offline harita ayrı bir ekran
> olarak tasarlanmamış) — Figma kota kısıtından (#13) etkilenmiyor.
> Premium kısıtlaması gerçek RevenueCat/ödeme olmadan, mevcut
> `profiles.tier` alanı (Faz 0'dan beri şemada var) ile UI seviyesinde
> uygulanabilir — gerçek ödeme akışı gelince değişmeyecek.
- [x] Bağımlılıklar: `pmtiles`+`@capacitor/filesystem`+`@capacitor/preferences`
  kurulumu (`apps/mobile-web/package.json`) — general-purpose (2026-07-26
  otonom oturumda tamamlandı)
- [x] `useOfflineMap.ts` composable: `getVisibleBounds`/`downloadRegion`/
  `deleteRegion`/`listRegions`/`getRegionSourceUrl`, native (`@capacitor/
  filesystem`+`@capacitor/preferences`, `Directory.Data`) / web (in-memory
  `Blob` Map + `localStorage`, session-only — kalıcı IndexedDB yok, bilinen
  kısıt) dallanması `useMap.ts` deseniyle tutarlı — general-purpose
  (2026-07-26 otonom oturumda tamamlandı: `packages/shared/src/types.ts`'e
  `OfflineRegionBBox`/`OfflineRegion` type'ları eklendi)
- [x] Harita ekranına "Bölgeyi Çevrimdışı İndir" UI: `components/map/
  OfflineMapModal.vue` (FilterModal.vue bottom-sheet deseni), `pages/
  index.vue`'da yeni yüzen buton, mevcut bbox + ad girme + indirme
  ilerlemesi + indirilen bölgeler listesi (silme), `authStore.isPremium`
  (`profile.tier==='premium'`) ile kilitli/premium gate, kilitliyse
  `/premium`'a link — general-purpose (2026-07-26 otonom oturumda
  tamamlandı; i18n `map.offlineModal.*` altında, önerilen `offlineMap.*`
  yerine mevcut `map.layerModal`/`map.filterModal` iç içe desenine
  uyumlu isimlendirme tercih edildi)
- [x] MapLibre `pmtiles` protokol entegrasyonu: `useOfflineMap.ts`'teki
  `getRegionSourceUrl()` `useMap.ts`'e kaynak olarak bağlandı, çevrimdışı/
  bağlantı hatası durumunda yerel dosyaya fallback — general-purpose
  (2026-07-26 otonom oturumda tamamlandı: `useMap.ts`'e `buildOfflinePmtilesStyle()`
  (Protomaps demo şemasına göre minimal vector style, glyph/etiket katmanı yok),
  `tryActivateOfflineFallback()`/`restoreOnlineStyle()` — `navigator.onLine` +
  `online`/`offline` window event'leri + harita `error` event'i tetikliyor,
  `map.setStyle()` ile tüm stil geçici olarak offline pmtiles kaynağına
  değiştiriliyor (source üstüne katman eklemek yerine); `pages/index.vue`'a
  "Çevrimdışı harita kullanılıyor" rozeti eklendi; `@capacitor/network`
  bilinçli olarak kurulmadı. `vue-tsc --noEmit` değişiklik öncesi/sonrası
  aynı 1 baseline hata (`tailwind.config.ts`, ilgisiz) — yeni hata yok;
  `nuxt build` başarılı; `nuxt dev` ile `/` HTTP 200. Gerçek cihazda
  (Capacitor native) test edilmedi. Bilinen kısıt: mounted proje klasöründe
  önceki oturumdan kalma `node_modules_broken_*`/`.nuxt_broken_*` çöp
  klasörleri tsc'yi OOM'a düşürüyordu — subagent yalnızca kendi `$HOME`
  kopyasında temizledi, mounted kaynağa dokunmadı, ayrı bir temizlik görevi
  gerekebilir.)
- [ ] Gerçek bölgesel PMTiles üretim kararı: uzak bir PMTiles kaynağından
  (ör. Protomaps'ın ücretsiz/açık public build'i, hesap/ödeme gerekmez) HTTP
  range request ile bbox bazlı istemci-taraflı excerpt mi çıkarılacak, yoksa
  ayrı bir self-hosted tile-packaging sunucusu mu kurulacak — **üçüncü taraf
  veri kaynağı seçimi, DECISIONS.md'ye teknik öneri olarak yazılıp bir
  sonraki daily'de Mustafa'ya sunulacak**
- [ ] Faz 11 DoD doğrulaması: kullanıcı bir bölgeyi indirip internetsiz
  kullanabiliyor mu — **Mustafa (gerçek cihaz + gerçek internet kesintisi
  testi gerektirir, bu ortamda yapılamaz)**

## Faz 12 — Rota Motoru (PRD 7.3, Bölüm 5.F ek)
> **Not (2026-07-26 otonom oturum):** Faz 11'in kalan 2 görevi (PMTiles veri
> kaynağı kararı, DoD) tamamen Mustafa'yı bekliyor; diğer tüm açık fazlar da
> (2/3/4/5/6/7/8/10) Mustafa'nın DoD testine veya mimari karara bağlı. PHASES.md'de
> tanımlı sıradaki faz olan Faz 12'ye (Rota Motoru, hesap/ödeme gerektirmeyen
> kısmıyla) geçildi. Rota motoru **hangi servis** (Valhalla self-hosted / OSRM
> self-hosted / public demo API) sorusu üçüncü taraf hizmet seçimi olduğundan
> CEO_AGENT.md'deki "geri dönüşü zor kararlar" kapsamında — otonom karar
> verilmeyecek, DECISIONS.md'ye öneri yazılıp Mustafa'ya sunulacak (Faz 11'deki
> PMTiles kararıyla aynı desen). Bu karardan bağımsız olarak, "Uygulama içi Rota"
> ekranının UI/UX'i mock/sabit rota verisiyle şimdiden kodlanabilir — gerçek
> servis netleşince yalnızca veri kaynağı değişecek. PRD'de bu ekranın Figma
> karşılığı yok (DECISIONS.md'de not düşülmüş), bu yüzden Figma kota kısıtından
> (#13) etkilenmiyor.
- [x] Rota motoru seçimi: Valhalla (self-hosted) vs OSRM (self-hosted) vs
  public demo API karşılaştırması — karavan/truck costing (yükseklik/genişlik/
  ağırlık kısıtı) desteği, maliyet, hosting gereksinimi — DECISIONS.md'ye öneri
  olarak yazılacak, uygulanmayacak — general-purpose (araştırma) (önceki bir
  otonom oturumda tamamlanmış: DECISIONS.md 2026-07-26 "Faz 12 (Rota Motoru) —
  servis seçimi" — Valhalla self-hosted önerildi, ORS/OSRM/GraphHopper
  karşılaştırıldı; TASKS.md/STATUS.md o oturumda güncellenmemişti, bu oturumda
  (2026-07-26 bookkeeping) fark edilip işaretlendi — Mustafa onayı hâlâ bekliyor)
- [x] "Yol Tarifi" seçim modalına (`PoiDirectionsModal.vue`) üçüncü seçenek:
  "Uygulama içi rota (Beta)" — mevcut Google Maps/harici seçeneklerin yanına
  — general-purpose (önceki bir otonom oturumda kodu yazılmış ama TASKS.md
  güncellenmemişti; bu oturumda general-purpose subagent ile doğrulandı:
  `goToInAppRoute()` → `/konum/{id}/rota`, i18n eksiksiz, typecheck/build temiz)
- [x] Uygulama içi Rota ekranı: yeni sayfa, sabit/mock rota polyline'ı
  (gerçek routing API çağrısı yok) mini MapLibre üzerinde çizili, tahmini
  mesafe/süre mock gösterimi, ekranda açık "örnek veri, gerçek rota motoru
  entegrasyonu bekleniyor" notu — general-purpose (önceki bir otonom oturumda
  kodu yazılmış ama TASKS.md güncellenmemişti; bu oturumda doğrulandı:
  `pages/konum/[id]/rota.vue`, mock GeoJSON LineString + mock mesafe/süre +
  uyarı kutusu, `/konum/mock-loc-001/rota` HTTP 200, typecheck/build temiz)
- [ ] Faz 12 DoD doğrulaması: uygulama içi karavan-güvenli rota önerisi
  çalışıyor mu — **Mustafa/CEO (gerçek routing servisi seçimi + entegrasyonu
  tamamlanmadan bu DoD karşılanamaz, blocker)**
