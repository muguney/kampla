<script setup lang="ts">
/**
 * Gizlilik Sözleşmesi — PRD 5.L statik içerik sayfası (Faz 6).
 * `pages/ayarlar/index.vue`'daki "Gizlilik" linki ve `pages/kayit.vue`
 * "Gizlilik Politikası" linki buraya (`/gizlilik`) işaret ediyor — ayrı bir
 * `ayarlar/gizlilik.vue` route'u YOK, mevcut tek route dolduruldu.
 *
 * ÖNEMLİ: Bu içerik genel geçer bir mobil uygulama şablonundan türetilmiş bir
 * TASLAKTIR — yayına almadan önce hukuki inceleme gerekir (bkz. sayfa üstündeki
 * uyarı kutusu, `pages.privacy.draftNotice`).
 */
const { t } = useI18n();
usePageTitle("pages.privacy.title");

const sections = computed(() =>
  [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    heading: t(`pages.privacy.section${n}Heading`),
    body: t(`pages.privacy.section${n}Body`),
  }))
);
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div
      class="rounded-control border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      role="alert"
    >
      {{ t("pages.privacy.draftNotice") }}
    </div>

    <div
      class="kl-card flex flex-col gap-4 px-4 py-5 text-sm leading-relaxed text-brand-charcoal/80 dark:text-neutral-300"
    >
      <p>{{ t("pages.privacy.intro") }}</p>

      <div v-for="section in sections" :key="section.heading" class="flex flex-col gap-1">
        <h2 class="font-semibold text-brand-charcoal dark:text-neutral-100">{{ section.heading }}</h2>
        <p>{{ section.body }}</p>
      </div>
    </div>
  </div>
</template>
