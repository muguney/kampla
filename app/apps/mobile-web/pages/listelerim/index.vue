<script setup lang="ts">
/**
 * Harita Listelerim — PRD 5.H, design/7-9 "Harita Listelerim.png".
 * Faz 5: sistem listeleri (Favorilerim, Ziyaret Edilen Yerler) `useListsStore.
 * fetchLists()` içinde DB'de yoksa lazy-create edilir; özel listeler gerçek
 * `lists` tablosundan gelir (bkz. stores/lists.ts). Liste "Listeye ekle/POI"
 * içeriği kapsam dışı — bkz. pages/listelerim/[id].vue üstündeki not.
 *
 * PRD 5.A gereği bu, kullanıcının kendi verisini yönettiği bir "aksiyon"
 * sayfasıdır — konum-ekle sihirbazıyla aynı desende `middleware: ['auth']`
 * ile korunuyor (bkz. middleware/auth.ts, pages/konum-ekle/[step].vue).
 */
import type { ListType } from "@kampla/shared";
import { FREE_TIER_LIMITS } from "@kampla/shared";

definePageMeta({ middleware: ["auth"] });

usePageTitle("pages.myLists.title");

const { t } = useI18n();
const listsStore = useListsStore();

const SYSTEM_LIST_ICONS: Record<"favorites" | "visited", string> = {
  favorites: "❤️",
  visited: "🚩",
};

onMounted(() => {
  listsStore.fetchLists();
});

const systemLists = computed(() =>
  [...listsStore.systemLists].sort((a, b) => (a.type === "favorites" ? -1 : b.type === "favorites" ? 1 : 0))
);

const customLists = computed(() => listsStore.customLists);

function systemListLabel(type: ListType) {
  if (type === "favorites") return t("pages.myLists.systemListNames.favorites");
  if (type === "visited") return t("pages.myLists.systemListNames.visited");
  return "";
}

// --- Yeni özel liste oluşturma (bkz. components/poi/PoiReviewModal.vue bottom-sheet deseni) ---
const isCreateModalOpen = ref(false);
const newListName = ref("");
const createError = ref("");
const isLimitReached = ref(false);
const creating = ref(false);

function openCreateModal() {
  newListName.value = "";
  createError.value = "";
  isLimitReached.value = false;
  isCreateModalOpen.value = true;
}

function closeCreateModal() {
  isCreateModalOpen.value = false;
}

async function submitCreateList() {
  isLimitReached.value = false;

  if (!newListName.value.trim()) {
    createError.value = t("pages.myLists.createModal.nameRequired");
    return;
  }

  creating.value = true;
  createError.value = "";
  const result = await listsStore.createCustomList(newListName.value);
  creating.value = false;

  if (!result.success) {
    if (result.error === "limit-reached") {
      createError.value = t("pages.myLists.limitReached", { max: FREE_TIER_LIMITS.maxCustomLists });
      isLimitReached.value = true;
    } else {
      createError.value = t("pages.myLists.genericError");
    }
    return;
  }

  isCreateModalOpen.value = false;
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- Sistem listeleri (her zaman görünür) -->
    <div class="flex flex-col gap-2">
      <NuxtLink
        v-for="list in systemLists"
        :key="list.id"
        :to="`/listelerim/${list.id}`"
        class="kl-card flex items-center gap-3 px-4 py-4"
      >
        <span class="text-xl">{{ SYSTEM_LIST_ICONS[list.type as "favorites" | "visited"] }}</span>
        <span class="font-semibold text-brand-charcoal dark:text-neutral-100">
          {{ systemListLabel(list.type) }}
        </span>
      </NuxtLink>
    </div>

    <!-- Özel listeler -->
    <div v-if="customLists.length > 0" class="flex flex-col gap-2">
      <h2 class="text-sm font-semibold text-brand-charcoal/60 dark:text-neutral-400">
        {{ t("pages.myLists.customSectionTitle") }}
      </h2>
      <NuxtLink
        v-for="list in customLists"
        :key="list.id"
        :to="`/listelerim/${list.id}`"
        class="kl-card flex items-center gap-3 px-4 py-4"
      >
        <span class="text-xl">📍</span>
        <span class="flex-1 font-semibold text-brand-charcoal dark:text-neutral-100">{{ list.name }}</span>
        <span v-if="list.is_public" class="text-brand-charcoal/40 dark:text-neutral-500">👁️</span>
      </NuxtLink>
    </div>

    <button type="button" class="kl-btn-primary" @click="openCreateModal">
      {{ t("pages.myLists.createButton") }}
    </button>

    <UiEmptyState
      v-if="customLists.length === 0"
      icon="📌"
      :title="t('emptyState.lists.title')"
    />

    <!-- Yeni liste oluşturma modalı -->
    <Teleport to="body">
      <Transition name="kampla-fade">
        <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-end justify-center">
          <div class="absolute inset-0 bg-black/40" @click="closeCreateModal" />

          <div
            class="kl-card relative w-full max-w-md rounded-b-none p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
            role="dialog"
            aria-modal="true"
            :aria-label="t('pages.myLists.createModal.title')"
          >
            <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

            <h2 class="mb-3 text-base font-bold text-brand-charcoal dark:text-neutral-100">
              {{ t("pages.myLists.createModal.title") }}
            </h2>

            <input
              v-model="newListName"
              type="text"
              class="kl-input mb-2"
              :placeholder="t('pages.myLists.createModal.placeholder')"
              :disabled="creating"
              @keyup.enter="submitCreateList"
            />

            <p v-if="createError" class="mb-3 text-sm font-medium text-red-500 dark:text-red-400" role="alert">
              {{ createError }}
              <NuxtLink v-if="isLimitReached" to="/premium" class="ml-1 underline">
                {{ t("pages.myLists.upgradeCta") }}
              </NuxtLink>
            </p>

            <div class="flex gap-3">
              <button type="button" class="kl-btn-outline flex-1" :disabled="creating" @click="closeCreateModal">
                {{ t("common.cancel") }}
              </button>
              <button type="button" class="kl-btn-primary flex-1" :disabled="creating" @click="submitCreateList">
                {{ creating ? t("pages.myLists.createModal.creating") : t("pages.myLists.createModal.submit") }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.kampla-fade-enter-active,
.kampla-fade-leave-active {
  transition: opacity 0.2s ease;
}
.kampla-fade-enter-from,
.kampla-fade-leave-to {
  opacity: 0;
}
</style>
