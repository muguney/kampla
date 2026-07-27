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
 *
 * Faz 11 "Offline Harita" (PRD 7.1, 5.B, 5.P) — offline fallback:
 * `useOfflineMap().getRegionSourceUrl()` indirilmiş bir bölge için çalışan bir
 * `pmtiles://` kaynak URL'i üretiyordu ama hiçbir yerde haritaya BAĞLANMIYORDU.
 * Bu dosyada eklenen mekanizma: bağlantı kesildiğinde (`navigator.onLine` +
 * harita `error` event'i — bkz. `tryActivateOfflineFallback`) mevcut harita
 * merkezini kapsayan (yoksa en son indirilen) bölgenin pmtiles kaynağı, online
 * stilin YERİNE `map.setStyle()` ile geçici olarak bağlanır; bağlantı geri
 * gelince (`online` event) `restoreOnlineStyle()` normal online stile döner.
 * Basit/geri dönüşü kolay bir karar — karmaşık network-state yönetimi veya
 * `@capacitor/network` plugin'i kasıtlı olarak eklenmedi (kapsam dışı, bkz.
 * görev talimatı). Gerçek üretim PMTiles kaynağı/şeması netleşene kadar
 * `buildOfflinePmtilesStyle()`'daki katmanlar Protomaps'in herkese açık demo
 * dosyasının (`v4.pmtiles`) bilinen şemasına (earth/water/roads/buildings)
 * göre yazıldı — DECISIONS.md'deki karar netleşince gözden geçirilecek.
 */
import maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, Marker as MapLibreMarker, StyleSpecification } from "maplibre-gl";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import type { OfflineRegionBBox } from "@kampla/shared";

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

/** Bir noktanın (`lng`/`lat`) bir bbox `[west, south, east, north]` içinde olup olmadığı. */
function regionContainsPoint(bbox: OfflineRegionBBox, lng: number, lat: number): boolean {
  const [west, south, east, north] = bbox;
  return lng >= west && lng <= east && lat >= south && lat <= north;
}

/**
 * İndirilmiş bir bölgenin `pmtiles://` kaynağını (bkz. `useOfflineMap().getRegionSourceUrl`)
 * kullanan, tamamen çevrimdışı çalışabilen minimal bir MapLibre stili üretir. Bilerek
 * `glyphs`/sembol-etiket katmanı YOK — uzak font glyph fetch'i gerektirir ve bu offline
 * fallback'in tüm amacını (bağlantısız çalışma) bozardı. Katman/`source-layer` adları
 * (`earth`/`water`/`roads`/`buildings`) Protomaps'in herkese açık demo şemasına göre —
 * placeholder kaynak değişirse (bkz. dosya başı not) bu liste de güncellenmeli; eksik bir
 * `source-layer` MapLibre'de hata FIRLATMAZ, o katman sadece boş çizilir.
 */
function buildOfflinePmtilesStyle(sourceUrl: string): StyleSpecification {
  return {
    version: 8,
    sources: {
      "offline-pmtiles": {
        type: "vector",
        url: sourceUrl,
      },
    },
    layers: [
      { id: "offline-bg", type: "background", paint: { "background-color": "#f2ede4" } },
      {
        id: "offline-earth",
        type: "fill",
        source: "offline-pmtiles",
        "source-layer": "earth",
        paint: { "fill-color": "#f2ede4" },
      },
      {
        id: "offline-water",
        type: "fill",
        source: "offline-pmtiles",
        "source-layer": "water",
        paint: { "fill-color": "#a8d4e6" },
      },
      {
        id: "offline-buildings",
        type: "fill",
        source: "offline-pmtiles",
        "source-layer": "buildings",
        paint: { "fill-color": "#d9d2c5" },
      },
      {
        id: "offline-roads",
        type: "line",
        source: "offline-pmtiles",
        "source-layer": "roads",
        paint: { "line-color": "#ffffff", "line-width": 1 },
      },
    ],
  };
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
  /** Harita şu an online tile yerine indirilmiş bir offline pmtiles bölgesi mi gösteriyor
   * (bkz. dosya başı not — Faz 11 offline fallback). */
  const isOfflineFallbackActive = useState("kampla-map-offline-fallback", () => false);

  let userMarker: MapLibreMarker | null = null;
  let handleBrowserOffline: (() => void) | null = null;
  let handleBrowserOnline: (() => void) | null = null;

  /**
   * Bağlantı kesildiğinde (`offline` event veya online tile fetch hatası) mevcut harita
   * merkezini kapsayan indirilmiş bir bölge varsa onun `pmtiles://` kaynağını devreye
   * sokar (bkz. dosya başı not). Kapsayan bölge yoksa en son indirilen bölgeye düşülür —
   * basit/geri dönüşü kolay bir sezgisel; indirilmiş hiçbir bölge yoksa `false` döner ve
   * mevcut (başarısız da olsa) online stil yerinde kalır.
   */
  async function tryActivateOfflineFallback(): Promise<boolean> {
    if (!map.value || isOfflineFallbackActive.value) return isOfflineFallbackActive.value;

    const offlineMap = useOfflineMap();
    await offlineMap.hydrate();
    const available = offlineMap.regions.value;
    if (available.length === 0) return false;

    const center = map.value.getCenter();
    const containing = available.find((region) => regionContainsPoint(region.bbox, center.lng, center.lat));
    const target = containing ?? available[available.length - 1];

    const sourceUrl = await offlineMap.getRegionSourceUrl(target.id);
    if (!sourceUrl || !map.value) return false;

    map.value.setStyle(buildOfflinePmtilesStyle(sourceUrl));
    isOfflineFallbackActive.value = true;
    return true;
  }

  /** Bağlantı geri geldiğinde (`online` event) normal online stile döner. */
  function restoreOnlineStyle() {
    if (!isOfflineFallbackActive.value) return;
    isOfflineFallbackActive.value = false;
    map.value?.setStyle(getMapStyle(currentLayer.value, maptilerKey));
  }

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
      // İlk yüklemede zaten bağlantı yoksa (ör. uçak modunda uygulama açıldıysa)
      // doğrudan offline fallback'i dener.
      if (import.meta.client && !navigator.onLine) {
        void tryActivateOfflineFallback();
      }
    });

    // Online tile/stil fetch'i başarısız olursa (ör. bağlantı koptu ama henüz `offline`
    // event'i gelmediyse) offline fallback'i dener — mevcut hata yakalama deseniyle
    // tutarlı (bkz. dosyadaki diğer sessiz `catch` blokları).
    instance.on("error", () => {
      if (import.meta.client && !navigator.onLine) {
        void tryActivateOfflineFallback();
      }
    });

    if (import.meta.client) {
      handleBrowserOffline = () => {
        void tryActivateOfflineFallback();
      };
      handleBrowserOnline = () => {
        restoreOnlineStyle();
      };
      window.addEventListener("offline", handleBrowserOffline);
      window.addEventListener("online", handleBrowserOnline);
    }

    map.value = instance;
    return instance;
  }

  /** 3 katmandan birine geçer (Klasik/Topografik/Uydu) — PRD 5.B. Kullanıcı elle katman
   * değiştirirse offline fallback'ten çıkılır (online stile geçilir). */
  function setMapLayer(layer: MapLayerId) {
    currentLayer.value = layer;
    isOfflineFallbackActive.value = false;
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
   * Native (Capacitor iOS/Android) ortamda `@capacitor/geolocation` plugin'i
   * üzerinden konum izni ister ve konum alır. Web'deki `navigator.geolocation`
   * akışıyla aynı davranış: izin reddedilir veya hata olursa sessizce `null`
   * döner (hata fırlatmaz).
   */
  async function requestUserLocationNative(): Promise<UserLocation | null> {
    try {
      const permission = await Geolocation.requestPermissions({ permissions: ["location"] });
      if (permission.location !== "granted" && permission.coarseLocation !== "granted") {
        return null;
      }
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60_000,
      });
      const location: UserLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      userLocation.value = location;
      showUserMarker(location);
      return location;
    } catch {
      // İzin reddedildi veya konum alınamadı — sessizce yoksay.
      return null;
    }
  }

  /**
   * Tarayıcıdan (web) `navigator.geolocation` ile konum izni ister. İzin
   * verilmezse veya hata olursa sessizce `null` döner (hata fırlatmaz) —
   * mevcut varsayılan merkezde kalınır.
   */
  function requestUserLocationWeb(): Promise<UserLocation | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
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

  /**
   * Konum izni ister ve kullanıcı konumunu döner. Native (Capacitor iOS/Android)
   * ortamda `@capacitor/geolocation` plugin'ini, web'de mevcut
   * `navigator.geolocation` API'sini kullanır — `Capacitor.isNativePlatform()`
   * ile dallanır (PRD 7.1/7.2, Faz 10). Web davranışı değişmedi.
   */
  function requestUserLocation(): Promise<UserLocation | null> {
    if (!import.meta.client) {
      return Promise.resolve(null);
    }
    if (Capacitor.isNativePlatform()) {
      return requestUserLocationNative();
    }
    return requestUserLocationWeb();
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

  /** Sayfa/bileşen unmount olurken map instance'ını ve `online`/`offline` listener'larını temizler. */
  function destroyMap() {
    if (import.meta.client) {
      if (handleBrowserOffline) window.removeEventListener("offline", handleBrowserOffline);
      if (handleBrowserOnline) window.removeEventListener("online", handleBrowserOnline);
    }
    handleBrowserOffline = null;
    handleBrowserOnline = null;
    userMarker = null;
    map.value?.remove();
    map.value = null;
    isReady.value = false;
    isOfflineFallbackActive.value = false;
  }

  return {
    map,
    isReady,
    currentLayer,
    userLocation,
    isOfflineFallbackActive,
    initMap,
    setMapLayer,
    requestUserLocation,
    flyToUserLocation,
    flyToCoordinates,
    tryActivateOfflineFallback,
    restoreOnlineStyle,
    destroyMap,
  };
}
