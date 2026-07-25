<script setup lang="ts">
/** Forgot Password — PRD 5.A, design/27-Forgot password.png. Supabase Auth'a bağlı. */
definePageMeta({ layout: "auth" });
usePageTitle("pages.forgotPassword.title");

const { t } = useI18n();
const authStore = useAuthStore();

const email = ref("");
const validationError = ref(false);
const sent = ref(false);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function onSubmit() {
  validationError.value = false;

  if (!email.value || !EMAIL_RE.test(email.value)) {
    validationError.value = true;
    return;
  }

  const { success } = await authStore.resetPasswordForEmail(email.value);

  if (success) {
    sent.value = true;
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-center px-6 py-10">
    <div class="mb-8 flex justify-center">
      <LayoutLogo size="lg" :with-wordmark="true" />
    </div>

    <h1 class="mb-2 text-center text-xl font-bold text-brand-charcoal dark:text-neutral-100">
      {{ $t("pages.forgotPassword.title") }}
    </h1>

    <div v-if="sent" class="flex flex-col gap-3 text-center">
      <p class="mt-2 text-lg font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ $t("pages.forgotPassword.checkEmailTitle") }}
      </p>
      <p class="text-sm text-brand-charcoal/70 dark:text-neutral-400">
        {{ $t("pages.forgotPassword.checkEmailBody") }}
      </p>
      <NuxtLink to="/giris" class="kl-btn-primary mt-2 inline-block">
        {{ $t("pages.login.title") }}
      </NuxtLink>
    </div>

    <template v-else>
      <p class="mb-6 text-center text-sm text-brand-charcoal/60 dark:text-neutral-400">
        {{ $t("pages.forgotPassword.subtitle") }}
      </p>

      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <input
          v-model="email"
          type="email"
          :placeholder="t('pages.forgotPassword.emailPlaceholder')"
          class="kl-input"
          autocomplete="email"
          required
        />

        <p v-if="validationError" class="text-sm text-red-600" role="alert">
          {{ $t("pages.forgotPassword.emailInvalid") }}
        </p>

        <p v-if="authStore.error" class="text-sm text-red-600" role="alert">
          {{ authStore.error }}
        </p>

        <button type="submit" class="kl-btn-primary mt-2" :disabled="authStore.loading">
          {{ authStore.loading ? $t("pages.forgotPassword.submitting") : $t("pages.forgotPassword.submit") }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-brand-charcoal/60 dark:text-neutral-400">
        <NuxtLink to="/giris" class="font-semibold text-brand-orange">{{ $t("pages.forgotPassword.backToLogin") }}</NuxtLink>
      </p>
    </template>
  </div>
</template>
