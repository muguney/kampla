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
