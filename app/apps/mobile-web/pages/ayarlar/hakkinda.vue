<script setup lang="ts">
/**
 * Kamp.la Hakkında — PRD 5.L statik içerik sayfası (Faz 6).
 *
 * PRD 5.R "İçerik Yönetimi" (Faz 8): metin artık admin panelden düzenlenebilen
 * `public.site_content` tablosundan (`key = 'hakkinda'`) okunuyor — bkz.
 * `composables/useSiteContent.ts`. Tablo boşsa/erişilemezse (migration 0013
 * uygulanmamış ortamlar dahil) `paragraphs` GÜVENLİ ŞEKİLDE mevcut statik
 * i18n metnine (`pages.settingsAbout.paragraph1..3`) düşer — sayfa asla boş
 * render edilmez.
 */
const { t } = useI18n();
usePageTitle("pages.settingsAbout.title");

const { content } = useSiteContent("hakkinda");

const displayTitle = computed(() => content.value?.title || t("pages.settingsAbout.title"));

const paragraphs = computed<string[]>(() => {
  if (content.value?.body) {
    return content.value.body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [t("pages.settingsAbout.paragraph1"), t("pages.settingsAbout.paragraph2"), t("pages.settingsAbout.paragraph3")];
});
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div
      class="kl-card flex flex-col gap-3 px-4 py-5 text-sm leading-relaxed text-brand-charcoal/80 dark:text-neutral-300"
    >
      <h1 class="text-base font-bold text-brand-charcoal dark:text-neutral-100">{{ displayTitle }}</h1>
      <p v-for="(paragraph, i) in paragraphs" :key="i">{{ paragraph }}</p>
    </div>
  </div>
</template>
