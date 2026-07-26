<script setup lang="ts">
/**
 * Menü (Hamburger) — PRD Bölüm 4/7.
 * PRD 5.A: giriş yapmamış kullanıcıda "Giriş Yap" ayrı bir madde olarak durur;
 * giriş yapmış kullanıcıda "Çıkış Yap" + "Hesabım" gösterilir.
 *
 * Faz 7 notu: Bottom nav'da (5 sabit sekme) veya TopBar'da "Bildirimler" için
 * ayrı bir ikon/link yok (bkz. components/layout/BottomNav.vue, TopBar.vue —
 * tasarımda yer ayrılmamış). Bu yüzden PRD 5.Q gereği en azından buraya,
 * yalnızca giriş yapmış kullanıcıya görünen bir "Bildirimler" satırı +
 * okunmamış sayısı rozeti eklendi.
 */
usePageTitle("pages.menu.title");

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();

onMounted(() => {
  if (authStore.isLoggedIn) {
    notificationsStore.fetchNotifications();
  }
});

const unreadBadge = computed(() => {
  const count = notificationsStore.unreadCount;
  if (count <= 0) return "";
  return count > 9 ? "9+" : String(count);
});

type MenuItem = { to: string; labelKey: string; icon: string; badge?: string };

const items = computed<MenuItem[]>(() => [
  { to: "/konum-ekle/1", labelKey: "menu.addLocation", icon: "➕" },
  ...(authStore.isLoggedIn
    ? [{ to: "/bildirimler", labelKey: "menu.notifications", icon: "🔔", badge: unreadBadge.value }]
    : []),
  ...(authStore.isLoggedIn ? [{ to: "/hesabim", labelKey: "menu.account", icon: "👤" }] : []),
  { to: "/ayarlar", labelKey: "menu.settings", icon: "⚙️" },
  { to: "/ayarlar/hakkinda", labelKey: "menu.about", icon: "🔥" },
]);

async function onAuthAction() {
  if (authStore.isLoggedIn) {
    await authStore.signOut();
    await navigateTo("/");
  } else {
    await navigateTo("/giris");
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="kl-card flex items-center gap-3 px-4 py-4 text-brand-charcoal transition-colors hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-700"
    >
      <span class="text-xl">{{ item.icon }}</span>
      <span class="flex-1 font-semibold">{{ $t(item.labelKey) }}</span>
      <span
        v-if="item.badge"
        class="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-orange px-1.5 text-xs font-bold text-white"
      >
        {{ item.badge }}
      </span>
    </NuxtLink>

    <button
      type="button"
      class="kl-card flex items-center gap-3 px-4 py-4 text-left text-brand-charcoal transition-colors hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-700"
      @click="onAuthAction"
    >
      <span class="text-xl">{{ authStore.isLoggedIn ? "🚪" : "🔑" }}</span>
      <span class="font-semibold">{{ $t(authStore.isLoggedIn ? "menu.logout" : "menu.login") }}</span>
    </button>
  </div>
</template>
