<script setup lang="ts">
/**
 * Parametrik boş durum şablonu (PRD 5.O): ikon + başlık + açıklama + tek CTA.
 * Favorilerim, Ziyaret Edilenler, Yorumlarım, Arama sonucu, Bildirimler vb.
 * tüm boş ekranlarda yeniden kullanılır.
 */
withDefaults(
  defineProps<{
    icon?: string;
    title: string;
    description?: string;
    ctaLabel?: string;
    ctaTo?: string;
  }>(),
  {
    icon: "🏕️",
    description: "",
    ctaLabel: "",
    ctaTo: "",
  }
);

// `ctaTo` verilmişse NuxtLink olarak davranır (favoriler, listeler vb.); verilmemişse
// (ör. bir modal açmak gibi) CTA tıklaması `cta-click` event'iyle dışarı bildirilir
// (bkz. components/poi/PoiReviewsTab.vue — "Yorum Yaz" boş durumu, PRD 5.O/5.F).
defineEmits<{ "cta-click": [] }>();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
    <span class="text-5xl">{{ icon }}</span>
    <h2 class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">{{ title }}</h2>
    <p v-if="description" class="text-sm text-brand-charcoal/60 dark:text-neutral-400">
      {{ description }}
    </p>
    <NuxtLink v-if="ctaLabel && ctaTo" :to="ctaTo" class="kl-btn-primary mt-2">
      {{ ctaLabel }}
    </NuxtLink>
    <button
      v-else-if="ctaLabel"
      type="button"
      class="kl-btn-primary mt-2"
      @click="$emit('cta-click')"
    >
      {{ ctaLabel }}
    </button>
  </div>
</template>
