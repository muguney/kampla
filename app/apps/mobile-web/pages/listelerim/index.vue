<script setup lang="ts">
/**
 * Harita Listelerim — PRD 5.H, design/7-9 "Harita Listelerim.png".
 * Faz 0: sistem listeleri (Favorilerim, Ziyaret Edilen Yerler) sabit gösterilir;
 * kullanıcı listeleri Faz 5'te `useListsStore` üzerinden Supabase'den çekilecek.
 */
usePageTitle("pages.myLists.title");

const systemLists = [
  { icon: "❤️", label: "Favorilerim" },
  { icon: "🚩", label: "Ziyaret Edilen Yerler" },
];
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex flex-col gap-2">
      <div
        v-for="list in systemLists"
        :key="list.label"
        class="kl-card flex items-center gap-3 px-4 py-4"
      >
        <span class="text-xl">{{ list.icon }}</span>
        <span class="font-semibold text-brand-charcoal dark:text-neutral-100">{{ list.label }}</span>
      </div>
    </div>

    <button type="button" class="kl-btn-primary" disabled>
      + Yeni Harita Listesi Oluştur
    </button>

    <UiEmptyState
      icon="📌"
      :title="$t('emptyState.lists.title')"
      description="Özel listeler Faz 5'te eklenecek."
    />
  </div>
</template>
