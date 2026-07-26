<script setup lang="ts">
/**
 * Hesabım — PRD 5.J, design/35-Hesabım.png. Faz 6: gerçek Supabase profiliyle
 * dolduruldu (bkz. stores/auth.ts `fetchProfile`). Misafir bu sayfaya hiç
 * giremez — `middleware: ['auth']` (bkz. middleware/auth.ts) girişe yönlendirir,
 * bu yüzden aşağıdaki `profile` her zaman dolu kabul edilebilir.
 */
import type { Database } from "@kampla/shared";

definePageMeta({ middleware: ["auth"] });
usePageTitle("pages.account.title");

const { t } = useI18n();
const authStore = useAuthStore();
const supabase = useSupabaseClient<Database>();

const profile = computed(() => authStore.profile);

const items = [
  { to: "/hesabim/kullanici-adi", labelKey: "pages.accountUsername.title", icon: "✏️" },
  { to: "/hesabim/e-posta", labelKey: "pages.accountEmail.title", icon: "✉️" },
  { to: "/hesabim/sifre", labelKey: "pages.accountPassword.title", icon: "🔑" },
  { to: "/hesabim/sosyal-medya", labelKey: "pages.accountSocial.title", icon: "🔗" },
  { to: "/hesabim/yorumlarim", labelKey: "pages.accountReviews.title", icon: "💬" },
  { to: "/listelerim", labelKey: "pages.account.myListsLink", icon: "🗺️" },
];

// --- Profili Paylaş — pages/konum/[id]/index.vue ile aynı desen (navigator.share,
// yoksa clipboard + toast). Bilinçli tercih: butona tıklamak KENDİ profiline
// GİTMİYOR (zaten kendi hesabındasın), yalnızca `/profil/[username]` herkese açık
// URL'sini paylaşıyor — proje genelindeki diğer "Paylaş" aksiyonlarıyla tutarlı. ---
const toastMessage = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(message: string) {
  toastMessage.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2000);
}

async function handleShareProfile() {
  if (!profile.value) return;

  const shareUrl = import.meta.client
    ? `${window.location.origin}/profil/${profile.value.username}`
    : "";

  if (import.meta.client && navigator.share) {
    try {
      await navigator.share({ title: profile.value.username, url: shareUrl });
    } catch {
      // Kullanıcı paylaşım penceresini iptal etti — sessizce yoksay.
    }
    return;
  }

  try {
    if (import.meta.client && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
    }
  } catch {
    // yoksay
  }
  showToast(t("pages.account.shareToast"));
}

// --- "Ziyaret ettiğim yerleri göster" — profiles.show_visited_places (PRD 6.6) ---
const togglingVisited = ref(false);
const visitedToggleError = ref("");

async function onToggleVisited(event: Event) {
  if (!profile.value) return;

  const checked = (event.target as HTMLInputElement).checked;
  const previous = profile.value.show_visited_places;

  // Optimistic update — store'daki `profile` nesnesi reaktif, doğrudan yazılabilir.
  authStore.profile!.show_visited_places = checked;
  togglingVisited.value = true;
  visitedToggleError.value = "";

  const { error } = await supabase
    .from("profiles")
    .update({ show_visited_places: checked })
    .eq("id", profile.value.id);

  togglingVisited.value = false;

  if (error) {
    authStore.profile!.show_visited_places = previous;
    visitedToggleError.value = t("pages.account.visitedToggleError");
  }
}

// --- Hesabı kalıcı olarak sil — server/api/hesap-sil.post.ts ---
// Projede henüz genel bir modal component'i yok (bkz. pages/listelerim/[id].vue
// "Sil" akışı) — bu yüzden aynı "inline onay kartı" deseni burada da kullanıldı:
// butona basınca aynı kart içinde bir uyarı + "Evet, hesabımı sil"/"Vazgeç"
// butonları belirir, ayrı bir modal/route açılmaz.
const isDeleteConfirmOpen = ref(false);
const deleting = ref(false);
const deleteError = ref("");

function openDeleteConfirm() {
  deleteError.value = "";
  isDeleteConfirmOpen.value = true;
}

function cancelDeleteConfirm() {
  isDeleteConfirmOpen.value = false;
}

async function confirmDeleteAccount() {
  deleting.value = true;
  deleteError.value = "";

  try {
    await $fetch("/api/hesap-sil", { method: "POST" });
  } catch {
    deleting.value = false;
    deleteError.value = t("pages.account.deleteAccount.genericError");
    return;
  }

  await authStore.signOut();
  deleting.value = false;
  await navigateTo("/");
}
</script>

<template>
  <div v-if="profile" class="flex flex-col gap-4 p-4">
    <div class="kl-card flex flex-col items-center gap-2 px-4 py-6">
      <img
        v-if="profile.avatar_url"
        :src="profile.avatar_url"
        :alt="profile.username"
        class="h-16 w-16 shrink-0 rounded-full object-cover"
      />
      <div
        v-else
        class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10 text-2xl text-brand-orange"
      >
        🙍
      </div>
      <p class="font-semibold text-brand-charcoal dark:text-neutral-100">@{{ profile.username }}</p>
      <p class="text-sm text-brand-charcoal/60 dark:text-neutral-400">{{ profile.email }}</p>
      <button type="button" class="text-sm text-brand-orange" @click="handleShareProfile">
        {{ t("pages.account.shareProfile") }}
      </button>
    </div>

    <div class="kl-card flex items-center justify-between px-4 py-4">
      <span class="pr-3 text-sm font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ t("pages.account.visitedToggleLabel") }}
      </span>
      <input
        type="checkbox"
        class="h-5 w-5 accent-brand-orange"
        :checked="profile.show_visited_places"
        :disabled="togglingVisited"
        @change="onToggleVisited"
      />
    </div>
    <p v-if="visitedToggleError" class="-mt-2 text-xs text-red-600" role="alert">{{ visitedToggleError }}</p>

    <div class="flex flex-col gap-2">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="kl-card flex items-center justify-between px-4 py-4 text-brand-charcoal dark:text-neutral-100"
      >
        <span class="flex items-center gap-3 font-semibold">
          <span class="text-xl">{{ item.icon }}</span>
          {{ $t(item.labelKey) }}
        </span>
        <span class="text-brand-charcoal/30">›</span>
      </NuxtLink>
    </div>

    <div class="kl-card flex flex-col gap-2 px-4 py-4">
      <template v-if="isDeleteConfirmOpen">
        <p class="text-sm text-brand-charcoal/80 dark:text-neutral-300">
          {{ t("pages.account.deleteAccount.warning") }}
        </p>
        <p v-if="deleteError" class="text-xs font-medium text-red-500">{{ deleteError }}</p>
        <div class="flex gap-2">
          <button type="button" class="kl-btn-outline flex-1" :disabled="deleting" @click="cancelDeleteConfirm">
            {{ t("pages.account.deleteAccount.cancel") }}
          </button>
          <button
            type="button"
            class="kl-btn-primary flex-1 !bg-red-500 hover:!bg-red-600"
            :disabled="deleting"
            @click="confirmDeleteAccount"
          >
            {{ deleting ? t("pages.account.deleteAccount.deleting") : t("pages.account.deleteAccount.confirm") }}
          </button>
        </div>
      </template>
      <button v-else type="button" class="text-sm text-red-500" @click="openDeleteConfirm">
        {{ t("pages.account.deleteAccount.button") }}
      </button>
    </div>

    <Transition name="kampla-fade">
      <div
        v-if="toastMessage"
        class="fixed inset-x-6 bottom-24 z-40 rounded-control bg-brand-charcoal px-4 py-3 text-center text-sm font-semibold text-white shadow-lg dark:bg-neutral-700"
      >
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>
