/**
 * Kamp.la — Arama ekranı mock şehir/bölge önerileri (PRD 5.C).
 * Gerçek bir geocoding servisi (Faz 4/backend entegrasyonu) henüz yok;
 * bu yüzden `pages/ara.vue` bu sabit listeyi öneri olarak gösterir. Bir
 * öneriye tıklanınca `/?focus=<id>` query param'ıyla Ana Ekran'a
 * yönlendirilir, `pages/index.vue` bu id'yi aynı tablo üzerinden çözüp
 * haritayı `useMap().flyToCoordinates()` ile o bölgeye odaklar.
 */
export interface SearchSuggestion {
  id: string;
  label: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { id: "alanya", label: "Alanya", lat: 36.5463, lng: 31.9979, zoom: 12 },
  { id: "antalya", label: "Antalya", lat: 36.8969, lng: 30.7133, zoom: 11 },
  { id: "ankara", label: "Ankara", lat: 39.9334, lng: 32.8597, zoom: 10 },
  { id: "kas", label: "Kaş", lat: 36.2020, lng: 29.6398, zoom: 12 },
  { id: "fethiye", label: "Fethiye", lat: 36.6217, lng: 29.1164, zoom: 11 },
  { id: "kemer", label: "Kemer", lat: 36.6008, lng: 30.5589, zoom: 12 },
];
