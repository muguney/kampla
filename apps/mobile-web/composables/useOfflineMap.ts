/**
 * Offline harita indirme (PRD 7.1 "Offline Harita", 5.B, Premium — 5.P, Faz 11).
 *
 * Teknik yaklaşım (PRD 7.1): "MapLibre + self-hosted PMTiles" — ticari sağlayıcı yok.
 * Bu composable, kullanıcının haritada gördüğü bir bölgeyi (bbox) cihaza `.pmtiles`
 * dosyası olarak indirip MapLibre'ye `pmtiles://` protokolü üzerinden yerel kaynak
 * olarak bağlamanın ALTYAPISINI kurar — `useMap.ts`'teki
 * `Capacitor.isNativePlatform()` native/web dallanma deseniyle tutarlı
 * (bkz. `requestUserLocationNative`/`requestUserLocationWeb`).
 *
 * ÖNEMLİ — kapsam sınırı: gerçek bölgesel PMTiles verisinin NASIL üretileceği
 * (uzak bir kaynaktan HTTP range-request ile client-side excerpt mi, ayrı bir
 * "tile-cutting" sunucusu mu) ayrı bir görev/karar; bu dosyada indirme kaynağı
 * kasıtlı olarak `TODO` bırakıldı (bkz. `PMTILES_SOURCE_URL_TODO` ve
 * `resolveDownloadSourceUrl()`). Karar netleşene kadar altyapının uçtan uca
 * çalıştığını doğrulamak için Protomaps'in herkese açık küçük örnek PMTiles
 * dosyası kullanılabilir — bu ÜRETİM KARARI DEĞİLDİR.
 *
 * Kalıcılık: indirilen bölgelerin metadata'sı (ad/bbox/boyut/tarih) native'de
 * `@capacitor/preferences`, webde `localStorage` ile saklanır. Gerçek `.pmtiles`
 * ikili verisi native'de `@capacitor/filesystem` ile `Directory.Data` altına
 * yazılır; web'de kalıcı ikili depolama (IndexedDB) bu fazın kapsamı dışında
 * bırakıldı — bellek içi bir `Map` ile yalnızca oturum boyunca çalışır
 * (sayfa yenilenince web'de dosya kaybolur, metadata kaybolmaz; bu tutarsızlık
 * bilinçli bir kısıtlama, gerçek kaynak kararı gelince ele alınacak).
 */
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import * as pmtiles from "pmtiles";
import maplibregl from "maplibre-gl";
import type { Map as MapLibreMap } from "maplibre-gl";
import type { OfflineRegion, OfflineRegionBBox } from "@kampla/shared";

const OFFLINE_REGIONS_STORAGE_KEY = "kampla-offline-map-regions";
const OFFLINE_REGIONS_DIR = "offline-maps";

/**
 * TODO(Faz 11, DECISIONS.md): gerçek PMTiles kaynağı (self-hosted excerpt servisi ya
 * da client-side range-request akışı) netleşince bu placeholder kaldırılıp
 * `resolveDownloadSourceUrl(bbox)` gerçek URL'i üretecek şekilde değiştirilecek.
 * Şimdilik Protomaps'in herkese açık, küçük (~1MB altı) demo dosyası kullanılıyor
 * — sadece "indirme + yerel yazma + MapLibre'ye pmtiles:// kaynağı olarak bağlama"
 * iskeletini doğrulamak için; bbox parametresi bilerek YOK SAYILIYOR (gerçek akışta
 * bölgeye özel bir excerpt üretilecek/indirilecek).
 */
const PMTILES_PLACEHOLDER_SOURCE_URL = "https://demo-bucket.protomaps.com/v4.pmtiles";

/** MapLibre GL JS'e `pmtiles://` protokolünü tanıtır — modül başına yalnızca bir kez. */
let pmtilesProtocol: pmtiles.Protocol | null = null;

function getPmtilesProtocol(): pmtiles.Protocol {
  if (!pmtilesProtocol) {
    pmtilesProtocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", pmtilesProtocol.tile);
  }
  return pmtilesProtocol;
}

/** Web'de kalıcı ikili depolama henüz yok (yukarıdaki not) — indirilen `Blob`'lar
 * yalnızca oturum boyunca bu bellek içi kayıtta tutulur. */
const webBlobStore = new Map<string, Blob>();

function regionFilePath(id: string): string {
  return `${OFFLINE_REGIONS_DIR}/${id}.pmtiles`;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // FileReader.readAsDataURL "data:<mime>;base64,<data>" döner — Capacitor
      // Filesystem.writeFile yalnızca ham base64 verisini bekler.
      const base64 = result.split(",")[1] ?? "";
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error ?? new Error("file-read-error"));
    reader.readAsDataURL(blob);
  });
}

async function readRegionsFromStorage(): Promise<OfflineRegion[]> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key: OFFLINE_REGIONS_STORAGE_KEY });
      return value ? (JSON.parse(value) as OfflineRegion[]) : [];
    }
    const raw = localStorage.getItem(OFFLINE_REGIONS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OfflineRegion[]) : [];
  } catch {
    return [];
  }
}

async function writeRegionsToStorage(regions: OfflineRegion[]): Promise<void> {
  const serialized = JSON.stringify(regions);
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key: OFFLINE_REGIONS_STORAGE_KEY, value: serialized });
  } else {
    localStorage.setItem(OFFLINE_REGIONS_STORAGE_KEY, serialized);
  }
}

export function useOfflineMap() {
  const regions = useState<OfflineRegion[]>("kampla-offline-map-regions", () => []);
  const isHydrated = useState("kampla-offline-map-hydrated", () => false);
  const isDownloading = useState("kampla-offline-map-downloading", () => false);
  /** 0-100 — toplam bayt bilinmiyorsa (ör. sunucu `content-length` döndürmüyorsa) 0'da kalır. */
  const downloadProgress = useState("kampla-offline-map-progress", () => 0);
  const downloadError = useState<string | null>("kampla-offline-map-error", () => null);

  /** Kalıcı depodan (Preferences/localStorage) bölge listesini yükler — idempotent. */
  async function hydrate(): Promise<void> {
    if (isHydrated.value || !import.meta.client) return;
    regions.value = await readRegionsFromStorage();
    isHydrated.value = true;
  }

  /** MapLibre haritasının o anki görünür sınırlarından `[west, south, east, north]` bbox'ı. */
  function getVisibleBounds(map: MapLibreMap): OfflineRegionBBox {
    const bounds = map.getBounds();
    return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
  }

  /**
   * Gerçek indirme kaynağını çözer. Bkz. dosya başındaki TODO notu — bbox bugün
   * kullanılmıyor (placeholder her zaman aynı küçük demo dosyasını döner), gerçek
   * karar netleşince bölgeye özel bir excerpt URL'i/isteği üretecek şekilde
   * değiştirilecek.
   */
  function resolveDownloadSourceUrl(_bbox: OfflineRegionBBox): string {
    // TODO: gerçek PMTiles kaynağı DECISIONS.md'deki karar netleşince buraya bağlanacak.
    return PMTILES_PLACEHOLDER_SOURCE_URL;
  }

  /** Bir bbox'ı indirir, cihaza yazar ve metadata listesine ekler. */
  async function downloadRegion(
    bbox: OfflineRegionBBox,
    name: string
  ): Promise<{ success: boolean; error?: string }> {
    if (isDownloading.value) {
      return { success: false, error: "already-downloading" };
    }

    isDownloading.value = true;
    downloadProgress.value = 0;
    downloadError.value = null;

    const id = `region-${Date.now()}`;

    try {
      const sourceUrl = resolveDownloadSourceUrl(bbox);
      const response = await fetch(sourceUrl);
      if (!response.ok || !response.body) {
        throw new Error(`download-failed-${response.status}`);
      }

      const totalBytes = Number(response.headers.get("content-length") ?? 0);
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedBytes += value.byteLength;
          downloadProgress.value = totalBytes > 0 ? Math.min(100, Math.round((receivedBytes / totalBytes) * 100)) : 0;
        }
      }

      const blob = new Blob(chunks as BlobPart[]);
      const sizeBytes = blob.size;

      if (Capacitor.isNativePlatform()) {
        const base64 = await blobToBase64(blob);
        await Filesystem.writeFile({
          path: regionFilePath(id),
          data: base64,
          directory: Directory.Data,
          recursive: true,
        });
      } else {
        webBlobStore.set(id, blob);
      }

      const region: OfflineRegion = {
        id,
        name: name.trim() || id,
        bbox,
        sizeBytes,
        downloadedAt: new Date().toISOString(),
      };

      regions.value = [...regions.value, region];
      await writeRegionsToStorage(regions.value);

      downloadProgress.value = 100;
      return { success: true };
    } catch (err) {
      downloadError.value = err instanceof Error ? err.message : "unknown-error";
      return { success: false, error: downloadError.value };
    } finally {
      isDownloading.value = false;
    }
  }

  /** İndirilmiş bir bölgeyi (dosya + metadata) siler. */
  async function deleteRegion(id: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await Filesystem.deleteFile({ path: regionFilePath(id), directory: Directory.Data });
      } catch {
        // Dosya zaten yoksa (ör. önceki bir hata nedeniyle yarım kalmışsa) sessizce yoksay.
      }
    } else {
      webBlobStore.delete(id);
    }
    regions.value = regions.value.filter((region) => region.id !== id);
    await writeRegionsToStorage(regions.value);
  }

  /** Mevcut indirilen bölgeleri döndürür (bkz. `regions` — reaktif state, bu sadece okuma kolaylığı). */
  function listRegions(): OfflineRegion[] {
    return regions.value;
  }

  /**
   * İndirilmiş bir bölgeyi MapLibre'ye `pmtiles://` kaynağı olarak bağlamak için
   * kullanılacak source URL'ini döner (`map.addSource(id, { type: "vector", url })`
   * gibi bir çağrıda kullanılabilir). Bu fazda haritaya gerçek bağlama UI/akışı
   * kapsamda değil — yalnızca altyapı; `null` dönerse bölge dosyası bulunamadı demektir.
   */
  async function getRegionSourceUrl(id: string): Promise<string | null> {
    const protocol = getPmtilesProtocol();

    if (Capacitor.isNativePlatform()) {
      try {
        const { uri } = await Filesystem.getUri({ path: regionFilePath(id), directory: Directory.Data });
        const webUri = Capacitor.convertFileSrc(uri);
        protocol.add(new pmtiles.PMTiles(webUri));
        return `pmtiles://${webUri}`;
      } catch {
        return null;
      }
    }

    const blob = webBlobStore.get(id);
    if (!blob) return null;
    const file = new File([blob], `${id}.pmtiles`);
    const instance = new pmtiles.PMTiles(new pmtiles.FileSource(file));
    protocol.add(instance);
    return `pmtiles://${instance.source.getKey()}`;
  }

  return {
    regions,
    isDownloading,
    downloadProgress,
    downloadError,
    hydrate,
    getVisibleBounds,
    downloadRegion,
    deleteRegion,
    listRegions,
    getRegionSourceUrl,
  };
}
