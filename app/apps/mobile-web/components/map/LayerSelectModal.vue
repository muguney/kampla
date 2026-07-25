<script setup lang="ts">
/**
 * Harita katmanı seçim modalı (PRD 5.B) — Klasik / Topografik / Uydu.
 * Seçim `useMap()` composable'ındaki `currentLayer` state'inde tutulur
 * (sayfa yenilenene kadar hatırlanır, kalıcılık Faz 2 kapsamında değil).
 * Gerçek MapTiler key gelince her seçenek kendi stil URL'sine otomatik
 * bağlanır (bkz. composables/useMap.ts → getMapStyle()).
 */
import type { MapLayerId } from "~/composables/useMap";

defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [boolean]; select: [MapLayerId] }>();

const { currentLayer, setMapLayer } = useMap();
const { t } = useI18n();

const layerOptions: Array<{ id: MapLayerId; icon: string }> = [
  { id: "classic", icon: "🗺️" },
  { id: "topo", icon: "⛰️" },
  { id: "satellite", icon: "🛰️" },
];

function close() {
  emit("update:modelValue", false);
}

function choose(id: MapLayerId) {
  setMapLayer(id);
  emit("select", id);
  close();
}
</script>

<template>
  <Teleport to="body">
    <Transition name="kampla-fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-end justify-center">
        <div class="absolute inset-0 bg-black/40" @click="close" />

        <div
          class="kl-card relative w-full max-w-md rounded-b-none p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
          role="dialog"
          aria-modal="true"
          :aria-label="t('map.layerModal.title')"
        >
          <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-brand-charcoal dark:text-neutral-100">
              {{ t("map.layerModal.title") }}
            </h2>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-brand-charcoal/60 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
              :aria-label="t('common.cancel')"
              @click="close"
            >
              ✕
            </button>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="option in layerOptions"
              :key="option.id"
              type="button"
              class="flex flex-col items-center gap-2 rounded-control border-2 p-3 transition-colors"
              :class="
                currentLayer === option.id
                  ? 'border-brand-orange bg-brand-orange/10'
                  : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'
              "
              @click="choose(option.id)"
            >
              <span
                class="flex h-14 w-14 items-center justify-center rounded-control bg-gradient-to-b from-[#dfe9d8] to-[#f1ede5] text-2xl dark:from-neutral-700 dark:to-neutral-800"
              >
                {{ option.icon }}
              </span>
              <span
                class="text-xs font-semibold"
                :class="currentLayer === option.id ? 'text-brand-orange' : 'text-brand-charcoal dark:text-neutral-200'"
              >
                {{ t(`map.layerModal.${option.id}`) }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.kampla-fade-enter-active,
.kampla-fade-leave-active {
  transition: opacity 0.2s ease;
}
.kampla-fade-enter-from,
.kampla-fade-leave-to {
  opacity: 0;
}
</style>
