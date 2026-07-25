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

// TODO(figma-assets): `icon` alanı gerçek harita önizleme fotoğrafı export'u
// gelince (node 160:1454/1455/1456) buraya eklenecek — bkz. template'teki not.
const layerOptions: Array<{ id: MapLayerId }> = [{ id: "classic" }, { id: "topo" }, { id: "satellite" }];

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
      <!--
        Figma node 160:1313: bu, ekranın alt kenarına yapışık bir bottom-sheet
        DEĞİL — harita üzerinde, alt navigasyonun ÜZERİNDE yüzen, dört köşesi
        de yuvarlak (rounded-[10-20px]) bir kart (bkz. get_design_context
        screenshot: kart altında hâlâ harita + alt nav görünüyor). Bu yüzden
        `items-end` + `inset-0` yerine alt navigasyonu (bkz.
        layouts/default.vue → LayoutBottomNav, ~6rem) temizleyecek bir
        `bottom` boşluğu veriliyor; sürükleme tutamacı (grey handle-bar)
        Figma'da yok, kaldırıldı.
      -->
      <div v-if="modelValue" class="fixed inset-0 z-50" @click="close">
        <div class="absolute inset-0 bg-black/40" />

        <div
          class="kl-card absolute inset-x-5 bottom-[calc(6rem+env(safe-area-inset-bottom))] p-5 shadow-[0_0_10px_rgba(0,0,0,0.15)]"
          role="dialog"
          aria-modal="true"
          :aria-label="t('map.layerModal.title')"
          @click.stop
        >
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-brand-charcoal dark:text-neutral-100">
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

          <div class="grid grid-cols-3 gap-2.5">
            <button
              v-for="option in layerOptions"
              :key="option.id"
              type="button"
              class="flex flex-col items-center gap-2 rounded-control border-2 p-1.5 transition-colors"
              :class="
                currentLayer === option.id
                  ? 'border-brand-orange bg-brand-orange/10'
                  : 'border-neutral-100 bg-white dark:border-neutral-700 dark:bg-neutral-800'
              "
              @click="choose(option.id)"
            >
              <!--
                TODO(figma-assets, 2026-07-26): Figma'da bu alanlar gerçek
                harita önizleme fotoğrafları (Klasik/Topografik/Uydu, node
                160:1454/1455/1456, ~110x110px). Bu oturumda Figma MCP rate
                limit'e takıldı VE bu sandbox'ın ağ proxy'si figma.com asset
                CDN'ini engellediği için bayt indirilemedi — gerçek görseller
                gelene kadar emoji/placeholder KULLANILMADI, nötr bir renk
                bloğu bırakıldı (kafadan ikon uydurmamak için).
              -->
              <span
                class="h-[90px] w-full rounded-control bg-gradient-to-b from-[#dfe9d8] to-[#f1ede5] dark:from-neutral-700 dark:to-neutral-800"
                aria-hidden="true"
              />
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
