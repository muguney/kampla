<script setup lang="ts">
/** Kamp.la Hakkında — PRD 5.L statik içerik sayfası (Faz 6). */
usePageTitle("pages.settingsAbout.title");
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div
      class="kl-card flex flex-col gap-3 px-4 py-5 text-sm leading-relaxed text-brand-charcoal/80 dark:text-neutral-300"
    >
      <p>{{ $t("pages.settingsAbout.paragraph1") }}</p>
      <p>{{ $t("pages.settingsAbout.paragraph2") }}</p>
      <p>{{ $t("pages.settingsAbout.paragraph3") }}</p>
    </div>
  </div>
</template>
