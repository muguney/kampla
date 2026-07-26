<script setup lang="ts">
/**
 * Konum Ekle — Adım 4: Detayları Gir (PRD 5.G, PRD 6.3, 6.4).
 * Ad zorunlu, geri kalan tüm alanlar (açıklama, iletişim, sosyal medya,
 * konaklama tipi, sezon) opsiyoneldir — bkz. PRD 5.G madde 4: "hepsi opsiyonel".
 * Konaklama tipi `ACCOMMODATION_TYPES` çoklu seçim (PoiDetailsTab.vue rozet
 * deseniyle tutarlı ikonlar), sezon `SEASONS` tekli seçim (radio kart).
 */
import {
  ACCOMMODATION_LABELS_EN,
  ACCOMMODATION_LABELS_TR,
  ACCOMMODATION_TYPES,
  SEASONS,
  SEASON_LABELS_EN,
  SEASON_LABELS_TR,
  type AccommodationType,
  type Season,
} from "@kampla/shared";
import { useLocationWizardStore } from "~/stores/locationWizard";

const { t, locale } = useI18n();
const wizard = useLocationWizardStore();

const ACCOMMODATION_ICONS: Record<AccommodationType, string> = {
  caravan: "🚐",
  tent: "⛺",
  bungalow: "🏡",
};

const SEASON_ICONS: Record<Season, string> = {
  summer: "☀️",
  winter: "❄️",
  all: "🍂",
};

function accommodationLabel(type: AccommodationType): string {
  return locale.value === "en" ? ACCOMMODATION_LABELS_EN[type] : ACCOMMODATION_LABELS_TR[type];
}

function seasonLabel(season: Season): string {
  return locale.value === "en" ? SEASON_LABELS_EN[season] : SEASON_LABELS_TR[season];
}

function isAccommodationSelected(type: AccommodationType): boolean {
  return wizard.accommodationTypes.includes(type);
}

function toggleAccommodation(type: AccommodationType) {
  const idx = wizard.accommodationTypes.indexOf(type);
  if (idx === -1) {
    wizard.accommodationTypes.push(type);
  } else {
    wizard.accommodationTypes.splice(idx, 1);
  }
}

function selectSeason(season: Season) {
  wizard.season = wizard.season === season ? null : season;
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ t("wizard.detailsStep.nameLabel") }}
        <span class="text-brand-orange">*</span>
      </label>
      <input
        v-model="wizard.name"
        type="text"
        class="kl-input"
        :placeholder="t('wizard.detailsStep.namePlaceholder')"
        required
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ t("wizard.detailsStep.descriptionLabel") }}
      </label>
      <textarea
        v-model="wizard.description"
        rows="4"
        class="kl-input resize-none"
        :placeholder="t('wizard.detailsStep.descriptionPlaceholder')"
      />
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-brand-charcoal dark:text-neutral-100">
          {{ t("wizard.detailsStep.phoneLabel") }}
        </label>
        <input
          v-model="wizard.phone"
          type="tel"
          class="kl-input"
          :placeholder="t('wizard.detailsStep.phonePlaceholder')"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-brand-charcoal dark:text-neutral-100">
          {{ t("wizard.detailsStep.websiteLabel") }}
        </label>
        <input
          v-model="wizard.websiteUrl"
          type="url"
          class="kl-input"
          :placeholder="t('wizard.detailsStep.websitePlaceholder')"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ t("wizard.detailsStep.socialLabel") }}
      </span>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="flex items-center gap-2">
          <span class="text-lg">📘</span>
          <input v-model="wizard.facebookUrl" type="url" class="kl-input" placeholder="Facebook" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">📸</span>
          <input v-model="wizard.instagramUrl" type="url" class="kl-input" placeholder="Instagram" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">▶️</span>
          <input v-model="wizard.youtubeUrl" type="url" class="kl-input" placeholder="YouTube" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">✖️</span>
          <input v-model="wizard.xUrl" type="url" class="kl-input" placeholder="X (Twitter)" />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ t("wizard.detailsStep.accommodationLabel") }}
      </span>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="type in ACCOMMODATION_TYPES"
          :key="type"
          type="button"
          class="flex flex-col items-center gap-1 rounded-control border-2 px-4 py-2.5 text-center transition-colors"
          :class="
            isAccommodationSelected(type)
              ? 'border-brand-orange bg-brand-orange/10'
              : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800'
          "
          :aria-pressed="isAccommodationSelected(type)"
          @click="toggleAccommodation(type)"
        >
          <span class="text-xl">{{ ACCOMMODATION_ICONS[type] }}</span>
          <span class="text-xs font-semibold text-brand-charcoal dark:text-neutral-100">
            {{ accommodationLabel(type) }}
          </span>
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ t("wizard.detailsStep.seasonLabel") }}
      </span>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="season in SEASONS"
          :key="season"
          type="button"
          class="flex items-center gap-2 rounded-control border-2 px-4 py-2.5 text-center transition-colors"
          :class="
            wizard.season === season
              ? 'border-brand-orange bg-brand-orange/10'
              : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800'
          "
          :aria-pressed="wizard.season === season"
          @click="selectSeason(season)"
        >
          <span class="text-lg">{{ SEASON_ICONS[season] }}</span>
          <span class="text-xs font-semibold text-brand-charcoal dark:text-neutral-100">
            {{ seasonLabel(season) }}
          </span>
        </button>
      </div>
    </div>

    <p class="text-xs font-medium text-brand-charcoal/50 dark:text-neutral-500">
      {{ t("wizard.detailsStep.optionalHint") }}
    </p>
  </div>
</template>
