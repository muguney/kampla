import type { Config } from "tailwindcss";
import { tailwindThemeExtend } from "@kampla/shared";

export default <Partial<Config>>{
  darkMode: "class",
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./composables/**/*.{js,ts}",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: tailwindThemeExtend,
  },
  safelist: [
    // POI kategori renkleri dinamik olarak (`bg-poi-${type}`) oluşturuluyor,
    // JIT tarayıcısı bunları statik metinde bulamadığı için safelist gerekiyor.
    ...Object.keys(tailwindThemeExtend.colors.poi).flatMap((key) => [
      `bg-poi-${key}`,
      `text-poi-${key}`,
      `border-poi-${key}`,
    ]),
  ],
  plugins: [],
};
