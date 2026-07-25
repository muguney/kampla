<script setup lang="ts">
/**
 * Arama Ekranı (PRD 5.C) — konum/şehir arama kutusu + öneri listesi.
 * Gerçek bir geocoding servisi henüz yok (Faz 4/backend entegrasyonu);
 * bu yüzden sabit bir şehir listesi (`@kampla/shared` → `SEARCH_SUGGESTIONS`)
 * öneri olarak gösterilir. Bir öneriye tıklanınca Ana Ekran'a `/?focus=<id>`
 * query'siyle yönlendirilir, harita o bölgeye odaklanır (bkz. pages/index.vue).
 *
 * Görsel katman Figma "10-Arama Ekranı" (node 255:7148, `get_design_context`
 * ile alındı) ile eşleştirildi: başlık + geri oku olan yerel üst bar, gölgeli
 * beyaz arama kutusu (10px köşe, ikon solda), öneri satırları pin ikonuyla.
 */
import { SEARCH_SUGGESTIONS, type SearchSuggestion } from "@kampla/shared";

usePageTitle("pages.search.title");

const { t } = useI18n();

const query = ref("");

// TODO(Faz 5+): Son aramalar kalıcı hale getirilebilir (ör. profile bağlı
// tercih tablosu). `localStorage` kullanımı bu proje için yasak olduğundan
// şimdilik yalnızca sayfa içi reactive state — sayfa yenilenince sıfırlanır.
const recentSearches = ref<SearchSuggestion[]>([]);

const filteredSuggestions = computed(() => {
  const term = query.value.trim().toLocaleLowerCase("tr");
  if (!term) return SEARCH_SUGGESTIONS;
  return SEARCH_SUGGESTIONS.filter((s) => s.label.toLocaleLowerCase("tr").includes(term));
});

function selectSuggestion(suggestion: SearchSuggestion) {
  recentSearches.value = [
    suggestion,
    ...recentSearches.value.filter((s) => s.id !== suggestion.id),
  ].slice(0, 5);
  navigateTo(`/?focus=${suggestion.id}`);
}
</script>

<template>
  <div class="flex min-h-[calc(100vh-4rem-6rem)] flex-col">
    <!-- Yerel üst bar (Figma: geri oku + "Konum ara" başlığı) -->
    <div
      class="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-100 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <NuxtLink
        to="/"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brand-charcoal hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
        :aria-label="t('common.back')"
      >
        <IconsAppIcon name="back" class="h-5 w-5" />
      </NuxtLink>
      <h1 class="text-lg font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ t("pages.search.headerTitle") }}
      </h1>
    </div>

    <div class="flex flex-col gap-3 px-4 py-4">
      <div class="relative">
        <IconsAppIcon
          name="search"
          class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-orange"
        />
        <input
          v-model="query"
          type="search"
          class="w-full rounded-[10px] bg-white px-4 py-3 pl-11 text-sm font-medium text-brand-charcoal shadow-[0_2px_7px_0_rgba(0,0,0,0.08)] placeholder:text-[#BBBBBB] focus:outline-none focus:ring-1 focus:ring-brand-orange dark:bg-neutral-800 dark:text-neutral-100"
          :placeholder="t('pages.search.placeholder')"
          :aria-label="t('pages.search.placeholder')"
        />
      </div>

      <section v-if="!query && recentSearches.length > 0">
        <h2 class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-charcoal/50 dark:text-neutral-400">
          {{ t("pages.search.recentTitle") }}
        </h2>
        <ul class="flex flex-col gap-2">
          <li v-for="item in recentSearches" :key="`recent-${item.id}`">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-[10px] bg-white px-4 py-3 text-left text-sm font-medium text-brand-charcoal shadow-[0_2px_7px_0_rgba(0,0,0,0.08)] hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              @click="selectSuggestion(item)"
            >
              <IconsAppIcon name="pin" class="h-5 w-5 shrink-0 text-brand-charcoal/40 dark:text-neutral-500" />
              {{ item.label }}
            </button>
          </li>
        </ul>
      </section>

      <section>
        <h2
          v-if="!query"
          class="mb-1 text-xs font-bold uppercase tracking-wide text-brand-charcoal/50 dark:text-neutral-400"
        >
          {{ t("pages.search.suggestionsTitle") }}
        </h2>

        <ul v-if="filteredSuggestions.length > 0" class="flex flex-col gap-2">
          <li v-for="item in filteredSuggestions" :key="item.id">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-[10px] bg-white px-4 py-3 text-left text-sm font-medium text-brand-charcoal shadow-[0_2px_7px_0_rgba(0,0,0,0.08)] hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              @click="selectSuggestion(item)"
            >
              <IconsAppIcon name="pin" class="h-5 w-5 shrink-0 text-brand-orange" />
              {{ item.label }}
            </button>
          </li>
        </ul>

        <p v-else class="px-3 py-8 text-center text-sm text-brand-charcoal/60 dark:text-neutral-400">
          {{ t("emptyState.search.title") }}
        </p>
      </section>
    </div>
  </div>
</template>
