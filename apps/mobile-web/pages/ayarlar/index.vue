<script setup lang="ts">
/** Uygulama Ayarları — PRD 5.L */
usePageTitle("pages.settings.title");

const items = [
  { to: "/ayarlar/dil", labelKey: "pages.settingsLanguage.title", icon: "🌐" },
  { to: "/ayarlar/tema", labelKey: "pages.settingsTheme.title", icon: "🌓" },
  { to: "/kullanim-kosullari", labelKey: "pages.terms.title", icon: "📄" },
  { to: "/gizlilik", labelKey: "pages.privacy.title", icon: "🔒" },
];
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="kl-card flex items-center justify-between px-4 py-4 text-brand-charcoal transition-colors hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-700"
    >
      <span class="flex items-center gap-3 font-semibold">
        <span class="text-xl">{{ item.icon }}</span>
        {{ $t(item.labelKey) }}
      </span>
      <span class="text-brand-charcoal/30">›</span>
    </NuxtLink>
  </div>
</template>
