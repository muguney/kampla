<script setup lang="ts">
/**
 * Kategori filtre modalı (PRD 5.D) — 9 konum türü ızgarası, `useFiltersStore`
 * ile bağlı çoklu seçim. Ücretsiz kullanıcı `FREE_TIER_LIMITS.maxActiveFilters`
 * (2) sınırına takılınca kısa süreli bir uyarı gösterilir (Premium'a geçiş
 * teşviki, PRD 5.P). Hem Ana Ekran (`pages/index.vue`) hem Liste Görünümü
 * (`pages/liste.vue`) aynı modalı kullanır — seçim `useFiltersStore` Pinia
 * store'unda tutulduğu için haritadaki pin'ler ve liste kartları otomatik
 * senkron filtrelenir.
 *
 * Görsel katman Figma "6-Filtre" (node 132:1271, `get_design_context` ile
 * alındı) ile eşleştirildi: 3x3 ızgara, 20px köşe yuvarlaklığı, seçili kart tam
 * turuncu dolgu + beyaz ikon, seçili olmayan kart beyaz + gölge (kenarlık yok),
 * ücretli kategorilerde küçük "₺" rozeti, kapat butonu turuncu dolgulu daire.
 */
import { LOCATION_TYPES, LOCATION_TYPE_LABELS_EN, LOCATION_TYPE_LABELS_TR, type LocationType } from "@kampla/shared";
import { LOCATION_TYPE_ICONS, PAID_LOCATION_TYPES } from "~/composables/useLocationTypeIcon";

defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const filtersStore = useFiltersStore();
const subscriptionStore = useSubscriptionStore();
const { t, locale } = useI18n();

const typeOptions = computed(() =>
  LOCATION_TYPES.map((type) => ({
    type,
    icon: LOCATION_TYPE_ICONS[type],
    isPaid: PAID_LOCATION_TYPES.has(type),
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
          class="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-y-auto rounded-t-[20px] bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_0_rgba(0,0,0,0.09)] dark:bg-neutral-900"
          role="dialog"
          aria-modal="true"
          :aria-label="t('map.filterModal.title')"
        >
          <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-brand-charcoal dark:text-neutral-100">
              {{ t("map.filterModal.title") }}
            </h2>
            <div class="flex items-center gap-2">
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
                class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_4px_3px_0_rgba(0,0,0,0.09)]"
                :aria-label="t('common.cancel')"
                @click="close"
              >
                <IconsAppIcon name="close" class="h-4 w-4" />
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
              class="flex flex-col items-center gap-2 rounded-[20px] p-3 shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] transition-colors"
              :class="
                filtersStore.activeTypes.includes(option.type)
                  ? 'bg-brand-orange'
                  : 'bg-white dark:bg-neutral-800'
              "
              :aria-pressed="filtersStore.activeTypes.includes(option.type)"
              @click="toggleType(option.type)"
            >
              <span class="relative flex h-9 w-9 items-center justify-center">
                <IconsAppIcon
                  :name="option.icon"
                  class="h-full w-full"
                  :class="
                    filtersStore.activeTypes.includes(option.type)
                      ? 'text-white'
                      : `text-poi-${option.type}`
                  "
                />
                <IconsAppIcon
                  v-if="option.isPaid"
                  name="fee-badge"
                  class="absolute -right-2 -top-2 h-4 w-4"
                  :class="
                    filtersStore.activeTypes.includes(option.type)
                      ? 'text-brand-orange'
                      : `text-poi-${option.type}`
                  "
                />
              </span>
              <span
                class="text-center text-[11px] font-semibold leading-tight"
                :class="
                  filtersStore.activeTypes.includes(option.type)
                    ? 'text-white'
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
