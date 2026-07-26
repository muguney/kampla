import type { Database, Profile } from "@kampla/shared";

/**
 * Admin paneli giriş/yetkilendirme composable'ı (PRD 5.R, Faz 8).
 * `apps/admin/package.json`'da Pinia bağımlı değil (bkz. mobile-web'deki
 * `stores/auth.ts`), bu yüzden ortak state `useState` ile tutuluyor —
 * modül singleton'ı Pinia store'la aynı sorumluluğu görür, ekstra paket
 * eklemeden (bkz. görev kısıtı: yeni npm paketi ekleme).
 */
export function useAdminAuth() {
  const profile = useState<Profile | null>("admin-profile", () => null);
  const loading = useState<boolean>("admin-auth-loading", () => false);
  const error = useState<string | null>("admin-auth-error", () => null);

  const isAdmin = computed(() => profile.value?.role === "admin");

  /** Giriş yapmış kullanıcının `profiles` satırını çeker ve state'e yazar. */
  async function fetchProfile() {
    const supabase = useSupabaseClient<Database>();
    const user = useSupabaseUser();

    if (!user.value) {
      profile.value = null;
      return null;
    }

    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.value.id)
      .single();

    if (fetchError || !data) {
      profile.value = null;
      return null;
    }

    profile.value = data as Profile;
    return profile.value;
  }

  /**
   * E-posta/şifre ile giriş. Giriş başarılı olsa dahi `profiles.role !== 'admin'`
   * ise kullanıcı HEMEN signOut edilir — admin olmayan biri panele asla giremez.
   */
  async function signIn(email: string, password: string) {
    loading.value = true;
    error.value = null;

    const supabase = useSupabaseClient<Database>();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.session) {
      loading.value = false;
      error.value = signInError?.message ?? "Giriş başarısız.";
      return { success: false };
    }

    const fetched = await fetchProfile();

    if (!fetched || fetched.role !== "admin") {
      await supabase.auth.signOut();
      profile.value = null;
      loading.value = false;
      error.value = "Bu panel yalnızca yöneticiler içindir.";
      return { success: false };
    }

    loading.value = false;
    return { success: true };
  }

  async function signOut() {
    const supabase = useSupabaseClient<Database>();
    await supabase.auth.signOut();
    profile.value = null;
  }

  return { profile, loading, error, isAdmin, fetchProfile, signIn, signOut };
}
