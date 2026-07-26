<script setup lang="ts">
/**
 * Sabit alt navigasyon — 5 sekme, ortada öne çıkan turuncu [+] FAB (PRD 3.4, 5.O).
 * bkz. design/2-Ana Ekran.png alt kısmı.
 *
 * GÜNCELLEME (2026-07-26): İkonlar `design/icons-export/*.svg` gerçek export'larına
 * göre güncellendi — home.svg, add.svg, collect.svg (bookmark/"Listelerim"),
 * menu.svg (üç çizgi, alt satırlar sağa yaslı azalan genişlikte — screenshot'ta
 * doğrulandı). "search" (büyüteç) için export yok, elle yakınsanmış placeholder
 * korundu (bkz. AppIcon.vue dosya başı notu, BLOCKERS.md).
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
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4926 5.85442C13.0912 5.50363 12.5564 5.30774 12 5.30774C11.4436 5.30774 10.9088 5.50363 10.5074 5.85442L6.07555 9.72753C5.96691 9.8224 5.89384 9.94601 5.8667 10.0808C5.33594 12.7166 5.29675 15.4149 5.75078 18.0626L5.85808 18.6915H8.71013V13.2735C8.71013 13.1 8.78583 12.9336 8.92058 12.8109C9.05533 12.6882 9.23809 12.6193 9.42865 12.6193H14.5713C14.7619 12.6193 14.9447 12.6882 15.0794 12.8109C15.2142 12.9336 15.2899 13.1 15.2899 13.2735V18.6915H18.1419L18.2492 18.0634C18.7039 15.4153 18.665 12.7163 18.1343 10.08C18.1067 9.94534 18.0333 9.82205 17.9244 9.72753L13.4926 5.85442ZM9.51296 4.91057C10.1819 4.32626 11.073 4 12 4C12.927 4 13.8181 4.32626 14.487 4.91057L18.9198 8.78368C19.2456 9.06806 19.4659 9.43967 19.5473 9.84442C20.1069 12.6251 20.148 15.4718 19.669 18.265L19.4966 19.2742C19.462 19.4765 19.3492 19.6608 19.1784 19.7939C19.0076 19.927 18.7902 20.0001 18.5654 20H14.5713C14.3808 20 14.198 19.9311 14.0633 19.8084C13.9285 19.6857 13.8528 19.5193 13.8528 19.3458V13.9278H10.1472V19.3458C10.1472 19.5193 10.0715 19.6857 9.93672 19.8084C9.80197 19.9311 9.61922 20 9.42865 20H5.43463C5.20983 20.0001 4.99238 19.927 4.8216 19.7939C4.65082 19.6608 4.53796 19.4765 4.50343 19.2742L4.33098 18.265C3.85202 15.4718 3.89315 12.6251 4.45265 9.84442C4.53409 9.43967 4.75443 9.06806 5.08016 8.78281L9.51296 4.91057Z" fill="currentColor"/>
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
          <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.8571 13.1429H13.1429V18.8571C13.1429 19.4857 12.6286 20 12 20C11.3714 20 10.8571 19.4857 10.8571 18.8571V13.1429H5.14286C4.51429 13.1429 4 12.6286 4 12C4 11.3714 4.51429 10.8571 5.14286 10.8571H10.8571V5.14286C10.8571 4.51429 11.3714 4 12 4C12.6286 4 13.1429 4.51429 13.1429 5.14286V10.8571H18.8571C19.4857 10.8571 20 11.3714 20 12C20 12.6286 19.4857 13.1429 18.8571 13.1429Z" fill="currentColor"/>
          </svg>
        </span>
      </NuxtLink>

      <NuxtLink
        to="/listelerim"
        class="flex flex-1 flex-col items-center gap-1 py-1 text-xs"
        :class="isActive('/listelerim') ? 'text-brand-orange' : 'text-brand-charcoal/60 dark:text-neutral-400'"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.15625 3.1875H16.8438C17.0012 3.1875 17.1522 3.25006 17.2636 3.36141C17.3749 3.47276 17.4375 3.62378 17.4375 3.78125V18.5775C17.4373 18.6892 17.4057 18.7986 17.3461 18.8932C17.2865 18.9877 17.2015 19.0635 17.1008 19.1119C17.0001 19.1602 16.8878 19.1792 16.7768 19.1666C16.6658 19.154 16.5606 19.1103 16.4732 19.0406L11.8705 15.3594C11.7653 15.2754 11.6346 15.2296 11.5 15.2296C11.3654 15.2296 11.2347 15.2754 11.1295 15.3594L6.52675 19.0406C6.43944 19.1103 6.33424 19.154 6.22323 19.1666C6.11221 19.1792 5.9999 19.1602 5.89919 19.1119C5.79847 19.0635 5.71345 18.9877 5.6539 18.8932C5.59434 18.7986 5.56266 18.6892 5.5625 18.5775V3.78125C5.5625 3.62378 5.62506 3.47276 5.73641 3.36141C5.84776 3.25006 5.99878 3.1875 6.15625 3.1875Z" fill="currentColor"/>
        </svg>
        <span>{{ $t("nav.lists") }}</span>
      </NuxtLink>

      <NuxtLink
        to="/menu"
        class="flex flex-1 flex-col items-center gap-1 py-1 text-xs"
        :class="isActive('/menu') ? 'text-brand-orange' : 'text-brand-charcoal/60 dark:text-neutral-400'"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M7 12H20M10 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ $t("nav.menu") }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
