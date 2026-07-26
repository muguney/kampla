<script setup lang="ts">
/** Faz 0 iskelet sayfaları için ortak "yapım aşamasında" gövdesi. */
withDefaults(
  defineProps<{
    icon?: string;
    description?: string;
  }>(),
  {
    icon: "🚧",
    description: "",
  }
);
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
    <span class="text-4xl">{{ icon }}</span>
    <p class="max-w-xs text-sm text-brand-charcoal/60 dark:text-neutral-400">
      {{ description || $t("common.comingSoon") }}
    </p>
  </div>
</template>
