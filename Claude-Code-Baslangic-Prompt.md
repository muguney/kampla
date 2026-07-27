# Claude Code — Başlangıç Promptu

> Bu dosyanın altındaki metni, proje klasöründe `claude` başlatıp ilk mesaj olarak yapıştır.
> Sonraki fazlarda "Faz X'e geç" diyerek devam edebilirsin; PRD'deki faz planı (Bölüm 7.3) yol haritasıdır.

---

Kamp.la adında bir kamp/karavan keşif uygulaması geliştireceğiz. Bu klasörde ihtiyacın olan her şey mevcut:

1. **`Kampla-Proje-Dokumani.md`** — Projenin tam PRD'si: kurumsal kimlik (Bölüm 2), tasarım prensipleri (Bölüm 3), ekran haritası (Bölüm 4), tüm özellikler (Bölüm 5.A–5.R), veri modeli (Bölüm 6), teknik mimari ve tech stack (Bölüm 7), netleşmiş ürün kararları (Bölüm 8). **Önce bu dosyayı baştan sona oku.**
2. **44 adet PNG** (`1- Splash.png` … `44-Liste Sayfası (Paylaşılan).png`) — Figma'dan alınmış birebir uygulanacak ekran tasarımları. Dosya adları ekranın ne olduğunu söylüyor. Bir ekranı geliştirmeden önce ilgili PNG'yi mutlaka görüntüleyip birebir uygula (renkler, köşe yuvarlaklıkları, buton düzeni, ikonografi).
3. **`.env.example`** — Ortam değişkenleri şablonu. Ben bunu `.env` olarak kopyalayıp gerçek değerleri gireceğim/girdim. Kod her zaman env üzerinden okusun, hiçbir anahtar hard-code edilmesin.
4. **`Kurulum-Gereksinimleri.md`** — Hangi harici hesapların hazır olduğunu gösterir; bir servise ihtiyaç duyduğunda değeri `.env`'de bulamazsan bana sor, kodu bloklamadan mock/placeholder ile devam et.

## Görev: Faz 0 — Proje İskeleti

PRD Bölüm 7.2'deki monorepo yapısını kur ve Faz 0'ı (Bölüm 7.3) tamamla:

1. **Monorepo:** pnpm workspaces — `apps/mobile-web` (Nuxt 3 + Tailwind CSS + Pinia), `apps/admin` (şimdilik boş Nuxt iskeleti), `packages/shared` (ortak tipler/sabitler/tema).
2. **Tasarım sistemi:** PRD Bölüm 2.3'teki renk paletini ve Bölüm 6.1'deki 9 POI kategorisinin renklerini Tailwind theme'ine işle (`brand`, `poi.*` renkleri). Font: Google Fonts'tan Baloo 2 (PRD 2.4 — tasarımlardaki yuvarlak hatlı fonta en yakın aile). PNG'lerden renkleri doğrula.
3. **Temel layout:** Üst bar (logo + sayfa başlığı deseni, PNG'lerdeki gibi) ve sabit alt navigasyon (5 sekme: Ana Sayfa, Ara, ortada turuncu [+] FAB, Listelerim, Menü — bkz. `2-Ana Ekran.png` alt kısmı).
4. **Supabase bağlantısı:** `@nuxtjs/supabase` veya `supabase-js` ile client kurulumu (env'den okuyarak). Veritabanı şemasını PRD Bölüm 6'ya göre SQL migration dosyaları olarak yaz (`supabase/migrations/`): `profiles`, `locations` (PostGIS point + status + source), `location_amenities`, `lists`, `list_items`, `reviews`, `reports`, `notifications`, `subscriptions` + RLS politikaları (PRD 7.1 "Veritabanı" notlarına göre).
5. **Placeholder sayfalar:** PRD 7.2'deki tüm route'lar için boş/iskelet sayfalar, aralarında navigasyon çalışır durumda.
6. **Dil altyapısı:** `@nuxtjs/i18n` ile TR (varsayılan) + EN iskeleti; metinler baştan itibaren locale dosyalarından gelsin (PRD 5.L).
7. **Tema altyapısı:** Light/Dark için Tailwind `dark:` + tercih saklama iskeleti (PRD 5.L). Dark tasarımı henüz yok; sadece altyapı.

Kurallar:
- Ekran metinleri Türkçe, kod/dosya adları PRD 7.2'deki gibi.
- Her önemli adımda kısa açıklama yap; faz sonunda `pnpm dev` ile çalışan, alt navigasyonu gezilebilir bir iskelet teslim et.
- Faz 0 kapsamı dışına çıkma (harita, auth, POI detay sonraki fazlarda).

---

## Sonraki Fazlar İçin Şablon

Yeni oturumda/fazda şunu yapıştır:

> `Kampla-Proje-Dokumani.md` dosyasını oku. Faz N'e geçiyoruz: [PRD 7.3'teki faz tanımı]. İlgili PRD bölümleri: [örn. Faz 2 için 5.B–5.E + 7.1 Harita Motoru]. İlgili tasarımlar: [örn. `2-Ana Ekran.png`, `3-Ana Ekran - Harita Seçim.png`, `4-Ana Ekran - Konuma tıklanınca.png`, `5- Liste Ekranı.png`, `6-Filtre.png`, `10-Arama Ekranı.png`]. Önceki fazlarda üretilen yapı `apps/mobile-web` altında; mevcut bileşenleri yeniden kullan, tasarımlara birebir sadık kal.
