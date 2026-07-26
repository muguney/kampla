<script setup lang="ts">
/**
 * İçerik Yönetimi — PRD 5.R "İçerik Yönetimi", Faz 8.
 * `public.site_content` tablosundaki sabit key'li (hakkinda,
 * kullanim-kosullari, gizlilik) kayıtları listeler ve düzenlemeye izin verir.
 * mobile-web tarafındaki statik sayfaların (`pages/ayarlar/hakkinda.vue`,
 * `pages/kullanim-kosullari.vue`, `pages/gizlilik.vue`) bu tablodan okuması
 * KAPSAM DIŞI — ayrı bir görev (şu an hâlâ i18n içine gömülü metinleri
 * render ediyorlar).
 */
import type { Database, SiteContent } from "@kampla/shared";

definePageMeta({ middleware: "admin" });

const supabase = useSupabaseClient<Database>();

const CONTENT_LABELS: Record<string, string> = {
  hakkinda: "Kamp.la Hakkında",
  "kullanim-kosullari": "Kullanım Koşulları",
  gizlilik: "Gizlilik Sözleşmesi",
};
const CONTENT_ORDER = ["hakkinda", "kullanim-kosullari", "gizlilik"];

const items = ref<SiteContent[]>([]);
const drafts = ref<Record<string, { title: string; body: string }>>({});

const loading = ref(false);
const loadError = ref<string | null>(null);

const savingKey = ref<string | null>(null);
const saveError = ref<string | null>(null);

const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(message: string) {
  toast.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = null), 4000);
}

async function fetchContent() {
  loading.value = true;
  loadError.value = null;

  const { data, error } = await supabase.from("site_content").select("*").order("key", { ascending: true });

  if (error) {
    loadError.value = error.message;
    loading.value = false;
    return;
  }

  const rows = (data ?? []) as SiteContent[];
  items.value = rows.sort((a, b) => CONTENT_ORDER.indexOf(a.key) - CONTENT_ORDER.indexOf(b.key));
  drafts.value = Object.fromEntries(
    rows.map((row) => [row.key, { title: row.title ?? "", body: row.body }])
  );

  loading.value = false;
}

function isDirty(item: SiteContent) {
  const draft = drafts.value[item.key];
  if (!draft) return false;
  return draft.title !== (item.title ?? "") || draft.body !== item.body;
}

async function saveContent(item: SiteContent) {
  const draft = drafts.value[item.key];
  if (!draft) return;

  savingKey.value = item.key;
  saveError.value = null;

  const { error } = await supabase
    .from("site_content")
    .update({ title: draft.title, body: draft.body })
    .eq("key", item.key);

  savingKey.value = null;

  if (error) {
    saveError.value = error.message;
    return;
  }

  item.title = draft.title;
  item.body = draft.body;

  showToast(`"${CONTENT_LABELS[item.key] ?? item.key}" kaydedildi.`);
}

onMounted(fetchContent);
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-brand-charcoal">İçerik Yönetimi</h1>
    <p class="mb-6 text-sm text-neutral-500">
      "Kamp.la Hakkında", "Kullanım Koşulları" ve "Gizlilik Sözleşmesi" statik sayfa metinlerini buradan düzenle.
    </p>

    <div v-if="toast" class="mb-4 rounded-control bg-green-50 px-4 py-2 text-sm text-green-700">
      {{ toast }}
    </div>

    <div v-if="loadError" class="mb-4 rounded-control bg-red-50 px-4 py-2 text-sm text-red-600" role="alert">
      {{ loadError }}
    </div>

    <div v-if="saveError" class="mb-4 rounded-control bg-red-50 px-4 py-2 text-sm text-red-600" role="alert">
      {{ saveError }}
    </div>

    <div v-if="loading" class="text-sm text-neutral-500">Yükleniyor...</div>

    <div
      v-else-if="items.length === 0"
      class="rounded-card border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500"
    >
      Henüz içerik kaydı yok. Migration seed'inin çalıştığından emin olun.
    </div>

    <div v-else class="flex flex-col gap-6">
      <div v-for="item in items" :key="item.key" class="rounded-card border border-neutral-200 bg-white p-5">
        <div class="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-sm font-semibold text-brand-charcoal">
              {{ CONTENT_LABELS[item.key] ?? item.key }}
            </h2>
            <p class="text-xs text-neutral-400">key: {{ item.key }}</p>
          </div>
          <button
            type="button"
            :disabled="savingKey === item.key || !isDirty(item)"
            class="rounded-control bg-brand-orange px-4 py-1.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            @click="saveContent(item)"
          >
            {{ savingKey === item.key ? "Kaydediliyor..." : "Kaydet" }}
          </button>
        </div>

        <div v-if="drafts[item.key]" class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label :for="`title-${item.key}`" class="text-xs font-medium text-neutral-500">Başlık</label>
            <input
              :id="`title-${item.key}`"
              v-model="drafts[item.key].title"
              type="text"
              class="rounded-control border border-neutral-300 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label :for="`body-${item.key}`" class="text-xs font-medium text-neutral-500">Metin</label>
            <textarea
              :id="`body-${item.key}`"
              v-model="drafts[item.key].body"
              rows="12"
              class="rounded-control border border-neutral-300 px-3 py-2 text-sm leading-relaxed focus:border-brand-orange focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
