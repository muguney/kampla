<script setup lang="ts">
/**
 * Kullanıcı Yönetimi — PRD Bölüm 5.R, Faz 8.
 * `profiles` tablosunu listeler (en yeni önce), username/email'e göre client-side
 * arama sunar, satır başına `tier` (free/premium) değiştirme ve hesap askıya
 * alma/kaldırma aksiyonları içerir.
 *
 * Askıya alma: `profiles.suspended` kolonu `0012_profiles_suspended.sql` ile
 * eklendi. Bu kolon login/RLS davranışını DEĞİŞTİRMEZ (kapsam dışı) — yalnızca
 * admin panelinde görünen bir durum bayrağıdır. `role` (user/admin) değiştirme
 * bu görevin kapsamında değil.
 */
import type { Database, Profile, UserTier } from "@kampla/shared";
import { USER_TIERS } from "@kampla/shared";

definePageMeta({ middleware: "admin" });

const supabase = useSupabaseClient<Database>();
const { profile: currentAdmin } = useAdminAuth();

type UserRow = Pick<Profile, "id" | "username" | "email" | "tier" | "role" | "created_at"> & {
  suspended: boolean;
};

const users = ref<UserRow[]>([]);
const loadingList = ref(false);
const listError = ref<string | null>(null);

const search = ref("");

const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(message: string) {
  toast.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = null), 4000);
}

const updatingId = ref<string | null>(null);
const actionError = ref<string | null>(null);

const tierLabels: Record<UserTier, string> = {
  free: "Ücretsiz",
  premium: "Premium",
};

const filteredUsers = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return users.value;
  return users.value.filter(
    (u) => u.username.toLowerCase().includes(query) || u.email.toLowerCase().includes(query),
  );
});

async function fetchUsers() {
  loadingList.value = true;
  listError.value = null;
  actionError.value = null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, email, tier, role, suspended, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    listError.value = error.message;
    loadingList.value = false;
    return;
  }

  users.value = (data ?? []) as UserRow[];
  loadingList.value = false;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
}

async function setTier(user: UserRow, tier: UserTier) {
  if (user.tier === tier) return;

  updatingId.value = user.id;
  actionError.value = null;

  const { error } = await supabase.from("profiles").update({ tier }).eq("id", user.id);

  updatingId.value = null;

  if (error) {
    actionError.value = error.message;
    return;
  }

  const target = users.value.find((u) => u.id === user.id);
  if (target) target.tier = tier;

  showToast(`"${user.username}" için üyelik "${tierLabels[tier]}" olarak güncellendi.`);
}

async function toggleSuspended(user: UserRow) {
  const nextSuspended = !user.suspended;

  updatingId.value = user.id;
  actionError.value = null;

  const { error } = await supabase.from("profiles").update({ suspended: nextSuspended }).eq("id", user.id);

  updatingId.value = null;

  if (error) {
    actionError.value = error.message;
    return;
  }

  const target = users.value.find((u) => u.id === user.id);
  if (target) target.suspended = nextSuspended;

  showToast(nextSuspended ? `"${user.username}" askıya alındı.` : `"${user.username}" için askı kaldırıldı.`);
}

function isSelf(user: UserRow) {
  return currentAdmin.value?.id === user.id;
}

onMounted(fetchUsers);
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-brand-charcoal">Kullanıcı Yönetimi</h1>
    <p class="mb-6 text-sm text-neutral-500">Tüm kullanıcılar, en yeni kayıt önce.</p>

    <div v-if="toast" class="mb-4 rounded-control bg-green-50 px-4 py-2 text-sm text-green-700">
      {{ toast }}
    </div>

    <div v-if="listError" class="mb-4 rounded-control bg-red-50 px-4 py-2 text-sm text-red-600">
      {{ listError }}
    </div>

    <div v-if="actionError" class="mb-4 rounded-control bg-red-50 px-4 py-2 text-sm text-red-600" role="alert">
      {{ actionError }}
    </div>

    <div class="mb-4">
      <input
        v-model="search"
        type="search"
        placeholder="Kullanıcı adı veya e-posta ile ara..."
        class="w-full max-w-sm rounded-control border border-neutral-300 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
      />
    </div>

    <div v-if="loadingList" class="text-sm text-neutral-500">Yükleniyor...</div>

    <div
      v-else-if="filteredUsers.length === 0"
      class="rounded-card border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500"
    >
      {{ users.length === 0 ? "Hiç kullanıcı yok." : "Aramayla eşleşen kullanıcı yok." }}
    </div>

    <div v-else class="overflow-hidden rounded-card border border-neutral-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th class="px-4 py-3">Kullanıcı adı</th>
            <th class="px-4 py-3">E-posta</th>
            <th class="px-4 py-3">Rol</th>
            <th class="px-4 py-3">Kayıt Tarihi</th>
            <th class="px-4 py-3">Durum</th>
            <th class="px-4 py-3">Üyelik</th>
            <th class="px-4 py-3">Askıya Alma</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-neutral-100 last:border-0">
            <td class="px-4 py-3 align-top font-medium text-brand-charcoal">{{ user.username }}</td>
            <td class="px-4 py-3 align-top text-neutral-600">{{ user.email }}</td>
            <td class="px-4 py-3 align-top text-neutral-600">{{ user.role === "admin" ? "Yönetici" : "Kullanıcı" }}</td>
            <td class="px-4 py-3 align-top text-neutral-600">{{ formatDate(user.created_at) }}</td>
            <td class="px-4 py-3 align-top">
              <span
                v-if="user.suspended"
                class="rounded-pill bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
              >
                Askıda
              </span>
              <span v-else class="rounded-pill bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                Aktif
              </span>
            </td>
            <td class="px-4 py-3 align-top">
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="tier in USER_TIERS"
                  :key="tier"
                  type="button"
                  :disabled="updatingId === user.id || user.tier === tier"
                  class="rounded-control border px-2.5 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
                  :class="
                    user.tier === tier
                      ? 'border-brand-orange bg-brand-orange text-white'
                      : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                  "
                  @click="setTier(user, tier)"
                >
                  {{ tierLabels[tier] }}
                </button>
              </div>
            </td>
            <td class="px-4 py-3 align-top">
              <button
                type="button"
                :disabled="updatingId === user.id || isSelf(user)"
                class="rounded-control border px-2.5 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
                :class="
                  user.suspended
                    ? 'border-green-300 text-green-700 hover:bg-green-50'
                    : 'border-red-300 text-red-600 hover:bg-red-50'
                "
                @click="toggleSuspended(user)"
              >
                {{ user.suspended ? "Askıyı Kaldır" : "Askıya Al" }}
              </button>
              <p v-if="isSelf(user)" class="mt-1 text-[11px] text-neutral-400">Kendi hesabınız</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
