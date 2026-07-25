<script setup lang="ts">
/** Register — PRD 5.A, design/26-Register.png. Supabase Auth'a bağlı. */
definePageMeta({ layout: "auth" });
usePageTitle("pages.register.title");

const { t } = useI18n();
const authStore = useAuthStore();

const username = ref("");
const email = ref("");
const password = ref("");
const agreed = ref(false);

const registered = ref(false);
const agreementError = ref(false);

const canSubmit = computed(() => agreed.value && !authStore.loading);

async function onSubmit() {
  agreementError.value = false;

  if (!agreed.value) {
    agreementError.value = true;
    return;
  }

  const { success, session } = await authStore.signUp(email.value, password.value, username.value);

  if (!success) {
    return;
  }

  if (session) {
    // E-posta onayı kapalıysa Supabase doğrudan oturum döndürür.
    await navigateTo("/");
    return;
  }

  // E-posta onayı açık: kullanıcıyı bilgilendir, sonra girişe yönlendir.
  registered.value = true;
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-center px-6 py-10">
    <div class="mb-8 flex justify-center">
      <LayoutLogo size="lg" :with-wordmark="true" />
    </div>

    <h1 class="mb-6 text-center text-xl font-bold text-brand-charcoal dark:text-neutral-100">
      {{ $t("pages.register.title") }}
    </h1>

    <div v-if="registered" class="flex flex-col gap-3 text-center">
      <p class="text-lg font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ $t("pages.register.checkEmailTitle") }}
      </p>
      <p class="text-sm text-brand-charcoal/70 dark:text-neutral-400">
        {{ $t("pages.register.checkEmailBody") }}
      </p>
      <NuxtLink to="/giris" class="kl-btn-primary mt-2 inline-block">
        {{ $t("pages.login.title") }}
      </NuxtLink>
    </div>

    <form v-else class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <input
        v-model="username"
        type="text"
        :placeholder="t('pages.register.usernamePlaceholder')"
        class="kl-input"
        required
      />
      <input
        v-model="email"
        type="email"
        :placeholder="t('pages.register.emailPlaceholder')"
        class="kl-input"
        autocomplete="email"
        required
      />
      <input
        v-model="password"
        type="password"
        :placeholder="t('pages.register.passwordPlaceholder')"
        class="kl-input"
        autocomplete="new-password"
        required
      />

      <label class="flex items-start gap-2 text-sm text-brand-charcoal/70 dark:text-neutral-400">
        <input v-model="agreed" type="checkbox" class="mt-1" />
        <span>
          <NuxtLink to="/kullanim-kosullari" class="text-brand-orange">{{ $t("pages.register.agreementTerms") }}</NuxtLink>
          {{ $t("pages.register.agreementAnd") }}
          <NuxtLink to="/gizlilik" class="text-brand-orange">{{ $t("pages.register.agreementPrivacy") }}</NuxtLink>{{ $t("pages.register.agreementSuffix") }}
        </span>
      </label>

      <p v-if="agreementError" class="text-sm text-red-600" role="alert">
        {{ $t("pages.register.agreementRequired") }}
      </p>

      <p v-if="authStore.error" class="text-sm text-red-600" role="alert">
        {{ authStore.error }}
      </p>

      <button type="submit" class="kl-btn-primary mt-2" :disabled="!canSubmit">
        {{ authStore.loading ? $t("pages.register.submitting") : $t("pages.register.submit") }}
      </button>
    </form>

    <p v-if="!registered" class="mt-6 text-center text-sm text-brand-charcoal/60 dark:text-neutral-400">
      {{ $t("pages.register.hasAccount") }}
      <NuxtLink to="/giris" class="font-semibold text-brand-orange">{{ $t("pages.register.loginLink") }}</NuxtLink>
    </p>
  </div>
</template>
