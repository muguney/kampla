<script setup lang="ts">
/** Login — PRD 5.A, design/25-Login.png. Supabase Auth'a bağlı. */
definePageMeta({ layout: "auth" });
usePageTitle("pages.login.title");

const { t } = useI18n();
const authStore = useAuthStore();
const route = useRoute();

const email = ref("");
const password = ref("");

// `middleware/auth.ts` girişe yönlendirirken `redirect` query'sinde gelinen sayfayı
// taşır; başarılı girişten sonra kullanıcıyı kaldığı yere geri döndürüyoruz.
const redirectTo = computed(() => {
  const raw = route.query.redirect;
  const target = Array.isArray(raw) ? raw[0] : raw;
  return target && target.startsWith("/") ? target : "/";
});

async function onSubmit() {
  const { success } = await authStore.signIn(email.value, password.value);
  if (success) {
    await navigateTo(redirectTo.value);
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-center px-6 py-10">
    <div class="mb-8 flex justify-center">
      <LayoutLogo size="lg" :with-wordmark="true" />
    </div>

    <h1 class="mb-6 text-center text-xl font-bold text-brand-charcoal dark:text-neutral-100">
      {{ $t("pages.login.title") }}
    </h1>

    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <input
        v-model="email"
        type="email"
        :placeholder="t('pages.login.emailPlaceholder')"
        class="kl-input"
        autocomplete="email"
        required
      />
      <input
        v-model="password"
        type="password"
        :placeholder="t('pages.login.passwordPlaceholder')"
        class="kl-input"
        autocomplete="current-password"
        required
      />

      <NuxtLink to="/sifremi-unuttum" class="self-end text-sm text-brand-orange">
        {{ $t("pages.login.forgotPassword") }}
      </NuxtLink>

      <p v-if="authStore.error" class="text-sm text-red-600" role="alert">
        {{ authStore.error }}
      </p>

      <button type="submit" class="kl-btn-primary mt-2" :disabled="authStore.loading">
        {{ authStore.loading ? $t("pages.login.submitting") : $t("pages.login.submit") }}
      </button>

      <button type="button" class="kl-btn-outline" disabled>
        {{ $t("pages.login.googleSignIn") }}
        <span class="text-xs opacity-70">{{ $t("pages.login.googleComingSoon") }}</span>
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-brand-charcoal/60 dark:text-neutral-400">
      {{ $t("pages.login.noAccount") }}
      <NuxtLink to="/kayit" class="font-semibold text-brand-orange">{{ $t("pages.login.registerLink") }}</NuxtLink>
    </p>
  </div>
</template>
