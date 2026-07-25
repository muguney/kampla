<script setup lang="ts">
/** Bildirimler — PRD 5.Q. Faz 7'de `notifications` tablosuna bağlanacak. */
usePageTitle("pages.notifications.title");
</script>

<template>
  <UiEmptyState icon="🔔" :title="$t('emptyState.notifications.title')" />
</template>
