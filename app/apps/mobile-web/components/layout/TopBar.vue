<script setup lang="ts">
/**
 * Üst bar deseni (PRD 2.2): logo neredeyse her ekranın sağ üst köşesinde
 * sayfa başlığının yanında küçük boyutta tekrar ediyor.
 * Ana ekranda logo + "Kamp.la" yazısı sol üstte (bkz. design/2-Ana Ekran.png),
 * iç sayfalarda ise sayfa başlığı solda + küçük logo sağda.
 */
withDefaults(
  defineProps<{
    title?: string;
    showWordmark?: boolean;
    showBack?: boolean;
  }>(),
  {
    title: "",
    showWordmark: false,
    showBack: false,
  }
);

defineEmits<{ back: [] }>();
</script>

<template>
  <header
    class="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-neutral-100 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
  >
    <div class="flex items-center gap-2">
      <button
        v-if="showBack"
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-full text-brand-charcoal hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
        :aria-label="$t('common.back')"
        @click="$emit('back')"
      >
        ←
      </button>

      <LayoutLogo v-if="showWordmark" :with-wordmark="true" />
      <h1 v-else class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">
        {{ title }}
      </h1>
    </div>

    <LayoutLogo v-if="!showWordmark" :with-wordmark="false" size="sm" />
  </header>
</template>
