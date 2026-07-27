<script setup lang="ts">
/**
 * Liste Detayı — PRD 5.H. Route param `id` ile Supabase'den ilgili `lists`
 * satırı çekilir (RLS: sahibi ya da `is_public=true`, bkz.
 * supabase/migrations/0005_lists_and_list_items.sql).
 *
 * Aksiyonlar (Adını Değiştir / Profilde Görünür Yap / Sil) yalnızca özel
 * (`type='custom'`) listelerde gösterilir. Sistem listeleri (favorites/visited)
 * için PRD 5.H madde J yalnızca "profilde görünür yapılmış özel listeler"den
 * bahsediyor — sistem listelerinin public/paylaşım davranışı netleşmediği için
 * güvenli taraf seçildi: sistem listelerinde rename/delete/visibility hiç
 * gösterilmiyor (sadece salt okunur rozet + oluşturulma tarihi).
 *
 * Liste içeriği (list_items / POI'ler) KAPSAM DIŞI: haritadaki POI'ler şu an
 * mock veri (gerçek UUID değil, bkz. packages/shared/src/mock-locations.ts),
 * bu yüzden `list_items` sorgusu burada YAPILMIYOR.
 * TODO: list_items entegrasyonu, mock POI → gerçek locations kararına bağlı
 * (bkz. DECISIONS.md 2026-07-26 "mock POI vs. gerçek locations çakışması").
 */
import type { Database, MapList } from "@kampla/shared";

definePageMeta({ middleware: ["auth"] });

usePageTitle("pages.listDetail.title");

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const supabase = useSupabaseClient<Database>();
const listsStore = useListsStore();

const list = ref<MapList | null>(null);
const loading = ref(true);
const notFound = ref(false);

async function loadList() {
  loading.value = true;
  notFound.value = false;

  const id = route.params.id as string;
  const { data, error } = await supabase.from("lists").select("*").eq("id", id).maybeSingle();

  loading.value = false;

  if (error || !data) {
    notFound.value = true;
    return;
  }

  list.value = data as MapList;
}

onMounted(loadList);

const isSystemList = computed(() => list.value?.type === "favorites" || list.value?.type === "visited");

const typeLabel = computed(() =>
  isSystemList.value ? t("pages.listDetail.typeBadge.system") : t("pages.listDetail.typeBadge.custom")
);

const displayName = computed(() => {
  if (!list.value) return "";
  if (list.value.type === "favorites") return t("pages.myLists.systemListNames.favorites");
  if (list.value.type === "visited") return t("pages.myLists.systemListNames.visited");
  return list.value.name;
});

const createdAtLabel = computed(() => {
  if (!list.value) return "";
  return new Intl.DateTimeFormat(locale.value === "en" ? "en-GB" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(list.value.created_at));
});

// --- Adını değiştir ---
const isRenaming = ref(false);
const renameValue = ref("");
const renameError = ref("");
const renaming = ref(false);

function startRename() {
  renameValue.value = list.value?.name ?? "";
  renameError.value = "";
  isRenaming.value = true;
}

function cancelRename() {
  isRenaming.value = false;
}

async function confirmRename() {
  if (!list.value) return;
  if (!renameValue.value.trim()) {
    renameError.value = t("pages.listDetail.rename.nameRequired");
    return;
  }

  renaming.value = true;
  const result = await listsStore.renameList(list.value.id, renameValue.value);
  renaming.value = false;

  if (!result.success) {
    renameError.value = t("pages.listDetail.genericError");
    return;
  }

  list.value = { ...list.value, name: renameValue.value.trim() };
  isRenaming.value = false;
}

// --- Görünürlük (herkese açık/gizli) — "gizlilik onayı gerektiren aksiyon" (PRD 5.H) ---
const isVisibilityConfirmOpen = ref(false);
const visibilityError = ref("");
const togglingVisibility = ref(false);

function openVisibilityConfirm() {
  visibilityError.value = "";
  isVisibilityConfirmOpen.value = true;
}

function cancelVisibilityConfirm() {
  isVisibilityConfirmOpen.value = false;
}

async function confirmToggleVisibility() {
  if (!list.value) return;

  togglingVisibility.value = true;
  const result = await listsStore.toggleVisibility(list.value.id);
  togglingVisibility.value = false;

  if (!result.success) {
    visibilityError.value = t("pages.listDetail.genericError");
    return;
  }

  list.value = { ...list.value, is_public: !list.value.is_public };
  isVisibilityConfirmOpen.value = false;
}

// --- Sil ---
const isDeleteConfirmOpen = ref(false);
const deleteError = ref("");
const deleting = ref(false);

function openDeleteConfirm() {
  deleteError.value = "";
  isDeleteConfirmOpen.value = true;
}

function cancelDeleteConfirm() {
  isDeleteConfirmOpen.value = false;
}

async function confirmDelete() {
  if (!list.value) return;

  deleting.value = true;
  const result = await listsStore.deleteList(list.value.id);
  deleting.value = false;

  if (!result.success) {
    deleteError.value = t("pages.listDetail.genericError");
    isDeleteConfirmOpen.value = false;
    return;
  }

  router.push("/listelerim");
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div v-if="loading" class="py-16 text-center text-sm text-brand-charcoal/60 dark:text-neutral-400">
      {{ t("common.loading") }}
    </div>

    <UiEmptyState
      v-else-if="notFound"
      icon="📌"
      :title="t('pages.listDetail.notFound.title')"
      :cta-label="t('pages.listDetail.notFound.cta')"
      cta-to="/listelerim"
    />

    <template v-else-if="list">
      <div class="kl-card flex flex-col gap-2 px-4 py-4">
        <div class="flex items-center justify-between gap-2">
          <h1 class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">
            {{ displayName }}
          </h1>
          <span
            class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
            :class="
              isSystemList
                ? 'bg-neutral-100 text-brand-charcoal/70 dark:bg-neutral-700 dark:text-neutral-300'
                : 'bg-brand-orange/10 text-brand-orange'
            "
          >
            {{ typeLabel }}
          </span>
        </div>
        <p class="text-xs text-brand-charcoal/50 dark:text-neutral-500">
          {{ t("pages.listDetail.createdAtLabel", { date: createdAtLabel }) }}
        </p>
        <p
          class="text-xs font-semibold"
          :class="list.is_public ? 'text-brand-orange' : 'text-brand-charcoal/50 dark:text-neutral-400'"
        >
          {{ list.is_public ? t("pages.listDetail.visibility.public") : t("pages.listDetail.visibility.private") }}
        </p>
      </div>

      <!-- Özel liste aksiyonları — sistem listelerinde gösterilmiyor (bkz. script açıklaması) -->
      <div v-if="!isSystemList" class="flex flex-col gap-3">
        <!-- Adını değiştir -->
        <div class="kl-card flex flex-col gap-2 px-4 py-4">
          <template v-if="isRenaming">
            <input v-model="renameValue" type="text" class="kl-input" :disabled="renaming" @keyup.enter="confirmRename" />
            <p v-if="renameError" class="text-xs font-medium text-red-500">{{ renameError }}</p>
            <div class="flex gap-2">
              <button type="button" class="kl-btn-outline flex-1" :disabled="renaming" @click="cancelRename">
                {{ t("pages.listDetail.rename.cancel") }}
              </button>
              <button type="button" class="kl-btn-primary flex-1" :disabled="renaming" @click="confirmRename">
                {{ renaming ? t("common.loading") : t("pages.listDetail.rename.save") }}
              </button>
            </div>
          </template>
          <button
            v-else
            type="button"
            class="flex items-center justify-between text-sm font-semibold text-brand-charcoal dark:text-neutral-100"
            @click="startRename"
          >
            <span>✏️ {{ t("pages.listDetail.rename.button") }}</span>
            <span class="text-brand-charcoal/30">›</span>
          </button>
        </div>

        <!-- Profilde Görünür Yap / Gizle -->
        <div class="kl-card flex flex-col gap-2 px-4 py-4">
          <template v-if="isVisibilityConfirmOpen">
            <p class="text-sm text-brand-charcoal/80 dark:text-neutral-300">
              {{
                list.is_public
                  ? t("pages.listDetail.visibility.confirmPrivate")
                  : t("pages.listDetail.visibility.confirmPublic")
              }}
            </p>
            <p v-if="visibilityError" class="text-xs font-medium text-red-500">{{ visibilityError }}</p>
            <div class="flex gap-2">
              <button type="button" class="kl-btn-outline flex-1" :disabled="togglingVisibility" @click="cancelVisibilityConfirm">
                {{ t("pages.listDetail.visibility.cancel") }}
              </button>
              <button type="button" class="kl-btn-primary flex-1" :disabled="togglingVisibility" @click="confirmToggleVisibility">
                {{ togglingVisibility ? t("common.loading") : t("pages.listDetail.visibility.confirm") }}
              </button>
            </div>
          </template>
          <button
            v-else
            type="button"
            class="flex items-center justify-between text-sm font-semibold text-brand-charcoal dark:text-neutral-100"
            @click="openVisibilityConfirm"
          >
            <span>
              {{ list.is_public ? "🙈" : "👁️" }}
              {{
                list.is_public
                  ? t("pages.listDetail.visibility.makePrivateButton")
                  : t("pages.listDetail.visibility.makePublicButton")
              }}
            </span>
            <span class="text-brand-charcoal/30">›</span>
          </button>
        </div>

        <!-- Sil -->
        <div class="kl-card flex flex-col gap-2 px-4 py-4">
          <template v-if="isDeleteConfirmOpen">
            <p class="text-sm text-brand-charcoal/80 dark:text-neutral-300">
              {{ t("pages.listDetail.delete.confirmBody") }}
            </p>
            <p v-if="deleteError" class="text-xs font-medium text-red-500">{{ deleteError }}</p>
            <div class="flex gap-2">
              <button type="button" class="kl-btn-outline flex-1" :disabled="deleting" @click="cancelDeleteConfirm">
                {{ t("pages.listDetail.delete.cancel") }}
              </button>
              <button
                type="button"
                class="kl-btn-primary flex-1 !bg-red-500 hover:!bg-red-600"
                :disabled="deleting"
                @click="confirmDelete"
              >
                {{ deleting ? t("common.loading") : t("pages.listDetail.delete.confirm") }}
              </button>
            </div>
          </template>
          <button
            v-else
            type="button"
            class="flex items-center justify-between text-sm font-semibold text-red-500"
            @click="openDeleteConfirm"
          >
            <span>🗑️ {{ t("pages.listDetail.delete.button") }}</span>
            <span class="text-red-300">›</span>
          </button>
        </div>
      </div>

      <!-- Liste içeriği (POI'ler) — kapsam dışı, bkz. script açıklaması -->
      <UiEmptyState
        icon="📍"
        :title="t('pages.listDetail.itemsPlaceholder.title')"
        :description="t('pages.listDetail.itemsPlaceholder.description')"
      />
    </template>
  </div>
</template>
