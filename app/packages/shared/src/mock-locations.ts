/**
 * Kamp.la — Mock POI verisi (Faz 2, PRD 5.B)
 * Gerçek `locations` tablosu Faz 2'de henüz haritaya bağlanmadığı için
 * Ana Ekran haritasında ve özet kartlarda gösterim/etkileşim testi amacıyla
 * kullanılan sabit örnek veri. `Location` tipini birebir kullanır (şemayı
 * bozmaz); yalnızca kart görünümü için gereken `photo_url` alanı ayrı bir
 * `MockLocationCard` tipiyle eklenir.
 *
 * Koordinatlar gerçek Türkiye kamp/karavan bölgelerine (Alanya, Antalya,
 * Kemer, Kaş, Fethiye civarı) yaklaşık olarak yerleştirilmiştir.
 */
import type { Location } from "./types";
import type { LocationType } from "./constants";

/** `Location` + kart görünümü için basit ek alan (şema değişikliği değildir). */
export interface MockLocationCard extends Location {
  /** Kart önizlemesinde gösterilecek fotoğraf — mock veride gerçek URL yoksa null (renkli blok gösterilir). */
  photo_url: string | null;
}

let mockIdCounter = 1;
const MOCK_TIMESTAMP = "2026-06-01T00:00:00.000Z";

function createMockLocation(
  overrides: Partial<MockLocationCard> & {
    name: string;
    location_type: LocationType;
    lat: number;
    lng: number;
  }
): MockLocationCard {
  const id = overrides.id ?? `mock-loc-${String(mockIdCounter++).padStart(3, "0")}`;
  return {
    created_by: null,
    description: null,
    is_reference_layer: false,
    reference_type: null,
    phone: null,
    website_url: null,
    facebook_url: null,
    instagram_url: null,
    youtube_url: null,
    x_url: null,
    accommodation_types: [],
    season: "all",
    status: "published",
    source: "admin",
    rejection_reason: null,
    city: null,
    region: null,
    rating_avg: 0,
    rating_count: 0,
    created_at: MOCK_TIMESTAMP,
    updated_at: MOCK_TIMESTAMP,
    photo_url: null,
    ...overrides,
    id,
  };
}

/** Faz 2 Ana Ekran haritası için mock POI listesi (en az 2 örnek / 9 kategori). */
export const MOCK_LOCATIONS: MockLocationCard[] = [
  // paid-caravan
  createMockLocation({
    name: "Alanya Karavan Parkı",
    description: "Deniz manzaralı, elektrik bağlantılı ücretli karavan parkı.",
    location_type: "paid-caravan",
    lat: 36.5463,
    lng: 31.9979,
    city: "Alanya",
    region: "Antalya",
    phone: "+90 242 511 22 33",
    rating_avg: 4.6,
    rating_count: 128,
    accommodation_types: ["caravan"],
  }),
  createMockLocation({
    name: "Side Karavan Kampı",
    description: "Antik kente yürüme mesafesinde, güvenlikli karavan alanı.",
    location_type: "paid-caravan",
    lat: 36.7673,
    lng: 31.3891,
    city: "Manavgat",
    region: "Antalya",
    phone: null,
    rating_avg: 4.3,
    rating_count: 74,
    accommodation_types: ["caravan"],
  }),
  // free-caravan
  createMockLocation({
    name: "Kaş Sahil Karavan Alanı",
    description: "Ücretsiz, gözetimsiz sahil kenarı karavan konaklama noktası.",
    location_type: "free-caravan",
    lat: 36.202,
    lng: 29.6398,
    city: "Kaş",
    region: "Antalya",
    rating_avg: 4.1,
    rating_count: 52,
    accommodation_types: ["caravan"],
  }),
  createMockLocation({
    name: "Patara Karavan Noktası",
    description: "Patara plajı yakınında ücretsiz düz zeminli park/konaklama alanı.",
    location_type: "free-caravan",
    lat: 36.2649,
    lng: 29.3156,
    city: "Kaş",
    region: "Antalya",
    rating_avg: 3.9,
    rating_count: 31,
    accommodation_types: ["caravan"],
  }),
  // paid-parking
  createMockLocation({
    name: "Konyaaltı Plajı Otoparkı",
    description: "Plaja sıfır, saatlik ücretli geniş otopark.",
    location_type: "paid-parking",
    lat: 36.8631,
    lng: 30.6506,
    city: "Antalya",
    region: "Antalya",
    phone: "+90 242 229 00 00",
    rating_avg: 4.0,
    rating_count: 210,
  }),
  createMockLocation({
    name: "Ölüdeniz Otoparkı",
    description: "Ölüdeniz plajına yakın, yoğun sezonda ücretli otopark.",
    location_type: "paid-parking",
    lat: 36.5487,
    lng: 29.1171,
    city: "Fethiye",
    region: "Muğla",
    rating_avg: 3.7,
    rating_count: 96,
  }),
  // free-parking
  createMockLocation({
    name: "Çıralı Sahil Park Alanı",
    description: "Çıralı plajı kenarında ücretsiz toprak zeminli park alanı.",
    location_type: "free-parking",
    lat: 36.4032,
    lng: 30.4779,
    city: "Kemer",
    region: "Antalya",
    rating_avg: 4.4,
    rating_count: 45,
  }),
  createMockLocation({
    name: "Adrasan Köyü Park Yeri",
    description: "Köy girişinde ücretsiz, gündüz-gece kullanılabilen park alanı.",
    location_type: "free-parking",
    lat: 36.3011,
    lng: 30.4652,
    city: "Kumluca",
    region: "Antalya",
    rating_avg: 4.2,
    rating_count: 28,
  }),
  // paid-tent
  createMockLocation({
    name: "Olympos Çadır Kampı",
    description: "Antik kent ve plaja yakın, ücretli çadır kurulum alanı.",
    location_type: "paid-tent",
    lat: 36.4092,
    lng: 30.4736,
    city: "Kumluca",
    region: "Antalya",
    phone: "+90 242 892 10 10",
    rating_avg: 4.7,
    rating_count: 163,
    accommodation_types: ["tent", "bungalow"],
  }),
  createMockLocation({
    name: "Butterfly Valley Çadır Alanı",
    description: "Vadi içinde, tekneyle veya yürüyerek ulaşılan ücretli çadır alanı.",
    location_type: "paid-tent",
    lat: 36.5083,
    lng: 29.1194,
    city: "Fethiye",
    region: "Muğla",
    rating_avg: 4.5,
    rating_count: 89,
    accommodation_types: ["tent"],
  }),
  // free-tent
  createMockLocation({
    name: "Gökçeören Yaylası Çadır Alanı",
    description: "Serin yayla havasında ücretsiz çadır kurulum noktası.",
    location_type: "free-tent",
    lat: 36.7192,
    lng: 29.2903,
    city: "Fethiye",
    region: "Muğla",
    rating_avg: 4.3,
    rating_count: 19,
    accommodation_types: ["tent"],
  }),
  createMockLocation({
    name: "Geyikbayırı Çadır Noktası",
    description: "Tırmanış bölgesi içinde, doğal ücretsiz çadır alanı.",
    location_type: "free-tent",
    lat: 36.7532,
    lng: 30.4574,
    city: "Antalya",
    region: "Antalya",
    rating_avg: 4.0,
    rating_count: 37,
    accommodation_types: ["tent"],
  }),
  // water
  createMockLocation({
    name: "Manavgat Su Doldurma Noktası",
    description: "Karavanlar için içme suyu doldurma musluğu.",
    location_type: "water",
    lat: 36.7867,
    lng: 31.4436,
    city: "Manavgat",
    region: "Antalya",
    rating_avg: 4.5,
    rating_count: 22,
  }),
  createMockLocation({
    name: "Demre Su İstasyonu",
    description: "Yol üzeri, 7/24 erişilebilir su doldurma noktası.",
    location_type: "water",
    lat: 36.2427,
    lng: 29.9793,
    city: "Demre",
    region: "Antalya",
    rating_avg: 4.1,
    rating_count: 14,
  }),
  // laundry
  createMockLocation({
    name: "Alanya Çamaşırhane Noktası",
    description: "Karavan sahiplerine özel jetonlu çamaşır yıkama imkanı.",
    location_type: "laundry",
    lat: 36.5389,
    lng: 32.0011,
    city: "Alanya",
    region: "Antalya",
    phone: "+90 242 512 44 55",
    rating_avg: 4.2,
    rating_count: 41,
  }),
  createMockLocation({
    name: "Kalkan Çamaşır Yıkama Alanı",
    description: "Küçük işletme bünyesinde saatlik çamaşır makinesi kiralama.",
    location_type: "laundry",
    lat: 36.2679,
    lng: 29.4152,
    city: "Kaş",
    region: "Antalya",
    rating_avg: 3.8,
    rating_count: 12,
  }),
  // shower
  createMockLocation({
    name: "Çıralı Duş Alanı",
    description: "Plaj girişinde ücretli sıcak duş kabinleri.",
    location_type: "shower",
    lat: 36.405,
    lng: 30.48,
    city: "Kemer",
    region: "Antalya",
    rating_avg: 4.0,
    rating_count: 33,
  }),
  createMockLocation({
    name: "Alanya Kleopatra Plajı Duş",
    description: "Belediye işletmesi, ücretsiz açık duş noktası.",
    location_type: "shower",
    lat: 36.5389,
    lng: 31.995,
    city: "Alanya",
    region: "Antalya",
    rating_avg: 3.9,
    rating_count: 58,
  }),
  // ekstra çeşitlilik için 2 kayıt daha
  createMockLocation({
    name: "Antalya Merkez Karavan Park",
    description: "Şehir merkezine yakın, güvenlikli ve elektrikli ücretli karavan parkı.",
    location_type: "paid-caravan",
    lat: 36.9,
    lng: 30.75,
    city: "Antalya",
    region: "Antalya",
    rating_avg: 4.4,
    rating_count: 67,
    accommodation_types: ["caravan"],
  }),
  createMockLocation({
    name: "Saklıkent Vadisi Çadır Alanı",
    description: "Kanyon girişinde ücretsiz, doğal gölgeli çadır alanı.",
    location_type: "free-tent",
    lat: 36.5106,
    lng: 29.375,
    city: "Fethiye",
    region: "Muğla",
    rating_avg: 4.6,
    rating_count: 25,
    accommodation_types: ["tent"],
  }),
];
