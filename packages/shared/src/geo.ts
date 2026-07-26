/**
 * Kamp.la — Coğrafi yardımcı fonksiyonlar (PRD 5.B/5.C/5.E).
 * Haversine formülü ile iki koordinat arası kuş uçuşu mesafe (km) hesaplar.
 * `components/map/PoiSummaryCard.vue` (Ana Ekran özet kartı) ve
 * `pages/liste.vue` (Liste Görünümü) arasında paylaşılan tek kaynak —
 * mesafe hesaplama mantığı iki yerde ayrı ayrı yazılmaz.
 */
export interface GeoPoint {
  lat: number;
  lng: number;
}

export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Okunabilir mesafe etiketi — 1 km altı metre, üstü ondalıklı km (ör. "850 m", "12.3 km"). */
export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
