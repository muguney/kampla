<script setup lang="ts">
/**
 * Yol tarifi seçim modalı (PRD 5.F, design/17-Poi Detay- Haritaya Yönlendir.png).
 * Çoklu navigasyon seçeneği: Google Maps (uygulama içi — Capacitor native build'de
 * gerçek in-app webview/deep link, bu web build'de aynı harici linke düşer),
 * Google Maps (harici, yeni sekmede açılır) ve "Uygulama içi rota (Beta)" —
 * Faz 12 "Rota Motoru" (PHASES.md) UI iskeleti; `/konum/[id]/rota` sayfasına
 * yönlendirir, orada MOCK/sabit bir rota gösterilir (gerçek Valhalla/OSRM
 * entegrasyonu DECISIONS.md'de üçüncü taraf servis kararını bekliyor — kapsam
 * dışı, bkz. görev talimatı). Gerçek pencere açma bu ortamda test edilemez;
 * href'ler doğru formatta üretilir (bkz. PRD 7.1).
 */
const props = defineProps<{ modelValue: boolean; lat: number; lng: number; name: string; poiId?: string }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const { t } = useI18n();
const route = useRoute();

const externalHref = computed(
  () => `https://www.google.com/maps/dir/?api=1&destination=${props.lat},${props.lng}`
);

/** Rota id'si prop ile verilmediyse (bkz. mevcut kullanımlar) aktif POI sayfasının route param'ına düşülür. */
const routePoiId = computed(() => props.poiId ?? (route.params.id as string | undefined));

function close() {
  emit("update:modelValue", false);
}

function goToInAppRoute() {
  close();
  if (routePoiId.value) {
    navigateTo(`/konum/${routePoiId.value}/rota`);
  }
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
          :aria-label="t('pages.poiDetail.directionsModal.title')"
        >
          <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-brand-charcoal dark:text-neutral-100">
              {{ t("pages.poiDetail.directionsModal.title") }}
            </h2>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-brand-charcoal/60 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
              :aria-label="t('common.close')"
              @click="close"
            >
              ✕
            </button>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <!-- Uygulama içi (Capacitor native build'de gerçek deep link/webview) -->
            <a
              :href="externalHref"
              target="_blank"
              rel="noopener"
              class="flex flex-col items-center gap-2 rounded-control border border-neutral-200 bg-white p-4 text-center transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              @click="close"
            >
              <span class="text-3xl">📍</span>
              <span class="text-xs font-semibold text-brand-charcoal dark:text-neutral-100">
                {{ t("pages.poiDetail.directionsModal.inApp") }}
              </span>
            </a>

            <a
              :href="externalHref"
              target="_blank"
              rel="noopener"
              class="flex flex-col items-center gap-2 rounded-control border border-neutral-200 bg-white p-4 text-center transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              @click="close"
            >
              <span class="text-3xl">🗺️</span>
              <span class="text-xs font-semibold text-brand-charcoal dark:text-neutral-100">
                {{ t("pages.poiDetail.directionsModal.external") }}
              </span>
            </a>

            <!-- Faz 12 "Rota Motoru" UI iskeleti — gerçek routing servisi henüz bağlı değil (bkz. dosya başı not) -->
            <button
              type="button"
              class="relative flex flex-col items-center gap-2 rounded-control border border-neutral-200 bg-white p-4 text-center transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              @click="goToInAppRoute"
            >
              <span
                class="absolute right-1.5 top-1.5 rounded-full bg-brand-orange/15 px-1.5 py-0.5 text-[9px] font-bold leading-none text-brand-orange"
              >
                {{ t("pages.poiDetail.directionsModal.betaBadge") }}
              </span>
              <span class="text-3xl">🧭</span>
              <span class="text-xs font-semibold text-brand-charcoal dark:text-neutral-100">
                {{ t("pages.poiDetail.directionsModal.inAppRoute") }}
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
