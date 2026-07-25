<script setup lang="ts">
/**
 * Kamp.la sembolü: turuncu/mercan kamp ateşi + antrasit çapraz odun (PRD 2.2).
 * Gerçek marka SVG'si Figma'dan alınana kadar yaklaşık bir vektör kullanılıyor.
 */
withDefaults(
  defineProps<{
    withWordmark?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    withWordmark: true,
    size: "md",
  }
);

const sizeClasses: Record<string, string> = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};
</script>

<template>
  <NuxtLink to="/" class="flex items-center gap-2" :aria-label="$t('brand.name')">
    <svg
      viewBox="0 0 32 32"
      :class="sizeClasses[size]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 26 L16 20 L24 26"
        stroke="#3B3B3B"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <path
        d="M16 4c3 4-2 5-1 9 3-1 4-4 4-4 2 3 1 7-2 9-3 2-7 1-8-2-1-3 1-5 2-7 1-2 1-4 0-5 2 0 4-1 5 0z"
        fill="#F2884B"
      />
    </svg>
    <span v-if="withWordmark" class="text-xl font-extrabold tracking-tight">
      <span class="text-brand-charcoal dark:text-neutral-100">Kamp</span
      ><span class="text-brand-orange">.la</span>
    </span>
  </NuxtLink>
</template>
