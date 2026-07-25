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
  plugins: [],
};
