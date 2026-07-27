import { defineStore } from "pinia";
import type { Database, Notification } from "@kampla/shared";

/**
 * PRD 5.Q / 6.11 — Uygulama içi bildirimler.
 * Bildirimler yalnızca DB tetikleyicileri tarafından otomatik oluşturulur
 * (bkz. supabase/migrations/0011_notification_triggers.sql — konum onay/red,
 * hata bildirimi durum değişimi); istemci tarafında `insert` YOKTUR (zaten
 * RLS `notifications_insert_admin` politikasıyla engelleniyor, bkz.
 * 0008_notifications.sql). Bu store yalnızca okuma + okundu işaretleme yapar.
 */
export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: [] as Notification[],
    isLoading: false,
    error: null as string | null,
  }),
  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.is_read).length,
  },
  actions: {
    /** Giriş yapmış kullanıcının tüm bildirimlerini en yeniden eskiye çeker.
     * Misafirse (`profile` yok) state'i boşaltıp sessizce çıkar. */
    async fetchNotifications() {
      const authStore = useAuthStore();
      const profileId = authStore.profile?.id;

      if (!profileId) {
        this.notifications = [];
        return;
      }

      this.isLoading = true;
      this.error = null;

      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_id", profileId)
        .order("created_at", { ascending: false });

      this.isLoading = false;

      if (error) {
        this.error = error.message;
        return;
      }

      this.notifications = (data ?? []) as Notification[];
    },

    /** Tek bir bildirimi okundu olarak işaretler (kullanıcı bildirime tıklayınca
     * çağrılır, bkz. pages/bildirimler.vue). İyimser güncelleme yapılır — hata
     * durumunda geri alınır. */
    async markAsRead(id: string): Promise<void> {
      const target = this.notifications.find((n) => n.id === id);
      if (!target || target.is_read) return;

      target.is_read = true;

      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) {
        target.is_read = false;
        this.error = error.message;
      }
    },

    /** Tüm okunmamış bildirimleri tek seferde okundu yapar ("Tümünü okundu
     * işaretle" aksiyonu). RLS zaten `recipient_id = auth.uid()` ile
     * kısıtladığı için filtre olarak yalnızca `is_read = false` yeterli,
     * ama açıklık için `recipient_id` de eklenir. */
    async markAllAsRead(): Promise<void> {
      const authStore = useAuthStore();
      const profileId = authStore.profile?.id;
      if (!profileId) return;

      const hadUnread = this.notifications.some((n) => !n.is_read);
      if (!hadUnread) return;

      this.notifications.forEach((n) => {
        n.is_read = true;
      });

      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("recipient_id", profileId)
        .eq("is_read", false);

      if (error) {
        this.error = error.message;
        // Not: burada satır satır geri alma yapılmıyor; bir sonraki
        // fetchNotifications() çağrısı gerçek durumu senkronize eder.
      }
    },
  },
});
