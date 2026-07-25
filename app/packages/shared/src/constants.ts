/**
 * Kamp.la — Ortak sabitler (PRD Bölüm 6 — Veri Modeli)
 * Hem `apps/mobile-web` hem `apps/admin` bu enum/sabitleri kullanır.
 */

/** PRD 6.1 — Konum türleri (tekli seçim, renk+ikon kodlu, 9 kategori) */
export const LOCATION_TYPES = [
  "paid-caravan",
  "free-caravan",
  "paid-parking",
  "free-parking",
  "paid-tent",
  "free-tent",
  "water",
  "laundry",
  "shower",
] as const;

export type LocationType = (typeof LOCATION_TYPES)[number];

export const LOCATION_TYPE_LABELS_TR: Record<LocationType, string> = {
  "paid-caravan": "Ücretli Karavan Parkı",
  "free-caravan": "Ücretsiz Karavan Parkı",
  "paid-parking": "Ücretli Park Alanı",
  "free-parking": "Ücretsiz Park Alanı",
  "paid-tent": "Ücretli Çadır Alanı",
  "free-tent": "Ücretsiz Çadır Alanı",
  water: "Su Doldurma Yeri",
  laundry: "Çamaşır Yıkama Yeri",
  shower: "Duş Alanı",
};

export const LOCATION_TYPE_LABELS_EN: Record<LocationType, string> = {
  "paid-caravan": "Paid Caravan Park",
  "free-caravan": "Free Caravan Park",
  "paid-parking": "Paid Parking Area",
  "free-parking": "Free Parking Area",
  "paid-tent": "Paid Tent Area",
  "free-tent": "Free Tent Area",
  water: "Water Refill Point",
  laundry: "Laundry Point",
  shower: "Shower Area",
};

/** PRD 6.2 — Konum hizmetleri / imkanları (çoklu seçim, 19 etiket) */
export const AMENITIES = [
  "shower",
  "electricity",
  "fridge",
  "vehicle-entry",
  "hot-shower",
  "near-sea",
  "campfire-grill",
  "pet-friendly",
  "washing-machine",
  "paid-general",
  "gsm-signal",
  "toilet-drain",
  "water-fill",
  "caravan-waste-drain",
  "free-wifi",
  "toilet",
  "market-nearby",
  "playground",
  "dryer",
] as const;

export type Amenity = (typeof AMENITIES)[number];

export const AMENITY_LABELS_TR: Record<Amenity, string> = {
  shower: "Duş",
  electricity: "Elektrik",
  fridge: "Buz dolabı",
  "vehicle-entry": "Araç kamp alanına girebilir",
  "hot-shower": "Sıcak duş",
  "near-sea": "Denize yakın",
  "campfire-grill": "Ateş/Mangal yakılabilir",
  "pet-friendly": "Evcil hayvan girebilir",
  "washing-machine": "Çamaşır yıkama makinesi",
  "paid-general": "Ücretli (genel)",
  "gsm-signal": "GSM çekiyor",
  "toilet-drain": "Tuvalet boşaltma imkanı",
  "water-fill": "Su doldurma imkanı",
  "caravan-waste-drain": "Karavan atık su boşaltma yeri",
  "free-wifi": "Ücretsiz wifi",
  toilet: "Tuvalet",
  "market-nearby": "Yakında/içeride market",
  playground: "Çocuk oyun alanı",
  dryer: "Kurutma makinesi",
};

export const AMENITY_LABELS_EN: Record<Amenity, string> = {
  shower: "Shower",
  electricity: "Electricity",
  fridge: "Fridge",
  "vehicle-entry": "Vehicles can enter the site",
  "hot-shower": "Hot shower",
  "near-sea": "Near the sea",
  "campfire-grill": "Campfire/grill allowed",
  "pet-friendly": "Pet friendly",
  "washing-machine": "Washing machine",
  "paid-general": "Paid (general)",
  "gsm-signal": "GSM signal",
  "toilet-drain": "Toilet drain point",
  "water-fill": "Water refill point",
  "caravan-waste-drain": "Caravan waste drain point",
  "free-wifi": "Free wifi",
  toilet: "Toilet",
  "market-nearby": "Market nearby/on-site",
  playground: "Playground",
  dryer: "Dryer",
};

/** PRD 6.3 — Konaklama imkanları (çoklu seçim, bağımsız katman) */
export const ACCOMMODATION_TYPES = ["caravan", "tent", "bungalow"] as const;
export type AccommodationType = (typeof ACCOMMODATION_TYPES)[number];

export const ACCOMMODATION_LABELS_TR: Record<AccommodationType, string> = {
  caravan: "Karavan konaklamaya müsait",
  tent: "Çadır ile konaklamaya müsait",
  bungalow: "Bungalov / Tiny house var",
};

export const ACCOMMODATION_LABELS_EN: Record<AccommodationType, string> = {
  caravan: "Caravan-friendly",
  tent: "Tent-friendly",
  bungalow: "Bungalow / tiny house available",
};

/** POI Detay rozetleri için kısa etiketler (PRD 5.F) — `ACCOMMODATION_LABELS_*` form/sihirbaz
 * bağlamındaki tam cümleler olduğu için detay sayfası rozetlerinde kısa isimler kullanılır. */
export const ACCOMMODATION_BADGE_LABELS_TR: Record<AccommodationType, string> = {
  caravan: "Karavan",
  tent: "Çadır",
  bungalow: "Bungalov",
};

export const ACCOMMODATION_BADGE_LABELS_EN: Record<AccommodationType, string> = {
  caravan: "Caravan",
  tent: "Tent",
  bungalow: "Bungalow",
};

/** PRD 6.4 — Sezon (tekli seçim) */
export const SEASONS = ["summer", "winter", "all"] as const;
export type Season = (typeof SEASONS)[number];

export const SEASON_LABELS_TR: Record<Season, string> = {
  summer: "Yaz",
  winter: "Kış",
  all: "Tüm sezonlar",
};

export const SEASON_LABELS_EN: Record<Season, string> = {
  summer: "Summer",
  winter: "Winter",
  all: "All seasons",
};

/** PRD 6.5 — Referans/bilgi katmanı türleri */
export const REFERENCE_TYPES = ["national-park", "plateau", "historic"] as const;
export type ReferenceType = (typeof REFERENCE_TYPES)[number];

/** PRD 7.1 — locations.source */
export const LOCATION_SOURCES = ["user", "admin", "import"] as const;
export type LocationSource = (typeof LOCATION_SOURCES)[number];

/** PRD 7.1 / 5.M — locations.status (moderasyon) */
export const LOCATION_STATUSES = ["pending", "published", "rejected"] as const;
export type LocationStatus = (typeof LOCATION_STATUSES)[number];

/** PRD 5.M / 6.10 — reports.status (hata bildirimi) */
export const REPORT_STATUSES = ["open", "reviewing", "resolved"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

/** PRD 5.P / 6.6 — kullanıcı tipi */
export const USER_TIERS = ["free", "premium"] as const;
export type UserTier = (typeof USER_TIERS)[number];

/** PRD 6.9 — subscriptions.provider */
export const SUBSCRIPTION_PROVIDERS = ["app_store", "play_store", "stripe"] as const;
export type SubscriptionProvider = (typeof SUBSCRIPTION_PROVIDERS)[number];

/** PRD 6.7 — liste tipi (sistem listeleri silinemez) */
export const LIST_TYPES = ["favorites", "visited", "custom"] as const;
export type ListType = (typeof LIST_TYPES)[number];

/** Desteklenen diller (PRD 5.L) */
export const SUPPORTED_LOCALES = ["tr", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "tr";

/** Tema seçenekleri (PRD 5.L) */
export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

/** Ücretsiz kullanıcı kısıtları (PRD 5.P) */
export const FREE_TIER_LIMITS = {
  maxActiveFilters: 2,
  maxCustomLists: 3,
  mapLayers: ["classic"] as const,
};
