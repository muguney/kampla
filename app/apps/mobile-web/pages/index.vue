<script setup lang="ts">
/**
 * Ana Ekran (Harita) — PRD 4/5.B, design/2-Ana Ekran.png.
 * Faz 2: gerçek MapLibre GL JS haritası + 3 katman seçimi + kategori renkli
 * mock POI pin'leri + tıklanınca açılan özet kart (bkz. composables/useMap.ts,
 * components/map/LayerSelectModal.vue, components/map/PoiSummaryCard.vue).
 */
import maplibregl from "maplibre-gl";
import {
  LOCATION_TYPES,
  LOCATION_TYPE_LABELS_TR,
  MOCK_LOCATIONS,
  SEARCH_SUGGESTIONS,
  type MockLocationCard,
} from "@kampla/shared";
import type { Marker as MapLibreMarker } from "maplibre-gl";

usePageTitle("pages.home.title");

const poiLegend = LOCATION_TYPES.map((type) => ({
  type,
  label: LOCATION_TYPE_LABELS_TR[type],
}));

const {
  initMap,
  destroyMap,
  flyToUserLocation,
  flyToCoordinates,
  requestUserLocation,
  userLocation,
  map: mapState,
} = useMap();

const route = useRoute();
const filtersStore = useFiltersStore();

const mapContainer = ref<HTMLElement | null>(null);
const isLayerModalOpen = ref(false);
const isFilterModalOpen = ref(false);
const selectedLocation = ref<MockLocationCard | null>(null);

let poiMarkers: MapLibreMarker[] = [];

/** PRD 5.D — filtre boşsa tüm POI'ler, doluysa yalnızca seçili kategoriler gösterilir. */
const filteredLocations = computed(() => {
  if (filtersStore.activeTypes.length === 0) return MOCK_LOCATIONS;
  return MOCK_LOCATIONS.filter(
    (loc) => loc.location_type && filtersStore.activeTypes.includes(loc.location_type)
  );
});

function addPoiMarkers(map: maplibregl.Map) {
  poiMarkers.forEach((marker) => marker.remove());
  poiMarkers = filteredLocations.value
    .filter((loc) => loc.location_type)
    .map((loc) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `kampla-poi-marker bg-poi-${loc.location_type}`;
      el.setAttribute("aria-label", loc.name);
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        selectedLocation.value = loc;
      });
      return new maplibregl.Marker({ element: el }).setLngLat([loc.lng, loc.lat]).addTo(map);
    });
}

// Filtre değişince (bkz. components/map/FilterModal.vue) pin'ler yeniden çizilir.
watch(filteredLocations, () => {
  if (mapState.value) addPoiMarkers(mapState.value);
});

onMounted(() => {
  if (!mapContainer.value) return;
  const map = initMap(mapContainer.value);
  map.on("load", () => {
    addPoiMarkers(map);
    // Arama ekranından gelen `/?focus=<id>` query'si varsa haritayı oraya odakla
    // (bkz. pages/ara.vue, @kampla/shared → SEARCH_SUGGESTIONS).
    const focusId = route.query.focus;
    if (typeof focusId === "string") {
      const suggestion = SEARCH_SUGGESTIONS.find((s) => s.id === focusId);
      if (suggestion) flyToCoordinates(suggestion.lat, suggestion.lng, suggestion.zoom);
    }
  });
  // Kullanıcı konumunu sessizce dener — izin yoksa varsayılan merkezde kalınır (hata fırlatmaz).
  requestUserLocation();
});

onUnmounted(() => {
  poiMarkers.forEach((marker) => marker.remove());
  poiMarkers = [];
  destroyMap();
});

function handleLocateClick() {
  flyToUserLocation();
}

function closeSummaryCard() {
  selectedLocation.value = null;
}
</script>

<template>
  <div class="relative h-[calc(100vh-6rem)] min-h-[420px] w-full overflow-hidden">
    <!-- MapLibre GL JS haritası (Faz 2 — bkz. composables/useMap.ts).
         Figma'da (node 52:218) harita tam ekran kenarına kadar gidiyor, üst
         bar yok — bkz. components/layout/TopBar.vue (showWordmark dalı). -->
    <div id="map" ref="mapContainer" class="kampla-map-container" />

    <!-- Liste görünümüne geçiş (Figma node 52:218: buttonWithIcon, #fe8542,
         rounded-[20px], shadow 0 4px 3px rgba(0,0,0,.09)) -->
    <NuxtLink
      to="/liste"
      class="absolute right-4 top-[50px] z-20 flex items-center gap-2 rounded-[20px] bg-brand-orange px-5 py-2.5 text-base font-semibold text-white shadow-[0_4px_3px_rgba(0,0,0,0.09)]"
    >
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
      </svg>
      Liste
    </NuxtLink>

    <!-- Katman / Filtre / Konumum butonları (Figma node 52:218 alt kısmı, ~60px çap) -->
    <div class="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between">
      <button
        type="button"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange shadow-md dark:bg-neutral-800"
        aria-label="Harita katmanı"
        @click="isLayerModalOpen = true"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m12 3 9 5-9 5-9-5 9-5Z" stroke-linejoin="round" />
          <path d="m3 13 9 5 9-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div class="flex gap-3">
        <button
          type="button"
          class="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange shadow-md dark:bg-neutral-800"
          aria-label="Filtre"
          @click="isFilterModalOpen = true"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          class="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange shadow-md dark:bg-neutral-800"
          aria-label="Konumuma git"
          @click="handleLocateClick"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <MapLayerSelectModal v-model="isLayerModalOpen" />
    <MapFilterModal v-model="isFilterModalOpen" />
    <MapPoiSummaryCard
      v-if="selectedLocation"
      :location="selectedLocation"
      :user-location="userLocation"
      @close="closeSummaryCard"
    />
  </div>

  <!-- Tasarım sistemi doğrulaması: 9 POI kategori rengi (PRD 6.1) -->
  <section class="px-4 py-5">
    <h2 class="mb-3 text-sm font-bold text-brand-charcoal/70 dark:text-neutral-300">
      Konum Türü Renk Paleti
    </h2>
    <div class="kl-card grid grid-cols-2 gap-x-4 gap-y-3 p-4 sm:grid-cols-3">
      <div v-for="item in poiLegend" :key="item.type" class="flex items-center gap-2">
        <span class="h-3.5 w-3.5 shrink-0 rounded-full" :class="`bg-poi-${item.type}`" />
        <span class="text-xs text-brand-charcoal dark:text-neutral-200">{{ item.label }}</span>
      </div>
    </div>
  </section>
</template>
