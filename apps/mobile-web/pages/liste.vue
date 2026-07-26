<script setup lang="ts">
/**
 * Liste Görünümü (PRD 5.E) — Ana Ekran haritasındaki aynı mock POI verisini
 * kart listesi olarak gösterir. Aynı `useFiltersStore` (PRD 5.D) ile
 * filtrelenir, Ana Ekran'daki gibi Filtre ve "konumuma git" aksiyonları da
 * burada mevcut (bkz. components/map/FilterModal.vue, composables/useMap.ts).
 *
 * Görsel katman Figma "5- Liste Ekranı" (node 52:266, `get_design_context` ile
 * alındı) ile eşleştirildi: 10px köşeli kart + dış gölge, fotoğraf üstünde sol-alt
 * köşeye taşan favori kalbi, başlık altında kategori ikonu, mesafe → yıldızlar
 * → yorum sayısı sırası. Figma'da sayısal ortalama (ör. "4.4") gösterilmiyor,
 * yalnızca yıldız ikonları + yorum adedi var — buna göre kaldırıldı.
 */
import { distanceKm, formatDistanceKm, LOCATION_TYPE_LABELS_EN, LOCATION_TYPE_LABELS_TR, MOCK_LOCATIONS, ratingColor, type MockLocationCard } from "@kampla/shared";
import { LOCATION_TYPE_ICONS } from "~/composables/useLocationTypeIcon";

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

/** Figma'daki 5 yıldızlık gösterim: ortalamaya en yakın tam sayı kadar dolu yıldız. */
function filledStars(loc: MockLocationCard): number {
  return Math.round(loc.rating_avg ?? 0);
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

      <!-- Ana Ekran'a (haritaya) dönüş — Figma "buttonWithIcon" (turuncu hap, harita ikonu) -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 rounded-full bg-brand-orange px-[19px] py-[11px] text-sm font-semibold text-white shadow-[0_4px_3px_0_rgba(0,0,0,0.09)]"
      >
        <IconsAppIcon name="map" class="h-4 w-4" />
        {{ t("pages.listView.mapToggle") }}
      </NuxtLink>
    </div>

    <div class="flex flex-col gap-3 px-4 pb-28 pt-3">
      <article
        v-for="loc in filteredLocations"
        :key="loc.id"
        class="relative flex gap-3 rounded-[10px] bg-white p-2.5 shadow-[0_0_10px_0_rgba(0,0,0,0.15)] dark:bg-neutral-800"
      >
        <div class="relative h-[100px] w-[100px] shrink-0">
          <div
            class="flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] text-2xl"
            :class="!loc.photo_url ? `bg-poi-${loc.location_type}` : ''"
          >
            <img v-if="loc.photo_url" :src="loc.photo_url" :alt="loc.name" class="h-full w-full object-cover" />
            <span v-else>🏕️</span>
          </div>

          <!-- Hızlı favori — Figma: fotoğrafın sol-alt köşesine taşan daire rozet -->
          <button
            type="button"
            class="absolute -bottom-2 -left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_0_6px_0_rgba(0,0,0,0.2)] dark:bg-neutral-700"
            :aria-label="t('pages.listView.favoriteToggle')"
            :aria-pressed="favoriteIds.has(loc.id)"
            @click="toggleFavorite(loc.id)"
          >
            <IconsAppIcon
              :name="favoriteIds.has(loc.id) ? 'heart-solid' : 'heart-line'"
              class="h-4 w-4"
              :class="favoriteIds.has(loc.id) ? 'text-brand-orange' : 'text-brand-charcoal/30 dark:text-neutral-500'"
            />
          </button>
        </div>

        <div class="min-w-0 flex-1 py-0.5">
          <h3 class="truncate text-sm font-bold uppercase leading-tight text-brand-charcoal dark:text-neutral-100">
            {{ loc.name }}
          </h3>

          <div v-if="loc.location_type" class="mt-1.5 flex items-center gap-1.5">
            <IconsAppIcon :name="LOCATION_TYPE_ICONS[loc.location_type]" class="h-5 w-5" :class="`text-poi-${loc.location_type}`" />
            <span class="truncate text-xs font-semibold text-brand-charcoal/70 dark:text-neutral-400">
              {{ typeLabel(loc) }}
            </span>
          </div>

          <div class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-brand-charcoal/70 dark:text-neutral-400">
            <span v-if="distanceLabel(loc)">{{ distanceLabel(loc) }}</span>

            <span v-if="loc.rating_count > 0" class="inline-flex items-center gap-0.5">
              <IconsAppIcon
                v-for="i in 5"
                :key="i"
                :name="i <= filledStars(loc) ? 'star-solid' : 'star-line'"
                class="h-3 w-3"
                :style="{ color: ratingColor }"
              />
              <span class="ml-1">({{ loc.rating_count }})</span>
            </span>
            <span v-else>{{ t("map.poiCard.noRating") }}</span>
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
        class="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange shadow-md dark:bg-neutral-800"
        aria-label="Filtre"
        @click="isFilterModalOpen = true"
      >
        <IconsAppIcon name="filter" class="h-5 w-5" />
        <span
          v-if="filtersStore.activeTypes.length > 0"
          class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white"
        >
          {{ filtersStore.activeTypes.length }}
        </span>
      </button>

      <button
        type="button"
        class="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange shadow-md dark:bg-neutral-800"
        aria-label="Konumuma git"
        @click="handleLocateClick"
      >
        <IconsAppIcon name="locate" class="h-5 w-5" />
      </button>
    </div>

    <MapFilterModal v-model="isFilterModalOpen" />
  </div>
</template>
