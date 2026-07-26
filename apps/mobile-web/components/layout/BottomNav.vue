<script setup lang="ts">
/**
 * Sabit alt navigasyon — 5 sekme, ortada öne çıkan turuncu [+] FAB (PRD 3.4, 5.O).
 * bkz. design/2-Ana Ekran.png alt kısmı.
 */
const route = useRoute();

const isActive = (path: string) => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-100 bg-white pb-[env(safe-area-inset-bottom)] dark:border-neutral-800 dark:bg-neutral-900"
  >
    <div class="mx-auto flex max-w-md items-center justify-between px-6 py-2">
      <NuxtLink
        to="/"
        class="flex flex-1 flex-col items-center gap-1 py-1 text-xs"
        :class="isActive('/') ? 'text-brand-orange' : 'text-brand-charcoal/60 dark:text-neutral-400'"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 11.5 12 4l9 7.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ $t("nav.home") }}</span>
      </NuxtLink>

      <NuxtLink
        to="/ara"
        class="flex flex-1 flex-col items-center gap-1 py-1 text-xs"
        :class="isActive('/ara') ? 'text-brand-orange' : 'text-brand-charcoal/60 dark:text-neutral-400'"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" stroke-linecap="round" />
        </svg>
        <span>{{ $t("nav.search") }}</span>
      </NuxtLink>

      <NuxtLink
        to="/konum-ekle/1"
        class="flex flex-1 flex-col items-center"
        :aria-label="$t('nav.add')"
      >
        <span
          class="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/40 transition-transform hover:scale-105"
        >
          <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12h14" stroke-linecap="round" />
          </svg>
        </span>
      </NuxtLink>

      <NuxtLink
        to="/listelerim"
        class="flex flex-1 flex-col items-center gap-1 py-1 text-xs"
        :class="isActive('/listelerim') ? 'text-brand-orange' : 'text-brand-charcoal/60 dark:text-neutral-400'"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 4h12v16l-6-4-6 4V4Z" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ $t("nav.lists") }}</span>
      </NuxtLink>

      <NuxtLink
        to="/menu"
        class="flex flex-1 flex-col items-center gap-1 py-1 text-xs"
        :class="isActive('/menu') ? 'text-brand-orange' : 'text-brand-charcoal/60 dark:text-neutral-400'"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
        </svg>
        <span>{{ $t("nav.menu") }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
