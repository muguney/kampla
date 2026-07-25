<script setup lang="ts">
/**
 * Konum Ekle — Adım 2: Konum Türü Seç (PRD 5.G, PRD 6.1, design/19-Konum Ekle - Konum Türü.png).
 * 9 kategoriden TEKLİ seçim; her kart `@kampla/shared` → `poiColors` (tailwind
 * `bg-poi-<type>` — bkz. tailwind.config.ts safelist) ile kategori rengini,
 * `LOCATION_TYPE_LABELS_TR/EN` ile etiketini gösterir (bkz. pages/index.vue
 * "Konum Türü Renk Paleti" bölümündeki aynı renk noktası deseni).
 */
import {
  LOCATION_TYPES,
  LOCATION_TYPE_LABELS_EN,
  LOCATION_TYPE_LABELS_TR,
  type LocationType,
} from "@kampla/shared";
import { useLocationWizardStore } from "~/stores/locationWizard";

const { t, locale } = useI18n();
const wizard = useLocationWizardStore();

function typeLabel(type: LocationType): string {
  return locale.value === "en" ? LOCATION_TYPE_LABELS_EN[type] : LOCATION_TYPE_LABELS_TR[type];
}

function selectType(type: LocationType) {
  wizard.locationType = type;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p
      class="rounded-control bg-brand-orange/10 px-4 py-3 text-sm text-brand-charcoal dark:bg-brand-orange/20 dark:text-neutral-100"
    >
      {{ t("wizard.typeStep.hint") }}
    </p>

    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="type in LOCATION_TYPES"
        :key="type"
        type="button"
        class="flex items-center gap-2.5 rounded-control border-2 px-3.5 py-3 text-left transition-colors"
        :class="
          wizard.locationType === type
            ? 'border-brand-orange bg-brand-orange/10'
            : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800'
        "
        :aria-pressed="wizard.locationType === type"
        @click="selectType(type)"
      >
        <span class="h-3.5 w-3.5 shrink-0 rounded-full" :class="`bg-poi-${type}`" />
        <span class="text-sm font-semibold text-brand-charcoal dark:text-neutral-100">
          {{ typeLabel(type) }}
        </span>
      </button>
    </div>
  </div>
</template>
