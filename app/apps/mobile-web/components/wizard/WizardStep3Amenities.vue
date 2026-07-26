<script setup lang="ts">
/**
 * Konum Ekle — Adım 3: Hizmetleri Seç (PRD 5.G, PRD 6.2, design/20-Konum Ekle - Hizmetler.png).
 * 19 hizmetten ÇOKLU seçim (opsiyonel — boş bırakılabilir). İkon grid'i
 * `components/poi/PoiDetailsTab.vue` "İmkan/hizmet ikon grid'i" görsel
 * desenini referans alır; orada salt okunur + tooltip, burada tıklama =
 * seçili/seçili değil toggle (checkbox davranışı).
 */
import { AMENITIES, AMENITY_LABELS_EN, AMENITY_LABELS_TR, type Amenity } from "@kampla/shared";
import { useLocationWizardStore } from "~/stores/locationWizard";
import { useAmenityIcon } from "~/composables/useAmenityIcon";

const { t, locale } = useI18n();
const wizard = useLocationWizardStore();
const { amenityIconSrc } = useAmenityIcon();

function amenityLabel(amenity: Amenity): string {
  return locale.value === "en" ? AMENITY_LABELS_EN[amenity] : AMENITY_LABELS_TR[amenity];
}

function isSelected(amenity: Amenity): boolean {
  return wizard.amenities.includes(amenity);
}

function toggleAmenity(amenity: Amenity) {
  const idx = wizard.amenities.indexOf(amenity);
  if (idx === -1) {
    wizard.amenities.push(amenity);
  } else {
    wizard.amenities.splice(idx, 1);
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-brand-charcoal/70 dark:text-neutral-300">
      {{ t("wizard.amenitiesStep.hint") }}
    </p>

    <div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
      <button
        v-for="amenity in AMENITIES"
        :key="amenity"
        type="button"
        class="flex flex-col items-center gap-1.5 rounded-control border-2 px-2 py-3 text-center transition-colors"
        :class="
          isSelected(amenity)
            ? 'border-brand-orange bg-brand-orange/10'
            : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800'
        "
        :aria-pressed="isSelected(amenity)"
        @click="toggleAmenity(amenity)"
      >
        <img :src="amenityIconSrc(amenity)" :alt="amenityLabel(amenity)" class="h-9 w-9" width="36" height="36" />
        <span class="text-[11px] font-semibold leading-tight text-brand-charcoal dark:text-neutral-100">
          {{ amenityLabel(amenity) }}
        </span>
      </button>
    </div>

    <p v-if="wizard.amenities.length > 0" class="text-xs font-medium text-brand-charcoal/60 dark:text-neutral-400">
      {{ t("wizard.amenitiesStep.selectedCount", { count: wizard.amenities.length }) }}
    </p>
  </div>
</template>
