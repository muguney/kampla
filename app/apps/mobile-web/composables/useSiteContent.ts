/**
 * Kamp.la — `public.site_content` tablosundan (PRD 5.R "İçerik Yönetimi",
 * migration `0013_site_content.sql`) statik sayfa metni okur. Admin panelin
 * (`apps/admin/pages/icerik/index.vue`) düzenlediği `title`/`body` buradan
 * `pages/ayarlar/hakkinda.vue`, `pages/kullanim-kosullari.vue` ve
 * `pages/gizlilik.vue` sayfalarına akar.
 *
 * GÜVENLİ FALLBACK (zorunlu): migration henüz uygulanmamış ortamlarda (ör.
 * Mustafa'nın kendi Supabase projesi), tablo boşsa, ilgili `key`/`lang` için
 * satır yoksa VEYA sorgu herhangi bir nedenle hata verirse (ağ, RLS, vb.)
 * `content` `null` kalır — çağıran sayfa bu durumda MEVCUT statik i18n
 * metnine (`i18n/locales/tr.json` / `en.json`) düşer. Sayfa asla boş/bozuk
 * render etmemeli; bu yüzden burada hiçbir hata fırlatılmaz (throw yok).
 *
 * Şu an yalnızca TR içerik seed'lendi (bkz. migration 0013 yorumu) — `lang`
 * için eşleşme yoksa `tr` satırına düşülür, o da yoksa çağıran i18n'e düşer.
 */
import type { Database, SiteContent } from "@kampla/shared";

export function useSiteContent(key: string) {
  const supabase = useSupabaseClient<Database>();
  const { locale } = useI18n();

  const content = ref<SiteContent | null>(null);

  async function load() {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("key", key)
        .eq("lang", locale.value)
        .maybeSingle();

      if (!error && data) {
        content.value = data as SiteContent;
        return;
      }

      // Aktif dil için satır yoksa (ör. `en` henüz seed'lenmedi) TR'ye düş.
      if (!error && !data && locale.value !== "tr") {
        const { data: trData, error: trError } = await supabase
          .from("site_content")
          .select("*")
          .eq("key", key)
          .eq("lang", "tr")
          .maybeSingle();

        if (!trError && trData) {
          content.value = trData as SiteContent;
          return;
        }
      }

      // Eşleşme yok veya hata var — content null kalır, çağıran i18n'e düşer.
      content.value = null;
    } catch {
      // Tablo yok (migration uygulanmamış), ağ hatası vb. — sessizce statik
      // i18n metnine düş.
      content.value = null;
    }
  }

  onMounted(load);

  return { content };
}
