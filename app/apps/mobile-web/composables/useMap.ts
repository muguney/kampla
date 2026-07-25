/**
 * MapLibre GL JS entegrasyonu (PRD 7.1 "Harita Motoru", 5.B — Ana Harita Deneyimi).
 * Faz 2: temel interaktif harita + 3 katman seçimi (Klasik/Topografik/Uydu) +
 * "konumuma git". Gerçek MapTiler API key henüz yok (BLOCKERS.md #3, bekliyor)
 * — bu yüzden `getMapStyle()` açık kaynak/ücretsiz stiller döndürüyor.
 *
 * MapTiler key geldiğinde tek yapılması gereken: `apps/mobile-web/.env`
 * içindeki `NUXT_PUBLIC_MAPTILER_KEY` değerini gerçek anahtarla doldurmak.
 * `hasValidMaptilerKey()` placeholder değeri ("your-maptiler-api-key" veya
 * boş) otomatik tespit eder ve gerçek anahtar geldiğinde otomatik olarak
 * MapTiler style URL'lerine geçer — kod değişikliği gerekmez.
 */
import maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, Marker as MapLibreMarker, StyleSpecification } from "maplibre-gl";

/** 3 harita katmanı (PRD 5.B) — kimlikler sabit, gerçek stil URL'leri MapTiler key gelince değişir. */
export const MAP_LAYERS = ["classic", "topo", "satellite"] as const;
export type MapLayerId = (typeof MAP_LAYERS)[number];

/** Antalya/Alanya civarı — kamp/karavan alanlarının yoğun olduğu bölge (PRD 5.B varsayılan görünüm). */
export const DEFAULT_MAP_CENTER: [number, number] = [31.4, 36.7]; // [lng, lat]
export const DEFAULT_MAP_ZOOM = 8;
export const USER_LOCATION_ZOOM = 13;

/** OSM raster tile kaynağı — açık kaynak/ücretsiz fallback (attribution zorunlu). */
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> katkıda bulunanlar';

function osmRasterStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      "osm-tiles": {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: OSM_ATTRIBUTION,
      },
    },
    layers: [
      {
        id: "osm-tiles-layer",
        type: "raster",
        source: "osm-tiles",
      },
    ],
  };
}

function hasValidMaptilerKey(key: string | undefined | null): key is string {
  return !!key && key.trim().length > 0 && !key.startsWith("your-");
}

/**
 * Katman kimliğine göre MapLibre style URL'i veya inline style objesi döndürür.
 * MapTiler key varsa gerçek MapTiler stilleri kullanılır; yoksa açık kaynak
 * fallback'lere düşülür (classic → MapLibre demo vektör stili, topo/satellite
 * → OSM raster — gerçek görsel ayrım yok, sadece yapı hazır, key gelince
 * gerçek `topo-v2`/`satellite` stillerine dönüşür).
 */
export function getMapStyle(layer: MapLayerId, maptilerKey?: string | null): string | StyleSpecification {
  if (hasValidMaptilerKey(maptilerKey)) {
    switch (layer) {
      case "classic":
        return `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerKey}`;
      case "topo":
        return `https://api.maptiler.com/maps/topo-v2/style.json?key=${maptilerKey}`;
      case "satellite":
        return `https://api.maptiler.com/maps/satellite/style.json?key=${maptilerKey}`;
    }
  }

  if (layer === "classic") {
    // MapLibre'nin resmi açık kaynak demo vektör stili — key gerektirmez.
    return "https://demotiles.maplibre.org/style.json";
  }
  // topo & satellite için henüz ayrı ücretsiz vektör kaynağı yok; OSM raster ile
  // yapı/etkileşim (katman değiştirme) doğrulanabiliyor, görsel ayrım MapTiler
  // key'i ile gelecek.
  return osmRasterStyle();
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export function useMap() {
  const config = useRuntimeConfig();
  const maptilerKey = config.public.maptilerKey as string | undefined;

  const map = useState<MapLibreMap | null>("kampla-map-instance", () => null);
  const isReady = useState("kampla-map-ready", () => false);
  const currentLayer = useState<MapLayerId>("kampla-map-layer", () => "classic");
  const userLocation = useState<UserLocation | null>("kampla-map-user-location", () => null);

  let userMarker: MapLibreMarker | null = null;

  /** Verilen DOM container'ında MapLibre map instance'ı kurar. */
  function initMap(container: string | HTMLElement): MapLibreMap {
    const instance = new maplibregl.Map({
      container,
      style: getMapStyle(currentLayer.value, maptilerKey),
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      attributionControl: { compact: true },
    });

    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    instance.on("load", () => {
      isReady.value = true;
      // Katman kurulurken kullanıcı konumu zaten biliniyorsa marker'ı yeniden ekle
      // (ör. setStyle sonrası tüm custom layer/marker'lar sıfırlanabilir).
      if (userLocation.value) {
        showUserMarker(userLocation.value, instance);
      }
    });

    map.value = instance;
    return instance;
  }

  /** 3 katmandan birine geçer (Klasik/Topografik/Uydu) — PRD 5.B. */
  function setMapLayer(layer: MapLayerId) {
    currentLayer.value = layer;
    if (!map.value) return;
    map.value.setStyle(getMapStyle(layer, maptilerKey));
  }

  function showUserMarker(location: UserLocation, targetMap?: MapLibreMap) {
    const activeMap = targetMap ?? map.value;
    if (!activeMap) return;
    if (!userMarker) {
      const el = document.createElement("div");
      el.className = "kampla-user-location-dot";
      userMarker = new maplibregl.Marker({ element: el, anchor: "center" });
    }
    userMarker.setLngLat([location.lng, location.lat]).addTo(activeMap);
  }

  /**
   * Tarayıcıdan konum izni ister. İzin verilmezse veya hata olursa sessizce
   * `null` döner (hata fırlatmaz) — mevcut varsayılan merkezde kalınır.
   */
  function requestUserLocation(): Promise<UserLocation | null> {
    return new Promise((resolve) => {
      if (!import.meta.client || !navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          userLocation.value = location;
          showUserMarker(location);
          resolve(location);
        },
        () => {
          // İzin reddedildi veya konum alınamadı — sessizce yoksay.
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
      );
    });
  }

  /** "Konumuma git" butonu — konum yoksa önce ister, sonra oraya uçar. */
  async function flyToUserLocation() {
    const location = userLocation.value ?? (await requestUserLocation());
    if (!location || !map.value) return;
    map.value.flyTo({ center: [location.lng, location.lat], zoom: USER_LOCATION_ZOOM, essential: true });
  }

  /**
   * Arama ekranından (PRD 5.C) seçilen bir öneriye haritayı odaklar
   * (bkz. `@kampla/shared` → `SEARCH_SUGGESTIONS`, `pages/ara.vue` → `/?focus=<id>`).
   * Map henüz kurulmamışsa (ör. sayfa mount edilirken `load` beklenmeden
   * çağrılırsa) sessizce yoksayılır.
   */
  function flyToCoordinates(lat: number, lng: number, zoom: number = USER_LOCATION_ZOOM) {
    if (!map.value) return;
    map.value.flyTo({ center: [lng, lat], zoom, essential: true });
  }

  /** Sayfa/bileşen unmount olurken map instance'ını temizler. */
  function destroyMap() {
    userMarker = null;
    map.value?.remove();
    map.value = null;
    isReady.value = false;
  }

  return {
    map,
    isReady,
    currentLayer,
    userLocation,
    initMap,
    setMapLayer,
    requestUserLocation,
    flyToUserLocation,
    flyToCoordinates,
    destroyMap,
  };
}
