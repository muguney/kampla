# Figma Referansı — Kamp.la

**Dosya:** https://www.figma.com/design/p7neuunRKD3rmtxveGw0my/Kamp.la
**File key:** `p7neuunRKD3rmtxveGw0my`
**Bağlantı:** Figma MCP connector Mustafa tarafından bağlandı (2026-07-25).

## Kural (ÇOK ÖNEMLİ — Mustafa'nın talimatı, 2026-07-25)

> "Tasarım Figma'daki gibi olacak, kafana göre çok değişiklik yapma."

Yeni bir ekran/bileşen kodlanacağı veya var olan bir ekran düzeltileceği
zaman **PRD metnini veya kendi tasarım sezgini değil, aşağıdaki Figma
node'unu birebir referans al**:

1. `get_figma_skill` ile `skill://figma/figma-design-to-code/SKILL.md`
   dosyasını oku (zorunlu ön koşul — atlanmaz).
2. İlgili ekran için `get_design_context(fileKey, nodeId)` çağır (aşağıdaki
   tablodan node id'yi bul). Bu, referans kod + screenshot + renk/spacing
   token'larını verir.
3. Çıktıyı olduğu gibi yapıştırma — projenin stack'ine (Nuxt/Vue/Tailwind),
   mevcut bileşenlere ve `packages/shared/src/theme.ts` + Tailwind
   config'teki tasarım tokenlarına uyarlanmış şekilde kodla.
4. İkon/görselleri Figma'dan export edilen assetlerle birebir kullan,
   kendi SVG'ni çizme/yerine placeholder koyma.
5. `design/` klasöründeki PNG export'ları da aynı ekranların statik
   görüntüleridir — hızlı görsel referans için kullanılabilir ama
   `get_design_context` kadar kesin değildir (renk hex/spacing tam
   çıkmaz), asıl doğruluk kaynağı her zaman canlı Figma node'udur.

## Ekran → Figma Node ID Eşlemesi (44 ekran, PRD Bölüm 4)

| # | Ekran | Figma Node ID | Uygulama dosyası (bilinen) |
|---|---|---|---|
| 1 | Splash | 53:626 | — |
| 2 | Ana Ekran (Harita) | 52:218 | `apps/mobile-web/pages/index.vue` |
| 3 | Ana Ekran - Harita Seçim (modal) | 160:1313 | `apps/mobile-web/components/map/LayerSelectModal.vue` |
| 4 | Ana Ekran - Konuma tıklanınca (özet kart) | 64:4384 | `apps/mobile-web/components/map/PoiSummaryCard.vue` |
| 5 | Liste Ekranı | 52:266 | `apps/mobile-web/pages/liste.vue` |
| 6 | Filtre | 132:1271 | `apps/mobile-web/components/map/FilterModal.vue` |
| 7 | Harita Listelerim | 176:1875 | `apps/mobile-web/pages/harita-listelerim/index.vue` (yol tahmini) |
| 8 | Harita Listelerim | 503:1595 | " |
| 9 | Harita Listelerim | 503:1754 | " |
| 10 | Arama Ekranı | 255:7148 | `apps/mobile-web/pages/ara.vue` |
| 11 | Poi Detay | 190:1288 | `apps/mobile-web/pages/konum/[id]/index.vue` (yol tahmini) |
| 12 | Poi - Listeye Ekle | 503:1369 | — |
| 13 | Poi - Konuma Fotoğraf Ekle | 503:1976 | — |
| 14 | Poi Yorumlar | 237:1279 | — |
| 15 | Poi Detay Yorum Ekle | 237:1870 | — |
| 16 | Poi Detay - Hata Bildir | 237:2069 | — |
| 17 | Poi Detay - Haritaya Yönlendir | 237:2292 | — |
| 18 | Konum Ekle - Konum Seç | 248:3886 | `apps/mobile-web/pages/konum-ekle/[step].vue` (6 adım tek dosyada) |
| 19 | Konum Ekle - Türü | 248:2907 | " |
| 20 | Konum Ekle - Hizmetler | 248:3101 | " |
| 21 | Konum Ekle - Detaylar | 248:4052 | " |
| 22 | Konum Ekle - Fotoğraflar | 248:4201 | " |
| 23 | Konum Ekle - Fotoğraflar (2) | 503:2384 | " |
| 24 | Konum Ekle - Sonuç Ekranı | 503:2357 | " |
| 25 | Login | 149:5329 | `apps/mobile-web/pages/giris.vue` |
| 26 | Register | 149:5379 | `apps/mobile-web/pages/kayit.vue` |
| 27 | Forgot Password | 154:5463 | `apps/mobile-web/pages/sifremi-unuttum.vue` |
| 28 | Menu | 160:1904 | `apps/mobile-web/pages/menu.vue` |
| 29 | Menu (Logged) | 121:1146 | " |
| 30 | Uygulama Ayarları | 160:1467 | `apps/mobile-web/pages/ayarlar/index.vue` (yol tahmini) |
| 31 | Dil Seçimi | 160:1567 | `apps/mobile-web/pages/ayarlar/dil.vue` (yol tahmini) |
| 32 | Tema Ayarları | 160:1675 | `apps/mobile-web/pages/ayarlar/tema.vue` (yol tahmini) |
| 33 | Kullanım Koşulları | 160:1818 | `apps/mobile-web/pages/kullanim-kosullari.vue` (yol tahmini) |
| 34 | Gizlilik Sözleşmesi | 160:1871 | `apps/mobile-web/pages/gizlilik.vue` (yol tahmini) |
| 35 | Hesabım | 166:851 | `apps/mobile-web/pages/hesabim/index.vue` (yol tahmini) |
| 36 | Kullanıcı Adı Değiştir | 167:1293 | — |
| 37 | E-Posta Değiştir | 167:1435 | — |
| 38 | Şifre Değiştir | 167:1470 | — |
| 39 | Sosyal Medya Hesapları | 167:1511 | — |
| 40 | Yorumlarım | 168:1589 | — |
| 41 | Profil Sayfası (Paylaşılan) | 176:1274 | — |
| 42 | Profil Sayfası (Paylaşılan) | 176:2011 | — |
| 43 | Liste Sayfası (Paylaşılan) | 176:986 | — |
| 44 | Liste Sayfası (Paylaşılan) | 503:2045 | — |

"Yol tahmini" olarak işaretli satırlar gerçek dosya yapısı kontrol
edilmeden PRD 7.2 route haritasına göre tahmin edildi — kullanılmadan
önce `apps/mobile-web/pages/` altında doğrulanmalı.

## Faz 2'de zaten kodlanmış ama Figma karşılaştırması YAPILMADAN yazılmış ekranlar

2026-07-25 otonom oturumunda #2, #3, #4, #5, #6, #10 (yukarıdaki tablo)
PRD metin açıklamasına ve genel Tailwind tasarım sistemine göre kodlandı —
bu Figma connector'ü henüz bağlı değilken yapıldı. Bu yüzden bu 6 ekranın
Figma ile birebir örtüşüp örtüşmediği doğrulanmadı; bir sonraki oturumda
`get_design_context` ile tek tek kontrol edilip gerekirse renk/spacing/
layout düzeltmesi yapılmalı (bkz. DECISIONS.md ilgili kayıt).
