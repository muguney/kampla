/**
 * Kamp.la — Mock POI verisi (Faz 2-3, PRD 5.B / 5.F)
 * Gerçek `locations` tablosu henüz backend'e bağlanmadığı için Ana Ekran
 * haritasında, özet kartlarda ve POI Detay sayfasında (Faz 3) gösterim/etkileşim
 * testi amacıyla kullanılan sabit örnek veri. `Location` tipini birebir kullanır
 * (şemayı bozmaz); kart/detay görünümü için gereken ek alanlar (`photo_url`,
 * `photo_urls`, `amenities`, `created_by_username`, `created_by_avatar_url`)
 * ayrı bir `MockLocationCard` tipiyle eklenir — gerçek şemada bunlar ilişkili
 * tablolardan (`location_amenities`, `profiles` JOIN) gelecektir.
 *
 * Koordinatlar gerçek Türkiye kamp/karavan bölgelerine (Alanya, Antalya,
 * Kemer, Kaş, Fethiye civarı) yaklaşık olarak yerleştirilmiştir.
 */
import type { Location } from "./types";
import type { Amenity, LocationType } from "./constants";

/** `Location` + kart/detay görünümü için basit ek alanlar (şema değişikliği değildir). */
export interface MockLocationCard extends Location {
  /** Kart önizlemesinde gösterilecek fotoğraf — mock veride gerçek URL yoksa null (renkli blok gösterilir). */
  photo_url: string | null;
  /** POI Detay sayfasındaki kaydırılabilir galeri (PRD 5.F) — 2-4 fotoğraf. Gerçek şemada ayrı bir `location_photos` tablosundan gelecektir. */
  photo_urls: string[];
  /** PRD 6.2 — `location_amenities` ilişkisinin mock temsili (yalnızca bu POI'nin sahip olduğu hizmetler). */
  amenities: Amenity[];
  /** `created_by` (Profile.id) için mock görüntü alanları — gerçek şemada `profiles` JOIN ile gelir. `null` ise Kamp.la ekibi tarafından eklenmiş kabul edilir. */
  created_by_username: string | null;
  created_by_avatar_url: string | null;
}

let mockIdCounter = 1;
const MOCK_TIMESTAMP = "2026-06-01T00:00:00.000Z";

/** Birkaç POI'de tekrar kullanılan sahte kullanıcılar (PRD 5.F "kim tarafından eklendi"). */
export const MOCK_AUTHORS = {
  derya: { username: "deryayildiz", avatar_url: "https://i.pravatar.cc/150?img=47" },
  ahmet: { username: "kaptanahmet", avatar_url: "https://i.pravatar.cc/150?img=11" },
  mert: { username: "karavanci_mert", avatar_url: "https://i.pravatar.cc/150?img=32" },
  leyla: { username: "dogaseverleyla", avatar_url: "https://i.pravatar.cc/150?img=25" },
  baris: { username: "kampcibaris", avatar_url: "https://i.pravatar.cc/150?img=8" },
  tirmanis: { username: "tirmanissever", avatar_url: "https://i.pravatar.cc/150?img=15" },
  kleopatra: { username: "kleopatrafan", avatar_url: "https://i.pravatar.cc/150?img=5" },
  vadi: { username: "vadigezgini", avatar_url: "https://i.pravatar.cc/150?img=20" },
} as const;

function createMockLocation(
  overrides: Partial<MockLocationCard> & {
    name: string;
    location_type: LocationType;
    lat: number;
    lng: number;
  }
): MockLocationCard {
  const id = overrides.id ?? `mock-loc-${String(mockIdCounter++).padStart(3, "0")}`;

  // Galeri belirtilmemişse deterministik olarak 3 placeholder fotoğraf üretilir
  // (picsum.photos/seed/<id>-<n> — her POI için sabit ama farklı görseller).
  const photoUrls =
    overrides.photo_urls ?? [0, 1, 2].map((n) => `https://picsum.photos/seed/${id}-${n}/900/600`);

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
    amenities: [],
    created_by_username: null,
    created_by_avatar_url: null,
    ...overrides,
    id,
    photo_urls: photoUrls,
    photo_url: overrides.photo_url ?? photoUrls[0] ?? null,
  };
}

/** Faz 2/3 Ana Ekran haritası + POI Detay sayfası için mock POI listesi (en az 2 örnek / 9 kategori). */
export const MOCK_LOCATIONS: MockLocationCard[] = [
  // paid-caravan
  createMockLocation({
    name: "Alanya Karavan Parkı",
    description:
      "Deniz manzaralı, elektrik bağlantılı ücretli karavan parkı. Sıcak duş, market ve çamaşır imkanları mevcut, karavan atık suyu boşaltma noktası da site içinde.",
    location_type: "paid-caravan",
    lat: 36.5463,
    lng: 31.9979,
    city: "Alanya",
    region: "Antalya",
    phone: "+90 242 511 22 33",
    website_url: "https://alanyakaravanparki.example.com",
    facebook_url: "https://facebook.com/alanyakaravanparki",
    instagram_url: "https://instagram.com/alanyakaravanparki",
    rating_avg: 4.6,
    rating_count: 128,
    accommodation_types: ["caravan"],
    amenities: [
      "electricity",
      "shower",
      "hot-shower",
      "toilet",
      "water-fill",
      "free-wifi",
      "market-nearby",
      "caravan-waste-drain",
      "near-sea",
      "playground",
    ],
    created_by: "mock-user-derya",
    created_by_username: MOCK_AUTHORS.derya.username,
    created_by_avatar_url: MOCK_AUTHORS.derya.avatar_url,
    created_at: "2025-11-12T09:15:00.000Z",
    photo_urls: [0, 1, 2, 3].map((n) => `https://picsum.photos/seed/alanya-karavan-${n}/900/600`),
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
    amenities: ["shower", "toilet", "electricity", "near-sea", "gsm-signal", "pet-friendly"],
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
    amenities: ["near-sea", "campfire-grill", "vehicle-entry", "gsm-signal", "pet-friendly"],
    created_by: "mock-user-ahmet",
    created_by_username: MOCK_AUTHORS.ahmet.username,
    created_by_avatar_url: MOCK_AUTHORS.ahmet.avatar_url,
    created_at: "2025-08-02T14:00:00.000Z",
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
    amenities: ["vehicle-entry", "near-sea", "gsm-signal"],
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
    website_url: "https://antalya.bel.tr/konyaalti-otopark",
    x_url: "https://x.com/konyaaltiotopark",
    rating_avg: 4.0,
    rating_count: 210,
    amenities: ["toilet", "shower", "market-nearby", "free-wifi", "gsm-signal", "paid-general"],
    created_by: "mock-user-leyla",
    created_by_username: MOCK_AUTHORS.leyla.username,
    created_by_avatar_url: MOCK_AUTHORS.leyla.avatar_url,
    created_at: "2025-05-20T10:00:00.000Z",
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
    amenities: ["toilet", "paid-general", "gsm-signal"],
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
    amenities: ["near-sea", "vehicle-entry", "gsm-signal", "campfire-grill"],
    created_by: "mock-user-mert",
    created_by_username: MOCK_AUTHORS.mert.username,
    created_by_avatar_url: MOCK_AUTHORS.mert.avatar_url,
    created_at: "2025-09-10T08:30:00.000Z",
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
    amenities: ["vehicle-entry", "gsm-signal"],
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
    website_url: "https://olymposcadirkampi.example.com",
    instagram_url: "https://instagram.com/olymposcadirkampi",
    youtube_url: "https://youtube.com/@olymposcadirkampi",
    rating_avg: 4.7,
    rating_count: 163,
    accommodation_types: ["tent", "bungalow"],
    season: "summer",
    amenities: [
      "shower",
      "hot-shower",
      "toilet",
      "electricity",
      "near-sea",
      "campfire-grill",
      "market-nearby",
      "free-wifi",
      "washing-machine",
      "dryer",
    ],
    created_by: "mock-user-baris",
    created_by_username: MOCK_AUTHORS.baris.username,
    created_by_avatar_url: MOCK_AUTHORS.baris.avatar_url,
    created_at: "2025-04-01T12:00:00.000Z",
    photo_urls: [0, 1, 2].map((n) => `https://picsum.photos/seed/olympos-cadir-${n}/900/600`),
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
    season: "summer",
    amenities: ["near-sea", "campfire-grill", "toilet", "gsm-signal"],
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
    season: "summer",
    amenities: ["campfire-grill", "water-fill", "pet-friendly"],
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
    amenities: ["campfire-grill", "vehicle-entry", "pet-friendly", "gsm-signal"],
    created_by: "mock-user-tirmanis",
    created_by_username: MOCK_AUTHORS.tirmanis.username,
    created_by_avatar_url: MOCK_AUTHORS.tirmanis.avatar_url,
    created_at: "2025-07-04T16:45:00.000Z",
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
    amenities: ["water-fill", "caravan-waste-drain"],
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
    amenities: ["water-fill"],
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
    amenities: ["washing-machine", "dryer", "free-wifi", "paid-general"],
    created_by: "mock-user-mert",
    created_by_username: MOCK_AUTHORS.mert.username,
    created_by_avatar_url: MOCK_AUTHORS.mert.avatar_url,
    created_at: "2025-10-01T11:00:00.000Z",
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
    amenities: ["washing-machine", "dryer", "paid-general"],
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
    amenities: ["shower", "hot-shower", "toilet", "paid-general"],
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
    amenities: ["shower", "toilet", "near-sea"],
    created_by: "mock-user-kleopatra",
    created_by_username: MOCK_AUTHORS.kleopatra.username,
    created_by_avatar_url: MOCK_AUTHORS.kleopatra.avatar_url,
    created_at: "2025-06-18T09:00:00.000Z",
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
    website_url: "https://antalyamerkezkaravan.example.com",
    rating_avg: 4.4,
    rating_count: 67,
    accommodation_types: ["caravan"],
    amenities: ["electricity", "shower", "toilet", "free-wifi", "gsm-signal", "market-nearby", "caravan-waste-drain"],
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
    amenities: ["campfire-grill", "water-fill", "vehicle-entry", "pet-friendly"],
    created_by: "mock-user-vadi",
    created_by_username: MOCK_AUTHORS.vadi.username,
    created_by_avatar_url: MOCK_AUTHORS.vadi.avatar_url,
    created_at: "2025-03-15T13:20:00.000Z",
  }),
];
