/**
 * Kamp.la Admin Paneli — PRD 5.R, 7.1, 7.2.
 * Faz 0: yalnızca boş/minimal iskelet. Moderasyon, kullanıcı yönetimi,
 * Excel/CSV içe aktarma vb. Faz 8'de bu uygulamaya eklenecek.
 * mobile-web ile aynı Supabase projesine bağlanır, fakat ayrı bir kod tabanı/deploy hedefidir.
 */
export default defineNuxtConfig({
  compatibilityDate: "2024-09-01",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Kamp.la — Yönetim Paneli",
      meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
    },
  },

  ssr: false,

  supabase: {
    redirect: false,
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },

  typescript: {
    shim: false,
  },
});
