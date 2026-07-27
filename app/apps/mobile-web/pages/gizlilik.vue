<script setup lang="ts">
/**
 * Gizlilik Sözleşmesi — PRD 5.L statik içerik sayfası (Faz 6).
 * `pages/ayarlar/index.vue`'daki "Gizlilik" linki ve `pages/kayit.vue`
 * "Gizlilik Politikası" linki buraya (`/gizlilik`) işaret ediyor — ayrı bir
 * `ayarlar/gizlilik.vue` route'u YOK, mevcut tek route dolduruldu.
 *
 * PRD 5.R "İçerik Yönetimi" (Faz 8): gövde metni artık admin panelden
 * düzenlenebilen `public.site_content` tablosundan (`key = 'gizlilik'`)
 * okunuyor — bkz. `composables/useSiteContent.ts`. Tablo boşsa/erişilemezse
 * `dbParagraphs` `null` kalır ve sayfa GÜVENLİ ŞEKİLDE mevcut statik i18n
 * bölüm yapısına (intro + 8 numaralı bölüm) düşer — sayfa asla boş render
 * edilmez.
 *
 * ÖNEMLİ: İçerik kaynağı ne olursa olsun (DB veya i18n), bu metin hâlâ genel
 * geçer bir şablondan türetilmiş bir TASLAKTIR — hukuki inceleme durumu
 * içeriğin DB'ye taşınmasıyla değişmediği için uyarı kutusu (`pages.privacy.draftNotice`)
 * her koşulda gösterilmeye devam eder.
 */
const { t } = useI18n();
usePageTitle("pages.privacy.title");

const { content } = useSiteContent("gizlilik");

const displayTitle = computed(() => content.value?.title || t("pages.privacy.title"));

/** DB'deki `body` tek bir metin bloğu (admin editörü serbest metin textarea'sı) —
 * i18n'deki gibi başlık/gövde ayrımı yok; boş satırla ayrılmış paragraflar
 * olarak düz gösterilir. */
const dbParagraphs = computed<string[] | null>(() => {
  if (!content.value?.body) return null;
  const paragraphs = content.value.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.length > 0 ? paragraphs : null;
});

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
      <h1 class="text-base font-bold text-brand-charcoal dark:text-neutral-100">{{ displayTitle }}</h1>

      <template v-if="dbParagraphs">
        <p v-for="(paragraph, i) in dbParagraphs" :key="i">{{ paragraph }}</p>
      </template>
      <template v-else>
        <p>{{ t("pages.privacy.intro") }}</p>

        <div v-for="section in sections" :key="section.heading" class="flex flex-col gap-1">
          <h2 class="font-semibold text-brand-charcoal dark:text-neutral-100">{{ section.heading }}</h2>
          <p>{{ section.body }}</p>
        </div>
      </template>
    </div>
  </div>
</template>
