<script setup lang="ts">
/** Dil Seçimi — PRD 5.L, design/31-Dil Seçimi.png */
usePageTitle("pages.settingsLanguage.title");

const { locale, setLocale } = useI18n();

const options = [
  { code: "tr" as const, label: "Türkçe", flag: "🇹🇷" },
  { code: "en" as const, label: "English", flag: "🇬🇧" },
];
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <button
      v-for="opt in options"
      :key="opt.code"
      type="button"
      class="kl-card flex items-center justify-between px-4 py-4 text-left text-brand-charcoal dark:text-neutral-100"
      @click="setLocale(opt.code)"
    >
      <span class="flex items-center gap-3 font-semibold">
        <span class="text-xl">{{ opt.flag }}</span>
        {{ opt.label }}
      </span>
      <span
        class="flex h-5 w-5 items-center justify-center rounded-full border-2"
        :class="locale === opt.code ? 'border-brand-orange bg-brand-orange' : 'border-neutral-300'"
      >
        <span v-if="locale === opt.code" class="h-2 w-2 rounded-full bg-white" />
      </span>
    </button>
  </div>
</template>
