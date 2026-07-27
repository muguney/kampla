<script setup lang="ts">
/**
 * Şifre Değiştir — PRD 5.J (Faz 6). Supabase'in `updateUser({ password })`'ı
 * mevcut şifreyi zorunlu kılmıyor; ek bir güvenlik katmanı olarak önce
 * `signInWithPassword` ile "mevcut şifre doğru mu?" kontrolü (re-auth) yapılıyor,
 * yalnızca başarılıysa yeni şifreye geçiliyor.
 */
import type { Database } from "@kampla/shared";

definePageMeta({ middleware: ["auth"] });
usePageTitle("pages.accountPassword.title");

const { t } = useI18n();
const authStore = useAuthStore();
const supabase = useSupabaseClient<Database>();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);

async function onSubmit() {
  error.value = "";

  if (newPassword.value !== confirmPassword.value) {
    error.value = t("pages.accountPassword.mismatchError");
    return;
  }

  if (newPassword.value.length < 6) {
    error.value = t("pages.accountPassword.tooShortError");
    return;
  }

  const email = authStore.profile?.email;
  if (!email) {
    error.value = t("pages.accountPassword.genericError");
    return;
  }

  loading.value = true;

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword.value,
  });

  if (reauthError) {
    loading.value = false;
    error.value = t("pages.accountPassword.currentWrongError");
    return;
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword.value });

  loading.value = false;

  if (updateError) {
    error.value = updateError.message || t("pages.accountPassword.genericError");
    return;
  }

  success.value = true;
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div v-if="success" class="kl-card flex flex-col items-center gap-3 px-4 py-8 text-center">
      <span class="text-3xl">✅</span>
      <p class="font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ t("pages.accountPassword.successToast") }}
      </p>
      <NuxtLink to="/hesabim" class="kl-btn-primary mt-2 inline-block">{{ t("common.back") }}</NuxtLink>
    </div>

    <form v-else class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <input
        v-model="currentPassword"
        type="password"
        :placeholder="t('pages.accountPassword.currentPlaceholder')"
        class="kl-input"
        autocomplete="current-password"
        required
      />
      <input
        v-model="newPassword"
        type="password"
        :placeholder="t('pages.accountPassword.newPlaceholder')"
        class="kl-input"
        autocomplete="new-password"
        required
      />
      <input
        v-model="confirmPassword"
        type="password"
        :placeholder="t('pages.accountPassword.confirmPlaceholder')"
        class="kl-input"
        autocomplete="new-password"
        required
      />

      <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

      <button type="submit" class="kl-btn-primary mt-2" :disabled="loading">
        {{ loading ? t("pages.accountPassword.submitting") : t("pages.accountPassword.submit") }}
      </button>
    </form>
  </div>
</template>
