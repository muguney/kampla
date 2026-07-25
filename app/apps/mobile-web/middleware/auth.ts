/**
 * PRD 5.A — sayfa bazlı auth guard.
 * Misafir kullanıcı harita/arama gibi genel ekranları serbestçe gezebilir; ekran
 * seviyesinde genel bir kısıtlama yok. Bu middleware yalnızca "aksiyon" niteliğindeki
 * sayfalara (örn. konum ekleme sihirbazının tamamı) `definePageMeta({ middleware: ['auth'] })`
 * ile sayfa bazında uygulanır — global middleware DEĞİLDİR.
 *
 * Girişe yönlendirirken `redirect` query'sinde gelinen sayfa taşınır; `giris.vue`
 * başarılı girişten sonra bu query'yi okuyup kullanıcıyı kaldığı yere geri döndürür.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Supabase oturumu zaten var ama `profile` henüz çekilmediyse (örn. sayfa doğrudan
  // yenilendi), isLoggedIn'e karar vermeden önce bir kez profili çekmeyi dene.
  if (!authStore.isLoggedIn) {
    const user = useSupabaseUser();
    if (user.value) {
      await authStore.fetchProfile();
    }
  }

  if (!authStore.isLoggedIn) {
    return navigateTo(`/giris?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
