/**
 * Sayfa başlığını üst bara bildiren küçük yardımcı.
 * Her sayfa `usePageTitle('pages.xxx.title')` çağırır; TopBar bu i18n
 * anahtarını `$t()` ile çözüp gösterir (bkz. layouts/default.vue).
 */
export function usePageTitle(i18nKey: string) {
  const titleKey = useState<string>("kampla-page-title-key", () => "");
  titleKey.value = i18nKey;
}

export function usePageTitleKey() {
  return useState<string>("kampla-page-title-key", () => "");
}
