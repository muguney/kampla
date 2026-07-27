<script setup lang="ts">
/**
 * Rota (Faz 12 "Rota Motoru", PHASES.md). SADECE UI/UX iskeleti — gerçek bir
 * routing servisine (Valhalla/OSRM) HİÇ bağlanmaz. Hangi servisin kullanılacağı
 * üçüncü taraf hizmet seçimi olduğu için Mustafa'nın onayını bekliyor
 * (bkz. DECISIONS.md, ayrı bir görevde ele alınıyor). Bu sayfada gösterilen
 * rota çizgisi, mesafe ve süre tamamen SABİT/MOCK değerlerdir — POI'nin
 * kendisinden ~5km kuzeybatısında uydurma bir "başlangıç" noktası türetilir ve
 * aradaki basit bir GeoJSON LineString çizilir. Gerçek entegrasyon geldiğinde
 * bu sayfadaki mock veri üretimi (bkz. `MOCK_START_OFFSET_*`, `mockRouteGeoJson`,
 * `mockDistanceLabel`/`mockDurationLabel`) gerçek API çağrısıyla değiştirilecek;
 * harita kurulum deseni `components/poi/PoiDetailsTab.vue`'daki mini harita
 * instance'ından (bkz. `initMiniMap`) reuse edildi.
 */
import maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";
import { MOCK_LOCATIONS, poiColors, type MockLocationCard } from "@kampla/shared";
import { getMapStyle } from "~/composables/useMap";

definePageMeta({ layout: "auth" });

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const location = computed<MockLocationCard | undefined>(() =>
  MOCK_LOCATIONS.find((loc) => loc.id === route.params.id)
);

usePageTitle("pages.route.title");

function goBack() {
  const id = route.params.id as string;
  if (import.meta.client && window.history.length > 1) {
    router.back();
  } else {
    router.push(`/konum/${id}`);
  }
}

// --- MOCK rota üretimi (gerçek routing servisi bağlanana kadar sabit/uydurma) ---
// POI'nin ~5km kuzeybatısında uydurma bir "başlangıç" noktası (bkz. dosya başı not).
// 1° enlem ≈ 111 km, bu enlem bandında 1° boylam ≈ 89 km — 0.032°/0.039° offset'i
// yaklaşık 5 km'lik bir kuzeybatı mesafesi verir (sadece görsel amaçlı, hassas değil).
const MOCK_START_OFFSET_LAT = 0.032;
const MOCK_START_OFFSET_LNG = -0.039;

const mockStartPoint = computed(() => {
  if (!location.value) return null;
  return {
    lat: location.value.lat + MOCK_START_OFFSET_LAT,
    lng: location.value.lng + MOCK_START_OFFSET_LNG,
  };
});

/** Basit/sabit bir GeoJSON LineString — düz bir çizgi yerine hafif bir kırılma
 * noktasıyla "rota" hissi verir, ama tamamen uydurmadır (gerçek yol verisi değil). */
const mockRouteGeoJson = computed<GeoJSON.Feature<GeoJSON.LineString> | null>(() => {
  const start = mockStartPoint.value;
  const end = location.value;
  if (!start || !end) return null;
  const midLat = (start.lat + end.lat) / 2 + 0.01;
  const midLng = (start.lng + end.lng) / 2 - 0.006;
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [start.lng, start.lat],
        [midLng, midLat],
        [end.lng, end.lat],
      ],
    },
  };
});

// Sabit/mock tahmini değerler — gerçek servis entegre edilene kadar değişmez.
const mockDistanceLabel = "~5.2 km";
const mockDurationLabel = "~12 dk";

// --- Mini harita (bkz. components/poi/PoiDetailsTab.vue -> initMiniMap deseni) ---
const mapContainer = ref<HTMLElement | null>(null);
let map: MapLibreMap | null = null;
const routeMarkers: MapLibreMarker[] = [];

function initRouteMap() {
  if (!mapContainer.value || !location.value || !mockStartPoint.value) return;
  const config = useRuntimeConfig();
  const instance = new maplibregl.Map({
    container: mapContainer.value,
    style: getMapStyle("classic", config.public.maptilerKey as string | undefined),
    center: [location.value.lng, location.value.lat],
    zoom: 11,
    attributionControl: { compact: true },
  });

  instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

  instance.on("load", () => {
    if (!location.value || !mockStartPoint.value || !mockRouteGeoJson.value) return;

    instance.addSource("mock-route", {
      type: "geojson",
      data: mockRouteGeoJson.value,
    });
    instance.addLayer({
      id: "mock-route-line",
      type: "line",
      source: "mock-route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#FE8542",
        "line-width": 4,
        "line-dasharray": [0.001, 0], // düz çizgi; ileride gerçek rotada kaldırılabilir
      },
    });

    // Başlangıç (mock) noktası
    const startEl = document.createElement("div");
    startEl.className =
      "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-charcoal text-[10px] font-bold text-white shadow-md";
    startEl.textContent = "A";
    routeMarkers.push(
      new maplibregl.Marker({ element: startEl })
        .setLngLat([mockStartPoint.value.lng, mockStartPoint.value.lat])
        .addTo(instance)
    );

    // Varış (POI) noktası
    const endEl = document.createElement("div");
    endEl.className = "kampla-poi-marker";
    endEl.style.backgroundColor = location.value.location_type
      ? poiColors[location.value.location_type]
      : "#FE8542";
    endEl.textContent = "B";
    routeMarkers.push(
      new maplibregl.Marker({ element: endEl })
        .setLngLat([location.value.lng, location.value.lat])
        .addTo(instance)
    );

    const bounds = new maplibregl.LngLatBounds(
      [mockStartPoint.value.lng, mockStartPoint.value.lat],
      [mockStartPoint.value.lng, mockStartPoint.value.lat]
    );
    bounds.extend([location.value.lng, location.value.lat]);
    instance.fitBounds(bounds, { padding: 56, maxZoom: 13, duration: 0 });
  });

  map = instance;
}

onMounted(() => {
  initRouteMap();
});

onBeforeUnmount(() => {
  routeMarkers.forEach((marker) => marker.remove());
  map?.remove();
  map = null;
});
</script>

<template>
  <div v-if="location" class="relative flex min-h-screen flex-col pb-8">
    <!-- Üst bar: geri dön -->
    <div class="flex items-center gap-3 px-4 pb-2 pt-4">
      <button
        type="button"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-charcoal shadow-sm dark:bg-neutral-800 dark:text-neutral-100"
        :aria-label="t('pages.route.back')"
        @click="goBack"
      >
        ←
      </button>
      <div class="min-w-0">
        <h1 class="truncate text-base font-bold text-brand-charcoal dark:text-neutral-100">
          {{ t("pages.route.title") }}
        </h1>
        <p class="truncate text-xs text-brand-charcoal/60 dark:text-neutral-400">{{ location.name }}</p>
      </div>
    </div>

    <!-- Uyarı/bilgi kutusu: bu bir örnek/mock rota gösterimidir -->
    <div class="mx-4 mb-3 flex items-start gap-2.5 rounded-control border border-brand-orange/30 bg-brand-orange/10 px-4 py-3">
      <span class="text-lg leading-none">⚠️</span>
      <p class="text-xs font-medium leading-relaxed text-brand-charcoal dark:text-neutral-200">
        {{ t("pages.route.mockNotice") }}
      </p>
    </div>

    <!-- Mini harita + mock rota -->
    <div class="mx-4 overflow-hidden rounded-control bg-neutral-100 dark:bg-neutral-800">
      <div ref="mapContainer" class="kampla-map-container relative h-64 w-full" />
    </div>

    <!-- Mock mesafe/süre kartları -->
    <div class="mx-4 mt-4 grid grid-cols-2 gap-3">
      <div class="kl-card flex flex-col items-center gap-1 py-4 text-center">
        <span class="text-xl">📏</span>
        <p class="text-xs font-semibold text-brand-charcoal/60 dark:text-neutral-400">
          {{ t("pages.route.distanceLabel") }}
        </p>
        <p class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">{{ mockDistanceLabel }}</p>
      </div>
      <div class="kl-card flex flex-col items-center gap-1 py-4 text-center">
        <span class="text-xl">⏱️</span>
        <p class="text-xs font-semibold text-brand-charcoal/60 dark:text-neutral-400">
          {{ t("pages.route.durationLabel") }}
        </p>
        <p class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">{{ mockDurationLabel }}</p>
      </div>
    </div>

    <!-- Başlangıç/varış özeti -->
    <div class="mx-4 mt-4 space-y-2">
      <div class="flex items-center gap-2.5 rounded-control bg-neutral-100 px-4 py-2.5 dark:bg-neutral-800">
        <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-charcoal text-[10px] font-bold text-white">A</span>
        <span class="text-xs font-medium text-brand-charcoal/70 dark:text-neutral-300">{{ t("pages.route.startLabel") }}</span>
      </div>
      <div class="flex items-center gap-2.5 rounded-control bg-neutral-100 px-4 py-2.5 dark:bg-neutral-800">
        <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">B</span>
        <span class="text-xs font-medium text-brand-charcoal/70 dark:text-neutral-300">
          {{ t("pages.route.endLabel") }}: {{ location.name }}
        </span>
      </div>
    </div>

    <button type="button" class="kl-btn-primary mx-4 mt-6" @click="goBack">
      {{ t("pages.route.back") }}
    </button>
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
      :title="t('pages.route.notFound.title')"
      :cta-label="t('pages.route.notFound.cta')"
      cta-to="/"
    />
  </div>
</template>
