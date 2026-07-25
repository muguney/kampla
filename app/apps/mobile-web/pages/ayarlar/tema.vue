<script setup lang="ts">
/**
 * Tema Seçimi — PRD 5.L, design/32-Tema Ayarları.png.
 * Faz 0: yalnızca altyapı; henüz ayrı bir "dark" görsel tasarım yok.
 */
import type { ThemeMode } from "@kampla/shared";

usePageTitle("pages.settingsTheme.title");

const { mode, setMode } = useTheme();

const options: { code: ThemeMode; labelKey: string; icon: string }[] = [
  { code: "light", labelKey: "themeLight", icon: "☀️" },
  { code: "dark", labelKey: "themeDark", icon: "🌙" },
  { code: "system", labelKey: "themeSystem", icon: "🖥️" },
];

const labels: Record<string, string> = {
  themeLight: "Aydınlık",
  themeDark: "Karanlık",
  themeSystem: "Sistem",
};
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <button
      v-for="opt in options"
      :key="opt.code"
      type="button"
      class="kl-card flex items-center justify-between px-4 py-4 text-left text-brand-charcoal dark:text-neutral-100"
      @click="setMode(opt.code)"
    >
      <span class="flex items-center gap-3 font-semibold">
        <span class="text-xl">{{ opt.icon }}</span>
        {{ labels[opt.labelKey] }}
      </span>
      <span
        class="flex h-5 w-5 items-center justify-center rounded-full border-2"
        :class="mode === opt.code ? 'border-brand-orange bg-brand-orange' : 'border-neutral-300'"
      >
        <span v-if="mode === opt.code" class="h-2 w-2 rounded-full bg-white" />
      </span>
    </button>
  </div>
</template>
