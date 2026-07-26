-- Kamp.la — site_content (PRD 5.R "İçerik Yönetimi")
-- Admin panelden düzenlenebilir statik sayfa içerikleri: "Kamp.la Hakkında",
-- "Kullanım Koşulları", "Gizlilik Sözleşmesi". mobile-web tarafındaki ilgili
-- sayfalar (`pages/ayarlar/hakkinda.vue`, `pages/kullanim-kosullari.vue`,
-- `pages/gizlilik.vue`) şu an bu metinleri kod içine gömülü (i18n `tr.json`)
-- render ediyor; bu tabloyu okuyup göstermeleri KAPSAM DIŞI — ayrı bir görev.

create table if not exists public.site_content (
  key text primary key,
  lang text not null default 'tr',
  title text,
  body text not null default '',
  updated_at timestamptz not null default now()
);

create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

-- Herkes (misafir dahil) okuyabilir — mobile-web statik sayfaları ileride
-- buradan okuyacak.
create policy "site_content_select_all"
  on public.site_content for select
  using (true);

-- Yalnızca adminler yazabilir (ekleme/güncelleme/silme) — admin panel PRD 5.R.
create policy "site_content_write_admin"
  on public.site_content for all
  using (public.is_admin())
  with check (public.is_admin());

-- Tek seferlik idempotent seed: mobile-web'deki mevcut statik sayfa
-- metinlerinin (i18n/locales/tr.json → pages.settingsAbout / pages.terms /
-- pages.privacy) olduğu gibi (kısaltılmadan) buraya taşınmış hali.
insert into public.site_content (key, title, body) values
(
  'hakkinda',
  'Kamp.la Hakkında',
  'Kamp.la, Türkiye''deki kamp alanlarını, karavan parklarını ve doğa alanlarını harita üzerinde keşfetmeni, ziyaret ettiğin yerleri işaretlemeni ve deneyimlerini toplulukla paylaşmanı sağlayan bir topluluk kaynaklı keşif uygulamasıdır.

Misyonumuz, doğa severlerin güvenilir ve güncel konum bilgisine kolayca ulaşmasını sağlamak; her kullanıcının katkısıyla büyüyen, doğruluğu topluluk tarafından denetlenen bir harita oluşturmaktır. Yeni bir konum eklemek, fotoğraf paylaşmak veya bir yeri değerlendirmek — hepsi bu haritayı herkes için daha faydalı hale getirir.

Vizyonumuz, Kamp.la''yı Türkiye''nin en kapsamlı ve en güvenilir kamp/karavan keşif platformu haline getirmek; kampçıları birbirine bağlayan, doğaya saygılı ve sürdürülebilir bir keşif kültürünü desteklemektir.'
),
(
  'kullanim-kosullari',
  'Kullanım Koşulları',
  '⚠️ Bu metin taslaktır, yayına almadan önce hukuki inceleme gerekir.

Bu Kullanım Koşulları, Kamp.la mobil uygulamasını ve web sitesini (''Hizmet'') kullanımınızı düzenler. Hizmete erişerek veya kullanarak bu koşulları kabul etmiş sayılırsınız.

1. Hesap Oluşturma
Hizmetin bazı özelliklerini kullanmak (konum ekleme, yorum yazma, liste oluşturma vb.) için bir hesap oluşturmanız gerekir. Kayıt sırasında verdiğiniz bilgilerin doğru ve güncel olmasından siz sorumlusunuz. Hesabınızın güvenliğinden ve şifrenizin gizliliğinden siz sorumlusunuz.

2. Kullanıcı İçerikleri
Uygulamaya eklediğiniz konum bilgileri, fotoğraflar, yorumlar ve değerlendirmeler (''Kullanıcı İçeriği'') size aittir. Ancak bu içerikleri Kamp.la üzerinde paylaşarak, Kamp.la''ya bu içerikleri Hizmet kapsamında görüntüleme, saklama ve dağıtma konusunda münhasır olmayan, dünya çapında, telifsiz bir lisans vermiş olursunuz.

3. İçerik Kuralları
Yanıltıcı, hakaret içeren, telif hakkı ihlali yapan, kişisel gizliliği ihlal eden veya doğaya zarar verecek bilgiler içeren içerik paylaşamazsınız. Selfie veya kişisel fotoğraflar yerine mekân odaklı fotoğraflar paylaşmanız beklenir. Kural dışı içerikler yöneticiler tarafından incelenip kaldırılabilir.

4. Konum Bilgilerinin Doğruluğu
Kamp.la, topluluk tarafından oluşturulan bir haritadır. Konum bilgilerinin (koordinat, imkanlar, sezon vb.) doğruluğu garanti edilmez. Bir yere gitmeden önce güncel bilgiyi teyit etmeniz önerilir. Kamp.la, hatalı/güncel olmayan bilgilerden doğabilecek zararlardan sorumlu tutulamaz.

5. Premium Üyelik
Kamp.la Plus (premium) üyelik, ek özellikler (sınırsız liste, gelişmiş filtreleme vb.) sunan ücretli bir abonelik hizmetidir. Abonelik ücretleri, yenileme koşulları ve iptal işlemleri, kullandığınız mağazanın (App Store/Google Play) ödeme koşullarına tabidir.

6. Hesap Askıya Alma ve Sonlandırma
Bu koşulları ihlal eden hesapları uyarma, askıya alma veya kalıcı olarak kapatma hakkını saklı tutarız. Kendi hesabınızı da ''Hesabım'' sayfasından dilediğiniz zaman kalıcı olarak silebilirsiniz; bu işlem geri alınamaz.

7. Sorumluluğun Sınırlandırılması
Kamp.la, Hizmetin kesintisiz veya hatasız çalışacağını garanti etmez. Doğa koşullarında kamp/karavan faaliyetleri risk içerir; bu risklerden ve üçüncü taraf tesislerde yaşanabilecek olaylardan Kamp.la sorumlu tutulamaz.

8. Değişiklikler ve İletişim
Bu koşulları zaman zaman güncelleyebiliriz; önemli değişikliklerde sizi uygulama içinden bilgilendiririz. Sorularınız için destek@kamp.la adresinden bize ulaşabilirsiniz.'
),
(
  'gizlilik',
  'Gizlilik Sözleşmesi',
  '⚠️ Bu metin taslaktır, yayına almadan önce hukuki inceleme gerekir.

Bu Gizlilik Politikası, Kamp.la''yı kullanırken hangi verilerinizi topladığımızı, bu verileri nasıl kullandığımızı ve haklarınızı açıklar.

1. Topladığımız Veriler
Hesap oluştururken kullanıcı adı, e-posta adresi ve şifre (şifrelenmiş olarak) topluyoruz. İsteğe bağlı olarak profil fotoğrafı ve sosyal medya bağlantıları ekleyebilirsiniz. Uygulama kullanımınız sırasında eklediğiniz konumlar, fotoğraflar, yorumlar ve listeler de tarafımızca saklanır.

2. Konum Verileri
GPS ile otomatik konumlandırma özelliğini kullanırsanız cihazınızın konum bilgisine erişim izni isteriz; bu izin yalnızca konum eklerken/haritada gezinirken kullanılır ve izniniz olmadan arka planda takip yapılmaz.

3. Verilerin Kullanım Amaçları
Verileriniz; hesabınızı yönetmek, uygulamanın temel işlevlerini (harita, favoriler, listeler, bildirimler) sağlamak, hizmet kalitesini iyileştirmek ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanılır.

4. Veri Paylaşımı
Verileriniz, Hizmeti sağlamamıza yardımcı olan altyapı sağlayıcılarıyla (ör. barındırma, veritabanı, ödeme altyapısı) sınırlı ölçüde paylaşılabilir. Verileriniz reklam amacıyla üçüncü taraflara satılmaz.

5. Veri Saklama Süresi
Verileriniz, hesabınız aktif olduğu sürece saklanır. Hesabınızı ''Hesabım'' sayfasından kalıcı olarak sildiğinizde, ilişkili kişisel verileriniz sistemlerimizden silinir (yasal saklama yükümlülüğü olan veriler hariç).

6. Haklarınız
Yürürlükteki mevzuat (ör. KVKK, GDPR) kapsamında verilerinize erişme, düzeltme, silme ve işlemeye itiraz etme hakkına sahipsiniz. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.

7. Çerezler ve Benzer Teknolojiler
Oturumunuzu açık tutmak ve dil tercihinizi hatırlamak gibi temel işlevler için çerezler/benzer depolama teknolojileri kullanılır.

8. Veri Güvenliği ve İletişim
Verilerinizi korumak için makul teknik ve idari önlemler alıyoruz. Gizlilikle ilgili sorularınız için destek@kamp.la adresinden bize ulaşabilirsiniz.'
)
on conflict (key) do nothing;
