<script setup lang="ts">
/** Tüm Yorumlarım — PRD 5.I. Faz 5'te `reviews` tablosuna bağlanacak. */
usePageTitle("pages.accountReviews.title");
</script>

<template>
  <UiEmptyState
    icon="💬"
    :title="$t('emptyState.reviews.title')"
    :cta-label="$t('emptyState.reviews.cta')"
    cta-to="/"
  />
</template>
