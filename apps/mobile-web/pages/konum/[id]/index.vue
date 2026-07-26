<script setup lang="ts">
/**
 * POI Detay Sayfası (Faz 3, PRD 5.F, design/11-17 "Poi Detay*.png", "Poi Yorumlar.png").
 * Salt okunur: hiçbir aksiyon gerçek Supabase'e yazmaz (mock/local state, Faz 5'te
 * gerçek backend'e bağlanacak). Tasarımdaki gibi tam ekran, üst bar/alt nav yok
 * (bkz. layouts/auth.vue) — kendi kapanış (X) ve alt aksiyon çubuğunu kendi çizer.
 */
import { MOCK_LOCATIONS, LOCATION_TYPE_LABELS_EN, LOCATION_TYPE_LABELS_TR, ratingColor, type MockLocationCard } from "@kampla/shared";

definePageMeta({ layout: "auth" });

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const authStore = useAuthStore();

const location = computed<MockLocationCard | undefined>(() =>
  MOCK_LOCATIONS.find((loc) => loc.id === route.params.id)
);

usePageTitle("pages.poiDetail.title");

const typeLabel = computed(() => {
  const type = location.value?.location_type;
  if (!type) return "";
  return locale.value === "en" ? LOCATION_TYPE_LABELS_EN[type] : LOCATION_TYPE_LABELS_TR[type];
});

const authorName = computed(() => location.value?.created_by_username ?? t("pages.poiDetail.teamName"));

const headerFilledStars = computed(() => Math.round(location.value?.rating_avg ?? 0));

const addedDateLabel = computed(() => {
  if (!location.value) return "";
  return new Intl.DateTimeFormat(locale.value === "en" ? "en-GB" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(location.value.created_at));
});

// --- Tab state, URL query ile senkron (?tab=detaylar|yorumlar) ---
type TabKey = "detaylar" | "yorumlar";
const activeTab = computed<TabKey>(() => (route.query.tab === "yorumlar" ? "yorumlar" : "detaylar"));

function setTab(tab: TabKey) {
  router.replace({ query: { ...route.query, tab } });
}

// --- Fotoğraf galerisi (yatay scroll-snap + nokta göstergesi) ---
const galleryRef = ref<HTMLElement | null>(null);
const activePhotoIndex = ref(0);

function onGalleryScroll() {
  const el = galleryRef.value;
  if (!el || el.clientWidth === 0) return;
  activePhotoIndex.value = Math.round(el.scrollLeft / el.clientWidth);
}

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
}

// --- Alt aksiyon çubuğu (PRD 5.F) — misafir kullanıcı her aksiyonda girişe yönlendirilir ---
const isDirectionsModalOpen = ref(false);
const isVisited = ref(false);
const isSaved = ref(false);
const toastMessage = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(message: string) {
  toastMessage.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2000);
}

function requireAuth(action: () => void) {
  if (!authStore.isLoggedIn) {
    navigateTo(`/giris?redirect=${encodeURIComponent(route.fullPath)}`);
    return;
  }
  action();
}

function handleAddPhoto() {
  requireAuth(() => {
    // TODO(Faz 5): gerçek fotoğraf yükleme akışı (R2/Supabase Storage) henüz yok.
    showToast(t("pages.poiDetail.actions.addPhotoToast"));
  });
}

function handleToggleVisited() {
  requireAuth(() => {
    isVisited.value = !isVisited.value;
    // TODO(Faz 5): `lists`/`list_items` üzerinde "Ziyaret Edilenler" sistem listesine gerçek yazma.
    showToast(
      isVisited.value
        ? t("pages.poiDetail.actions.markVisitedOnToast")
        : t("pages.poiDetail.actions.markVisitedOffToast")
    );
  });
}

function handleDirections() {
  requireAuth(() => {
    isDirectionsModalOpen.value = true;
  });
}

function handleSaveToList() {
  requireAuth(() => {
    isSaved.value = !isSaved.value;
    // TODO(Faz 5): gerçek liste seçim modalı + `list_items` insert (PRD 5.H).
    showToast(
      isSaved.value ? t("pages.poiDetail.actions.saveOnToast") : t("pages.poiDetail.actions.saveOffToast")
    );
  });
}

async function handleShare() {
  requireAuth(async () => {
    const shareUrl = import.meta.client ? window.location.href : "";
    if (import.meta.client && navigator.share) {
      try {
        await navigator.share({ title: location.value?.name, url: shareUrl });
      } catch {
        // Kullanıcı paylaşım penceresini iptal etti — sessizce yoksay.
      }
      return;
    }
    try {
      if (import.meta.client && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      // yoksay
    }
    showToast(t("pages.poiDetail.actions.shareToast"));
  });
}
</script>

<template>
  <div v-if="location" class="relative flex min-h-screen flex-col pb-28">
    <!-- Kaydırılabilir fotoğraf galerisi -->
    <div class="relative">
      <div
        ref="galleryRef"
        class="flex h-72 w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style="scrollbar-width: none"
        @scroll="onGalleryScroll"
      >
        <div
          v-for="(photo, index) in location.photo_urls"
          :key="index"
          class="h-72 w-full flex-shrink-0 snap-center"
          :class="!photo ? `bg-poi-${location.location_type}` : ''"
        >
          <img v-if="photo" :src="photo" :alt="`${location.name} ${index + 1}`" class="h-full w-full object-cover" />
        </div>
        <div v-if="location.photo_urls.length === 0" :class="`flex h-72 w-full items-center justify-center bg-poi-${location.location_type} text-5xl`">
          🏕️
        </div>
      </div>

      <!-- Nokta göstergesi -->
      <div v-if="location.photo_urls.length > 1" class="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        <span
          v-for="(photo, index) in location.photo_urls"
          :key="index"
          class="h-2 w-2 rounded-full transition-colors"
          :class="index === activePhotoIndex ? 'bg-brand-orange' : 'bg-white/70'"
        />
      </div>

      <button
        type="button"
        class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-charcoal shadow-md"
        :aria-label="t('common.close')"
        @click="goBack"
      >
        ✕
      </button>
    </div>
    <div class="h-1 w-full bg-brand-orange" />

    <!-- Başlık, kategori rozeti, puan, eklenme bilgisi -->
    <div class="px-4 pt-4">
      <h1 class="text-xl font-bold text-brand-charcoal dark:text-neutral-100">{{ location.name }}</h1>

      <div class="mt-3 flex items-start justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
            :class="`bg-poi-${location.location_type}`"
          >
            🏕️
          </span>
          <div>
            <p class="text-xs font-semibold text-brand-orange">{{ typeLabel }}</p>
            <p v-if="location.rating_count > 0" class="mt-0.5 flex items-center gap-1 text-xs text-brand-charcoal/70 dark:text-neutral-400">
              <span class="inline-flex items-center gap-0.5">
                <IconsAppIcon
                  v-for="i in 5"
                  :key="i"
                  :name="i <= headerFilledStars ? 'star-solid' : 'star-line'"
                  class="h-3 w-3"
                  :style="{ color: ratingColor }"
                />
              </span>
              <span class="font-semibold text-brand-charcoal dark:text-neutral-200">{{ location.rating_avg.toFixed(1) }}</span>
            </p>
            <p v-else class="mt-0.5 text-xs text-brand-charcoal/50 dark:text-neutral-500">
              {{ t("map.poiCard.noRating") }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <p class="max-w-[9.5rem] text-right text-[11px] leading-tight text-brand-charcoal/60 dark:text-neutral-400">
            <span class="font-semibold text-brand-orange">{{ authorName }}</span>
            {{ t("pages.poiDetail.addedBySuffix", { date: addedDateLabel }) }}
          </p>
          <img
            v-if="location.created_by_avatar_url"
            :src="location.created_by_avatar_url"
            :alt="authorName"
            class="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          <span
            v-else
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-sm"
          >
            🏕️
          </span>
        </div>
      </div>

      <!-- Sekmeler -->
      <div class="mt-4 flex gap-2">
        <button
          type="button"
          class="flex-1 rounded-control px-4 py-2.5 text-sm font-semibold transition-colors"
          :class="
            activeTab === 'detaylar'
              ? 'bg-brand-orange text-white'
              : 'bg-neutral-100 text-brand-charcoal/60 dark:bg-neutral-800 dark:text-neutral-400'
          "
          @click="setTab('detaylar')"
        >
          {{ t("pages.poiDetail.tabs.details") }}
        </button>
        <button
          type="button"
          class="flex-1 rounded-control px-4 py-2.5 text-sm font-semibold transition-colors"
          :class="
            activeTab === 'yorumlar'
              ? 'bg-brand-orange text-white'
              : 'bg-neutral-100 text-brand-charcoal/60 dark:bg-neutral-800 dark:text-neutral-400'
          "
          @click="setTab('yorumlar')"
        >
          {{ t("pages.poiDetail.tabs.reviews", { count: location.rating_count }) }}
        </button>
      </div>
    </div>

    <div class="mt-2 border-t border-neutral-100 dark:border-neutral-800" />

    <PoiDetailsTab v-if="activeTab === 'detaylar'" :location="location" />
    <PoiReviewsTab v-else :location="location" />

    <!-- Alt aksiyon çubuğu -->
    <div
      class="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-md items-center justify-around border-t border-neutral-100 bg-white px-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-full text-brand-charcoal/70 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        :aria-label="t('pages.poiDetail.actions.addPhoto')"
        @click="handleAddPhoto"
      >
        <span class="text-xl">📷</span>
      </button>
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
        :class="isVisited ? 'text-brand-orange' : 'text-brand-charcoal/70 dark:text-neutral-300'"
        :aria-label="t('pages.poiDetail.actions.markVisited')"
        :aria-pressed="isVisited"
        @click="handleToggleVisited"
      >
        <span class="text-xl">🚩</span>
      </button>
      <button
        type="button"
        class="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg transition-transform hover:scale-105"
        :aria-label="t('pages.poiDetail.actions.directions')"
        @click="handleDirections"
      >
        <span class="text-2xl">🧭</span>
      </button>
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
        :class="isSaved ? 'text-brand-orange' : 'text-brand-charcoal/70 dark:text-neutral-300'"
        :aria-label="t('pages.poiDetail.actions.saveToList')"
        :aria-pressed="isSaved"
        @click="handleSaveToList"
      >
        <span class="text-xl">🔖</span>
      </button>
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-full text-brand-charcoal/70 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        :aria-label="t('pages.poiDetail.actions.share')"
        @click="handleShare"
      >
        <span class="text-xl">📤</span>
      </button>
    </div>

    <Transition name="kampla-fade">
      <div
        v-if="toastMessage"
        class="fixed inset-x-6 bottom-24 z-40 rounded-control bg-brand-charcoal px-4 py-3 text-center text-sm font-semibold text-white shadow-lg dark:bg-neutral-700"
      >
        {{ toastMessage }}
      </div>
    </Transition>

    <PoiDirectionsModal
      v-model="isDirectionsModalOpen"
      :lat="location.lat"
      :lng="location.lng"
      :name="location.name"
      :poi-id="location.id"
    />
  </div>

  <!-- Bulunamadı durumu -->
  <div v-else class="flex min-h-screen flex-col">
    <button
      type="button"
      class="m-4 flex h-9 w-9 items-center justify-center self-start rounded-full bg-neutral-100 text-brand-charcoal dark:bg-neutral-800 dark:text-neutral-100"
      :aria-label="t('common.close')"
      @click="goBack"
    >
      ✕
    </button>
    <UiEmptyState
      icon="🧭"
      :title="t('pages.poiDetail.notFound.title')"
      :cta-label="t('pages.poiDetail.notFound.cta')"
      cta-to="/"
    />
  </div>
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
