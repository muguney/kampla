import type { Config } from "tailwindcss";
import { tailwindThemeExtend } from "@kampla/shared";

export default <Partial<Config>>{
  darkMode: "class",
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: tailwindThemeExtend,
  },
  safelist: [
    // `pages/konumlar/index.vue` konum türü seçici, POI kategori rengini
    // dinamik olarak (`bg-poi-${type}`) oluşturuyor — JIT tarayıcısı bunu
    // statik metinde bulamadığı için safelist gerekiyor (bkz. aynı desen
    // `apps/mobile-web/tailwind.config.ts`).
    ...Object.keys(tailwindThemeExtend.colors.poi).flatMap((key) => [`bg-poi-${key}`]),
  ],
  plugins: [],
};
