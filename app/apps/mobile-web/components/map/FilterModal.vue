<script setup lang="ts">
/**
 * Kategori filtre modalı (PRD 5.D) — 9 konum türü ızgarası, `useFiltersStore`
 * ile bağlı çoklu seçim. Ücretsiz kullanıcı `FREE_TIER_LIMITS.maxActiveFilters`
 * (2) sınırına takılınca kısa süreli bir uyarı gösterilir (Premium'a geçiş
 * teşviki, PRD 5.P). Hem Ana Ekran (`pages/index.vue`) hem Liste Görünümü
 * (`pages/liste.vue`) aynı modalı kullanır — seçim `useFiltersStore` Pinia
 * store'unda tutulduğu için haritadaki pin'ler ve liste kartları otomatik
 * senkron filtrelenir.
 */
import { LOCATION_TYPES, LOCATION_TYPE_LABELS_EN, LOCATION_TYPE_LABELS_TR, type LocationType } from "@kampla/shared";

defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const filtersStore = useFiltersStore();
const subscriptionStore = useSubscriptionStore();
const { t, locale } = useI18n();

/** Kategori başına basit emoji ikon — ücretli/ücretsiz ayrımı zaten renk noktasıyla yapılıyor. */
const TYPE_ICONS: Record<LocationType, string> = {
  "paid-caravan": "🚐",
  "free-caravan": "🚐",
  "paid-parking": "🅿️",
  "free-parking": "🅿️",
  "paid-tent": "⛺",
  "free-tent": "⛺",
  water: "🚰",
  laundry: "🧺",
  shower: "🚿",
};

const typeOptions = computed(() =>
  LOCATION_TYPES.map((type) => ({
    type,
    icon: TYPE_ICONS[type],
    label: locale.value === "en" ? LOCATION_TYPE_LABELS_EN[type] : LOCATION_TYPE_LABELS_TR[type],
  }))
);

const warningVisible = ref(false);
let warningTimeout: ReturnType<typeof setTimeout> | null = null;

function showWarning() {
  warningVisible.value = true;
  if (warningTimeout) clearTimeout(warningTimeout);
  warningTimeout = setTimeout(() => {
    warningVisible.value = false;
  }, 3500);
}

function toggleType(type: LocationType) {
  const isActive = filtersStore.activeTypes.includes(type);
  if (!isActive && !subscriptionStore.isActive && filtersStore.isAtFreeLimit) {
    showWarning();
    return;
  }
  filtersStore.toggle(type, subscriptionStore.isActive);
}

function close() {
  emit("update:modelValue", false);
}

onUnmounted(() => {
  if (warningTimeout) clearTimeout(warningTimeout);
});
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
          :aria-label="t('map.filterModal.title')"
        >
          <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-brand-charcoal dark:text-neutral-100">
              {{ t("map.filterModal.title") }}
            </h2>
            <div class="flex items-center gap-1">
              <button
                v-if="filtersStore.activeTypes.length > 0"
                type="button"
                class="rounded-full px-2 py-1 text-xs font-semibold text-brand-orange hover:bg-brand-orange/10"
                @click="filtersStore.clear()"
              >
                {{ t("map.filterModal.clear") }}
              </button>
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full text-brand-charcoal/60 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                :aria-label="t('common.cancel')"
                @click="close"
              >
                ✕
              </button>
            </div>
          </div>

          <Transition name="kampla-fade">
            <p
              v-if="warningVisible"
              class="mb-3 rounded-control bg-brand-orange/10 px-3 py-2 text-xs font-semibold text-brand-orange-dark"
              role="alert"
            >
              {{ t("map.filterModal.freeLimitWarning") }}
            </p>
          </Transition>

          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="option in typeOptions"
              :key="option.type"
              type="button"
              class="flex flex-col items-center gap-1.5 rounded-control border-2 p-2.5 transition-colors"
              :class="
                filtersStore.activeTypes.includes(option.type)
                  ? 'border-brand-orange bg-brand-orange/10'
                  : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'
              "
              :aria-pressed="filtersStore.activeTypes.includes(option.type)"
              @click="toggleType(option.type)"
            >
              <span class="relative flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-700">
                {{ option.icon }}
                <span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-white dark:border-neutral-800" :class="`bg-poi-${option.type}`" />
              </span>
              <span
                class="text-center text-[11px] font-semibold leading-tight"
                :class="
                  filtersStore.activeTypes.includes(option.type)
                    ? 'text-brand-orange'
                    : 'text-brand-charcoal dark:text-neutral-200'
                "
              >
                {{ option.label }}
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
