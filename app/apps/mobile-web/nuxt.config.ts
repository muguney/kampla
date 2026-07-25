// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-09-01",
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/supabase",
  ],

  css: ["maplibre-gl/dist/maplibre-gl.css", "~/assets/css/main.css"],

  app: {
    head: {
      title: "Kamp.la",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
        {
          name: "description",
          content:
            "Kamp.la — kamp, karavan ve doğa alanlarını harita üzerinde keşfet, ekle, paylaş.",
        },
        { name: "theme-color", content: "#F2884B" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap",
        },
      ],
    },
  },

  // Faz 0: yalnızca istemci tarafı (SPA) modu — SSR gerektiren public sayfalar
  // (paylaşılan profil/liste, PRD 5.J/5.K) sonraki fazlarda route-bazlı açılacak.
  ssr: false,

  runtimeConfig: {
    public: {
      maptilerKey: process.env.NUXT_PUBLIC_MAPTILER_KEY || "",
      r2PublicUrl: process.env.NUXT_PUBLIC_R2_PUBLIC_URL || "",
      appName: "Kamp.la",
    },
  },

  supabase: {
    // Faz 0'da auth henüz yok (Faz 1) — misafir gezinme PRD 5.A gereği serbest,
    // bu yüzden route middleware'i (redirect) kapalı bırakılıyor.
    redirect: false,
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },

  i18n: {
    // v10 varsayılanı: dosyalar `<rootDir>/i18n/locales/` altından okunur.
    defaultLocale: "tr",
    strategy: "no_prefix",
    locales: [
      { code: "tr", language: "tr-TR", name: "Türkçe", file: "tr.json" },
      { code: "en", language: "en-US", name: "English", file: "en.json" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "kampla_locale",
      redirectOn: "root",
    },
  },

  typescript: {
    shim: false,
  },

  vite: {
    optimizeDeps: {
      exclude: ["@kampla/shared"],
    },
  },
});
