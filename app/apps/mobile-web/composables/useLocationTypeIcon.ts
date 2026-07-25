import type { LocationType } from "@kampla/shared";
import type { IconName } from "~/components/icons/AppIcon.vue";

/**
 * PRD 6.1 — 9 konum türü için ikon glifi eşlemesi. `components/icons/AppIcon.vue`
 * ile birlikte kullanılır (bkz. Figma "6-Filtre" node 132:1271 ve "5- Liste
 * Ekranı" node 52:266 — kategori glifleri: karavan, P (park), çadır, damla
 * (su), çamaşır makinesi, duş başlığı). Ücretli/ücretsiz varyantlar aynı glifi
 * paylaşır; ücretlilik ayrımı POI renk kodu (`bg-poi-<type>`, PRD 6.1) ve
 * "fee-badge" (₺/$ rozeti) ile yapılır.
 */
export const LOCATION_TYPE_ICONS: Record<LocationType, IconName> = {
  "paid-caravan": "poi-caravan",
  "free-caravan": "poi-caravan",
  "paid-parking": "poi-parking",
  "free-parking": "poi-parking",
  "paid-tent": "poi-tent",
  "free-tent": "poi-tent",
  water: "poi-water",
  laundry: "poi-laundry",
  shower: "poi-shower",
};

/** Ücretli kategoriler — ikonun köşesinde küçük ücret rozeti (fee-badge) gösterilir. */
export const PAID_LOCATION_TYPES: ReadonlySet<LocationType> = new Set([
  "paid-caravan",
  "paid-parking",
  "paid-tent",
]);

export function useLocationTypeIcon() {
  return { LOCATION_TYPE_ICONS, PAID_LOCATION_TYPES };
}
