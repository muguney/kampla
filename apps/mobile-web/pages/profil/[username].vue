<script setup lang="ts">
/**
 * Paylaşılan Profil Sayfası (PRD 5.J/5.K) — herkese açık, misafir dahil herkes
 * görebilir (bkz. supabase/migrations/0002_profiles.sql "profiles_select_public",
 * `using (true)`). Route param `username`'e göre `profiles` tablosundan yalnızca
 * herkese açık kolonlar (`id, username, avatar_url`) çekilir — `email` gibi
 * hassas alanlar RLS izin verse de sorguya dahil edilmiyor.
 *
 * ÖNEMLİ KAPSAM NOTU: Bu, PRD 5.J'nin TAMAMI DEĞİL. Avatar/istatistik kartları/
 * sosyal medya ikonları/"Profili Paylaş" gibi tam profil görünümü ayrı bir Faz 6
 * görevi (bkz. TASKS.md). Burada yalnızca üst kart (avatar + @username) +
 * "Paylaşılan Listeler" bölümü (PRD 5.K'nin bağımlılığı) uygulanıyor —
 * profilde görünür yapılmış (`is_public = true`) özel listeler.
 *
 * Her bir liste kartı `/listeler/[id]` (bağımsız public liste sayfası) ile
 * ilişkilendiriliyor — bkz. o sayfadaki dosya başı yorumu, neden `/liste/[id]`
 * DEĞİL de `/listeler/[id]` seçildiği (mevcut `pages/liste.vue` ile route
 * çakışması) orada açıklanıyor.
 */
import type { Database, MapList } from "@kampla/shared";

usePageTitle("pages.profile.title");

type PublicProfile = { id: string; username: string; avatar_url: string | null };

const route = useRoute();
const { t } = useI18n();
const supabase = useSupabaseClient<Database>();

const profile = ref<PublicProfile | null>(null);
const loading = ref(true);
const notFound = ref(false);

const publicLists = ref<MapList[]>([]);
const listsLoading = ref(false);

async function loadPublicLists(ownerId: string) {
  listsLoading.value = true;

  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("owner_id", ownerId)
    .eq("is_public", true)
    .order("created_at", { ascending: true });

  listsLoading.value = false;

  publicLists.value = error || !data ? [] : (data as MapList[]);
}

async function loadProfile() {
  loading.value = true;
  notFound.value = false;
  profile.value = null;
  publicLists.value = [];

  const username = route.params.username as string;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .eq("username", username)
    .maybeSingle();

  loading.value = false;

  if (error || !data) {
    notFound.value = true;
    return;
  }

  profile.value = data as PublicProfile;
  await loadPublicLists(data.id);
}

onMounted(loadProfile);

/** Sistem listesi ise çeviri, özel liste ise ham `name` — `pages/listelerim/[id].vue`
 * ile aynı desen. Not: sistem listeleri (favorites/visited) UI üzerinden hiç
 * `is_public=true` yapılamıyor (bkz. pages/listelerim/[id].vue), bu yüzden bu
 * dalın pratikte çalışması beklenmiyor, yalnızca güvenlik payı. */
function listDisplayName(list: MapList): string {
  if (list.type === "favorites") return t("pages.myLists.systemListNames.favorites");
  if (list.type === "visited") return t("pages.myLists.systemListNames.visited");
  return list.name;
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div v-if="loading" class="py-16 text-center text-sm text-brand-charcoal/60 dark:text-neutral-400">
      {{ t("common.loading") }}
    </div>

    <UiEmptyState
      v-else-if="notFound"
      icon="🙍"
      :title="t('pages.profile.notFound.title')"
      :cta-label="t('pages.profile.notFound.cta')"
      cta-to="/"
    />

    <template v-else-if="profile">
      <!-- Üst kart: avatar + @username (PRD 5.J'nin küçültülmüş bir alt kümesi) -->
      <div class="kl-card flex items-center gap-3 px-4 py-4">
        <img
          v-if="profile.avatar_url"
          :src="profile.avatar_url"
          :alt="profile.username"
          class="h-14 w-14 shrink-0 rounded-full object-cover"
        />
        <span
          v-else
          class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-2xl text-brand-orange"
        >
          🙍
        </span>
        <p class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">@{{ profile.username }}</p>
      </div>

      <!-- Paylaşılan Listeler (PRD 5.J "Kullanıcının paylaştığı haritalar" / 5.K bağımlılığı) -->
      <div class="flex flex-col gap-2">
        <h2 class="text-sm font-semibold text-brand-charcoal/60 dark:text-neutral-400">
          {{ t("pages.profile.publicListsTitle") }}
        </h2>

        <NuxtLink
          v-for="list in publicLists"
          :key="list.id"
          :to="`/listeler/${list.id}`"
          class="kl-card flex items-center gap-3 px-4 py-4"
        >
          <span class="text-xl">📍</span>
          <span class="flex-1 font-semibold text-brand-charcoal dark:text-neutral-100">
            {{ listDisplayName(list) }}
          </span>
          <span class="text-brand-charcoal/30">›</span>
        </NuxtLink>

        <UiEmptyState
          v-if="!listsLoading && publicLists.length === 0"
          icon="📌"
          :title="t('pages.profile.noPublicLists')"
        />
      </div>
    </template>
  </div>
</template>
