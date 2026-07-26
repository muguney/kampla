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
  <!--
    Ana Ekran (harita, `showWordmark`) — Figma node 52:218/160:1313/64:4384:
    tam ekran harita üzerine biner, tam genişlik bar/çizgi YOK; yalnızca sol
    üstte ekranın kenarına yapışık, sadece sağ köşeleri yuvarlak bir logo
    rozeti var (bkz. get_design_context: 62px yükseklik, sağ köşeler 20px,
    shadow 0 0 10px rgba(0,0,0,.15)). Diğer 41 ekranda (showWordmark=false)
    davranış DEĞİŞMEDİ — mevcut tam genişlik başlık çubuğu aynen korunuyor.
  -->
  <header
    v-if="showWordmark"
    class="absolute inset-x-0 top-0 z-30 flex items-center bg-transparent px-0 py-0"
  >
    <div
      class="flex h-[62px] w-[177px] items-center gap-2 rounded-bl-none rounded-tl-none rounded-br-[20px] rounded-tr-[20px] bg-white pl-4 shadow-[0_0_10px_rgba(0,0,0,0.15)] dark:bg-neutral-900"
    >
      <LayoutLogo :with-wordmark="true" />
    </div>
  </header>

  <header
    v-else
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

      <h1 class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">
        {{ title }}
      </h1>
    </div>

    <LayoutLogo :with-wordmark="false" size="sm" />
  </header>
</template>
