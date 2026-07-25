<script setup lang="ts">
/**
 * Arama Ekranı (PRD 5.C) — konum/şehir arama kutusu + öneri listesi.
 * Gerçek bir geocoding servisi henüz yok (Faz 4/backend entegrasyonu);
 * bu yüzden sabit bir şehir listesi (`@kampla/shared` → `SEARCH_SUGGESTIONS`)
 * öneri olarak gösterilir. Bir öneriye tıklanınca Ana Ekran'a `/?focus=<id>`
 * query'siyle yönlendirilir, harita o bölgeye odaklanır (bkz. pages/index.vue).
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
  <div class="flex flex-col gap-5 px-4 py-4">
    <div class="relative">
      <svg
        class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-charcoal/40 dark:text-neutral-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" stroke-linecap="round" />
      </svg>
      <input
        v-model="query"
        type="search"
        class="kl-input pl-10"
        :placeholder="t('pages.search.placeholder')"
        :aria-label="t('pages.search.placeholder')"
      />
    </div>

    <section v-if="!query && recentSearches.length > 0">
      <h2 class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-charcoal/50 dark:text-neutral-400">
        {{ t("pages.search.recentTitle") }}
      </h2>
      <ul class="flex flex-col gap-1">
        <li v-for="item in recentSearches" :key="`recent-${item.id}`">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left text-sm font-semibold text-brand-charcoal hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
            @click="selectSuggestion(item)"
          >
            <span class="text-brand-charcoal/40 dark:text-neutral-500">🕐</span>
            {{ item.label }}
          </button>
        </li>
      </ul>
    </section>

    <section>
      <h2 class="mb-2 text-xs font-bold uppercase tracking-wide text-brand-charcoal/50 dark:text-neutral-400">
        {{ t("pages.search.suggestionsTitle") }}
      </h2>

      <ul v-if="filteredSuggestions.length > 0" class="flex flex-col gap-1">
        <li v-for="item in filteredSuggestions" :key="item.id">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left text-sm font-semibold text-brand-charcoal hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
            @click="selectSuggestion(item)"
          >
            <span class="text-brand-orange">📍</span>
            {{ item.label }}
          </button>
        </li>
      </ul>

      <p v-else class="px-3 py-8 text-center text-sm text-brand-charcoal/60 dark:text-neutral-400">
        {{ t("emptyState.search.title") }}
      </p>
    </section>
  </div>
</template>
