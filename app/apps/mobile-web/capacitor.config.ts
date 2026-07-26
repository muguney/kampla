/**
 * Capacitor yapılandırması — PRD 7.1/7.2.
 * Faz 10: `@capacitor/core`/`@capacitor/cli` bağımlılıkları ve gerçek native
 * proje (ios/, android/) eklendi.
 */
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "la.kamp.app",
  appName: "Kamp.la",
  webDir: ".output/public",
  server: {
    androidScheme: "https",
  },
};

export default config;
