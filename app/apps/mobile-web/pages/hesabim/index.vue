<script setup lang="ts">
/** Hesabım — PRD 5.J, design/35-Hesabım.png. Faz 6'da Supabase profiliyle dolacak. */
usePageTitle("pages.account.title");

const items = [
  { to: "/hesabim/kullanici-adi", labelKey: "pages.accountUsername.title", icon: "✏️" },
  { to: "/hesabim/e-posta", labelKey: "pages.accountEmail.title", icon: "✉️" },
  { to: "/hesabim/sifre", labelKey: "pages.accountPassword.title", icon: "🔑" },
  { to: "/hesabim/sosyal-medya", labelKey: "pages.accountSocial.title", icon: "🔗" },
  { to: "/hesabim/yorumlarim", labelKey: "pages.accountReviews.title", icon: "💬" },
];
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="kl-card flex flex-col items-center gap-2 px-4 py-6">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10 text-2xl text-brand-orange"
      >
        🙍
      </div>
      <p class="font-semibold text-brand-charcoal dark:text-neutral-100">Misafir</p>
      <NuxtLink to="/profil/username-ornek" class="text-sm text-brand-orange">
        Profili Paylaş
      </NuxtLink>
    </div>

    <div class="flex flex-col gap-2">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="kl-card flex items-center justify-between px-4 py-4 text-brand-charcoal dark:text-neutral-100"
      >
        <span class="flex items-center gap-3 font-semibold">
          <span class="text-xl">{{ item.icon }}</span>
          {{ $t(item.labelKey) }}
        </span>
        <span class="text-brand-charcoal/30">›</span>
      </NuxtLink>
    </div>

    <button type="button" class="text-sm text-red-500" disabled>
      Hesabımı kalıcı olarak sil
    </button>
  </div>
</template>
