<script setup lang="ts">
/**
 * POI Detay — "Detaylar" sekmesi (PRD 5.F, design/11-Poi Detay.png).
 * İmkan/hizmet ikon grid'i, açıklama, iletişim ikonları, kamp imkanları
 * rozetleri, sezon, koordinat kopyalama, mini harita (çevredeki diğer POI'lerle
 * birlikte) ve "Hata Bildir"/"Düzenle" aksiyonları. Salt okunur (Faz 3) —
 * "Düzenle" yalnızca konumu ekleyen kullanıcıya görünür, hedef sayfa placeholder.
 */
import maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";
import {
  ACCOMMODATION_BADGE_LABELS_EN,
  ACCOMMODATION_BADGE_LABELS_TR,
  ACCOMMODATION_TYPES,
  AMENITY_LABELS_EN,
  AMENITY_LABELS_TR,
  MOCK_LOCATIONS,
  SEASON_LABELS_EN,
  SEASON_LABELS_TR,
  distanceKm,
  poiColors,
  type AccommodationType,
  type Amenity,
  type MockLocationCard,
} from "@kampla/shared";
import { getMapStyle } from "~/composables/useMap";

const props = defineProps<{ location: MockLocationCard }>();

const { t, locale } = useI18n();
const authStore = useAuthStore();

/** Sunum amaçlı emoji ikon eşlemesi — şema/i18n'e bağlı değildir, yalnızca bu bileşende yaşar. */
const AMENITY_ICONS: Record<Amenity, string> = {
  shower: "🚿",
  electricity: "⚡",
  fridge: "🧊",
  "vehicle-entry": "🚐",
  "hot-shower": "♨️",
  "near-sea": "🌊",
  "campfire-grill": "🔥",
  "pet-friendly": "🐾",
  "washing-machine": "🧺",
  "paid-general": "💰",
  "gsm-signal": "📶",
  "toilet-drain": "🚽",
  "water-fill": "🚰",
  "caravan-waste-drain": "♻️",
  "free-wifi": "📡",
  toilet: "🚻",
  "market-nearby": "🛒",
  playground: "🧸",
  dryer: "🌀",
};

const ACCOMMODATION_ICONS: Record<AccommodationType, string> = {
  caravan: "🚐",
  tent: "⛺",
  bungalow: "🏡",
};

function amenityLabel(amenity: Amenity): string {
  return locale.value === "en" ? AMENITY_LABELS_EN[amenity] : AMENITY_LABELS_TR[amenity];
}

function accommodationLabel(type: AccommodationType): string {
  return locale.value === "en" ? ACCOMMODATION_BADGE_LABELS_EN[type] : ACCOMMODATION_BADGE_LABELS_TR[type];
}

const seasonLabel = computed(() => {
  const season = props.location.season;
  if (!season) return "";
  return locale.value === "en" ? SEASON_LABELS_EN[season] : SEASON_LABELS_TR[season];
});

/** Tıklanan imkan ikonunun tooltip'i (bkz. design/11-Poi Detay.png "Kurutma Makinesi" balonu). */
const activeTooltip = ref<Amenity | null>(null);
function toggleTooltip(amenity: Amenity) {
  activeTooltip.value = activeTooltip.value === amenity ? null : amenity;
}

const hasContact = computed(() => {
  const l = props.location;
  return !!(l.phone || l.website_url || l.facebook_url || l.instagram_url || l.youtube_url || l.x_url);
});

const coordinatesLabel = computed(() =>
  t("pages.poiDetail.coordinatesLabel", {
    lat: props.location.lat.toFixed(4),
    lng: props.location.lng.toFixed(4),
  })
);

const copied = ref(false);
async function copyCoordinates() {
  const text = `${props.location.lat}, ${props.location.lng}`;
  try {
    if (import.meta.client && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  } catch {
    // Clipboard API kullanılamıyorsa (izin yok / güvenli olmayan bağlam) sessizce yoksay.
  }
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1500);
}

const canEdit = computed(
  () => !!authStore.profile && !!props.location.created_by && authStore.profile.id === props.location.created_by
);

const isReportModalOpen = ref(false);

// --- Mini harita (etkileşimsiz önizleme, çevredeki diğer POI'lerle birlikte) ---
const miniMapContainer = ref<HTMLElement | null>(null);
let miniMap: MapLibreMap | null = null;
const miniMapMarkers: MapLibreMarker[] = [];

const nearbyLocations = computed(() =>
  MOCK_LOCATIONS.filter((loc) => loc.id !== props.location.id && loc.location_type)
    .map((loc) => ({ loc, distance: distanceKm(props.location, loc) }))
    .filter((entry) => entry.distance <= 30)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6)
    .map((entry) => entry.loc)
);

function initMiniMap() {
  if (!miniMapContainer.value || !props.location.location_type) return;
  const config = useRuntimeConfig();
  const map = new maplibregl.Map({
    container: miniMapContainer.value,
    style: getMapStyle("classic", config.public.maptilerKey as string | undefined),
    center: [props.location.lng, props.location.lat],
    zoom: 11,
    interactive: false,
    attributionControl: { compact: true },
  });

  map.on("load", () => {
    const mainEl = document.createElement("div");
    mainEl.className = "kampla-poi-marker";
    mainEl.style.backgroundColor = poiColors[props.location.location_type!];
    miniMapMarkers.push(new maplibregl.Marker({ element: mainEl }).setLngLat([props.location.lng, props.location.lat]).addTo(map));

    nearbyLocations.value.forEach((loc) => {
      const el = document.createElement("div");
      el.className = "h-3 w-3 rounded-full border-2 border-white shadow";
      el.style.backgroundColor = poiColors[loc.location_type!];
      miniMapMarkers.push(new maplibregl.Marker({ element: el }).setLngLat([loc.lng, loc.lat]).addTo(map));
    });
  });

  miniMap = map;
}

onMounted(() => {
  initMiniMap();
});

onBeforeUnmount(() => {
  miniMapMarkers.forEach((marker) => marker.remove());
  miniMap?.remove();
  miniMap = null;
});
</script>

<template>
  <div class="flex flex-col gap-6 px-4 py-5">
    <!-- İmkan/hizmet ikon grid'i -->
    <section v-if="location.amenities.length > 0">
      <h2 class="mb-3 text-sm font-bold text-brand-charcoal/70 dark:text-neutral-300">
        {{ t("pages.poiDetail.amenitiesTitle") }}
      </h2>
      <div class="grid grid-cols-4 gap-4 sm:grid-cols-6">
        <div v-for="amenity in location.amenities" :key="amenity" class="relative flex justify-center">
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-control bg-emerald-500/90 text-xl text-white shadow-sm transition-transform hover:scale-105"
            :aria-label="amenityLabel(amenity)"
            @click="toggleTooltip(amenity)"
          >
            {{ AMENITY_ICONS[amenity] }}
          </button>
          <Transition name="kampla-fade">
            <span
              v-if="activeTooltip === amenity"
              class="absolute -top-9 z-10 whitespace-nowrap rounded-md bg-brand-charcoal px-2 py-1 text-[11px] font-medium text-white shadow-lg dark:bg-neutral-700"
            >
              {{ amenityLabel(amenity) }}
            </span>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Açıklama -->
    <section v-if="location.description">
      <h2 class="mb-2 text-sm font-bold text-brand-charcoal/70 dark:text-neutral-300">
        {{ t("pages.poiDetail.description") }}
      </h2>
      <p class="text-sm leading-relaxed text-brand-charcoal/90 dark:text-neutral-200">
        {{ location.description }}
      </p>
    </section>

    <!-- İletişim -->
    <section v-if="hasContact">
      <h2 class="mb-3 text-sm font-bold text-brand-charcoal/70 dark:text-neutral-300">
        {{ t("pages.poiDetail.contact") }}
      </h2>
      <div class="flex flex-wrap gap-3">
        <a
          v-if="location.phone"
          :href="`tel:${location.phone}`"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg dark:bg-neutral-800"
          :aria-label="t('pages.poiDetail.contactIcons.phone')"
        >📞</a>
        <a
          v-if="location.website_url"
          :href="location.website_url"
          target="_blank"
          rel="noopener"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg dark:bg-neutral-800"
          :aria-label="t('pages.poiDetail.contactIcons.website')"
        >🔗</a>
        <a
          v-if="location.facebook_url"
          :href="location.facebook_url"
          target="_blank"
          rel="noopener"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg dark:bg-neutral-800"
          :aria-label="t('pages.poiDetail.contactIcons.facebook')"
        >📘</a>
        <a
          v-if="location.instagram_url"
          :href="location.instagram_url"
          target="_blank"
          rel="noopener"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg dark:bg-neutral-800"
          :aria-label="t('pages.poiDetail.contactIcons.instagram')"
        >📸</a>
        <a
          v-if="location.youtube_url"
          :href="location.youtube_url"
          target="_blank"
          rel="noopener"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg dark:bg-neutral-800"
          :aria-label="t('pages.poiDetail.contactIcons.youtube')"
        >▶️</a>
        <a
          v-if="location.x_url"
          :href="location.x_url"
          target="_blank"
          rel="noopener"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg dark:bg-neutral-800"
          :aria-label="t('pages.poiDetail.contactIcons.x')"
        >✖️</a>
      </div>
    </section>

    <!-- Kamp imkanları rozetleri -->
    <section v-if="location.accommodation_types.length > 0">
      <h2 class="mb-3 text-sm font-bold text-brand-charcoal/70 dark:text-neutral-300">
        {{ t("pages.poiDetail.accommodations") }}
      </h2>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="type in ACCOMMODATION_TYPES"
          :key="type"
          class="flex flex-col items-center gap-1 rounded-control border-2 px-4 py-2.5 text-center"
          :class="
            location.accommodation_types.includes(type)
              ? 'border-brand-orange bg-brand-orange/10'
              : 'border-neutral-200 bg-white text-brand-charcoal/40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500'
          "
        >
          <span class="text-xl">{{ ACCOMMODATION_ICONS[type] }}</span>
          <span class="text-xs font-semibold">{{ accommodationLabel(type) }}</span>
        </div>
      </div>
    </section>

    <!-- Sezon -->
    <section v-if="location.season">
      <div class="flex items-center gap-3 rounded-control bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
        <span class="text-lg">📅</span>
        <span class="text-sm font-medium text-brand-charcoal dark:text-neutral-200">{{ seasonLabel }}</span>
      </div>
    </section>

    <!-- Koordinat -->
    <section>
      <div class="flex items-center justify-between gap-3 rounded-control bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
        <div class="flex items-center gap-3">
          <span class="text-lg">🗺️</span>
          <span class="text-sm font-medium text-brand-charcoal dark:text-neutral-200">{{ coordinatesLabel }}</span>
        </div>
        <button
          type="button"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white transition-transform hover:scale-105"
          :aria-label="t('pages.poiDetail.copyCoordinates')"
          @click="copyCoordinates"
        >
          <span v-if="copied">✅</span>
          <span v-else>📋</span>
        </button>
      </div>
      <p v-if="copied" class="mt-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        {{ t("pages.poiDetail.coordinatesCopied") }}
      </p>
    </section>

    <!-- Mini harita -->
    <section>
      <div class="mb-2 flex items-center justify-between">
        <h2 class="text-sm font-bold text-brand-charcoal/70 dark:text-neutral-300">
          {{ t("pages.poiDetail.mapSectionTitle") }}
        </h2>
        <span v-if="location.city || location.region" class="text-xs text-brand-charcoal/50 dark:text-neutral-500">
          {{ [location.city, location.region].filter(Boolean).join(" / ") }}
        </span>
      </div>
      <div ref="miniMapContainer" class="h-44 w-full overflow-hidden rounded-control bg-neutral-100 dark:bg-neutral-800" />
    </section>

    <!-- Hata Bildir / Düzenle -->
    <div class="flex gap-3 pb-2">
      <button type="button" class="kl-btn-outline flex-1" @click="isReportModalOpen = true">
        ⚠️ {{ t("pages.poiDetail.reportIssue") }}
      </button>
      <NuxtLink v-if="canEdit" :to="`/konum/${location.id}/duzenle`" class="kl-btn-outline flex-1">
        ✏️ {{ t("pages.poiDetail.edit") }}
      </NuxtLink>
    </div>

    <PoiReportModal v-model="isReportModalOpen" />
  </div>
</template>

<style scoped>
.kampla-fade-enter-active,
.kampla-fade-leave-active {
  transition: opacity 0.15s ease;
}
.kampla-fade-enter-from,
.kampla-fade-leave-to {
  opacity: 0;
}
</style>
