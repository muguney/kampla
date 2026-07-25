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
        <NuxtLink to="/" class="rounded-control px-3 py-2 hover:bg-neutral-100">Panel</NuxtLink>
        <NuxtLink to="/konumlar" class="rounded-control px-3 py-2 hover:bg-neutral-100">
          Konumlar (Moderasyon)
        </NuxtLink>
        <NuxtLink to="/konumlar/import" class="rounded-control px-3 py-2 hover:bg-neutral-100">
          Excel/CSV İçe Aktar
        </NuxtLink>
        <NuxtLink to="/raporlar" class="rounded-control px-3 py-2 hover:bg-neutral-100">
          Hata Bildirimleri
        </NuxtLink>
        <NuxtLink to="/kullanicilar" class="rounded-control px-3 py-2 hover:bg-neutral-100">
          Kullanıcılar
        </NuxtLink>
        <NuxtLink to="/icerik" class="rounded-control px-3 py-2 hover:bg-neutral-100">
          İçerik Yönetimi
        </NuxtLink>
      </nav>
    </aside>
    <main class="flex-1 p-6">
      <NuxtPage />
    </main>
  </div>
</template>
