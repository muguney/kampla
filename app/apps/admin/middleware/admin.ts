/**
 * Admin panel route guard (PRD 5.R, Faz 8). Sayfa bazlı uygulanır:
 * `definePageMeta({ middleware: 'admin' })`. Oturum yoksa veya
 * `profiles.role !== 'admin'` ise `/giris`'e yönlendirir — admin olmayan
 * bir kullanıcı asla panel içeriğini göremez.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === "/giris") return;

  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo(`/giris?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  const { profile, fetchProfile } = useAdminAuth();

  if (!profile.value) {
    await fetchProfile();
  }

  if (!profile.value || profile.value.role !== "admin") {
    return navigateTo("/giris");
  }
});
