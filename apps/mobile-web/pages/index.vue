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

const { t } = useI18n();

const {
  initMap,
  destroyMap,
  flyToUserLocation,
  flyToCoordinates,
  requestUserLocation,
  userLocation,
  isOfflineFallbackActive,
  map: mapState,
} = useMap();

const route = useRoute();
const filtersStore = useFiltersStore();

const mapContainer = ref<HTMLElement | null>(null);
const isLayerModalOpen = ref(false);
const isFilterModalOpen = ref(false);
const isOfflineModalOpen = ref(false);
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

    <!-- Bağlantı kesilip indirilmiş bir bölgenin pmtiles kaynağına geçildiğinde
         gösterilen basit rozet (bkz. composables/useMap.ts → isOfflineFallbackActive,
         Faz 11 offline fallback). -->
    <div
      v-if="isOfflineFallbackActive"
      class="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-brand-charcoal/90 px-3 py-1.5 text-xs font-semibold text-white shadow-md dark:bg-neutral-800"
    >
      {{ t("map.offlineModal.offlineActiveBadge") }}
    </div>

    <!-- Liste görünümüne geçiş (Figma node 52:218: buttonWithIcon, #fe8542,
         rounded-[20px], shadow 0 4px 3px rgba(0,0,0,.09)) — ikon design/icons-export/list.svg -->
    <NuxtLink
      to="/liste"
      class="absolute right-4 top-[50px] z-20 flex items-center gap-2 rounded-[20px] bg-brand-orange px-5 py-2.5 text-base font-semibold text-white shadow-[0_4px_3px_rgba(0,0,0,0.09)]"
    >
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H6C6.26522 6 6.51957 6.10536 6.70711 6.29289C6.89464 6.48043 7 6.73478 7 7C7 7.26522 6.89464 7.51957 6.70711 7.70711C6.51957 7.89464 6.26522 8 6 8H5C4.73478 8 4.48043 7.89464 4.29289 7.70711C4.10536 7.51957 4 7.26522 4 7ZM9 7C9 6.73478 9.10536 6.48043 9.29289 6.29289C9.48043 6.10536 9.73478 6 10 6H19C19.2652 6 19.5196 6.10536 19.7071 6.29289C19.8946 6.48043 20 6.73478 20 7C20 7.26522 19.8946 7.51957 19.7071 7.70711C19.5196 7.89464 19.2652 8 19 8H10C9.73478 8 9.48043 7.89464 9.29289 7.70711C9.10536 7.51957 9 7.26522 9 7ZM4 12C4 11.7348 4.10536 11.4804 4.29289 11.2929C4.48043 11.1054 4.73478 11 5 11H6C6.26522 11 6.51957 11.1054 6.70711 11.2929C6.89464 11.4804 7 11.7348 7 12C7 12.2652 6.89464 12.5196 6.70711 12.7071C6.51957 12.8946 6.26522 13 6 13H5C4.73478 13 4.48043 12.8946 4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12ZM9 12C9 11.7348 9.10536 11.4804 9.29289 11.2929C9.48043 11.1054 9.73478 11 10 11H19C19.2652 11 19.5196 11.1054 19.7071 11.2929C19.8946 11.4804 20 11.7348 20 12C20 12.2652 19.8946 12.5196 19.7071 12.7071C19.5196 12.8946 19.2652 13 19 13H10C9.73478 13 9.48043 12.8946 9.29289 12.7071C9.10536 12.5196 9 12.2652 9 12ZM4 17C4 16.7348 4.10536 16.4804 4.29289 16.2929C4.48043 16.1054 4.73478 16 5 16H6C6.26522 16 6.51957 16.1054 6.70711 16.2929C6.89464 16.4804 7 16.7348 7 17C7 17.2652 6.89464 17.5196 6.70711 17.7071C6.51957 17.8946 6.26522 18 6 18H5C4.73478 18 4.48043 17.8946 4.29289 17.7071C4.10536 17.5196 4 17.2652 4 17ZM9 17C9 16.7348 9.10536 16.4804 9.29289 16.2929C9.48043 16.1054 9.73478 16 10 16H19C19.2652 16 19.5196 16.1054 19.7071 16.2929C19.8946 16.4804 20 16.7348 20 17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H10C9.73478 18 9.48043 17.8946 9.29289 17.7071C9.10536 17.5196 9 17.2652 9 17Z" fill="currentColor"/>
      </svg>
      Liste
    </NuxtLink>

    <!-- Katman / Filtre / Konumum butonları (Figma node 52:218 alt kısmı, ~60px çap) -->
    <div class="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between">
      <div class="flex flex-col gap-3">
        <!-- "Bölgeyi Çevrimdışı İndir" (PRD 5.B, 5.P, 7.1 — Faz 11) — bkz.
             components/map/OfflineMapModal.vue (Premium kilitli, useOfflineMap.ts).
             NOT: design/icons-export/ altında bu buton için ayrı bir "indir/download"
             glifi yok (118 dosya arasında yok) — bu ikon hâlâ elle yakınsanmış bir
             yaklaşıklık, gerçek export değil (bkz. BLOCKERS.md). -->
        <button
          type="button"
          class="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange shadow-md dark:bg-neutral-800"
          aria-label="Bölgeyi çevrimdışı indir"
          @click="isOfflineModalOpen = true"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 3v12m0 0-4-4m4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          class="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange shadow-md dark:bg-neutral-800"
          aria-label="Harita katmanı"
          @click="isLayerModalOpen = true"
        >
          <!-- design/icons-export/layer.svg -->
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.73425 10.2638C5.24475 9.66825 4.5 9.3705 4.5 9C4.5 8.6295 5.24475 8.3325 6.73425 7.73625L8.84025 6.894C10.3298 6.29775 11.0753 6 12 6C12.9255 6 13.6703 6.29775 15.1598 6.894L17.2658 7.73625C18.7553 8.33175 19.5 8.6295 19.5 9C19.5 9.3705 18.7553 9.6675 17.2658 10.2638L15.1598 11.106C13.6703 11.703 12.9248 12 12 12C11.0745 12 10.3298 11.7023 8.84025 11.1068L6.735 10.263L6.73425 10.2638Z" stroke="currentColor" stroke-width="1.125" />
            <path d="M19.5 12C19.5 12 18.7553 12.6675 17.2658 13.2638L15.1598 14.106C13.6703 14.703 12.9248 15 12 15C11.0745 15 10.3298 14.7023 8.84025 14.1068L6.735 13.263C5.24475 12.6683 4.5 12 4.5 12M19.5 15C19.5 15 18.7553 15.6675 17.2658 16.2637L15.1598 17.106C13.6703 17.703 12.9248 18 12 18C11.0745 18 10.3298 17.7023 8.84025 17.106L6.735 16.2637C5.24475 15.6682 4.5 15 4.5 15" stroke="currentColor" stroke-width="1.125" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          class="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange shadow-md dark:bg-neutral-800"
          aria-label="Filtre"
          @click="isFilterModalOpen = true"
        >
          <!-- design/icons-export/filter.svg -->
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.375 5.77947C9.14294 5.77947 8.92038 5.8731 8.75628 6.03975C8.59219 6.2064 8.5 6.43243 8.5 6.66812C8.5 6.9038 8.59219 7.12983 8.75628 7.29649C8.92038 7.46314 9.14294 7.55677 9.375 7.55677C9.60706 7.55677 9.82962 7.46314 9.99372 7.29649C10.1578 7.12983 10.25 6.9038 10.25 6.66812C10.25 6.43243 10.1578 6.2064 9.99372 6.03975C9.82962 5.8731 9.60706 5.77947 9.375 5.77947ZM6.89875 5.77947C7.07953 5.25914 7.41477 4.80857 7.85827 4.48986C8.30178 4.17115 8.8317 4 9.375 4C9.9183 4 10.4482 4.17115 10.8917 4.48986C11.3352 4.80857 11.6705 5.25914 11.8512 5.77947H18.125C18.3571 5.77947 18.5796 5.8731 18.7437 6.03975C18.9078 6.2064 19 6.43243 19 6.66812C19 6.9038 18.9078 7.12983 18.7437 7.29649C18.5796 7.46314 18.3571 7.55677 18.125 7.55677H11.8512C11.6705 8.0771 11.3352 8.52767 10.8917 8.84638C10.4482 9.16509 9.9183 9.33624 9.375 9.33624C8.8317 9.33624 8.30178 9.16509 7.85827 8.84638C7.41477 8.52767 7.07953 8.0771 6.89875 7.55677H5.875C5.64294 7.55677 5.42038 7.46314 5.25628 7.29649C5.09219 7.12983 5 6.9038 5 6.66812C5 6.43243 5.09219 6.2064 5.25628 6.03975C5.42038 5.8731 5.64294 5.77947 5.875 5.77947H6.89875ZM14.625 11.1114C14.3929 11.1114 14.1704 11.205 14.0063 11.3716C13.8422 11.5383 13.75 11.7643 13.75 12C13.75 12.2357 13.8422 12.4617 14.0063 12.6284C14.1704 12.795 14.3929 12.8886 14.625 12.8886C14.8571 12.8886 15.0796 12.795 15.2437 12.6284C15.4078 12.4617 15.5 12.2357 15.5 12C15.5 11.7643 15.4078 11.5383 15.2437 11.3716C15.0796 11.205 14.8571 11.1114 14.625 11.1114ZM12.1488 11.1114C12.3295 10.591 12.6648 10.1404 13.1083 9.82174C13.5518 9.50303 14.0817 9.33188 14.625 9.33188C15.1683 9.33188 15.6982 9.50303 16.1417 9.82174C16.5852 10.1404 16.9205 10.591 17.1012 11.1114H18.125C18.3571 11.1114 18.5796 11.205 18.7437 11.3716C18.9078 11.5383 19 11.7643 19 12C19 12.2357 18.9078 12.4617 18.7437 12.6284C18.5796 12.795 18.3571 12.8886 18.125 12.8886H17.1012C16.9205 13.409 16.5852 13.8596 16.1417 14.1783C15.6982 14.497 15.1683 14.6681 14.625 14.6681C14.0817 14.6681 13.5518 14.497 13.1083 14.1783C12.6648 13.8596 12.3295 13.409 12.1488 12.8886H5.875C5.64294 12.8886 5.42038 12.795 5.25628 12.6284C5.09219 12.4617 5 12.2357 5 12C5 11.7643 5.09219 11.5383 5.25628 11.3716C5.42038 11.205 5.64294 11.1114 5.875 11.1114H12.1488ZM9.375 16.4432C9.14294 16.4432 8.92038 16.5369 8.75628 16.7035C8.59219 16.8702 8.5 17.0962 8.5 17.3319C8.5 17.5676 8.59219 17.7936 8.75628 17.9603C8.92038 18.1269 9.14294 18.2205 9.375 18.2205C9.60706 18.2205 9.82962 18.1269 9.99372 17.9603C10.1578 17.7936 10.25 17.5676 10.25 17.3319C10.25 17.0962 10.1578 16.8702 9.99372 16.7035C9.82962 16.5369 9.60706 16.4432 9.375 16.4432ZM6.89875 16.4432C7.07953 15.9229 7.41477 15.4723 7.85827 15.1536C8.30178 14.8349 8.8317 14.6638 9.375 14.6638C9.9183 14.6638 10.4482 14.8349 10.8917 15.1536C11.3352 15.4723 11.6705 15.9229 11.8512 16.4432H18.125C18.3571 16.4432 18.5796 16.5369 18.7437 16.7035C18.9078 16.8702 19 17.0962 19 17.3319C19 17.5676 18.9078 17.7936 18.7437 17.9603C18.5796 18.1269 18.3571 18.2205 18.125 18.2205H11.8512C11.6705 18.7409 11.3352 19.1914 10.8917 19.5101C10.4482 19.8288 9.9183 20 9.375 20C8.8317 20 8.30178 19.8288 7.85827 19.5101C7.41477 19.1914 7.07953 18.7409 6.89875 18.2205H5.875C5.64294 18.2205 5.42038 18.1269 5.25628 17.9603C5.09219 17.7936 5 17.5676 5 17.3319C5 17.0962 5.09219 16.8702 5.25628 16.7035C5.42038 16.5369 5.64294 16.4432 5.875 16.4432H6.89875Z" fill="currentColor" />
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
          <!-- design/icons-export/here.svg -->
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.3504 12.8C18.1723 14.2099 17.5303 15.5205 16.5254 16.5254C15.5205 17.5303 14.2099 18.1723 12.8 18.3504V20H11.2V18.3504C9.79009 18.1723 8.47947 17.5303 7.47459 16.5254C6.46971 15.5205 5.82767 14.2099 5.6496 12.8H4V11.2H5.6496C5.82767 9.79009 6.46971 8.47947 7.47459 7.47459C8.47947 6.46971 9.79009 5.82767 11.2 5.6496V4H12.8V5.6496C14.2099 5.82767 15.5205 6.46971 16.5254 7.47459C17.5303 8.47947 18.1723 9.79009 18.3504 11.2H20V12.8H18.3504ZM12 16.8C13.273 16.8 14.4939 16.2943 15.3941 15.3941C16.2943 14.4939 16.8 13.273 16.8 12C16.8 10.727 16.2943 9.50606 15.3941 8.60589C14.4939 7.70571 13.273 7.2 12 7.2C10.727 7.2 9.50606 7.70571 8.60589 8.60589C7.70571 9.50606 7.2 10.727 7.2 12C7.2 13.273 7.70571 14.4939 8.60589 15.3941C9.50606 16.2943 10.727 16.8 12 16.8ZM12 14.4C12.6365 14.4 13.247 14.1471 13.6971 13.6971C14.1471 13.247 14.4 12.6365 14.4 12C14.4 11.3635 14.1471 10.753 13.6971 10.3029C13.247 9.85286 12.6365 9.6 12 9.6C11.3635 9.6 10.753 9.85286 10.3029 10.3029C9.85286 10.753 9.6 11.3635 9.6 12C9.6 12.6365 9.85286 13.247 10.3029 13.6971C10.753 14.1471 11.3635 14.4 12 14.4Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

    <MapLayerSelectModal v-model="isLayerModalOpen" />
    <MapFilterModal v-model="isFilterModalOpen" />
    <MapOfflineMapModal v-model="isOfflineModalOpen" />
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
