# Kamp.la — Ürün Tanım Dokümanı (PRD)

> Bu doküman, Figma tasarımlarındaki 44 ekran incelenerek hazırlanmıştır. Kurumsal kimlik ve renk kodları ekran görüntülerinden görsel olarak tahmin edilmiştir — **kesin hex/font değerleri Figma dosyasından (Inspect paneli / stil kütüphanesi) alınıp bu doküman güncellenmelidir.**

---

## 1. Proje Özeti

**Kamp.la**, kamp, karavan ve doğa alanlarını (ücretli/ücretsiz karavan parkı, çadır alanı, su/duş/çamaşır noktaları vb.) harita üzerinde keşfetmeyi, kullanıcıların bu konumları kendi deneyimleriyle eklemesini, fotoğraflamasını, yorumlamasını ve kişisel/paylaşılabilir listeler halinde organize etmesini sağlayan bir **topluluk kaynaklı (crowdsourced) kamp keşif uygulaması**.

Konsept olarak şu üç ürünün kesişimine oturuyor:
- **Google Maps / Foursquare** — harita merkezli POI keşfi
- **Airbnb** — kart bazlı liste görünümü, filtreleme, detay sayfası tasarımı
- **TripAdvisor** — kullanıcı yorumu, puanlama, "hata bildir" ve moderasyon akışı

Hedef kullanıcı: Türkiye'de kamp/karavan yapan, doğa gezileri planlayan, bu deneyimi paylaşan bireyler ve topluluklar.

---

## 2. Kurumsal Kimlik

### 2.1 Marka Adı
**Kamp.la** — "Kamp" kelimesi kalın/koyu renkte, ".la" uzantısı ise marka rengiyle (turuncu) yazılıyor. İsim, alan adı stilinde ("Kamp" + ".la") modern ve akılda kalıcı bir yapı kuruyor.

### 2.2 Logo
- **Sembol:** Stilize edilmiş bir **kamp ateşi** — turuncu/mercan renkli alev, altında çapraz duran iki antrasit renkli odun parçası.
- **Kullanım biçimleri:**
  - Tek başına sembol (splash ekranı, üst bar sağ köşesi, iç sayfa başlıkları)
  - Sembol + "Kamp.la" yazısı (giriş/kayıt ekranları, ana harita üst barı)
- Logo, marka kimliğinin en tutarlı unsuru; neredeyse her ekranın sağ üst köşesinde (sayfa başlığının yanında) küçük boyutta tekrar ediyor — bu bir marka pekiştirme deseni olarak korunmalı.

### 2.3 Renk Paleti (görsel olarak tahmini)

| Rol | Yaklaşık Ton | Kullanım |
|---|---|---|
| **Marka / Aksiyon Rengi (Turuncu)** | `#F2884B` – `#F4874C` civarı, sıcak mercan-turuncu | CTA butonlar, aktif sekmeler, logo alevi, linkler, seçili durumlar, ikonlar |
| **Antrasit / Koyu Gri** | `#3B3B3B` – `#40403F` civarı | Başlıklar, "Detaylar" gibi ikincil siyah butonlar, logo odunu, gövde metni |
| **Yeşil (Doğa/Ücretsiz Kamp)** | Orta ton yeşil | Ücretsiz çadır alanı ikonları, harita zemin rengi (topografik ton) |
| **Mavi (Su/Bilgi)** | Açık-orta mavi | Su doldurma noktaları, bilgi amaçlı harita pin'leri (tarihi alan vb.) |
| **Kırmızı/Mercan (Ücretli Karavan)** | Sıcak kırmızımsı ton | Ücretli karavan parkı kategori rengi |
| **Mor** | Orta mor | Ücretli çadır alanı kategori rengi |
| **Nötr Bej/Krem Arkaplan** | `#F1EDE9` civarı | Form ekranları arkaplanı (Konum Ekle, Ayarlar), kart dışı zemin |
| **Beyaz** | `#FFFFFF` | Kartlar, üst bar, input alanları |
| **Sarı/Amber** | Standart yıldız sarısı | Puanlama yıldızları |

> **Not:** Turuncu, markanın tek ve baskın rengi olarak "sıcaklık, ateş, doğa, macera" hissini taşıyor. Kategori renkleri (kırmızı/mor/yeşil/mavi) bir **anlamsal renk kodlama sistemi** oluşturuyor — her POI türü kendi rengiyle haritada ve listede anında tanınabiliyor. Bu sistem korunmalı ve resmi bir "kategori renk paleti" olarak dokümante edilmeli.

### 2.4 Tipografi
- **Yazı karakteri:** Yuvarlak hatlı, kalın (bold/semibold ağırlıklı), geometrik bir sans-serif — Poppins, Baloo 2, Quicksand veya Fredoka ailesine yakın bir görünüm sergiliyor (samimi, oyuncu, "outdoor/macera" hissi veren yuvarlak harf formları).
- **Başlıklar (H1/Sayfa başlığı):** Kalın, büyük punto (örn. "Üye girişi", "Tema Seçimi")
- **Gövde metni:** Aynı ailenin normal/medium ağırlığı, okunabilirlik için biraz daha ince
- **Placeholder/ikincil metin:** Açık gri, aynı font ailesi

> **Not:** Kesin font adı Figma'daki "Text Styles" panelinden doğrulanmalı. Bu doküman için önerim: yuvarlak, kalın, dostane bir font (Poppins veya Baloo 2) kullanılmaya devam edilmesi — marka kişiliğiyle (doğa, sıcaklık, topluluk) örtüşüyor.

### 2.5 Marka Tonu ve Dil
- Türkçe birincil dil, İngilizce ikincil dil desteği var (Dil Seçimi ekranı).
- Metinler samimi, davetkâr, ikinci tekil/çoğul şahıs kullanımıyla yönlendirici ("Yorumunuzu yazınız", "Eklediğim bu konumun...").
- Kullanıcı katkısına güven ve şeffaflık vurgusu var: konum eklerken "deneyime dayalı ve doğru olduğunu teyit ederim" onayı, "yönetici incelemesinden sonra yayınlanır" bilgilendirmesi.

### 2.6 Görsel Dil / Ton
- Doğa fotoğrafları (kamp ateşi, çadır, karavan, orman) ürünün duygusal omurgasını oluşturuyor — özellikle POI detay sayfalarındaki galeri görselleri.
- Yuvarlatılmış köşeler (kartlar, butonlar, inputlar), yumuşak gölgeler, "friendly/rounded" bir UI dili hakim.
- İkonografi: outline tarzda, tek renkli, yuvarlak arkaplan üzerine oturan (renkli daire/kare içinde beyaz ikon) tutarlı bir sistem.

---

## 3. Tasarım Konsepti / UI Prensipleri

1. **Harita-merkezli deneyim:** Uygulama açılışta doğrudan haritayı gösteriyor (liste değil). Harita, ürünün kalbi.
2. **Çoklu harita katmanı seçimi:** Kullanıcı klasik/topografik/uydu görünüm arasında geçiş yapabiliyor ("Harita seçiniz" modalı — üç görsel önizlemeli seçenek).
3. **Kart + Bottom Sheet mimarisi:** Bir pin'e tıklanınca ekranın altından kısa bir özet kartı (bottom sheet) yükseliyor; "Detaylar" ile tam sayfaya geçiliyor.
4. **Sabit alt navigasyon + ortada FAB:** Ana Sayfa (Harita), Ara, **[+] Konum Ekle** (öne çıkan turuncu buton), Favoriler/Listelerim, Menü.
5. **Anlamsal renk + ikon kodlaması:** Her POI türü kendine özgü renk + ikon kombinasyonuyla hem haritada hem listede tutarlı şekilde temsil ediliyor.
6. **Aşamalı form akışları (wizard):** Konum ekleme 6 adımlı bir sihirbaz olarak kurgulanmış (konum seç → tür seç → hizmetler → detaylar → fotoğraf → onay) — kullanıcıyı yormadan zengin veri toplama stratejisi.
7. **Görünürlük kontrolü:** Kullanıcının oluşturduğu listeler varsayılan olarak gizli; profilinde göstermek isterse bilinçli bir onay adımından geçiyor (gizlilik bilinci tasarıma gömülü).
8. **Moderasyon/güven katmanı:** Kullanıcı tarafından eklenen konumlar yayınlanmadan önce yönetici onayından geçiyor; "Hata Bildir" ile topluluk denetimi sürekli kılınıyor.
9. **Tema ve dil desteği:** Light/Dark tema ve TR/EN dil seçenekleri ürün ayarlarının temel bir parçası.
10. **Paylaşılabilirlik:** Profil ve liste sayfalarının "paylaşılan" (public, giriş yapmamış/başka kullanıcı görünümlü) versiyonları ayrıca tasarlanmış — sosyal büyüme/viral döngü düşünülmüş.
11. **Freemium model:** Ücretsiz ve Premium (Kamp.la Plus) kullanıcı tipleri var; kısıtlamalar ekran/erişim seviyesinde değil, özellik seviyesinde uygulanıyor (bkz. Bölüm 5.P).

---

## 4. Bilgi Mimarisi — Ekran Haritası (44 ekran)

```
├─ 0. Splash  (→ doğrudan Ana Ekran'a geçer; onboarding/tanıtım ekranı yok — bkz. Bölüm 8)
├─ 1. Ana Akış (Harita)
│   ├─ Ana Ekran (Harita) — pin'ler, katman seçici, filtre, konum butonu
│   ├─ Harita Katmanı Seçimi (modal)
│   ├─ Pin Tıklama → Özet Kartı (bottom sheet)
│   └─ Liste Görünümü (Harita ⇄ Liste toggle)
│       └─ Filtre (POI türü seçimi, çoklu seçim ızgarası)
├─ 2. Arama
│   └─ Konum Ara (şehir/bölge arama, öneriler)
├─ 3. POI Detay
│   ├─ Galeri + Başlık + Puan + Ekleyen kullanıcı
│   ├─ Detaylar sekmesi (imkanlar, açıklama, iletişim, konaklama tipi, sezon, koordinat, mini harita)
│   ├─ Yorumlar sekmesi (puan dağılımı, yorum listesi, yorum ekle modalı)
│   ├─ Listeye Ekle (favorilere / özel listeye ekleme)
│   ├─ Konuma Fotoğraf Ekle
│   ├─ Hata Bildir
│   ├─ Haritaya Yönlendir (Google Maps / Apple Maps seçenekli yol tarifi)
│   └─ Düzenle (kendi eklediği konum için)
├─ 4. Konum Ekle (6 adımlı sihirbaz)
│   ├─ 1) Konum Seç (harita üzerinde pin bırak)
│   ├─ 2) Konum Türü Seç (9 kategori, tekli seçim)
│   ├─ 3) Hizmetleri Seç (19 imkan, çoklu seçim)
│   ├─ 4) Detayları Gir (ad, açıklama, iletişim/sosyal medya, konaklama tipi, sezon)
│   ├─ 5) Fotoğraf Ekle (çoklu yükleme, kurallar metni)
│   ├─ 6) Onay (sözleşme onayı) → Sonuç (Tebrikler / moderasyon bilgisi)
├─ 5. Harita Listelerim (Kaydedilenler)
│   ├─ Sistem listeleri: Favorilerim, Ziyaret Edilen Yerler
│   ├─ Kullanıcı listeleri (özel, yıl/tema bazlı — "2023 Akdeniz Turu" vb.)
│   ├─ Liste aksiyonları: Paylaş, Adını Değiştir, Profilde Görünür Yap (onaylı), Sil
│   └─ Yeni Harita Listesi Oluştur
├─ 6. Kimlik Doğrulama
│   ├─ Login (e-posta/şifre + Google ile giriş)
│   ├─ Register (kullanıcı adı, e-posta, şifre, sözleşme onayı)
│   └─ Forgot Password (e-posta ile sıfırlama linki)
├─ 7. Menü (Hamburger)
│   ├─ Giriş yapılmamış: Konum Ekle, Giriş Yap, Uygulama Ayarları, Kamp.la Hakkında
│   └─ Giriş yapılmış: Konum Ekle, Hesabım, Uygulama Ayarları, Kamp.la Hakkında, Çıkış Yap
├─ 8. Uygulama Ayarları
│   ├─ Dil Seçimi (TR/EN)
│   ├─ Tema Seçimi (Light/Dark)
│   ├─ Kullanım Koşulları
│   └─ Gizlilik Sözleşmesi
├─ 9. Hesabım
│   ├─ Profil fotoğrafı, kullanıcı adı, e-posta, "Profili Paylaş"
│   ├─ Ziyaret ettiğim yerleri göster (toggle — gizlilik kontrolü)
│   ├─ Kullanıcı adını / e-postayı / şifreyi değiştir
│   ├─ Sosyal medya hesaplarım (web, FB, IG, X, YouTube)
│   ├─ Tüm yorumlarım
│   ├─ Favorilerim / Konum Listelerim
│   └─ Hesabımı kalıcı olarak sil
├─ 10. Paylaşılan (Public) Sayfalar
│   ├─ Profil Sayfası (Paylaşılan) — giriş yapmış/yapmamış görünüm farkı (istatistik kartları değişiyor)
│   └─ Liste Sayfası (Paylaşılan) — başkasının listesini görüntüleme + "Listeyi Kaydet" aksiyonu
├─ 11. Bildirimler (yeni — Bölüm 5.Q)
│   └─ Uygulama içi düz metin bildirim listesi (okundu/okunmadı, ilgili kayda yönlendirme)
└─ 12. Üyelik / Premium (yeni — Bölüm 5.P)
    └─ Ücretsiz/Premium karşılaştırma ekranı + satın alma akışı (RevenueCat)
```

---

## 5. Özellikler — A'dan Z'ye

### A. Kimlik Doğrulama & Hesap Yönetimi
- E-posta/şifre ile kayıt ol ve giriş yap
- Google ile tek tıkla giriş (OAuth)
- Şifremi unuttum → e-posta ile sıfırlama linki
- Üyelik Sözleşmesi + Gizlilik Politikası onay kutucuğu (kayıtta zorunlu)
- **Misafir kullanım desteklenir:** Giriş yapmadan harita gezilebilir, konum aranabilir; yorum yazma / konum ekleme / listeye kaydetme gibi aksiyonlar girişe yönlendiriyor olmalı (menüde "Giriş Yap" ayrı bir madde olarak duruyor)
- **Karar (netleşti):** Giriş yapan her kullanıcı uygulamanın tüm ekranlarına erişebilir; kısıtlama ekran/erişim seviyesinde değil, **özellik seviyesinde ve arka planda kullanıcı tipine (ücretsiz/premium) bağlı yetkilendirme** ile yapılır. Detaylı özellik kırılımı için bkz. **Bölüm 5.P — Üyelik Tipleri**.
- Hesap ayarları: kullanıcı adı değiştir, e-posta değiştir, şifre değiştir, sosyal medya hesaplarını bağla/güncelle
- Hesabı kalıcı olarak silme

### B. Ana Harita Deneyimi
- Açılışta konum bazlı interaktif harita
- Kullanıcının anlık konumu (mavi/gri nokta) + "konumuma git" butonu
- **3 harita katmanı:** Klasik/tarihi harita, topografik/idari harita, uydu görünümü — görsel önizlemeli seçim modalı
- Kategoriye göre renk-kodlu pin sistemi (bkz. Bölüm 6 — Veri Modeli)
- Bilgilendirici katman: Milli park, tarihi/antik alan, yayla gibi "referans" POI'ler de haritada gösteriliyor (kullanıcı katkılı kamp noktalarından ayrı bir bilgi katmanı)
- Pin'e dokununca özet kart (bottom sheet): fotoğraf, ad, mesafe, puan/yorum sayısı, "Detaylar" ve "Yol Tarifi" butonları
- Harita ⇄ Liste görünümü arasında tek dokunuşla geçiş (üst sağdaki toggle buton)
- **Offline harita desteği (Premium):** Kullanıcı bulunduğu/seçtiği bölgeyi cihazına indirip internetsiz ortamda haritayı ve indirilen bölgedeki POI'leri görüntüleyebilir — zayıf/sıfır çekim olan kamp alanları için kritik bir özellik. Teknik yaklaşım için bkz. Bölüm 7.1.

### C. Arama
- Konum/şehir arama kutusu, öneri listesi (Alanya, Antalya, Ankara gibi popüler/son aramalar)
- Arama sonucu haritayı ilgili bölgeye ortalıyor

### D. Filtreleme
- 9 konum türüne göre çoklu/tekli filtre (ikon + etiket kartları ızgarası): Ücretli/Ücretsiz Karavan Parkı, Ücretli/Ücretsiz Park Alanı, Ücretli/Ücretsiz Çadır Alanı, Çamaşır Yıkama, Duş Alanları, Su Doldurma
- Seçili filtre görsel olarak vurgulanıyor (turuncu dolgu)
- Filtre hem harita hem liste görünümünde erişilebilir (yüzen buton)
- **Ücretsiz kullanıcı sınırı:** Aynı anda en fazla 2 kategori filtresi seçilebilir; tüm kategorileri aynı anda filtreleme **Premium** özelliğidir (bkz. Bölüm 5.P)

### E. Liste Görünümü
- Harita ile birebir senkron kart listesi (fotoğraf, başlık, kategori ikonu, mesafe, yıldız puanı, yorum sayısı)
- Her kartta hızlı favori (kalp) aksiyonu
- Sonsuz kaydırma / sayfalama (liste uzun)
- Filtre ve "konumuma git" butonları liste görünümünde de sabit duruyor

### F. POI (Konum) Detay Sayfası
- Kaydırılabilir fotoğraf galerisi (nokta göstergeli)
- Başlık, kategori rozeti, yıldız puanı + sayısal ortalama, "kim tarafından ve ne zaman eklendiği" bilgisi + ekleyen kullanıcının avatarı
- **Detaylar / Yorumlar** olmak üzere iki sekmeli yapı
- **Detaylar sekmesi:**
  - İmkan/hizmet ikonları grid'i (duş, elektrik, wifi, market, WC, çocuk oyun alanı, vb. — tooltip ile isim gösterimi)
  - Açıklama metni
  - İletişim ikonları: telefon, web, Facebook, Instagram, YouTube, X
  - Kamp imkanları rozetleri: Karavan / Çadır / Bungalov
  - Sezon bilgisi (Yaz / Kış / Tüm sezonlar)
  - Koordinat gösterimi + tek tıkla kopyalama
  - Konumu gösteren mini harita (çevredeki diğer yerlerle birlikte)
  - "Hata Bildir" ve "Düzenle" aksiyonları
- **Yorumlar sekmesi:**
  - 1-5 yıldız dağılım grafiği + ortalama puan + toplam yorum sayısı
  - "Yorum yazın" → modal: yıldız seçimi + serbest metin → yayınla
  - Yorum kartları: kullanıcı, tarih, yıldız, metin
- **Alt aksiyon çubuğu (5 ikon):** Fotoğraf ekle, Ziyaret/işaretle (flag), Yol tarifi (öne çıkan orta buton), Listeye kaydet, Paylaş
- **Yol tarifi:** Google Maps (uygulama içi) ve Google Maps (harici) gibi çoklu navigasyon seçeneği sunan seçim modalı

### G. Kullanıcı Katkısı — Konum Ekleme (6 Adımlı Sihirbaz)
1. **Konum Seç:** Harita üzerinde pin sürükle/bırak, GPS ile otomatik konumlandırma
2. **Konum Türü Seç:** 9 kategoriden biri (tekli seçim, radio) — bilgilendirme notu: "hem karavan hem kamp alanıysa karavan parkı seçip sonraki adımda çadırı da işaretleyebilirsiniz"
3. **Hizmetleri Seç:** 19 imkan seçeneği (çoklu, checkbox) — duş, elektrik, buzdolabı, araç girişi, sıcak duş, denize yakınlık, ateş/mangal, evcil hayvan, çamaşır makinesi, ücretli/ücretsiz, GSM çekimi, tuvalet boşaltma, su doldurma, atık su boşaltma, wifi, tuvalet, market, çocuk oyun alanı, kurutma makinesi
4. **Detayları Gir:** Ad, açıklama, telefon, web, sosyal medya hesapları (hepsi opsiyonel), konaklama imkanları (karavan/çadır/bungalov çoklu seçim), sezon seçimi
5. **Fotoğraf Ekle:** Çoklu fotoğraf yükleme + kurallar uyarısı (selfie/kişisel fotoğraf yasak, yatay & mekân odaklı çekim önerisi, uygunsuz görsellerin silineceği bilgisi)
6. **Onayla ve Kaydet:** Sözleşme/doğruluk beyanı onay kutusu → **"Yönetici incelemesinden sonra yayınlanır"** mesajıyla moderasyon kuyruğuna gönderilme

### H. Favoriler & Özel Listeler ("Harita Listelerim")
- İki sabit sistem listesi: **Favorilerim**, **Ziyaret Edilen Yerler**
- Sınırsız sayıda kullanıcı tanımlı özel liste oluşturma (örn. "2023 Akdeniz Turu")
- Her liste için: Paylaş, Adını Değiştir, **Profilde Görünür Yap** (gizlilik onayı gerektiren aksiyon), Sil
- POI detayından "Listeye Ekle" modalı ile tek tıkla listeye/listelerden ekleme-çıkarma (yeşil + / - ikonları)
- Görünürlük durumu ikonla ifade ediliyor (göz açık = herkese açık, üstü çizili göz = gizli)
- **Ücretsiz kullanıcı sınırı:** En fazla 3 özel liste oluşturulabilir (sistem listeleri olan Favorilerim ve Ziyaret Edilen Yerler bu sınıra dahil değil); sınırsız liste **Premium** özelliğidir (bkz. Bölüm 5.P)

### I. Yorum & Değerlendirme Sistemi
- 5 yıldız üzerinden puanlama + serbest metin yorum
- Puan dağılım grafiği (POI detay sayfasında)
- Kullanıcının kendi yorum geçmişi ("Tüm Yorumlarım" — arama kutulu, POI'ye göre gruplu liste, ilgili POI'ye hızlı geçiş oku)

### J. Kullanıcı Profili (Herkese Açık / Paylaşılan)
- Avatar, kullanıcı adı, sosyal medya ikonları
- İstatistik kartları: **Ziyaret** sayısı, **Konum** (eklediği yer) sayısı, **Yorumlar** sayısı (kendi profilinde 3, başkası görüntülerken "Ziyaret" gizli — gizlilik ayarına bağlı 2 karta düşüyor)
- "Kullanıcının paylaştığı haritalar" — profilde görünür yapılmış özel listeler burada listeleniyor
- "Profili Paylaş" ile dış paylaşım (link/QR/sosyal medya)

### K. Liste Sayfası (Paylaşılan / Public)
- Bir kullanıcının herkese açık yaptığı özel listenin, o listeyi kaydeden kullanıcı adına atıflı public görünümü
- Ziyaretçi için "Listeyi Kaydet" (kendi hesabına kopyalama) ve "Paylaş" aksiyonları

### L. Uygulama Ayarları
- **Dil Seçimi:** Türkçe / English (bayrak ikonlu liste, genişletilebilir yapı)
- **Tema Seçimi:** Light tema / Dark tema
- **Kullanım Koşulları** ve **Gizlilik Sözleşmesi** (statik metin sayfaları)
- **"Kamp.la Hakkında"** (menüden erişilen marka sayfası) — **Karar:** Kullanım Koşulları / Gizlilik Sözleşmesi ekranlarıyla aynı düz metin (statik/CMS içerikli) sayfa deseni kullanılacak; admin panelden içeriği güncellenebilir bir metin alanı olarak modellenmeli.

### M. Moderasyon & Güven
- Kullanıcı eklediği konum admin onayından geçmeden yayınlanmıyor
- POI detayında "Hata Bildir" ile serbest metinli şikayet/düzeltme bildirimi
- Kendi eklediği konumu "Düzenle" ile güncelleyebiliyor
- Fotoğraf yükleme kuralları arayüzde açıkça belirtiliyor (kalite/uygunluk kontrolü kullanıcı tarafında da teşvik ediliyor)
- **Konum kaynakları ve onay akışı (netleşti):** Konumlar üç şekilde sisteme girebilir — (1) kullanıcılar uygulama üzerinden ekler, (2) yöneticiler admin panelinden manuel ekler, (3) yöneticiler admin panelinden **Excel/CSV toplu içe aktarma** yapar. Kaynak fark etmeksizin **kullanıcı tarafından eklenen** her konum, yönetici onayından geçmeden yayınlanmaz; admin/Excel kaynaklı kayıtlar doğrudan yayınlanabilir (güvenilir kaynak varsayımı).
- **Hata bildirimi durum takibi (netleşti):** Kullanıcı "Hata Bildir" gönderdiğinde anında bir onay mesajı ("bildiriminiz alındı") görür; bildirim arka planda bir durum alanına (`open` / `reviewing` / `resolved`) sahiptir ve durum değiştiğinde kullanıcıya Bölüm 5.Q'daki uygulama içi bildirim ile haber verilir.

### N. Navigasyon Yardımcıları
- Konum kopyalama (lat/lng), harici navigasyon uygulamalarına (Google Maps vb.) çoklu seçenekle yönlendirme
- "Konumuma git" (GPS merkezleme) haritanın her modunda erişilebilir

### O. Genel UI Bileşenleri (tekrarlayan desenler)
- Onay modalları (İptal / Kaydet ikili buton deseni tüm formlarda tutarlı)
- Boş/başarı durum ekranı şablonu (rozet ikonu + başlık + açıklama + tek CTA — "Tebrikler" ekranı örneği, diğer başarı senaryolarında da tekrar kullanılabilir)
- Sabit alt navigasyon (5 sekme: Ana Sayfa, Ara, [+], Listelerim, Menü)
- **Boş durum (empty state) ekranları (netleşti — tasarımı öngörülmesi istendi):** Mevcut "Tebrikler" başarı ekranı şablonu (ikon + başlık + açıklama + tek CTA) baz alınarak aşağıdaki boş durumlar tasarlanmalı:
  - **Favorilerim / özel liste boş:** "Henüz favori eklemediniz" + kalp/işaret ikonu + "Haritaya Dön" CTA
  - **Ziyaret Edilen Yerler boş:** "Henüz ziyaret işaretlemediniz" + bayrak ikonu
  - **Tüm Yorumlarım boş:** "Henüz yorum yapmadınız" + konuşma balonu ikonu + "Bir konum keşfet" CTA
  - **POI Yorumlar sekmesi boş:** "İlk yorumu sen yaz" + kalem ikonu + doğrudan "Yorum Yaz" CTA
  - **Arama sonucu boş:** "Sonuç bulunamadı" + büyüteç ikonu + arama terimini temizleme CTA
  - **Filtre sonrası liste boş:** "Bu filtrelerle eşleşen konum yok" + filtreyi temizle CTA
  - **Bildirimler ekranı boş** (bkz. Bölüm 5.Q): "Henüz bildiriminiz yok" + çan ikonu
  - **Harita Listelerim boş** (yeni kullanıcı, sistem listeleri hariç kullanıcı listesi yok): "İlk listeni oluştur" + "Yeni Harita Listesi Oluştur" CTA (zaten var olan buton)
  - Tüm boş durumlar aynı görsel şablonu (Bölüm 2.6'daki yuvarlak/dostane ikonografi, turuncu CTA) kullanmalı — ayrı ayrı özel tasarım gerekmez, tek bir `EmptyState` bileşeni parametrik olarak (ikon, başlık, açıklama, CTA metni/aksiyonu) tüm bu senaryolarda yeniden kullanılabilir.

### P. Üyelik Tipleri (Ücretsiz / Premium)
**Karar (netleşti):** Giriş yapan tüm kullanıcılar tüm ekranlara erişebilir; ücretsiz/premium ayrımı **özellik kısıtlaması** olarak arka planda uygulanır. Aşağıdaki kırılım bir öneri/ilk taslaktır — ürün sahibiyle birlikte netleştirilip fiyatlandırma/paketleme kararına bağlanmalı.

| Özellik | Ücretsiz | Premium (Kamp.la Plus) |
|---|---|---|
| Harita/POI görüntüleme, arama | ✅ Sınırsız | ✅ Sınırsız |
| Yorum yazma, puanlama | ✅ Sınırsız | ✅ Sınırsız |
| Konum ekleme (moderasyona tabi) | ✅ Sınırsız | ✅ Sınırsız |
| Harita katmanı | Yalnızca 1 katman (klasik) | 3 katman (klasik + topografik + uydu) |
| Aynı anda filtre sayısı | En fazla 2 kategori | Sınırsız / çoklu |
| Özel liste sayısı | En fazla 3 | Sınırsız |
| Offline harita indirme | ❌ | ✅ (bkz. Bölüm 5.B, 7.1) |
| Reklamsız deneyim | Reklam gösterilebilir | Reklamsız |

- **Veri modeli:** `users.tier` (`free` / `premium`) alanı + `subscriptions` tablosu (sağlayıcı, plan, başlangıç/bitiş, otomatik yenileme durumu) — bkz. Bölüm 6.9.
- **Ödeme altyapısı:** Mobilde Apple/Google mağaza politikaları gereği **uygulama içi satın alma (IAP)** zorunlu; RevenueCat gibi bir katman (App Store + Play Store + web/Stripe aboneliklerini tek yerden yönetir) önerilir. **Not:** Bu, Bölüm 8'de reddedilen "kamp alanı rezervasyon/ödemesi" ile karıştırılmamalı — burada ödenen şey kamp alanı değil, **uygulama aboneliğidir**.
- **Yetkilendirme:** Supabase RLS politikaları ve/veya API katmanında `tier` kontrolü ile uygulanır (örn. liste oluşturma endpoint'i mevcut liste sayısını kontrol eder).

### Q. Bildirimler (Uygulama İçi)
**Karar (netleşti):** MVP kapsamında native push notification (FCM/APNs) altyapısı kurulmayacak; bunun yerine basit, düz metin girilebilen bir **uygulama içi bildirim ekranı** yeterli.
- Menüde/ana ekranda bir "Bildirimler" simgesi (çan ikonu, okunmamış sayısı rozeti)
- Bildirim kaynakları: konum onaylandı/reddedildi (Bölüm 5.M), hata bildirimi durum değişikliği (Bölüm 5.M), yorumuna yanıt geldi (ileride)
- Liste görünümü: tarih + düz metin içerik + ilgili POI/ekrana yönlendiren dokunma alanı
- Veri modeli: bkz. Bölüm 6.11
- İleride büyüme: bu yapı bozulmadan üzerine native push (FCM/APNs, Capacitor Push Notifications plugin) eklenebilir — MVP'de sadece "sunucu tarafı oluşturma + uygulama içi listeleme" var, cihaza push gönderimi yok.

### R. Admin Paneli
**Karar (netleşti):** Ayrı bir Nuxt.js web uygulaması olarak geliştirilecek (bu doküman kapsamındaki veri modeli — Bölüm 6 — hem mobil/web uygulamasına hem admin paneline hizmet edecek şekilde tasarlanmıştır).
- **Konum moderasyonu:** `pending` durumundaki konumları listeleme, harita/detay önizleme, onayla/reddet, red gerekçesi girme
- **Konum yönetimi:** Manuel konum ekleme/düzenleme (kullanıcı akışındaki formun admin karşılığı), **Excel/CSV toplu içe aktarma** (şablon indir → doldur → yükle → doğrulama → içe aktar)
- **Hata bildirimi kuyruğu:** Gelen "Hata Bildir" kayıtlarını listeleme, durum güncelleme (`open` → `reviewing` → `resolved`)
- **Kullanıcı yönetimi:** Kullanıcı listesi, `tier` (ücretsiz/premium) görüntüleme/manuel değiştirme, hesap askıya alma
- **Yorum moderasyonu:** Uygunsuz yorumları kaldırma
- **İçerik yönetimi:** "Kamp.la Hakkında", Kullanım Koşulları, Gizlilik Sözleşmesi gibi statik sayfa içeriklerini düzenleme
- Teknik detay ve proje yapısı için bkz. Bölüm 7.1/7.2

---

## 6. Veri Modeli Önerisi (Tasarımlardan Çıkarılan Yapı)

### 6.1 Konum Türleri (kategori — tekli seçim, renk+ikon kodlu)
1. Ücretli Karavan Parkı 💰
2. Ücretsiz Karavan Parkı
3. Ücretli Park Alanı 💰
4. Ücretsiz Park Alanı
5. Ücretli Çadır Alanı 💰
6. Ücretsiz Çadır Alanı
7. Su Doldurma Yeri
8. Çamaşır Yıkama Yeri
9. Duş Alanı

### 6.2 Konum Hizmetleri / İmkanları (çoklu seçim — boolean etiketler)
Duş, Elektrik, Buz dolabı, Araç kamp alanına girebilir, Sıcak duş, Denize yakın, Ateş/Mangal yakılabilir, Evcil hayvan girebilir, Çamaşır yıkama makinesi, Ücretli (genel), GSM çekiyor, Tuvalet boşaltma imkanı, Su doldurma imkanı, Karavan atık su boşaltma yeri, Ücretsiz wifi, Tuvalet, Yakında/içeride market, Çocuk oyun alanı, Kurutma makinesi *(19 etiket)*

### 6.3 Konaklama İmkanları (çoklu seçim, bağımsız katman)
Karavan konaklamaya müsait, Çadır ile konaklamaya müsait, Bungalov / Tiny house var

### 6.4 Sezon
Yaz / Kış / Tüm sezonlar (tekli seçim)

### 6.5 Referans/Bilgi Katmanı
Milli park, Yayla, Antik/tarihi kent gibi genel coğrafi ilgi noktaları haritada ayrı ikonlarla (yeşil ağaç, mavi kale vb.) gösteriliyor. **Netleşti:** Bu katman da `locations` tablosunun bir parçasıdır ve üç kaynaktan beslenir — kullanıcı katkısı (moderasyona tabi), admin panelinden manuel giriş, admin panelinden Excel/CSV toplu içe aktarma (bkz. Bölüm 5.M, 5.R). Ayrı bir tablo/kaynak gerekmez; `source` (`user` / `admin` / `import`) alanı yeterlidir.

### 6.6 Kullanıcı Nesnesi
Kullanıcı adı, e-posta, şifre (hash), avatar, sosyal medya linkleri (web/FB/IG/X/YouTube), "ziyaret ettiklerimi göster" gizlilik tercihi (boolean), `tier` (`free` / `premium` — bkz. Bölüm 5.P, 6.9)

### 6.7 Liste (MapList) Nesnesi
Ad, sahibi, görünürlük (public/private), POI referansları (n:n), sistem listesi mi kullanıcı listesi mi (favoriler ve ziyaret edilenler özel/silinemez tip olabilir)

### 6.8 Yorum Nesnesi
Kullanıcı, POI referansı, yıldız (1-5), metin, tarih

### 6.9 Abonelik (Subscription) Nesnesi
Kullanıcı referansı, sağlayıcı (App Store / Play Store / Stripe), plan, başlangıç/bitiş tarihi, otomatik yenileme durumu — bkz. Bölüm 5.P

### 6.10 Hata Bildirimi (Report) Nesnesi
Bildiren kullanıcı, POI referansı, açıklama metni, durum (`open` / `reviewing` / `resolved`), oluşturulma/güncellenme tarihi — bkz. Bölüm 5.M

### 6.11 Bildirim (Notification) Nesnesi
Alıcı kullanıcı, tür (konum onaylandı/reddedildi, hata bildirimi güncellendi vb.), düz metin içerik, ilgili kayıt referansı (POI/rapor), okundu durumu (boolean), tarih — bkz. Bölüm 5.Q

---

## 7. Teknik Mimari (Tech Stack)

| Katman | Teknoloji / Açıklama |
|---|---|
| **UI/UX Tasarım** | Figma |
| **Front-End** | Nuxt.js + Tailwind CSS |
| **Mobil Derleme** | Capacitor (Ionic) — iOS ve Android native paket üretimi |
| **Harita Motoru** | MapLibre GL JS (açık kaynak, Mapbox alternatifi, tile hosting özgürlüğü) |
| **Offline Harita** | PMTiles / MBTiles bölgesel önbellekleme + Capacitor Filesystem (bkz. 7.1) |
| **Rota Motoru** | Valhalla (self-hosted) veya OSRM — karavan kısıtlamaları için kritik |
| **Veritabanı** | Supabase (PostgreSQL + PostGIS) |
| **Kullanıcı Yönetimi** | Supabase Auth |
| **Medya Depolama** | Cloudflare R2 (çıkış trafiği ücretsiz) |
| **Ödeme / Abonelik (Premium)** | RevenueCat (App Store + Play Store + web aboneliklerini tek yerden yönetir) |
| **Admin Paneli** | Ayrı bir Nuxt.js uygulaması, aynı Supabase projesine bağlı |

### 7.1 Katman Bazlı Uygulama Notları

**Front-End — Nuxt.js + Tailwind CSS**
- Nuxt'un dosya tabanlı routing yapısı, Bölüm 4'teki ekran hiyerarşisiyle birebir eşleşecek şekilde kurgulanabilir (`/pages/harita`, `/pages/konum/[id]`, `/pages/konum-ekle/[step]`, `/pages/hesabim`, `/pages/liste/[id]` vb.)
- Bölüm 2.3'teki renk paleti ve Bölüm 6.1'deki kategori renkleri, Tailwind config'inde `theme.extend.colors` altında merkezi olarak tanımlanmalı (örn. `brand.orange`, `poi.paid-caravan`, `poi.free-tent`) — hem web hem native derlemede tutarlılık sağlar.
- SSR modu, "Liste Sayfası (Paylaşılan)" ve "Profil Sayfası (Paylaşılan)" gibi public/SEO'ya açık sayfalar için değerli (Bölüm 5.K, 5.J); harita/uygulama içi ekranlar için SPA modu yeterli.

**Mobil Derleme — Capacitor (Ionic)**
- Native plugin ihtiyaçları: Camera/Photo Library (Bölüm 5.G adım 5 — konum fotoğrafı ekleme, Bölüm 5.F — profil fotoğrafı), Geolocation (Bölüm 5.B — "konumuma git"), Share (Bölüm 5.H, 5.J — paylaşım aksiyonları), Filesystem (Bölüm 5.B — offline harita indirme), In-App Purchase (Bölüm 5.P — Premium abonelik). Push Notifications (FCM/APNs) MVP kapsamında yok (bkz. Bölüm 5.Q).
- iOS/Android için ayrı store görselleri, izin metinleri (konum, kamera, galeri) ve deep-link (paylaşılan profil/liste linklerinin uygulamayı açması) yapılandırması gerekir.

**Harita Motoru — MapLibre GL JS**
- Bölüm 3, madde 2'deki "3 harita katmanı" (klasik, topografik, uydu) üç ayrı MapLibre style JSON olarak tanımlanmalı; stil değiştirici modal bu style'lar arasında `map.setStyle()` ile geçiş yapar.
- Kategori bazlı pin'ler (Bölüm 6.1) için custom marker/sprite seti oluşturulmalı; yoğun bölgelerde performans için **clustering** (`supercluster` veya MapLibre'nin native cluster desteği) uygulanmalı.
- Bilgi katmanı (Bölüm 6.5 — milli park, tarihi alan) ayrı bir GeoJSON kaynağı/layer olarak, kullanıcı katkılı POI katmanından bağımsız yönetilmeli.

**Rota Motoru — Valhalla / OSRM**
- Uygulamanın kamp/karavan odaklı olması nedeniyle rota motorunun **"truck/hgv" costing modeli** (yükseklik, genişlik, ağırlık kısıtı) desteklemesi önemli — bu, genel amaçlı Google Maps yönlendirmesinden farklılaşan temel değer önerisi olabilir.
- Bölüm 5.F'deki "Yol Tarifi" seçim modalı (Google Maps / Apple Maps) şu an harici uygulamalara yönlendiriyor; Valhalla/OSRM entegrasyonu ileride **uygulama içi karavan-güvenli rota** özelliği olarak eklenebilir (mevcut tasarımda karşılığı yok — yeni bir ekran/akış gerektirir).

**Veritabanı — Supabase (PostgreSQL + PostGIS)**
- `locations` tablosu: `geography(Point, 4326)` kolonu + GIST spatial index → harita bbox sorguları ve "mesafeye göre sırala" (Bölüm 5.E) için gerekli.
- Bölüm 6.1 (konum türü) enum/foreign key, Bölüm 6.2 (19 hizmet) ayrı `location_amenities` join tablosu veya `jsonb` kolon, Bölüm 6.3 (konaklama imkanları) benzer şekilde.
- Moderasyon (Bölüm 5.M) için `locations.status` (`pending` / `published` / `rejected`) kolonu ve Row Level Security: kullanıcı yalnızca kendi `pending` kayıtlarını görebilir/düzenleyebilir, herkes yalnızca `published` kayıtları görür.
- `lists`, `list_items`, `reviews`, `reports` (hata bildir) tabloları Bölüm 6.7/6.8 ve 5.M ile birebir örtüşüyor.

**Kullanıcı Yönetimi — Supabase Auth**
- E-posta/şifre + Google OAuth (Bölüm 5.A) Supabase Auth'un native desteklediği akışlar.
- Kullanıcı tipi (`tier: free/premium`, Bölüm 5.P) ve admin rolü (Bölüm 5.R), Supabase Auth'un `raw_user_meta_data`/custom claims mekanizmasıyla veya ayrı bir `profiles` tablosuyla tutulmalı; RLS politikaları bu alana göre yazılır.

**Medya Depolama — Cloudflare R2**
- POI fotoğrafları (Bölüm 5.G adım 5), yorum ekindeki görseller (varsa) ve profil avatarları için presigned upload URL akışı; Supabase Storage yerine R2 tercih edilmesinin sebebi (çıkış trafiği ücretsiz) yüksek görsel trafiğinde maliyet avantajı sağlıyor.

**Offline Harita — PMTiles/MBTiles + Capacitor Filesystem**
- Mapbox/Google gibi ticari sağlayıcılar yerine açık kaynak yığın (MapLibre + self-hosted tile) kullanıldığı için offline destek **lisans/ücret engeli olmadan** mümkün; asıl maliyet depolama/bant genişliğidir.
- Önerilen akış: kullanıcı haritada bir bölge seçer → sunucu tarafında ilgili tile aralığı **PMTiles** (tek dosya, HTTP range request destekli, mobil offline kullanım için ideal) formatında paketlenir → Capacitor Filesystem API ile cihaza indirilir → MapLibre bu yerel PMTiles dosyasını çevrimdışıyken kaynak olarak kullanır.
- Bu özellik Bölüm 5.P'de **Premium** olarak işaretlenmiştir; teknik olarak ücretsiz kullanıcıya da açılabilir, kısıtlama tamamen ürün kararına bağlıdır.

**Ödeme / Abonelik — RevenueCat**
- Bölüm 5.P'deki Ücretsiz/Premium ayrımını yönetmek için: iOS (StoreKit) ve Android (Play Billing) mağaza içi satın almalarını tek bir RevenueCat entegrasyonu üzerinden yönetmek, iki ayrı native ödeme altyapısı yazmaktan daha az efor gerektirir.
- RevenueCat webhook'ları Supabase'e (`subscriptions` tablosu, Bölüm 6.9) durumu senkronize eder; kullanıcının `tier` alanı bu webhook'lar üzerinden güncellenir.
- Web'de (varsa) Stripe ile aynı mantık kurulabilir.

**Bildirimler — Uygulama İçi (Bölüm 5.Q)**
- MVP'de ayrı bir push servisi (FCM/APNs) kurulmuyor; bildirimler doğrudan Supabase'de bir `notifications` tablosuna (Bölüm 6.11) yazılıyor ve uygulama bunu normal bir liste ekranı gibi çekiyor (Supabase Realtime ile anlık rozet güncellemesi de eklenebilir).
- İleride native push'a geçişte bu tablo değişmeden kalır; sadece ek olarak bir push gönderim tetikleyicisi (Supabase Edge Function + FCM/APNs) eklenir.

**Admin Paneli — Ayrı Nuxt.js Uygulaması (Bölüm 5.R)**
- Aynı Supabase projesine (aynı `locations`, `reports`, `users`, `reviews` tabloları) bağlanan, fakat ayrı bir kod tabanı/deploy hedefi olan ikinci bir Nuxt uygulaması olarak kurulmalı — mobil/web son kullanıcı uygulamasıyla karışmaması için.
- Yetkilendirme: Supabase Auth üzerinde ayrı bir `role = admin` alanı/claim'i ile korunmalı; RLS politikaları admin panelinin `pending` kayıtlara ve tüm kullanıcı verilerine erişebilmesini, normal uygulamanın ise erişemediğini garanti etmeli.
- Excel/CSV içe aktarma: dosya yüklemesi → satır bazlı doğrulama (zorunlu alanlar, enum değerleri Bölüm 6.1/6.2 ile eşleşiyor mu) → önizleme → onaylanan satırların `locations` tablosuna `source = 'import'` ile yazılması.

### 7.2 Önerilen Klasör/Proje Yapısı (Nuxt.js)

```
kampla/                             (monorepo kökü — örn. pnpm workspaces / turborepo)
├─ apps/
│  ├─ mobile-web/                  → Son kullanıcı uygulaması (Nuxt.js, bu proje kapsamının odağı)
│  │  ├─ pages/
│  │  │  ├─ index.vue                  → Ana Ekran (Harita)
│  │  │  ├─ liste.vue                  → Liste Görünümü
│  │  │  ├─ ara.vue                    → Arama
│  │  │  ├─ konum/[id]/
│  │  │  │  ├─ index.vue               → POI Detay (Detaylar/Yorumlar sekmeleri)
│  │  │  │  └─ duzenle.vue
│  │  │  ├─ konum-ekle/
│  │  │  │  └─ [step].vue              → 6 adımlı sihirbaz (state Pinia store'da tutulur)
│  │  │  ├─ listelerim/
│  │  │  │  ├─ index.vue               → Harita Listelerim
│  │  │  │  └─ [id].vue                → Liste detay / paylaşılan liste
│  │  │  ├─ bildirimler.vue            → Uygulama içi bildirimler (Bölüm 5.Q)
│  │  │  ├─ premium.vue                → Üyelik/abonelik satın alma ekranı (Bölüm 5.P)
│  │  │  ├─ hesabim/
│  │  │  │  ├─ index.vue
│  │  │  │  ├─ kullanici-adi.vue
│  │  │  │  ├─ e-posta.vue
│  │  │  │  ├─ sifre.vue
│  │  │  │  ├─ sosyal-medya.vue
│  │  │  │  └─ yorumlarim.vue
│  │  │  ├─ profil/[username].vue      → Paylaşılan profil sayfası
│  │  │  ├─ ayarlar/
│  │  │  │  ├─ index.vue
│  │  │  │  ├─ dil.vue
│  │  │  │  ├─ tema.vue
│  │  │  │  └─ hakkinda.vue            → "Kamp.la Hakkında" (düz metin, Bölüm 5.L)
│  │  │  ├─ giris.vue / kayit.vue / sifremi-unuttum.vue
│  │  │  └─ kullanim-kosullari.vue / gizlilik.vue
│  │  ├─ components/
│  │  │  ├─ map/                       → MapLibre wrapper, marker, style-switcher, filtre grid, offline indirme
│  │  │  ├─ poi/                       → Galeri, puan/yorum kartı, imkan ikon grid'i
│  │  │  └─ ui/                        → Buton, input, modal (İptal/Kaydet deseni), bottom-sheet, EmptyState
│  │  ├─ composables/                  → useSupabase, useMap, useLocationWizard, useOfflineMap, useSubscription
│  │  ├─ stores/ (Pinia)               → auth, locationWizard, filters, lists, subscription
│  │  └─ capacitor.config.ts
│  └─ admin/                        → Yönetici paneli (ayrı Nuxt.js uygulaması, Bölüm 5.R)
│     ├─ pages/
│     │  ├─ konumlar/                  → Moderasyon kuyruğu, manuel ekleme/düzenleme
│     │  ├─ konumlar/import.vue        → Excel/CSV toplu içe aktarma
│     │  ├─ raporlar.vue               → Hata bildirimi kuyruğu
│     │  ├─ kullanicilar.vue           → Kullanıcı/tier yönetimi
│     │  └─ icerik/                    → Statik sayfa içerik yönetimi (Hakkında, Koşullar, Gizlilik)
│     └─ ...
└─ packages/
   └─ shared/                       → Ortak Supabase tipleri, sabitler (Bölüm 6'daki enum'lar), Tailwind tema config'i
```

### 7.3 Önerilen Geliştirme Fazları (MVP Sıralaması)

Claude Code'a ardışık promptlar halinde verilecekse, önerilen sıralama:

1. **Faz 0 — İskelet:** Nuxt + Tailwind + Supabase bağlantısı, tasarım sisteminin (renk/tipografi — Bölüm 2) Tailwind config'e taşınması, temel layout (üst bar + alt navigasyon).
2. **Faz 1 — Kimlik Doğrulama:** Login/Register/Forgot Password (Bölüm 5.A), Supabase Auth entegrasyonu.
3. **Faz 2 — Harita & Keşif (salt okunur):** MapLibre entegrasyonu, 3 harita katmanı, statik/sahte veriyle pin gösterimi, Liste görünümü, Arama, Filtre (Bölüm 5.B–E).
4. **Faz 3 — POI Detay:** Galeri, detaylar sekmesi, yorumlar sekmesi (salt okuma) (Bölüm 5.F).
5. **Faz 4 — Kullanıcı Katkısı:** Konum Ekle sihirbazı uçtan uca, PostGIS'e yazma, moderasyon durum alanı (Bölüm 5.G, 5.M).
6. **Faz 5 — Etkileşim:** Yorum yazma, favoriye ekleme, özel liste oluşturma/paylaşma (Bölüm 5.H, 5.I).
7. **Faz 6 — Hesap & Ayarlar:** Hesabım, ayarlar, dil/tema, "Kamp.la Hakkında", paylaşılan profil/liste sayfaları (Bölüm 5.J, 5.K, 5.L).
8. **Faz 7 — Bildirimler:** `notifications` tablosu, uygulama içi bildirim ekranı, hata bildirimi ve konum onay/red olaylarının bildirime bağlanması (Bölüm 5.Q, 5.M).
9. **Faz 8 — Admin Paneli:** Ayrı Nuxt uygulaması — moderasyon kuyruğu, manuel konum CRUD, Excel/CSV içe aktarma, kullanıcı/tier yönetimi, statik içerik yönetimi (Bölüm 5.R).
10. **Faz 9 — Premium & Ödeme:** `subscriptions` tablosu, RevenueCat entegrasyonu, özellik kısıtlamalarının (harita katmanı, filtre sayısı, liste sayısı) uygulanması (Bölüm 5.P).
11. **Faz 10 — Mobil Paketleme:** Capacitor kurulumu, native plugin entegrasyonları, iOS/Android build.
12. **Faz 11 — Offline Harita:** Bölgesel PMTiles paketleme + indirme akışı (Bölüm 7.1).
13. **Faz 12 — Rota Motoru:** Valhalla/OSRM entegrasyonu (karavan kısıtlamalı rotalama), mevcut "harici uygulamaya yönlendir" akışının yanına opsiyonel uygulama-içi rota eklenmesi.

> Her faz kendi başına çalışan/test edilebilir bir durumda bırakılmalı; Claude Code'a verilecek promptlarda hangi fazda olunduğu ve bir önceki fazın hangi dosya/bileşenleri ürettiği açıkça belirtilmeli.

---

## 8. Ürün Kararları (Netleşen Kapsam)

Önceki taslakta açık soru olarak listelenen noktalar netleşmiştir; kararlar ilgili bölümlere işlenmiştir. Özet:

| Konu | Karar | Detay |
|---|---|---|
| Misafir/kullanıcı sınırları | Giriş yapan herkes tüm ekranlara erişir; kısıtlama özellik seviyesinde, ücretsiz/premium tipine bağlı | Bölüm 5.A, 5.P |
| "Kamp.la Hakkında" sayfası | Kullanım Koşulları ile aynı düz metin/CMS sayfa deseni | Bölüm 5.L |
| Bildirim sistemi | MVP'de push (FCM/APNs) yok; basit uygulama içi düz metin bildirim ekranı | Bölüm 5.Q, 6.11, 7.1 |
| Onboarding/tanıtım ekranları | Gereksiz — Splash sonrası doğrudan Ana Ekran (Harita)'a geçilir | Bölüm 4 |
| Offline harita | Evet, kesinlikle gerekli; açık kaynak yığın (MapLibre + self-hosted tile) ile lisans engeli olmadan mümkün | Bölüm 5.B, 5.P, 7.1 |
| Rezervasyon/ödeme (kamp alanı) | Yok ve olmayacak — uygulama kapsamı dışı; karıştırılmamalı: uygulama **aboneliği** (Premium) için ödeme var | Bölüm 5.P |
| Bilgi/referans katmanı kaynağı | Kullanıcı + admin manuel + admin Excel/CSV içe aktarma; kullanıcı kaynaklı olanlar onaydan geçer | Bölüm 5.M, 5.R, 6.5 |
| Admin/moderasyon paneli | Ayrı bir Nuxt.js uygulaması olarak geliştirilecek | Bölüm 5.R, 7.1, 7.2 |
| Hata bildirimi sonrası akış | Anında "alındı" onayı + durum takibi + durum değişince bildirim | Bölüm 5.M, 5.Q |
| Boş durum ekranları | Genel şablona uygun, öngörülerek tasarlandı | Bölüm 5.O |

---

## 9. Sonraki Adımlar (Önerilen)

1. Figma'dan kesin renk (hex) ve font stil kütüphanesini bu dokümana işlemek (Bölüm 2)
2. Bölüm 5.P'deki ücretsiz/premium özellik kırılımını ve fiyatlandırmayı ürün sahibiyle netleştirmek
3. Bölüm 7.3'teki fazlamaya göre Claude Code'a **faz faz** prompt vermek — tüm dokümanı tek seferde vermek yerine, her fazda ilgili bölümleri (örn. Faz 2 için Bölüm 5.B–E + Bölüm 7.1 "Harita Motoru" notları) referans göstermek daha isabetli sonuç verir
4. Her faz sonunda çalışan bir demo/build ile ilerlemeyi doğrulamak
