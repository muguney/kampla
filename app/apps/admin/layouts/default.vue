<script setup lang="ts">
/** Admin paneli temel iskeleti: sol nav + üst bar (oturum e-postası + çıkış) — PRD 5.R, Faz 8. */
const { signOut } = useAdminAuth();
const user = useSupabaseUser();

async function handleSignOut() {
  await signOut();
  await navigateTo("/giris");
}
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="w-56 shrink-0 border-r border-neutral-200 bg-white p-4">
      <div class="mb-6 flex items-center gap-2">
        <span class="text-xl font-extrabold">
          <span class="text-brand-charcoal">Kamp</span><span class="text-brand-orange">.la</span>
        </span>
        <span class="text-xs text-neutral-400">Admin</span>
      </div>
      <nav class="flex flex-col gap-1 text-sm">
        <NuxtLink
          to="/"
          class="rounded-control px-3 py-2 hover:bg-neutral-100"
          active-class="bg-neutral-100 font-semibold text-brand-orange"
        >
          Konum Moderasyonu
        </NuxtLink>
        <NuxtLink
          to="/konumlar"
          class="rounded-control px-3 py-2 hover:bg-neutral-100"
          active-class="bg-neutral-100 font-semibold text-brand-orange"
        >
          Konumlar
        </NuxtLink>
        <NuxtLink
          to="/konumlar/import"
          class="rounded-control px-3 py-2 hover:bg-neutral-100"
          active-class="bg-neutral-100 font-semibold text-brand-orange"
        >
          Excel/CSV İçe Aktar
        </NuxtLink>
        <NuxtLink
          to="/kullanicilar"
          class="rounded-control px-3 py-2 hover:bg-neutral-100"
          active-class="bg-neutral-100 font-semibold text-brand-orange"
        >
          Kullanıcılar
        </NuxtLink>
        <NuxtLink
          to="/raporlar"
          class="rounded-control px-3 py-2 hover:bg-neutral-100"
          active-class="bg-neutral-100 font-semibold text-brand-orange"
        >
          Raporlar
        </NuxtLink>
        <NuxtLink
          to="/icerik"
          class="rounded-control px-3 py-2 hover:bg-neutral-100"
          active-class="bg-neutral-100 font-semibold text-brand-orange"
        >
          İçerik
        </NuxtLink>
      </nav>
    </aside>

    <div class="flex flex-1 flex-col">
      <header class="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
        <h1 class="text-sm font-semibold text-brand-charcoal">Kamp.la — Yönetim Paneli</h1>
        <div v-if="user" class="flex items-center gap-3 text-sm">
          <span class="text-neutral-500">{{ user.email }}</span>
          <button
            type="button"
            class="rounded-control border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100"
            @click="handleSignOut"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
