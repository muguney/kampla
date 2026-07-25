<script setup lang="ts">
/**
 * Konum Ekle — Adım 1: Konum Seç (PRD 5.G, design/18-Konum Ekle - Konum Seç.png).
 *
 * Ana harita singleton'ından (composables/useMap.ts `useState`) bağımsız,
 * kendi MapLibre instance'ını kuran bir mini harita kullanır — aynı desen
 * `components/poi/PoiDetailsTab.vue` "Mini harita" bölümünde uygulanmıştı
 * (orada salt okunur/önizleme, burada etkileşimli).
 *
 * UX kararı: PRD'de "sürükle/bırak" olarak anılan ama en yaygın/basit
 * uygulaması olan "sabit merkez pin + haritayı kaydır" deseni kullanıldı.
 * Kullanıcı haritayı kaydırdıkça `moveend` event'inde merkez koordinatı
 * okunup `useLocationWizardStore().lat/lng` alanlarına yazılır.
 */
import maplibregl from "maplibre-gl";
import type { Map as MapLibreMap } from "maplibre-gl";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, USER_LOCATION_ZOOM, getMapStyle } from "~/composables/useMap";
import { useLocationWizardStore } from "~/stores/locationWizard";

const { t } = useI18n();
const wizard = useLocationWizardStore();

const mapContainer = ref<HTMLElement | null>(null);
let map: MapLibreMap | null = null;

const isLocating = ref(false);
const locationError = ref(false);

/** Haritanın güncel merkezini store'a yazar (moveend / ilk yükleme). */
function readCenterIntoStore() {
  if (!map) return;
  const center = map.getCenter();
  wizard.lat = Math.round(center.lat * 1e6) / 1e6;
  wizard.lng = Math.round(center.lng * 1e6) / 1e6;
}

/** "GPS ile otomatik konumlandır" — tarayıcı Geolocation API'si. */
function requestGpsLocation() {
  if (!import.meta.client || !navigator.geolocation) {
    locationError.value = true;
    return;
  }
  isLocating.value = true;
  locationError.value = false;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      isLocating.value = false;
      const { latitude, longitude } = position.coords;
      map?.flyTo({ center: [longitude, latitude], zoom: USER_LOCATION_ZOOM, essential: true });
      // flyTo tamamlanınca `moveend` merkezi zaten senkronlayacak; anında geri
      // bildirim (alttaki koordinat metni) için store'u burada da güncelliyoruz.
      wizard.lat = latitude;
      wizard.lng = longitude;
    },
    () => {
      isLocating.value = false;
      locationError.value = true;
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
  );
}

onMounted(() => {
  if (!mapContainer.value) return;
  const config = useRuntimeConfig();
  const hasSelection = wizard.lat !== null && wizard.lng !== null;
  const initialCenter: [number, number] = hasSelection
    ? [wizard.lng as number, wizard.lat as number]
    : DEFAULT_MAP_CENTER;

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: getMapStyle("classic", config.public.maptilerKey as string | undefined),
    center: initialCenter,
    zoom: hasSelection ? USER_LOCATION_ZOOM : DEFAULT_MAP_ZOOM,
    attributionControl: { compact: true },
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

  map.on("load", () => {
    // Kullanıcı hiç kaydırmasa bile ilk merkez geçerli bir seçim sayılır,
    // böylece "Devam Et" haritayı hiç dokunmadan da aktif olabilir.
    readCenterIntoStore();
  });
  map.on("moveend", readCenterIntoStore);
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-brand-charcoal/70 dark:text-neutral-300">
      {{ t("wizard.locationStep.hint") }}
    </p>

    <div class="relative h-64 w-full overflow-hidden rounded-control bg-neutral-100 dark:bg-neutral-800">
      <div ref="mapContainer" class="absolute inset-0" />
      <!-- Sabit merkez pin'i — harita hareket eder, pin ekranda sabit kalır. -->
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-4xl drop-shadow-lg"
      >
        📍
      </div>
    </div>

    <button type="button" class="kl-btn-outline" :disabled="isLocating" @click="requestGpsLocation">
      <span v-if="isLocating">⏳</span>
      <span v-else>📡</span>
      {{ isLocating ? t("wizard.locationStep.locating") : t("wizard.locationStep.gpsButton") }}
    </button>

    <p v-if="locationError" class="text-xs font-medium text-red-500 dark:text-red-400">
      {{ t("wizard.locationStep.locationError") }}
    </p>

    <p class="text-center text-xs font-medium text-brand-charcoal/60 dark:text-neutral-400">
      <template v-if="wizard.lat !== null && wizard.lng !== null">
        {{ t("wizard.locationStep.coordinatesLabel", { lat: wizard.lat.toFixed(5), lng: wizard.lng.toFixed(5) }) }}
      </template>
      <template v-else>
        {{ t("wizard.locationStep.coordinatesEmpty") }}
      </template>
    </p>
  </div>
</template>
