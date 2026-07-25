/**
 * Kamp.la — Merkezi tasarım tokenları (PRD Bölüm 2.3 ve 6.1)
 *
 * NOT: Renkler Figma tasarımlarından görsel olarak tahmin edilmiştir.
 * Kesin hex değerleri Figma "Inspect" panelinden alınıp burada güncellenmelidir
 * (bkz. PRD.md üst kısmındaki uyarı notu).
 *
 * Bu dosya hem `apps/mobile-web/tailwind.config.ts` hem de
 * `apps/admin/tailwind.config.ts` tarafından import edilir — tek kaynak.
 */

/** Marka / kurumsal kimlik renkleri (PRD 2.3) */
export const brandColors = {
  orange: {
    DEFAULT: "#F2884B",
    dark: "#D9723A",
    light: "#F7A876",
  },
  charcoal: {
    DEFAULT: "#3B3B3B",
    soft: "#5A5A58",
  },
  cream: "#F1EDE9",
  white: "#FFFFFF",
} as const;

/**
 * 9 POI kategorisi renk kodlaması (PRD 6.1 — "anlamsal renk kodlama sistemi").
 * Anahtarlar `location_type` enum değerleriyle birebir eşleşir (bkz. supabase/migrations).
 */
export const poiColors = {
  "paid-caravan": "#E8604C", // Ücretli Karavan Parkı
  "free-caravan": "#F2884B", // Ücretsiz Karavan Parkı
  "paid-parking": "#C2622E", // Ücretli Park Alanı
  "free-parking": "#8A6D3B", // Ücretsiz Park Alanı
  "paid-tent": "#8B5CF6", // Ücretli Çadır Alanı
  "free-tent": "#4CAF6D", // Ücretsiz Çadır Alanı
  water: "#3B9FD6", // Su Doldurma Yeri
  laundry: "#06B6D4", // Çamaşır Yıkama Yeri
  shower: "#F4C430", // Duş Alanı
} as const;

/** Referans/bilgi katmanı (PRD 6.5) — kullanıcı POI kategorilerinden ayrı renkler */
export const referenceColors = {
  "national-park": "#3E8E5B",
  plateau: "#3E8E5B",
  historic: "#3B9FD6",
} as const;

/** Puanlama yıldızı rengi (PRD 2.3) */
export const ratingColor = "#F4C430";

export const fontFamily = {
  sans: [
    "Baloo 2",
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
