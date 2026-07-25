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
