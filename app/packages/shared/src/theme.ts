/**
 * Kamp.la — Merkezi tasarım tokenları (PRD Bölüm 2.3 ve 6.1)
 *
 * GÜNCELLEME (2026-07-26): `brandColors.orange`/`brandColors.charcoal` ve
 * `ratingColor`, Figma connector bağlandıktan sonra `get_design_context` ile
 * 3 ekrandan (node 52:218, 160:1313, 64:4384) doğrudan okunan gerçek hex
 * değerleriyle güncellendi (bu 3 node'un ikisinde de tutarlı şekilde
 * "Primary: #FE8542", "Black: #444444" olarak raporlandı). `dark`/`light`
 * tonları Figma'da ayrı token olarak yok — eski oran korunarak yeniden
 * hesaplandı (hover/active state'leri için).
 *
 * GÜNCELLEME (2026-07-26, ikinci tur): Mustafa Figma'dan TÜM ikonları
 * (design/icons-export/*.svg) gerçek export olarak indirdi. `poiColors`
 * artık bu SVG'lerin `fill` değerlerinden birebir okunan gerçek hex
 * kodları (paid-parking hariç — bkz. aşağıdaki not, görsel doğrulama
 * bekliyor). `referenceColors` hâlâ görsel tahmin (ilgili ikon export
 * edilmedi).
 *
 * Bu dosya hem `apps/mobile-web/tailwind.config.ts` hem de
 * `apps/admin/tailwind.config.ts` tarafından import edilir — tek kaynak.
 */

/** Marka / kurumsal kimlik renkleri (PRD 2.3) */
export const brandColors = {
  orange: {
    DEFAULT: "#FE8542",
    dark: "#E56F31",
    light: "#FFA56D",
  },
  charcoal: {
    DEFAULT: "#444444",
    soft: "#636361",
  },
  cream: "#F1EDE9",
  white: "#FFFFFF",
} as const;

/**
 * 9 POI kategorisi renk kodlaması (PRD 6.1 — "anlamsal renk kodlama sistemi").
 * Anahtarlar `location_type` enum değerleriyle birebir eşleşir (bkz. supabase/migrations).
 */
export const poiColors = {
  "paid-caravan": "#FF6868", // Ücretli Karavan Parkı — design/icons-export/van-1.svg + van-2.svg (pin) fill
  "free-caravan": "#FE8542", // Ücretsiz Karavan Parkı — van-free-1.svg + van-free-2.svg fill (marka turuncusuyla aynı)
  "paid-parking": "#70C8EE", // Ücretli Park Alanı — park-3.svg fill (TAHMİNİ eşleşme: bu kategorinin pin/40x49 varyantı export'ta yok, park-2/park-4 yeşil çiftiyle karşılaştırınca "kalan" renk budur — bir sonraki Figma incelemesinde Chrome ile görsel doğrulanmalı)
  "free-parking": "#93DC5A", // Ücretsiz Park Alanı — park-2.svg + park-4.svg (pin) fill
  "paid-tent": "#C26BEB", // Ücretli Çadır Alanı — tent-1.svg + tent-2.svg (pin) fill
  "free-tent": "#4AB937", // Ücretsiz Çadır Alanı — tent-free-1.svg + tent-free-2.svg (pin) fill
  water: "#38B3E8", // Su Doldurma Yeri — water-1.svg + water-2.svg (pin) fill
  laundry: "#2A6CB9", // Çamaşır Yıkama Yeri — laundry-1.svg + laundry-2.svg (pin) fill
  shower: "#2AB9B9", // Duş Alanı — shower-1.svg + shower-2.svg (pin) fill (shower-3.svg #FF0000 kategoriyle alakasız görünüyor, kullanılmadı)
} as const;

/** Referans/bilgi katmanı (PRD 6.5) — kullanıcı POI kategorilerinden ayrı renkler */
export const referenceColors = {
  "national-park": "#3E8E5B",
  plateau: "#3E8E5B",
  historic: "#3B9FD6",
} as const;

/** Puanlama yıldızı rengi — Figma node 64:4384 ("Warning: #FFCA41") */
export const ratingColor = "#FFCA41";

export const fontFamily = {
  sans: [
    "Saira",
    "ui-rounded",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "sans-serif",
  ],
} as const;

/** Tailwind theme.extend içine olduğu gibi taşınabilecek nesne */
export const tailwindThemeExtend = {
  colors: {
    brand: {
      orange: brandColors.orange.DEFAULT,
      "orange-dark": brandColors.orange.dark,
      "orange-light": brandColors.orange.light,
      charcoal: brandColors.charcoal.DEFAULT,
      "charcoal-soft": brandColors.charcoal.soft,
      cream: brandColors.cream,
    },
    poi: poiColors,
    reference: referenceColors,
  },
  fontFamily,
  borderRadius: {
    card: "1.25rem",
    control: "0.9rem",
    pill: "999px",
  },
};

export type PoiColorKey = keyof typeof poiColors;
