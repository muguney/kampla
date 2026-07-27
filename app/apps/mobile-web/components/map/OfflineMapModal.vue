<script setup lang="ts">
/**
 * "Bölgeyi Çevrimdışı İndir" bottom-sheet (PRD 5.B, 5.P, 7.1 — Faz 11, Premium).
 * Görsel desen `FilterModal.vue`/`LayerSelectModal.vue` ile tutarlı: alttan açılan
 * bottom-sheet, `kampla-fade` transition, sürükleme tutamacı (grey handle-bar).
 *
 * Ücretsiz kullanıcı (`authStore.isPremium === false`) için indirme kilitli —
 * gerçek RevenueCat/satın alma akışı henüz yok (Faz 11 kapsamı DIŞINDA), bu yüzden
 * kontrol yalnızca `profile.tier === "premium"` okumasıyla yapılıyor
 * (bkz. `stores/auth.ts` → `isPremium` getter'ı, `pages/listelerim/index.vue`'daki
 * `/premium` link deseniyle aynı).
 */
import type { OfflineRegion } from "@kampla/shared";

defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const { t, locale } = useI18n();
const authStore = useAuthStore();
const { map } = useMap();
const {
  regions,
  isDownloading,
  downloadProgress,
  hydrate,
  getVisibleBounds,
  downloadRegion,
  deleteRegion,
} = useOfflineMap();

const regionName = ref("");
const formError = ref("");
const toastMessage = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(message: string) {
  toastMessage.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2500);
}

const currentBounds = computed(() => (map.value ? getVisibleBounds(map.value) : null));

const currentBoundsLabel = computed(() => {
  if (!currentBounds.value) return "";
  const [west, south, east, north] = currentBounds.value;
  return t("map.offlineModal.bboxLabel", {
    west: west.toFixed(3),
    south: south.toFixed(3),
    east: east.toFixed(3),
    north: north.toFixed(3),
  });
});

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(locale.value === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function handleDownload() {
  formError.value = "";

  if (!authStore.isPremium) return;

  if (!currentBounds.value) {
    formError.value = t("map.offlineModal.mapNotReady");
    return;
  }

  const result = await downloadRegion(currentBounds.value, regionName.value);
  if (result.success) {
    regionName.value = "";
    showToast(t("map.offlineModal.downloadSuccessToast"));
  } else {
    showToast(t("map.offlineModal.downloadErrorToast"));
  }
}

async function handleDelete(region: OfflineRegion) {
  await deleteRegion(region.id);
  showToast(t("map.offlineModal.deleteToast"));
}

function close() {
  emit("update:modelValue", false);
}

onMounted(() => {
  hydrate();
});

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer);
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
          :aria-label="t('map.offlineModal.title')"
          @click.stop
        >
          <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-brand-charcoal dark:text-neutral-100">
              {{ t("map.offlineModal.title") }}
            </h2>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_4px_3px_0_rgba(0,0,0,0.09)]"
              :aria-label="t('common.cancel')"
              @click="close"
            >
              <IconsAppIcon name="close" class="h-4 w-4" />
            </button>
          </div>

          <!-- Ücretsiz kullanıcı: kilitli durum + Premium CTA (PRD 5.P) -->
          <div
            v-if="!authStore.isPremium"
            class="flex flex-col items-center gap-2 rounded-control bg-brand-orange/10 px-4 py-6 text-center"
          >
            <span class="text-3xl" aria-hidden="true">🔒</span>
            <p class="font-semibold text-brand-charcoal dark:text-neutral-100">
              {{ t("map.offlineModal.premiumLockTitle") }}
            </p>
            <p class="text-sm text-brand-charcoal/70 dark:text-neutral-400">
              {{ t("map.offlineModal.premiumLockBody") }}
            </p>
            <NuxtLink to="/premium" class="kl-btn-primary mt-2 inline-block px-6" @click="close">
              {{ t("map.offlineModal.premiumCta") }}
            </NuxtLink>
          </div>

          <!-- Premium kullanıcı: bölge indirme formu -->
          <template v-else>
            <div class="mb-4 rounded-control bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
              <p class="text-xs font-semibold uppercase text-brand-charcoal/50 dark:text-neutral-400">
                {{ t("map.offlineModal.currentViewLabel") }}
              </p>
              <p class="mt-1 text-sm text-brand-charcoal dark:text-neutral-200">
                {{ currentBoundsLabel || t("map.offlineModal.mapNotReady") }}
              </p>
            </div>

            <label class="mb-1 block text-sm font-semibold text-brand-charcoal dark:text-neutral-200">
              {{ t("map.offlineModal.nameLabel") }}
            </label>
            <input
              v-model="regionName"
              type="text"
              class="kl-input mb-2"
              :placeholder="t('map.offlineModal.namePlaceholder')"
              :disabled="isDownloading"
            />

            <p v-if="formError" class="mb-2 text-sm font-medium text-red-500 dark:text-red-400" role="alert">
              {{ formError }}
            </p>

            <button
              type="button"
              class="kl-btn-primary mb-5 w-full"
              :disabled="isDownloading || !currentBounds"
              @click="handleDownload"
            >
              {{ isDownloading ? t("map.offlineModal.downloading", { progress: downloadProgress }) : t("map.offlineModal.downloadButton") }}
            </button>

            <h3 class="mb-2 text-sm font-semibold text-brand-charcoal/60 dark:text-neutral-400">
              {{ t("map.offlineModal.savedRegionsTitle") }}
            </h3>

            <p v-if="regions.length === 0" class="text-sm text-brand-charcoal/60 dark:text-neutral-500">
              {{ t("map.offlineModal.emptyRegions") }}
            </p>

            <ul v-else class="flex flex-col gap-2">
              <li
                v-for="region in regions"
                :key="region.id"
                class="kl-card flex items-center justify-between gap-3 px-4 py-3"
              >
                <div class="min-w-0 flex-1">
                  <p class="truncate font-semibold text-brand-charcoal dark:text-neutral-100">
                    {{ region.name }}
                  </p>
                  <p class="text-xs text-brand-charcoal/60 dark:text-neutral-400">
                    {{ formatSize(region.sizeBytes) }} &middot; {{ formatDate(region.downloadedAt) }}
                  </p>
                </div>
                <button
                  type="button"
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand-charcoal/60 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  :aria-label="t('map.offlineModal.deleteAria')"
                  @click="handleDelete(region)"
                >
                  <IconsAppIcon name="close" class="h-4 w-4" />
                </button>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition name="kampla-fade">
      <div
        v-if="toastMessage"
        class="fixed inset-x-6 bottom-24 z-[60] rounded-control bg-brand-charcoal px-4 py-3 text-center text-sm font-semibold text-white shadow-lg dark:bg-neutral-700"
      >
        {{ toastMessage }}
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
