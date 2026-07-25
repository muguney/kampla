<script setup lang="ts">
/**
 * Liste Görünümü (PRD 5.E) — Ana Ekran haritasındaki aynı mock POI verisini
 * kart listesi olarak gösterir. Aynı `useFiltersStore` (PRD 5.D) ile
 * filtrelenir, Ana Ekran'daki gibi Filtre ve "konumuma git" aksiyonları da
 * burada mevcut (bkz. components/map/FilterModal.vue, composables/useMap.ts).
 */
import { distanceKm, formatDistanceKm, LOCATION_TYPE_LABELS_EN, LOCATION_TYPE_LABELS_TR, MOCK_LOCATIONS, type MockLocationCard } from "@kampla/shared";

usePageTitle("pages.listView.title");

const { t, locale } = useI18n();
const filtersStore = useFiltersStore();
const { requestUserLocation, userLocation } = useMap();

const isFilterModalOpen = ref(false);

// TODO(Faz 5): Favoriler kalıcı olarak Supabase `lists`/`list_items` tablosuna
// (PRD 6.7, "favorites" sistem listesi) yazılacak. Şimdilik yalnızca UI state.
const favoriteIds = reactive(new Set<string>());

function toggleFavorite(id: string) {
  if (favoriteIds.has(id)) favoriteIds.delete(id);
  else favoriteIds.add(id);
}

/** PRD 5.D — Ana Ekran haritasıyla aynı filtre state'i, aynı mantık. */
const filteredLocations = computed(() => {
  const base =
    filtersStore.activeTypes.length === 0
      ? MOCK_LOCATIONS
      : MOCK_LOCATIONS.filter(
          (loc) => loc.location_type && filtersStore.activeTypes.includes(loc.location_type)
        );

  // Kullanıcı konumu varsa yakından uzağa sırala; yoksa mock veri sırası korunur.
  if (!userLocation.value) return base;
  const origin = userLocation.value;
  return [...base].sort(
    (a, b) => distanceKm(origin, { lat: a.lat, lng: a.lng }) - distanceKm(origin, { lat: b.lat, lng: b.lng })
  );
});

// TODO(Faz 4/backend entegrasyonu): mock veri yalnızca 20 kayıt olduğu için
// sonsuz kaydırma/sayfalama yok; gerçek `locations` tablosuna bağlanınca
// (Supabase) sayfalama/cursor tabanlı yükleme eklenecek.

function typeLabel(loc: MockLocationCard): string {
  if (!loc.location_type) return "";
  return locale.value === "en" ? LOCATION_TYPE_LABELS_EN[loc.location_type] : LOCATION_TYPE_LABELS_TR[loc.location_type];
}

function distanceLabel(loc: MockLocationCard): string | null {
  if (!userLocation.value) return null;
  return formatDistanceKm(distanceKm(userLocation.value, { lat: loc.lat, lng: loc.lng }));
}

function handleLocateClick() {
  // Bu görünümde harita yok; "konumuma git" burada yalnızca konum iznini
  // ister ve mesafeleri günceller (haritaya uçma Ana Ekran'da gerçekleşir).
  requestUserLocation();
}
</script>

<template>
  <div class="relative min-h-[calc(100vh-4rem-6rem)]">
    <div
      class="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-neutral-100 bg-brand-cream/95 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95"
    >
      <p class="text-xs font-semibold text-brand-charcoal/60 dark:text-neutral-400">
        {{ t("pages.listView.resultCount", { count: filteredLocations.length }) }}
      </p>

      <!-- Ana Ekran'a (haritaya) dönüş — index.vue'deki "Liste" butonunun simetriği -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 rounded-pill bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m12 3 9 5-9 5-9-5 9-5Z" stroke-linejoin="round" />
          <path d="m3 13 9 5 9-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ t("pages.listView.mapToggle") }}
      </NuxtLink>
    </div>

    <div class="flex flex-col gap-3 px-4 pb-28 pt-3">
      <article
        v-for="loc in filteredLocations"
        :key="loc.id"
        class="kl-card relative flex gap-3 p-3"
      >
        <div
          class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-control text-2xl"
          :class="!loc.photo_url ? `bg-poi-${loc.location_type}` : ''"
        >
          <img v-if="loc.photo_url" :src="loc.photo_url" :alt="loc.name" class="h-full w-full object-cover" />
          <span v-else>🏕️</span>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <h3 class="truncate text-sm font-bold text-brand-charcoal dark:text-neutral-100">
              {{ loc.name }}
            </h3>

            <!-- Hızlı favori — TODO(Faz 5): Supabase'e kalıcı yazma (bkz. yukarıdaki not) -->
            <button
              type="button"
              class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg"
              :aria-label="t('pages.listView.favoriteToggle')"
              :aria-pressed="favoriteIds.has(loc.id)"
              @click="toggleFavorite(loc.id)"
            >
              <span v-if="favoriteIds.has(loc.id)" class="text-brand-orange">♥</span>
              <span v-else class="text-brand-charcoal/30 dark:text-neutral-500">♡</span>
            </button>
          </div>

          <div class="mt-0.5 flex items-center gap-1.5">
            <span class="h-2 w-2 shrink-0 rounded-full" :class="`bg-poi-${loc.location_type}`" />
            <span class="truncate text-xs font-semibold text-brand-orange">{{ typeLabel(loc) }}</span>
          </div>

          <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-brand-charcoal/70 dark:text-neutral-400">
            <span v-if="loc.rating_count > 0" class="inline-flex items-center gap-1">
              <span class="text-poi-shower">★</span>
              {{ loc.rating_avg.toFixed(1) }}
              <span>({{ loc.rating_count }})</span>
            </span>
            <span v-else>{{ t("map.poiCard.noRating") }}</span>

            <span v-if="distanceLabel(loc)" class="inline-flex items-center gap-1">
              <span>·</span>
              <span>{{ distanceLabel(loc) }}</span>
            </span>
          </div>

          <p v-if="loc.description" class="mt-1 line-clamp-1 text-xs text-brand-charcoal/60 dark:text-neutral-400">
            {{ loc.description }}
          </p>
        </div>

        <NuxtLink :to="`/konum/${loc.id}`" class="absolute inset-0" :aria-label="t('map.poiCard.detailsCta')" />
      </article>

      <p
        v-if="filteredLocations.length === 0"
        class="px-4 py-16 text-center text-sm text-brand-charcoal/60 dark:text-neutral-400"
      >
        {{ t("emptyState.search.title") }}
      </p>
    </div>

    <!-- Filtre / konumuma git — Ana Ekran ile tutarlı sabit butonlar -->
    <div class="pointer-events-none fixed inset-x-4 bottom-24 z-20 flex items-end justify-between">
      <button
        type="button"
        class="pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-orange shadow-md dark:bg-neutral-800"
        aria-label="Filtre"
        @click="isFilterModalOpen = true"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M7 12h10M10 18h4" stroke-linecap="round" />
        </svg>
        <span
          v-if="filtersStore.activeTypes.length > 0"
          class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white"
        >
          {{ filtersStore.activeTypes.length }}
        </span>
      </button>

      <button
        type="button"
        class="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-orange shadow-md dark:bg-neutral-800"
        aria-label="Konumuma git"
        @click="handleLocateClick"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <MapFilterModal v-model="isFilterModalOpen" />
  </div>
</template>
