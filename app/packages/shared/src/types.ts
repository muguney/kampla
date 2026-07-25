/**
 * Kamp.la — Ortak TypeScript tipleri (PRD Bölüm 6 — Veri Modeli)
 * `supabase/migrations` altındaki şema ile birebir örtüşecek şekilde tutulmalı.
 * Faz 0'da elle yazılmıştır; ileride `supabase gen types typescript` ile
 * otomatik üretilen tiplerle değiştirilebilir/senkronize edilebilir.
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
export interface Profile {
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
  created_at: string;
  updated_at: string;
}

/** PRD 6.1 / 6.5 / 7.1 */
export interface Location {
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
  status: LocationStatus;
  source: LocationSource;
  rejection_reason: string | null;
  city: string | null;
  region: string | null;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

/** PRD 6.2 */
export interface LocationAmenity {
  id: string;
  location_id: string;
  amenity: Amenity;
}

/** PRD 6.7 */
export interface MapList {
  id: string;
  owner_id: string;
  name: string;
  type: ListType;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListItem {
  id: string;
  list_id: string;
  location_id: string;
  created_at: string;
}

/** PRD 6.8 */
export interface Review {
  id: string;
  location_id: string;
  user_id: string;
  rating: number; // 1-5
  comment: string | null;
  created_at: string;
  updated_at: string;
}

/** PRD 6.10 */
export interface Report {
  id: string;
  location_id: string;
  reporter_id: string | null;
  description: string;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

/** PRD 6.11 */
export interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  content: string;
  related_location_id: string | null;
  related_report_id: string | null;
  is_read: boolean;
  created_at: string;
}

/** PRD 6.9 */
export interface Subscription {
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
}

/** Minimal Supabase Database şema iskeleti — ileride `supabase gen types` ile genişletilecek */
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      locations: { Row: Location; Insert: Partial<Location>; Update: Partial<Location> };
      location_amenities: {
        Row: LocationAmenity;
        Insert: Partial<LocationAmenity>;
        Update: Partial<LocationAmenity>;
      };
      lists: { Row: MapList; Insert: Partial<MapList>; Update: Partial<MapList> };
      list_items: { Row: ListItem; Insert: Partial<ListItem>; Update: Partial<ListItem> };
      reviews: { Row: Review; Insert: Partial<Review>; Update: Partial<Review> };
      reports: { Row: Report; Insert: Partial<Report>; Update: Partial<Report> };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification>;
        Update: Partial<Notification>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription>;
        Update: Partial<Subscription>;
      };
    };
  };
}
