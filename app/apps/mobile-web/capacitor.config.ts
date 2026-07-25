/**
 * Capacitor yapılandırması — PRD 7.1/7.2.
 * Faz 0'da yalnızca yer tutucu; `@capacitor/core` ve `@capacitor/cli`
 * bağımlılıkları ve gerçek native proje (ios/, android/) Faz 10'da eklenecek.
 */
// import type { CapacitorConfig } from "@capacitor/cli";

const config /* : CapacitorConfig */ = {
  appId: "la.kamp.app",
  appName: "Kamp.la",
  webDir: ".output/public",
  server: {
    androidScheme: "https",
  },
};

export default config;
