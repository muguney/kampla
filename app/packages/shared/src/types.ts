/**
 * Kamp.la — Ortak TypeScript tipleri (PRD Bölüm 6 — Veri Modeli)
 * `supabase/migrations` altındaki şema ile birebir örtüşecek şekilde tutulmalı.
 * Faz 0'da elle yazılmıştır; ileride `supabase gen types typescript` ile
 * otomatik üretilen tiplerle değiştirilebilir/senkronize edilebilir.
 *
 * Not (Faz 4 Adım 6): bu modeller kasıtlı olarak `interface` değil `type` olarak
 * tanımlanıyor. `@supabase/postgrest-js` v2'nin `.insert()` tipi, `Row`/`Insert`
 * alanlarının `Record<string, unknown>`'a (dolayısıyla aşağıdaki `Database`
 * tipindeki `GenericTable` uyumluluğuna) yapısal olarak uyup uymadığını bir
 * conditional type ile kontrol ediyor; TypeScript bu kontrolde `interface`
 * tanımlarına (declaration merging'e açık oldukları için) type alias'lardaki
 * gibi bir "örtük index signature" esnekliği tanımıyor ve kontrol sessizce
 * `never`'a düşüyor (`.insert()` çağrıları o zaman "never[]" hatası veriyordu).
 * `interface X extends Y` hâlâ bir type alias'ı extend edebildiği için
 * `MockLocationCard`/`MockReview` (bkz. mock-locations.ts/mock-reviews.ts)
 * etkilenmedi.
 */
import type {
  AccommodationType,
  Amenity,
  LocationSource,
  LocationStatus,
  LocationType,
  ListType,
  ReportStatus,
  Season,
  SubscriptionProvider,
  UserTier,
} from "./constants";

/** PRD 6.6 */
export type Profile = {
  id: string; // auth.users.id ile aynı (FK)
  username: string;
  email: string;
  avatar_url: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  youtube_url: string | null;
  show_visited_places: boolean;
  tier: UserTier;
  role: "user" | "admin";
  /** PRD 5.R "Kullanıcı Yönetimi" — admin panelinden askıya alma (0012_profiles_suspended.sql).
   * Optional tutuldu: bu tip `supabase gen types` ile senkronize edilene kadar,
   * kolonu henüz seçmeyen eski `select("id, username")` gibi kısmi sorgular bozulmasın diye. */
  suspended?: boolean;
  created_at: string;
  updated_at: string;
};

/** PRD 6.1 / 6.5 / 7.1 */
export type Location = {
  id: string;
  created_by: string | null;
  name: string;
  description: string | null;
  location_type: LocationType | null; // null ise referans/bilgi katmanı kaydı olabilir
  is_reference_layer: boolean;
  reference_type: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  x_url: string | null;
  accommodation_types: AccommodationType[];
  season: Season | null;
  /** PRD 5.G Adım 5 / DECISIONS.md 2026-07-25 — ayrı bir `location_photos` tablosu yerine
   * basit bir public URL dizisi (Supabase Storage `location-photos` bucket'ı). */
  photo_urls: string[];
  status: LocationStatus;
  source: LocationSource;
  rejection_reason: string | null;
  city: string | null;
  region: string | null;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
};

/** PRD 6.2 */
export type LocationAmenity = {
  id: string;
  location_id: string;
  amenity: Amenity;
};

/** PRD 6.7 */
export type MapList = {
  id: string;
  owner_id: string;
  name: string;
  type: ListType;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type ListItem = {
  id: string;
  list_id: string;
  location_id: string;
  created_at: string;
};

/** PRD 6.8 */
export type Review = {
  id: string;
  location_id: string;
  user_id: string;
  rating: number; // 1-5
  comment: string | null;
  created_at: string;
  updated_at: string;
};

/** PRD 5.R "İçerik Yönetimi" — admin panelden düzenlenebilir statik sayfa içerikleri
 * (Kamp.la Hakkında, Kullanım Koşulları, Gizlilik Sözleşmesi). `key` sabit slug'lardan
 * biridir (`hakkinda`, `kullanim-kosullari`, `gizlilik`). */
export type SiteContent = {
  key: string;
  lang: string;
  title: string | null;
  body: string;
  updated_at: string;
};

/** PRD 6.10 */
export type Report = {
  id: string;
  location_id: string;
  reporter_id: string | null;
  description: string;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
};

/** PRD 6.11 */
export type Notification = {
  id: string;
  recipient_id: string;
  type: string;
  content: string;
  related_location_id: string | null;
  related_report_id: string | null;
  is_read: boolean;
  created_at: string;
};

/** PRD 6.9 */
export type Subscription = {
  id: string;
  user_id: string;
  provider: SubscriptionProvider;
  plan: string;
  status: "active" | "canceled" | "expired" | "trial";
  starts_at: string;
  ends_at: string | null;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
};

/** PRD 7.1 "Offline Harita" (Faz 11) — WGS84 bbox, MapLibre `map.getBounds()` sırasıyla
 * uyumlu: [west, south, east, north]. */
export type OfflineRegionBBox = [west: number, south: number, east: number, north: number];

/** PRD 5.B, 5.P, 7.1 — Faz 11 "Offline Harita" (Premium özellik): cihaza indirilmiş bir
 * bölgenin metadata kaydı. Bu kayıt yalnızca listede gösterme/silme için kullanılır; gerçek
 * `.pmtiles` dosyası ayrıca cihaz depolamasında tutulur (bkz.
 * `apps/mobile-web/composables/useOfflineMap.ts`). Supabase şemasının bir parçası DEĞİL —
 * tamamen cihaz-yerel (Capacitor Preferences / localStorage) bir kayıt, bu yüzden
 * `Database["public"]["Tables"]` altına eklenmedi. */
export type OfflineRegion = {
  id: string;
  name: string;
  bbox: OfflineRegionBBox;
  sizeBytes: number;
  downloadedAt: string; // ISO 8601
};

/** Minimal Supabase Database şema iskeleti — ileride `supabase gen types` ile genişletilecek.
 * `Relationships`/`Views`/`Functions` alanları gerçek veri modelini değiştirmez; yalnızca
 * `@supabase/postgrest-js` v2'nin `GenericTable`/`GenericSchema` tipleriyle uyumlu olması
 * için eklendi. */
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile>; Relationships: [] };
      locations: {
        Row: Location;
        Insert: Partial<Location>;
        Update: Partial<Location>;
        Relationships: [];
      };
      location_amenities: {
        Row: LocationAmenity;
        Insert: Partial<LocationAmenity>;
        Update: Partial<LocationAmenity>;
        Relationships: [];
      };
      lists: { Row: MapList; Insert: Partial<MapList>; Update: Partial<MapList>; Relationships: [] };
      list_items: {
        Row: ListItem;
        Insert: Partial<ListItem>;
        Update: Partial<ListItem>;
        Relationships: [];
      };
      reviews: { Row: Review; Insert: Partial<Review>; Update: Partial<Review>; Relationships: [] };
      reports: { Row: Report; Insert: Partial<Report>; Update: Partial<Report>; Relationships: [] };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification>;
        Update: Partial<Notification>;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription>;
        Update: Partial<Subscription>;
        Relationships: [];
      };
      site_content: {
        Row: SiteContent;
        Insert: Partial<SiteContent>;
        Update: Partial<SiteContent>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
