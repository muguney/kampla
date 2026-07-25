import { defineStore } from "pinia";
import type { Database, Profile } from "@kampla/shared";

/** PRD 5.A — Supabase Auth entegrasyonu (Faz 1). */
export const useAuthStore = defineStore("auth", {
  state: () => ({
    profile: null as Profile | null,
    loading: false,
    error: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => state.profile !== null,
    isPremium: (state) => state.profile?.tier === "premium",
  },
  actions: {
    /** PRD 5.A — e-posta/şifre ile kayıt. `username` `auth.users.raw_user_meta_data`'ya
     * yazılır; `handle_new_user` tetikleyicisi `profiles` satırını buradan türetir. */
    async signUp(email: string, password: string, username: string) {
      this.loading = true;
      this.error = null;

      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      this.loading = false;

      if (error) {
        this.error = error.message;
        return { success: false, session: null };
      }

      if (data.session) {
        await this.fetchProfile();
      }

      return { success: true, session: data.session };
    },

    /** PRD 5.A — e-posta/şifre ile giriş. */
    async signIn(email: string, password: string) {
      this.loading = true;
      this.error = null;

      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.loading = false;
        this.error = error.message;
        return { success: false };
      }

      if (data.session) {
        await this.fetchProfile();
      }

      this.loading = false;
      return { success: true };
    },

    /** PRD 5.A — çıkış. */
    async signOut() {
      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.auth.signOut();

      if (error) {
        this.error = error.message;
        return { success: false };
      }

      this.profile = null;
      return { success: true };
    },

    /** PRD 5.A — şifremi unuttum: Supabase'in şifre sıfırlama e-postasını gönderir.
     * Kullanıcı e-postadaki linke tıklayınca `redirectTo`'ya (şimdilik `/giris`) döner.
     * Gerçek bir "yeni şifre belirle" sayfası henüz yok; bu MVP için yeterli. */
    async resetPasswordForEmail(email: string) {
      this.loading = true;
      this.error = null;

      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/giris`,
      });

      this.loading = false;

      if (error) {
        this.error = error.message;
        return { success: false };
      }

      return { success: true };
    },

    /** Giriş yapmış kullanıcının `profiles` satırını çeker ve state'e yazar. */
    async fetchProfile() {
      const supabase = useSupabaseClient<Database>();
      const user = useSupabaseUser();

      if (!user.value) {
        this.profile = null;
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.value.id)
        .single();

      if (error) {
        this.error = error.message;
        this.profile = null;
        return;
      }

      this.profile = data as Profile;
    },
  },
});
