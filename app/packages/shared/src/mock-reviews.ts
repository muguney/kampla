/**
 * Kamp.la — Mock yorum verisi (Faz 3, PRD 5.F "Yorumlar" sekmesi).
 * `reviews` tablosu Faz 5'te gerçek Supabase entegrasyonuna bağlanacak; şimdilik
 * POI Detay sayfasının Yorumlar sekmesini (dağılım grafiği, yorum kartları,
 * "Yorum yazın" akışı) test edebilmek için birkaç `MOCK_LOCATIONS` kaydına
 * sabit yorum atanmıştır. Kasıtlı olarak yalnızca birkaç POI'de yorum var —
 * geri kalanı "İlk yorumu sen yaz" boş durumunu (PRD 5.O) test eder.
 */
import type { Review } from "./types";

/** `Review` + görüntüleme için basit ek alanlar (gerçek şemada `profiles` JOIN ile gelir). */
export interface MockReview extends Review {
  username: string;
  avatar_url: string | null;
}

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: "mock-review-001",
    location_id: "mock-loc-001",
    user_id: "mock-user-derya",
    username: "deryayildiz",
    avatar_url: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    comment:
      "Denize sıfır, elektrik bağlantısı sorunsuz çalıştı. Sıcak duşlar gerçekten sıcaktı, market de site içinde olunca hiçbir şeye ihtiyaç duymadık. Kesinlikle tekrar geliriz.",
    created_at: "2026-05-14T18:20:00.000Z",
    updated_at: "2026-05-14T18:20:00.000Z",
  },
  {
    id: "mock-review-002",
    location_id: "mock-loc-001",
    user_id: "mock-user-ahmet",
    username: "kaptanahmet",
    avatar_url: "https://i.pravatar.cc/150?img=11",
    rating: 4,
    comment:
      "Genel olarak memnun kaldık, sadece hafta sonu oldukça kalabalıklaşıyor. Çamaşır makinesi için sıra bekledik ama alan temiz ve güvenliydi.",
    created_at: "2026-04-02T09:05:00.000Z",
    updated_at: "2026-04-02T09:05:00.000Z",
  },
  {
    id: "mock-review-003",
    location_id: "mock-loc-001",
    user_id: "mock-user-leyla",
    username: "dogaseverleyla",
    avatar_url: "https://i.pravatar.cc/150?img=25",
    rating: 5,
    comment: "Wifi hızlı, personel ilgili. Çocuk oyun alanı sayesinde ailece çok keyifli vakit geçirdik.",
    created_at: "2026-02-20T11:40:00.000Z",
    updated_at: "2026-02-20T11:40:00.000Z",
  },
  {
    id: "mock-review-004",
    location_id: "mock-loc-005",
    user_id: "mock-user-mert",
    username: "karavanci_mert",
    avatar_url: "https://i.pravatar.cc/150?img=32",
    rating: 4,
    comment: "Plaja çok yakın, saatlik ücret makul. Sadece yaz aylarında yer bulmak biraz zor olabiliyor.",
    created_at: "2026-06-10T07:30:00.000Z",
    updated_at: "2026-06-10T07:30:00.000Z",
  },
  {
    id: "mock-review-005",
    location_id: "mock-loc-005",
    user_id: "mock-user-baris",
    username: "kampcibaris",
    avatar_url: "https://i.pravatar.cc/150?img=8",
    rating: 3,
    comment: "Otopark güvenli ama tuvaletler akşamları kapanıyor, biraz erken saatte gitmek lazım.",
    created_at: "2026-01-18T15:00:00.000Z",
    updated_at: "2026-01-18T15:00:00.000Z",
  },
  {
    id: "mock-review-006",
    location_id: "mock-loc-009",
    user_id: "mock-user-tirmanis",
    username: "tirmanissever",
    avatar_url: "https://i.pravatar.cc/150?img=15",
    rating: 5,
    comment:
      "Antik kente yürüme mesafesi harika, ateş yakma alanı ve mangal imkanı akşamları çok keyifliydi. Sezon içi mutlaka önceden yer ayırtın.",
    created_at: "2026-03-05T20:15:00.000Z",
    updated_at: "2026-03-05T20:15:00.000Z",
  },
];

/** Bir POI'ye ait mock yorumları döndürür (en yeni önce). */
export function getReviewsForLocation(locationId: string): MockReview[] {
  return MOCK_REVIEWS.filter((review) => review.location_id === locationId).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
