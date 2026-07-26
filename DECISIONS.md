# Kararlar — Kamp.la

Kaynak: `PRD.md` Bölüm 8 (Ürün Kararları) ve Bölüm 7 (Teknik Mimari).
Bu proje MobApps sistemine kaydedilmeden önce Mustafa ile netleşmiş
kararlar buraya taşındı; yenileri buraya eklenir.

### Stack (netleşti — PRD Bölüm 7)
**Karar:** Nuxt.js + Tailwind CSS, Capacitor ile mobil paketleme,
MapLibre GL JS harita motoru, Supabase (PostgreSQL + PostGIS) backend,
Cloudflare R2 medya depolama, RevenueCat ödeme/abonelik.
**Gerekçe:** Tek kod tabanıyla hem web hem mobil, açık kaynak harita
yığınıyla lisans/offline esnekliği, Supabase ile hızlı backend kurulumu.
**Onaylayan:** Mustafa (önceki oturumda)

### Misafir/kullanıcı sınırları (netleşti)
Giriş yapan herkes tüm ekranlara erişir; ücretsiz/premium ayrımı ekran
seviyesinde değil özellik seviyesinde uygulanır.

### Bildirim sistemi (netleşti)
MVP'de native push (FCM/APNs) yok; basit uygulama içi düz metin
bildirim ekranı yeterli.

### Onboarding (netleşti)
Splash sonrası doğrudan Ana Ekran (Harita)'a geçilir, ayrı bir
onboarding/tanıtım akışı yok.

### Offline harita (netleşti)
Evet gerekli — MapLibre + self-hosted PMTiles ile lisans engeli olmadan.

### Rezervasyon/ödeme (kamp alanı) (netleşti)
Kapsam dışı. Uygulama içi ödeme sadece Premium abonelik için var,
kamp alanı rezervasyonu/ödemesi yok.

### Admin paneli (netleşti)
Ayrı bir Nuxt.js uygulaması olarak geliştirilecek, aynı Supabase
projesine bağlı.

---
### 2026-07-25 — MobApps sistemine entegrasyon
**Karar:** Kamp.la, MobApps'in ilk kayıtlı projesi olarak kuruldu;
Faz 0 hesap eksikliklerinden bağımsız (Supabase hazır) hemen başlatıldı.
**Onaylayan:** Mustafa

### 2026-07-25 — Faz 0 kurulum doğrulaması: npm fallback + i18n v10
**Karar:** Proje pnpm workspaces için kuruldu (PRD 7.2, `pnpm-workspace.yaml`
mevcut, `package.json`'da `packageManager: pnpm@9.15.9`) ve pnpm birincil
araç olarak kalıyor. Ancak Faz 0'ı yürüten subagent'ın sandbox ortamında
bağlı dosya sistemi `unlink`/`rmdir` çağrılarını reddettiği için pnpm'in
içerik-adresli store'u orada çalışmadı; kurulum/doğrulama npm workspaces
ile yapıldı (`@kampla/shared` sürüm aralığı hem pnpm hem npm ile uyumlu
olacak şekilde `workspace:*` yerine `*` yazıldı). Bu yalnızca o sandbox'a
özgü bir doğrulama detayı — kullanıcının kendi Mac'inde pnpm sorunsuz
çalışmalı. Ayrıca `@nuxtjs/i18n` ilk planlanan `^8.5.5` yerine `^10.5.0`
kullanıldı (npm'in çözdüğü güncel Nuxt 3.21.9 ile v8 uyumsuz çıktı).
**Gerekçe:** Faz 0'ı çalışan/derlenen bir teslimat olarak bitirmek;
paket yöneticisi seçimi projenin mimarisini etkilemiyor.
**Onaylayan:** Faz 0 subagent (teknik detay, kullanıcı onayı gerekirse
STATUS.md'deki nota bakılabilir).

### 2026-07-25 — pnpm yerine npm (kalıcı)
**Karar:** Mustafa'nın kendi makinesinde pnpm kurulu değil; proje kalıcı
olarak npm ile devam edecek (pnpm'e geçiş gerekmiyor). `package.json`
zaten npm uyumlu (`@kampla/shared` sürümü `*`), ek değişiklik gerekmedi.
**Gerekçe:** Paket yöneticisi seçimi mimariyi etkilemiyor, npm zaten
sandbox'ta doğrulanmıştı.
**Onaylayan:** Mustafa

### 2026-07-25 — GitHub reposu bağlandı (muguney/kampla)
**Karar:** Proje `https://github.com/muguney/kampla` reposuna bağlandı,
kimlik doğrulama için fine-grained bir Personal Access Token kullanıldı.
**Nasıl yapıldı:** Mustafa "GitHub'ımda zaten Chrome açık, neden bana
soruyorsun" dedi — CEO ajanı Claude in Chrome üzerinden (kullanıcının
zaten giriş yapmış olduğu oturumda) `github.com/settings/personal-access-tokens/new`
sayfasına gidip token'ı bizzat oluşturdu: sadece `muguney/kampla` reposuna
scoped, `Contents: Read and write` + `Metadata: Read-only` yetkili, 90 gün
(2026-10-23) geçerli. Mustafa yalnızca GitHub'ın "sudo mode" reauth adımını
(telefon onayı) kendisi yaptı — şifre girişi CEO ajanının asla yapmadığı
bir aksiyon.
**Teknik not (önemli):** Mounted proje klasörü (`MobApps/projects/kamp-la/`)
FUSE tabanlı bir host-bridge üzerinden bağlı ve `unlink`/`rmdir` sistem
çağrılarını reddediyor (STATUS.md'deki Faz 0 notlarıyla aynı kısıt) — bu
yüzden `.git` bu klasörde DOĞRUDAN çalışmıyor (loose object/lock dosyası
temizliği unlink gerektiriyor, sürekli EPERM hatası veriyor). Bunun yerine
her commit/push işleminde proje dosyaları sandbox'ın kendi diskine
($HOME altına, node_modules/.nuxt/.env gibi ağır+gizli dosyalar hariç)
rsync'lenip orada `git init`/`add`/`commit`/`push` yapılıyor — `.git`
sandbox'ta geçici, kalıcı olan tek şey GitHub'daki repo. Token, bir sonraki
otonom oturumun tekrar sormasına gerek kalmaması için
`kamp-la/.git-remote-credentials` dosyasında saklanıyor (bu dosya
`.gitignore`'da, repoya gitmiyor).
**Onaylayan:** Mustafa

### 2026-07-25 — Otonom oturum: Faz 4 fotoğraf depolama yaklaşımı
**Karar:** Konum fotoğrafları (PRD 5.G Adım 5) için ayrı bir
`location_photos` tablosu yerine `locations` tablosuna `photo_urls
text[] not null default '{}'` kolonu eklenecek (mevcut
`accommodation_types text[]` deseniyle tutarlı, basit çoklu URL listesi
yeterli — sıralama/kapak foto gibi ek metadata şu an gerekmiyor).
Depolama: BLOCKERS #4'teki Cloudflare R2 hâlâ bekliyor olduğu için
STATUS.md/BLOCKERS notundaki "geçici olarak Supabase Storage ile
başlanabilir" önerisine göre `location-photos` adlı bir Supabase Storage
bucket'ı migration ile oluşturulacak (zaten açık olan Supabase projesi
içinde — yeni hesap açma değil, mevcut projede kaynak oluşturma).
Gerçek R2 key'i geldiğinde upload hedefi değiştirilecek, `photo_urls`
alanı şema olarak aynı kalır.
**Gerekçe:** Faz 4'ü R2 hesabı beklemeden ilerletebilmek, şema
karmaşıklığını en aza indirmek.
**Onaylayan:** CEO ajanı (otonom oturum — geri dönüşü kolay bir teknik
detay, büyük mimari karar kapsamında değil; Supabase Storage→R2 geçişi
ileride tek satırlık upload hedefi değişikliği).

### 2026-07-26 — Otonom oturum: mock POI vs. gerçek `locations` çakışması (ONAY BEKLİYOR)
**Durum tespiti:** Faz 5 (Etkileşim — yorum/favori/liste) görevlerini
planlarken şu çakışma ortaya çıktı: Faz 2/3'te Ana Ekran/Liste/Arama/POI
Detay tamamen `packages/shared/src/mock-locations.ts`'teki sahte veriyle
çalışıyor (id'ler `mock-loc-001` gibi, gerçek UUID değil — bilinçli bir
Faz 2/3 kararıydı, "salt okunur" fazlarda hız için). Ancak `reviews.
location_id` ve `list_items.location_id` gerçek `locations.id`'ye foreign
key. Yani şu an ekranda görünen hiçbir POI'ye gerçek bir yorum veya
favori eklenemez — DB foreign key hatası verir. Faz 4'te kullanıcının
eklediği konumlar gerçek `locations` tablosuna yazılıyor ama bunlar hiçbir
yerde (haritada/listede) gösterilmiyor; iki veri kaynağı birbirinden kopuk.

**Seçenekler (öneriliyor, karar Mustafa'da):**
1. **Gerçek entegrasyon:** Ana Ekran/Liste/Arama/POI Detay'ı gerçek
   `locations` tablosuna bağla (status='published' + kullanıcının kendi
   'pending' kayıtları). Artı: Faz 5 tam anlamıyla uçtan uca çalışır,
   Faz 4'te eklenen konumlar sonunda görünür olur. Eksi: DB'de şu an
   yayınlanmış (`published`) hiç konum yok (admin onay akışı/panel Faz 8'de),
   bu yüzden harita muhtemelen boş görünecek — en az birkaç konumun admin
   tarafından manuel `published` olarak eklenmesi/işaretlenmesi gerekir
   (admin panel Faz 8'i beklemeden Supabase dashboard'dan elle yapılabilir).
2. **Hibrit (geçici):** Mock veriyi olduğu gibi bırak, yorum/favori/liste
   özelliklerini yalnızca kullanıcının Faz 4 sihirbazıyla kendi eklediği
   gerçek konumlar için aktif et (mock POI'lerde bu butonlar "yakında"
   placeholder kalır). Artı: Faz 2/3'ü bozmadan ilerlenir. Eksi: Kullanıcı
   deneyimi tutarsız (bazı POI'lerde yorum yazılabiliyor, bazılarında değil).
3. **Faz 5'i ertele:** Önce Faz 2 DoD onayı (BLOCKERS #8) alınıp gerçek
   entegrasyon kararı netleşene kadar yalnızca POI'ye bağlı olmayan Faz 5
   işleri (liste yönetimi) ilerletilir — bu oturumda uygulanan yaklaşım.
**Bu oturumda alınan geçici karar:** Seçenek 3 uygulandı (POI'ye bağımlı
olmayan "Harita Listelerim" CRUD'una başlandı), kalan Faz 5 görevleri
TASKS.md'de bu karara bağımlı olarak işaretlendi.
**Onaylayan:** Bekliyor — Mustafa'nın 1/2/3'ten birini seçmesi (ya da
başka bir yön önermesi) gerekiyor, bir sonraki daily'de görüşülmeli.

### 2026-07-26 — Otonom oturum: Public liste sayfası route'u `/liste/[id]` değil `/listeler/[id]`
**Durum tespiti:** TASKS.md'de PRD 5.K (Liste Sayfası — Paylaşılan/Public) için
önerilen route `/liste/[id]` idi, ama `pages/liste.vue` (Faz 2'den kalma
"Liste Görünümü" — harita kart-listesi, PRD 5.E) zaten bu isimde tam bir leaf
sayfa. Subagent gerçek dev server denemesiyle doğruladı: `pages/liste.vue` +
`pages/liste/[id].vue` birlikte varken Nuxt/vue-router `liste.vue`'yu nested
route'lar için parent'a çeviriyor; `liste.vue` içinde `<NuxtPage/>` olmadığından
`/liste/<id>` ziyaret edilince ebeveynin kendi içeriği sessizce gösteriliyor,
`id` parametresi tamamen yok sayılıyor (curl ile `/liste` ve `/liste/<id>`
birebir aynı HTML döndürdüğü kanıtlandı).
**Karar:** Public liste sayfası `/listeler/[id]` route'una taşındı (proje
deseniyle tutarlı: `liste`=tekil harita liste görünümü, `listelerim`=kendi
listelerim/auth, `listeler`=genel/public liste görünümü). Mevcut `/liste`
özelliğinde regresyon olmadığı ayrıca doğrulandı (değişiklik öncesi/sonrası
birebir aynı içerik).
**Onaylayan:** CEO ajanı (otonom oturum — geri dönüşü kolay bir routing
detayı, PRD'nin özünü/davranışını değiştirmiyor, büyük mimari karar kapsamında
değil).

### 2026-07-26 — Otonom oturum: Faz 11 (Offline Harita) — gerçek PMTiles veri kaynağı (ÖNERİ, ONAY BEKLİYOR)
**Durum tespiti:** Offline harita altyapısı (`useOfflineMap.ts`, indirme/silme/
listeleme, UI) kuruldu ama gerçek bölgesel `.pmtiles` verisinin NEREDEN
geleceği henüz belirsiz. PRD 7.1 "self-hosted PMTiles" diyor ama bir tile
üretim/hosting hattı henüz yok.
**Öneri (iki seçenek):**
1. **Protomaps public build'inden istemci-taraflı excerpt (önerilen):**
   Protomaps'ın ücretsiz/açık kaynak global PMTiles "planet" build'i HTTP
   range-request destekliyor; `pmtiles` kütüphanesinin extract mantığıyla
   kullanıcının seçtiği bbox için yalnızca gereken tile'lar indirilip yerel
   bir `.pmtiles` dosyası oluşturulabilir. Artı: hesap/ödeme/sunucu
   gerekmiyor, PRD'nin "açık kaynak yığın" ruhuyla tam uyumlu, hemen
   uygulanabilir. Eksi: Protomaps'ın public build'inin güncellik/kapsam
   garantisi sınırlı (üçüncü taraf bir servise bağımlılık).
2. **Ayrı self-hosted tile-packaging sunucusu:** Kendi altyapımızda
   (Supabase Storage veya R2 üzerinde) bölgesel PMTiles dosyaları önceden
   üretilip barındırılır. Artı: tam kontrol. Eksi: yeni bir üretim
   pipeline'ı + depolama/bant genişliği maliyeti + kurulum süresi gerektirir,
   MVP için orantısız karmaşık olabilir.
**Bu oturumda alınan geçici karar:** Hiçbiri henüz uygulanmadı — `useOfflineMap.
ts`'teki `resolveDownloadSourceUrl()` bilinçli olarak `TODO` bırakıldı,
yalnızca bir Protomaps demo dosyasıyla indirme/silme akışının teknik olarak
çalıştığı kanıtlandı (üretim kaynağı değil).
**Onaylayan:** Bekliyor — Mustafa'nın 1/2'den birini seçmesi (ya da başka bir
yön önermesi) gerekiyor; büyük bir mimari kilitlenme değil (küçük ölçekte
denenip değiştirilebilir) ama üçüncü taraf veri kaynağı seçimi olduğundan
otonom karar verilmedi, bir sonraki daily'de görüşülmeli.

### 2026-07-26 — Otonom oturum: Faz 11 pmtiles↔MapLibre teknik entegrasyon kararı (küçük, geri dönüşü kolay)
**Karar:** `useOfflineMap.ts`'teki `getRegionSourceUrl()`'ü haritaya bağlarken,
mevcut online kaynağın ÜSTÜNE ayrı bir katman eklemek yerine `map.setStyle()`
ile haritanın TÜM stilini geçici olarak offline pmtiles kaynağına
değiştirme/geri alma yöntemi seçildi (`useMap.ts`: `tryActivateOfflineFallback`/
`restoreOnlineStyle`). Tetikleyici: `navigator.onLine` + `online`/`offline`
window event'leri + harita `error` event'i; `@capacitor/network` paketi
kurulmadı (basit/minimal çözüm yeterli görüldü). Offline stil yalnızca
`earth`/`water`/`buildings`/`roads` katmanlarını içeriyor, sembol/etiket
katmanı yok (glyph fetch internet gerektirir).
**Gerekçe:** Tam stil değişimi, kısmi source/layer ekleme mantığına göre
daha basit ve öngörülebilir (katman sıralaması/çakışma riski yok); minimal
offline stil kapsamı MVP için yeterli, gerçek üretim PMTiles kaynağı
netleşince (yukarıdaki bekleyen karar) kolayca genişletilebilir.
**Onaylayan:** CEO ajanı (otonom oturum — küçük ölçekli, geri dönüşü kolay
bir teknik entegrasyon detayı; büyük mimari karar kapsamında değil, üçüncü
taraf veri kaynağı seçimini etkilemiyor).

### 2026-07-26 — Otonom oturum: Faz 12 (Rota Motoru) — servis seçimi (ÖNERİ, ONAY BEKLİYOR)
**Durum tespiti:** PHASES.md Faz 12 "Rota Motoru"nu Valhalla/OSRM entegrasyonu
(karavan kısıtlamalı rotalama) olarak tanımlıyor; DoD "uygulama içi karavan-
güvenli rota önerisi çalışıyor". PRD.md (satır 362, 385-387) rota motorunun
"truck/hgv" costing modeli (yükseklik/genişlik/ağırlık kısıtı) desteklemesini
"genel amaçlı Google Maps'ten farklılaşan temel değer önerisi" olarak
işaretliyor. Şu an PRD 5.F'teki "Yol Tarifi" seçim modalı yalnızca harici
Google Maps/Apple Maps'e yönlendiriyor — uygulama içi, karavan kısıtlı bir
rota motoru henüz yok. Bu oturumda dört açık kaynak/ücretsiz seçenek
araştırıldı (hiçbirine gerçek entegrasyon/hesap açma yapılmadı, yalnızca
web araştırması):

**Seçenekler:**
1. **Valhalla, self-hosted (Docker) — önerilen:** Truck costing modeli
   `maxweight`/`maxheight`/`maxwidth`/`maxlength`/`hazmat` gibi kısıtları
   doğrudan OSM etiketlerinden okuyor ve bunları per-request JSON parametresi
   olarak dışa açıyor — yani tek bir tile seti üzerinde farklı karavan
   boyutları için tile'ları yeniden üretmeden sorgu bazında costing
   değiştirilebiliyor (PRD'nin istediği "karavan-güvenli rota" tam olarak bu).
   Resmî Docker imajı + toplulukça bakılan `nilsnolde/docker-valhalla` gibi
   hazır Docker kurulumları var. Artı: en güçlü açık kaynak truck/HGV
   desteği, hesap/API key/ödeme gerektirmiyor (sadece kendi sunucumuzda
   barındırma). Eksi: **yeni bir sunucu/hosting kararı gerektiriyor** —
   OSM verisinden tile üretimi + barındırma (kaba tahmin: küçük/orta trafik
   için ~8-16GB RAM + tile'lar için onlarca GB disk; büyük ölçek için
   8 core/64GB gibi rakamlar görülüyor) — bu "hesap açma" değil ama yeni bir
   aylık sunucu maliyeti/DevOps yükü anlamına geliyor, bu yüzden otonom karar
   verilmedi. Ayrıca Valhalla'nın topluluk tarafından barındırılan ücretsiz
   bir demo sunucusu var: `valhalla1.openstreetmap.de` (FOSSGIS e.V.), hesap/
   API key gerektirmiyor, fakat açık şekilde "fair-use" / demo amaçlı
   (1 istek/kullanıcı/sn, toplam 100 istek/sn limiti; yayınlanan uygulamaların
   `X-Client-Id` header'ı eklemesi ve GitHub Discussions'ta kendini bildirmesi
   isteniyor) — **prod için uygun değil, yalnızca geliştirme/test aşamasında
   kullanılabilir.**
2. **OSRM, self-hosted (Docker):** Resmî olarak yalnızca car/bike/foot
   profilleri var; "truck" desteği resmî değil, `osrm-profiles-contrib`
   reposundaki topluluk katkısı `truck-soft` Lua profiliyle sağlanıyor ve bu
   profilde bile yükseklik/genişlik kısıtları "strict" uygulanırken ağırlık/
   uzunluk kısıtları yalnızca "soft" (ceza puanı) uygulanıyor — GitHub
   issue'larında kullanıcılar ağırlık kısıtının pratikte çalışmadığını
   bildiriyor. Kurulumu Valhalla'dan biraz daha basit/hafif olabilir ama
   PRD'nin "temel değer önerisi" dediği sağlam truck/HGV kısıtlaması için
   OSRM zayıf kalıyor. Ayrıca `router.project-osrm.org` public demo
   sunucusunun kullanım politikası da net: "makul, ticari olmayan kullanım,
   1 istek/sn'yi geçmeyecek" — hem prod'a uygun değil hem de zaten truck
   profili sunmuyor (yalnızca car/bike/foot). **Eksi ağır basıyor, önerilmiyor.**
3. **openrouteservice (ORS) — public API veya self-hosted:** HGV profili
   (length/width/height/axleload/weight kısıtlarıyla) olgun ve iyi
   dokümante edilmiş. Ancak public API'yi kullanmak için bir API key almak
   (openrouteservice.org üzerinde hesap/kayıt) gerekiyor — ücretsiz katman
   olsa da (40.000 istek/ay, günlük 2.500 limit) bu proje kurallarına göre
   "hesap açma" kategorisine giriyor ve otonom yapılamaz, yalnızca BLOCKERS'a
   yazılabilir bir seçenek. Self-hosted ORS de mümkün (açık kaynak, Java
   tabanlı) ama Valhalla'ya göre daha ağır bir stack olarak değerlendiriliyor.
   MVP için değerlendirmeye değer ama hesap gerektirdiği için Valhalla'nın
   önüne geçemiyor.
4. **GraphHopper (açık kaynak):** Self-hosted sürüm hazır truck/bus profilleri
   içeriyor (Apache 2.0, Java tabanlı kütüphane/standalone sunucu). Hosted
   "Directions API" (ticari) ücretsiz test katmanı sunuyor ama yine API key/
   hesap gerektiriyor. Self-hosted seçenek olarak Valhalla'ya alternatif
   olabilir ama truck costing'in Valhalla kadar per-request esnek/dinamik
   olduğuna dair güçlü bir bulgu çıkmadı; şimdilik ikincil seçenek olarak
   not düşülüyor.

**Önerilen yön (Mustafa'nın onayına sunuluyor):** Geliştirme/prototipleme
aşamasında Valhalla'nın ücretsiz FOSSGIS demo sunucusuyla (`valhalla1.
openstreetmap.de`, `X-Client-Id` header'ıyla, hesap gerektirmiyor) uygulama
içi rota UI'sı ve truck costing entegrasyonu teknik olarak doğrulanabilir;
gerçek launch öncesi self-hosted Valhalla (Docker, Türkiye OSM extract'i)
kalıcı çözüm olarak kurulmalı. Bu, yeni bir aylık sunucu maliyeti/hosting
kararı gerektirdiğinden otonom uygulanmadı.
**Bu oturumda alınan geçici karar:** Hiçbir seçeneğe gerçek entegrasyon
yapılmadı; bu yalnızca araştırma + öneri notu. Faz 12 kod/entegrasyon işi
başlamadı.
**Onaylayan:** Bekliyor — Mustafa'nın seçmesi gerekiyor (1/2/3/4'ten biri ya
da başka bir yön), otonom karar verilmedi. Özellikle self-hosted Valhalla
seçeneği yeni bir sunucu/hosting maliyeti doğuracağından ayrıca not: bu,
BLOCKERS.md'deki "yeni hesap/ödeme" kısıtına birebir girmese de (kendi
sunucumuzu barındırma, üçüncü taraf hesabı değil) bütçe etkisi olan bir
altyapı kararı — bir sonraki daily'de görüşülmeli.

**Teknik not (UI için, paralel çalışan subagent'a bilgi):** Faz 12'nin
gerçek rota motoru entegrasyonu netleşene kadar, uygulama içi "Rota" ekranı
sabit/mock bir `RouteResult` nesnesiyle (örn. `packages/shared` içine
mock koordinat dizisi + tahmini süre/mesafe + "karavan-güvenli" rozeti
içeren sahte bir GeoJSON LineString) geçici olarak doldurulabilir — tıpkı
Faz 2/3'te `mock-locations.ts`'in yapıldığı gibi; gerçek servis seçilince
yalnızca veri kaynağı (mock → Valhalla/`fetch` çağrısı) değişir, ekran/route
görselleştirme mantığı (MapLibre üzerinde LineString çizimi) aynı kalabilir.

### Gerçek Figma ikon export'u eşleme kararları (2026-07-26, interaktif)

`design/icons-export/` altındaki 118 dosyanın bazı isimleri belirsizdi
(çoklu varyant içeriyordu). SVG'leri `cairosvg` ile PNG'ye çevirip görsel
karşılaştırma + `design/*.png` ekran görüntüleriyle çapraz kontrol sonucu
verilen eşleme kararları:

- **`tent.svg`/`tent-free.svg` vb. çift-varyant ailelerinin ("tent" vs
  "tent-free", "van" vs "van-free", "park" vs "park-1") hangisinin
  "ücretli" hangisinin "ücretsiz" olduğu:** `tent.svg`/`van.svg` içine $
  rozeti GÖMÜLÜ (paid), `tent-free.svg`/`van-free.svg` rozetsiz (free).
  `park` ailesinde TERSİ: `park.svg` rozetsiz (free), `park-1.svg` rozetli
  (paid) — bu, `design/6-Filtre.png` ekran görüntüsündeki 6 kategori
  kartıyla (Ücretli/Ücretsiz Karavan/Park/Çadır) birebir görsel doğrulandı.
- **`AppIcon.vue`'nun `poi-caravan`/`poi-parking`/`poi-tent` glifleri için
  hangi varyant kullanıldı:** Mevcut kod mimarisi (ücretli/ücretsiz aynı
  glifi paylaşır, "fee-badge" ayrı overlay ile ücret gösterir —
  `composables/useLocationTypeIcon.ts`) korundu; bu yüzden her kategori
  için rozetSİZ varyant seçildi (`van-free.svg`, `park.svg`,
  `tent-free.svg`) — rozetli varyantı kullanırsak `fee-badge` overlay'i ile
  çift rozet oluşurdu. `-1`/`-2` (renkli daire/pin) varyantları kullanılmadı
  çünkü mevcut UI bu glifleri sabit-renkli daire/pin olarak değil,
  `currentColor` ile dinamik renklendirilen düz ikonlar olarak kullanıyor.
- **`fee-badge` ikonu için `money.svg` seçildi** — van/tent/park-1
  ikonlarının köşesindeki $ rozeti ile aynı tasarım (iki path: dış halka +
  "$" harfi), 24x24 bağımsız bir glif olarak zaten var.
- **`shower-3.svg` KULLANILMADI** — görsel karşılaştırmada bunun bir duş
  varyantı değil, kırmızı bir "sil/kaldır" (çöp kutusu) pin ikonu olduğu
  görüldü; muhtemelen yanlış adlandırılmış/gruplama hatası, poi-shower
  glifinde `shower.svg` (rozetsiz temel glif) kullanıldı.
- **Logo için `logo.svg` (24x24, sade sembol) seçildi**, `app-logo.svg`/
  `logo-dark-mode.svg` (142x199, çok detaylı büyük illüstrasyon) DEĞİL —
  `Logo.vue`'nun kullanım boyutları (sm/md/lg = 24/32/48px) küçük-ikon
  versiyonuna daha uygun, ayrıca `design/2-Ana Ekran.png` header'ındaki
  logo boyutu da bu küçük versiyona yakın. `logo-with-text.svg` (özel font
  path'li "Kamp.la" wordmark gömülü) kullanılmadı çünkü mevcut kod zaten
  ayrı bir `<span>` tabanlı wordmark kullanıyor ve bu, i18n (`$t("brand.name")`)
  ile uyumlu — SVG içine gömülü metin i18n'i bozardı.
- **`pin` ikonu için `pin.svg` (siyah dolgu + beyaz ince kontur) seçildi**,
  `orange-pin.svg` (sabit turuncu dolgu) DEĞİL — çünkü `pages/ara.vue`
  "pin" ikonunu dinamik renkte kullanıyor (son aramalarda gri, öneri
  listesinde turuncu, `text-*` class'larıyla). `orange-pin.svg` sabit
  renkli olduğundan bu dinamik kullanıma uymuyordu; `pin.svg`'nin siyah
  dolgusu `currentColor`'a çevrilip beyaz kontur sabit bırakıldı.
- **`back` ikonu için `left-arrow.svg` seçildi** (24x24, stroke-width 2,
  standart "<" chevron) — `arrow-nav.svg` de benzer bir chevron ama daha
  ince stroke-width (1.11) ve farklı bir bağlamda (muhtemelen küçük
  prev/next kontrolü) kullanılmak üzere export edilmiş görünüyor;
  `design/10-Arama Ekranı.png`'deki geri oku `left-arrow.svg`'nin
  kalınlığıyla birebir eşleşiyor.
- **PoiSummaryCard.vue "Yol Tarifi" butonu ikonu için `direction.svg`
  seçildi** (döşenmiş yol tabelası/pusula şekli) — önceki oturumun elle
  çizdiği "kağıt uçak" tarzı ok yerine, `design/4-Ana Ekran - Konuma
  tıklanınca.png` ekran görüntüsündeki gerçek "YOL TARİFİ" buton ikonuyla
  birebir görsel doğrulandı.
- **`star-solid`/`star-line` ikonları artık SABİT renkli** (`star.svg`
  fill `#FFCA41`, `star-empty.svg` fill `#EEEEEE`) — `currentColor` DEĞİL.
  Önceki kod bu ikonlara `:style="{ color: ratingColor }"` ile dinamik
  renk veriyordu ama `ratingColor` zaten sabit bir sabittir
  (`packages/shared/src/theme.ts` → `"#FFCA41"`, gerçek Figma export'unun
  fill değeriyle birebir aynı) — yani gerçek tasarımda zaten sabit renk
  kullanılıyor, dinamik değil. `:style` binding'leri consumer dosyalarında
  (`pages/liste.vue`, `PoiSummaryCard.vue`) bilinçli olarak SİLİNMEDİ
  (zararsız, artık no-op) — gereksiz diff/regresyon riskini azaltmak için.
- **Kapsam dışı bırakılanlar (bilinçli, zaman/risk nedeniyle):** (1) Harita
  pin'lerinin gerçek tasarımda teardrop+ikon şeklinde olduğu ama kodda düz
  renkli CSS daire (`kampla-poi-marker`, ikonsuz) olarak render edildiği
  fark edildi (`design/4-Ana Ekran - Konuma tıklanınca.png`) — bu, "elle
  çizilmiş sahte SVG" değil, CSS tabanlı bir basitleştirme, bu oturumun
  kapsamı dışında bırakıldı (ayrı bir görev olarak STATUS.md'de not
  edildi). (2) `PoiSummaryCard.vue`'daki "DETAYLAR" butonunun gerçek
  tasarımda bir "i" ikonlu altıgen rozeti varken kodda hiç ikon
  bulunmadığı fark edildi — mevcut ikonun YANLIŞ olması değil, TAMAMEN
  EKSİK olması durumu; bu da "dürüstlük" sorunundan çok bir eksik özellik
  olduğundan bu oturumda eklenmedi, STATUS.md'de not edildi.
