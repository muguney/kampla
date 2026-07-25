<script setup lang="ts">
/**
 * Liste Sayfası (Paylaşılan / Public) — PRD 5.K. Bir kullanıcının herkese açık
 * yaptığı özel listenin, o listeyi kaydeden kullanıcı adına atıflı public
 * görünümü. Misafir dahil herkes görüntüleyebilir; yalnızca "Listeyi Kaydet"
 * aksiyonu giriş gerektirir (bu yüzden sayfanın tamamı `middleware: ['auth']`
 * ile KORUNMUYOR — bkz. handleSaveList).
 *
 * ⚠️ ROUTE ADI NOTU: TASKS.md bu sayfayı `/liste/[id]` olarak öneriyor, ancak
 * projede zaten `pages/liste.vue` (PRD 5.E "Liste Görünümü" — haritanın kart
 * listesi görünümü, Faz 2) mevcut ve içinde `<NuxtPage/>` yok. Gerçek bir dev
 * server denemesiyle DOĞRULANDI: `pages/liste.vue` + `pages/liste/[id].vue`
 * birlikte var olduğunda Nuxt/vue-router `liste.vue`'yu nested route'lar için
 * "parent" layout'a çeviriyor; `<NuxtPage/>` olmadığı için ziyaret edilen
 * `/liste/<id>` alt route'u HİÇ render edilmiyor — bunun yerine ebeveynin
 * (liste.vue, harita kart-listesi, 20 mock kart) içeriği sessizce gösteriliyor,
 * `id` parametresi tamamen yok sayılıyor (curl ile `/liste` ve `/liste/<id>`'nin
 * birebir aynı HTML'i döndürdüğü doğrulandı). Bu, mevcut Liste Görünümü
 * özelliğinde regresyon YARATMASA da, yeni public liste sayfasının HİÇBİR ZAMAN
 * görüntülenememesi anlamına geliyor. Bu yüzden `/liste/[id]` yerine
 * `/listeler/[id]` seçildi (çakışma yok; proje deseniyle tutarlı: `listelerim`
 * = "harita listelerim" (kendi listelerim, auth), `listeler` = genel/plural
 * "listeler" (public görünüm), `liste` = tekil "Liste Görünümü" — haritanın
 * kart listesi özelliği, farklı bir şey).
 *
 * Route param `id` ile `lists` satırı çekilir. Bulunamazsa VEYA `is_public !== true`
 * ise (misafir/başkasının gizli listesi) güvenlik gereği aynı "bulunamadı" boş
 * durumu gösterilir — bir listenin var olup olmadığı (gizli olsa bile) ifşa
 * edilmiyor.
 *
 * Liste içeriği (list_items/POI'ler) KAPSAM DIŞI — bkz. pages/listelerim/[id].vue
 * üstündeki aynı not (mock POI vs. gerçek `locations` kararı bekleniyor,
 * DECISIONS.md 2026-07-26 "mock POI vs. gerçek locations çakışması").
 */
import type { Database, MapList } from "@kampla/shared";
import { FREE_TIER_LIMITS } from "@kampla/shared";

usePageTitle("pages.publicList.title");

type OwnerProfile = { id: string; username: string };

const route = useRoute();
const { t, locale } = useI18n();
const supabase = useSupabaseClient<Database>();
const authStore = useAuthStore();
const listsStore = useListsStore();

const list = ref<MapList | null>(null);
const owner = ref<OwnerProfile | null>(null);
const loading = ref(true);
const notFound = ref(false);

async function loadList() {
  loading.value = true;
  notFound.value = false;
  list.value = null;
  owner.value = null;

  const id = route.params.id as string;
  const { data, error } = await supabase.from("lists").select("*").eq("id", id).maybeSingle();

  // Güvenlik: liste yoksa YA DA public değilse aynı "bulunamadı" durumu
  // gösterilir — gizli bir listenin varlığı (misafire/başkasına) ifşa edilmiyor.
  if (error || !data || data.is_public !== true) {
    loading.value = false;
    notFound.value = true;
    return;
  }

  list.value = data as MapList;

  const { data: ownerData } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", data.owner_id)
    .maybeSingle();

  owner.value = ownerData ? (ownerData as OwnerProfile) : null;
  loading.value = false;
}

onMounted(loadList);

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

// --- Paylaş — pages/konum/[id]/index.vue ile birebir aynı desen (navigator.share,
// yoksa clipboard + toast). Ortak bir composable'a çıkarılmadı; proje genelinde
// bu basit desen sayfa başına tekrarlanıyor (bkz. o dosyadaki handleShare). ---
const toastMessage = ref("");
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(message: string) {
  toastMessage.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2000);
}

async function handleShare() {
  const shareUrl = import.meta.client ? window.location.href : "";
  if (import.meta.client && navigator.share) {
    try {
      await navigator.share({ title: displayName.value, url: shareUrl });
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
  showToast(t("pages.publicList.actions.shareToast"));
}

// --- Listeyi Kaydet — kendi hesabına kopyalama (yalnızca metadata, PRD 5.K) ---
// Liste İÇERİĞİ (list_items) kopyalanmıyor: proje genelinde list_items zaten
// kapsam dışı (bkz. dosya başı yorumu). Kopyanın adına " (Kopya)"/" (Copy)" son
// eki eklendi — orijinal adı birebir kullanmak, ziyaretçinin kendi hesabında
// zaten aynı isimde bir liste varsa karışıklığa yol açabilir; küçük ama faydalı
// bir farklılaştırma. Kopya `useListsStore.createCustomList` üzerinden HER ZAMAN
// `type: 'custom'` olarak oluşturuluyor (kaynak sistem listesi olsa bile) —
// store'da başka bir oluşturma yolu yok, bu da "kendi listelerime ekliyorum"
// davranışıyla tutarlı. Ücretsiz kullanıcı sınırı (`FREE_TIER_LIMITS.maxCustomLists`)
// `createCustomList` içinde zaten uygulanıyor, burada tekrarlanmıyor.
const saving = ref(false);
const saved = ref(false);
const saveError = ref("");

function handleSaveList() {
  if (!list.value) return;

  if (!authStore.isLoggedIn) {
    navigateTo(`/giris?redirect=${encodeURIComponent(route.fullPath)}`);
    return;
  }

  // Başarılı kayıttan sonra buton "Kaydedildi" durumuna geçer ve tekrar
  // tıklanamaz — tek seferlik kopyalama, yanlışlıkla birden fazla kopya
  // oluşturulmasını önlemek için basit taraf seçildi.
  if (saved.value) return;

  saveList();
}

async function saveList() {
  if (!list.value) return;

  saving.value = true;
  saveError.value = "";

  const copyName = `${displayName.value} ${t("pages.publicList.actions.saveCopySuffix")}`;
  const result = await listsStore.createCustomList(copyName);

  saving.value = false;

  if (!result.success) {
    if (result.error === "limit-reached") {
      saveError.value = t("pages.myLists.limitReached", { max: FREE_TIER_LIMITS.maxCustomLists });
    } else {
      saveError.value = t("pages.publicList.actions.saveError");
    }
    return;
  }

  saved.value = true;
  showToast(t("pages.publicList.actions.saveToast"));
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
      :title="t('pages.publicList.notFound.title')"
      :cta-label="t('pages.publicList.notFound.cta')"
      cta-to="/"
    />

    <template v-else-if="list">
      <div class="kl-card flex flex-col gap-2 px-4 py-4">
        <h1 class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">{{ displayName }}</h1>

        <NuxtLink v-if="owner" :to="`/profil/${owner.username}`" class="text-sm font-semibold text-brand-orange">
          @{{ owner.username }}
        </NuxtLink>

        <p class="text-xs text-brand-charcoal/50 dark:text-neutral-500">
          {{ t("pages.publicList.createdAtLabel", { date: createdAtLabel }) }}
        </p>
      </div>

      <!-- Aksiyonlar: Paylaş / Listeyi Kaydet -->
      <div class="flex gap-3">
        <button type="button" class="kl-btn-outline flex-1" @click="handleShare">
          📤 {{ t("pages.publicList.actions.share") }}
        </button>
        <button type="button" class="kl-btn-primary flex-1" :disabled="saving || saved" @click="handleSaveList">
          {{
            saved
              ? t("pages.publicList.actions.saved")
              : saving
                ? t("common.loading")
                : t("pages.publicList.actions.save")
          }}
        </button>
      </div>

      <p v-if="saveError" class="text-xs font-medium text-red-500">{{ saveError }}</p>

      <!-- Liste içeriği (POI'ler) — kapsam dışı, bkz. dosya başı yorumu -->
      <UiEmptyState
        icon="📍"
        :title="t('pages.listDetail.itemsPlaceholder.title')"
        :description="t('pages.listDetail.itemsPlaceholder.description')"
      />
    </template>

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
