<script setup lang="ts">
/**
 * Ana uygulama iskeleti: üst bar + sayfa içeriği + sabit alt navigasyon.
 * Sayfalar `usePageTitle('pages.xxx.title')` composable'ı ile başlık verir.
 */
const route = useRoute();
const { t } = useI18n();
const titleKey = usePageTitleKey();
const title = computed(() => (titleKey.value ? t(titleKey.value) : ""));
const showWordmark = computed(() => route.path === "/");
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-cream dark:bg-neutral-900">
    <LayoutTopBar :title="title" :show-wordmark="showWordmark" />

    <main class="flex-1 pb-24">
      <slot />
    </main>

    <LayoutBottomNav />
  </div>
</template>
