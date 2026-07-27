import type { Amenity } from "@kampla/shared";

/**
 * PRD 6.2 — 19 hizmet/imkan için GERÇEK Figma ikon export'u eşlemesi.
 *
 * Kaynak: Mustafa'nın kendi makinesinde Figma'dan elle export ettiği
 * `design/icons-export/Group 171.svg` .. `Group 188.svg` (18 dosya) +
 * `Frame.svg` (dryer — orijinalde arkaplansız export edilmiş, bkz.
 * `public/icons/amenities/dryer.svg` içindeki not). `Group 189.svg` boş bir
 * artboard olarak bulundu (yalnızca arkaplan dikdörtgeni, glif yok) —
 * kullanılmadı.
 *
 * Eşleştirme yöntemi: 19 dosyanın Figma katman adı yoktu (hepsi "Group
 * 17x/18x"), bu yüzden her SVG'nin path verisi görsel olarak render edilip
 * `design/20-Konum Ekle - Hizmetler.png` (gerçek Figma ekran görüntüsü,
 * TÜRKÇE ETİKETLERLE ve TAM OLARAK AYNI SIRADA — `AMENITIES` dizisiyle
 * birebir eşleşiyor) ile karşılaştırıldı. Her satırın ikonu + etiketi bu
 * dosyaların dosya adına bakılmaksızın kesin olarak eşleştirildi.
 *
 * Dosyalar `public/icons/amenities/<amenity-key>.svg` altına bu isimlerle
 * kopyalandı (AMENITIES dizisindeki key'lerle birebir aynı).
 */
export const AMENITY_ICON_PATHS: Record<Amenity, string> = {
  shower: "/icons/amenities/shower.svg",
  electricity: "/icons/amenities/electricity.svg",
  fridge: "/icons/amenities/fridge.svg",
  "vehicle-entry": "/icons/amenities/vehicle-entry.svg",
  "hot-shower": "/icons/amenities/hot-shower.svg",
  "near-sea": "/icons/amenities/near-sea.svg",
  "campfire-grill": "/icons/amenities/campfire-grill.svg",
  "pet-friendly": "/icons/amenities/pet-friendly.svg",
  "washing-machine": "/icons/amenities/washing-machine.svg",
  "paid-general": "/icons/amenities/paid-general.svg",
  "gsm-signal": "/icons/amenities/gsm-signal.svg",
  "toilet-drain": "/icons/amenities/toilet-drain.svg",
  "water-fill": "/icons/amenities/water-fill.svg",
  "caravan-waste-drain": "/icons/amenities/caravan-waste-drain.svg",
  "free-wifi": "/icons/amenities/free-wifi.svg",
  toilet: "/icons/amenities/toilet.svg",
  "market-nearby": "/icons/amenities/market-nearby.svg",
  playground: "/icons/amenities/playground.svg",
  dryer: "/icons/amenities/dryer.svg",
};

export function useAmenityIcon() {
  function amenityIconSrc(amenity: Amenity): string {
    return AMENITY_ICON_PATHS[amenity];
  }
  return { AMENITY_ICON_PATHS, amenityIconSrc };
}
