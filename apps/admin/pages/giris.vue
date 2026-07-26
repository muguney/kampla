<script setup lang="ts">
/** Admin girişi — PRD 5.R, Faz 8. `useAdminAuth().signIn` admin olmayanı otomatik signOut eder. */
definePageMeta({ layout: false });

const { signIn, loading, error } = useAdminAuth();
const route = useRoute();

const email = ref("");
const password = ref("");

const redirectTo = computed(() => {
  const raw = route.query.redirect;
  const target = Array.isArray(raw) ? raw[0] : raw;
  return target && target.startsWith("/") ? target : "/";
});

async function onSubmit() {
  const { success } = await signIn(email.value, password.value);
  if (success) {
    await navigateTo(redirectTo.value);
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
    <div class="w-full max-w-sm rounded-card border border-neutral-200 bg-white p-8 shadow-sm">
      <div class="mb-6 text-center">
        <span class="text-2xl font-extrabold">
          <span class="text-brand-charcoal">Kamp</span><span class="text-brand-orange">.la</span>
        </span>
        <p class="mt-1 text-xs text-neutral-400">Yönetim Paneli</p>
      </div>

      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <label class="text-sm font-medium text-brand-charcoal">
          E-posta
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="mt-1 w-full rounded-control border border-neutral-300 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
          />
        </label>
        <label class="text-sm font-medium text-brand-charcoal">
          Şifre
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="mt-1 w-full rounded-control border border-neutral-300 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
          />
        </label>

        <p v-if="error" class="rounded-control bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="mt-2 rounded-control bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-orange-dark disabled:opacity-60"
        >
          {{ loading ? "Giriş yapılıyor..." : "Giriş Yap" }}
        </button>
      </form>
    </div>
  </div>
</template>
