<script setup lang="ts">
/**
 * Bildirimler — PRD 5.Q. Faz 7: `notifications` tablosuna bağlandı
 * (bkz. stores/notifications.ts, supabase/migrations/0011_notification_triggers.sql).
 *
 * PRD 5.A gereği bu bir "aksiyon" niteliğindeki kişisel veri sayfası —
 * konum-ekle sihirbazı/Harita Listelerim ile aynı desende `middleware: ['auth']`
 * ile korunuyor (misafir kullanıcı görmemeli, girişe yönlendirilir).
 */
import type { Notification } from "@kampla/shared";

definePageMeta({ middleware: ["auth"] });

usePageTitle("pages.notifications.title");

const { t, locale } = useI18n();
const router = useRouter();
const notificationsStore = useNotificationsStore();

onMounted(() => {
  notificationsStore.fetchNotifications();
});

const notifications = computed(() => notificationsStore.notifications);
const unreadCount = computed(() => notificationsStore.unreadCount);
const isLoading = computed(() => notificationsStore.isLoading);

/** Basit göreli zaman formatlaması — ek bir tarih kütüphanesi eklenmedi
 * (kapsam küçük, `Intl`/native `Date` yeterli). 30 günden eskiyse mutlak
 * tarihe düşer (bkz. pages/listelerim/[id].vue `createdAtLabel` deseni). */
function relativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return t("pages.notifications.relativeTime.justNow");
  if (diffMin < 60) return t("pages.notifications.relativeTime.minutesAgo", { count: diffMin });

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return t("pages.notifications.relativeTime.hoursAgo", { count: diffHour });

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return t("pages.notifications.relativeTime.daysAgo", { count: diffDay });

  return new Intl.DateTimeFormat(locale.value === "en" ? "en-GB" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
}

/** Bildirime tıklanınca okundu işaretlenir; `related_location_id` varsa konum
 * detayına yönlendirilir. `related_report_id` için ayrı bir "raporum" detay
 * sayfası henüz yok (Faz 8 admin panel kapsamı) — bu durumda sessizce sadece
 * okundu işaretlenir. */
async function onNotificationClick(notification: Notification) {
  await notificationsStore.markAsRead(notification.id);

  if (notification.related_location_id) {
    await router.push(`/konum/${notification.related_location_id}`);
  }
}

function onMarkAllAsRead() {
  notificationsStore.markAllAsRead();
}
</script>

<template>
  <div class="flex flex-col gap-3 p-4">
    <div v-if="unreadCount > 0" class="flex justify-end">
      <button
        type="button"
        class="text-sm font-semibold text-brand-orange"
        @click="onMarkAllAsRead"
      >
        {{ t("pages.notifications.markAllAsRead") }}
      </button>
    </div>

    <div
      v-if="isLoading && notifications.length === 0"
      class="py-16 text-center text-sm text-brand-charcoal/60 dark:text-neutral-400"
    >
      {{ t("common.loading") }}
    </div>

    <UiEmptyState
      v-else-if="notifications.length === 0"
      icon="🔔"
      :title="t('emptyState.notifications.title')"
    />

    <div v-else class="flex flex-col gap-2">
      <button
        v-for="notification in notifications"
        :key="notification.id"
        type="button"
        class="kl-card flex flex-col gap-1 border-l-4 px-4 py-3 text-left transition-colors"
        :class="notification.is_read ? 'border-transparent' : 'border-brand-orange bg-brand-orange/5'"
        @click="onNotificationClick(notification)"
      >
        <p
          class="text-sm text-brand-charcoal dark:text-neutral-100"
          :class="notification.is_read ? 'font-normal' : 'font-semibold'"
        >
          {{ notification.content }}
        </p>
        <span class="text-xs text-brand-charcoal/50 dark:text-neutral-500">
          {{ relativeTime(notification.created_at) }}
        </span>
      </button>
    </div>
  </div>
</template>
