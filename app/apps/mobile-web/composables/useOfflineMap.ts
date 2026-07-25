/**
 * Placeholder — Offline harita indirme (PMTiles + Capacitor Filesystem)
 * Faz 11'de burada kurulacak (PRD 7.1 "Offline Harita", 5.B, Premium — 5.P).
 */
export function useOfflineMap() {
  // TODO(Faz 11): bölge seçimi, PMTiles indirme, yerel kaynak olarak MapLibre'ye bağlama.
  return {
    isDownloading: useState("kampla-offline-map-downloading", () => false),
  };
}
