<script setup lang="ts">
/** Kullanıcı Adı Değiştir — PRD 5.J (Faz 6). `profiles.username` `unique` kısıtlı
 * (bkz. supabase/migrations/0002_profiles.sql), çakışma durumunda kullanıcı
 * dostu bir hata gösteriyoruz. */
import type { Database } from "@kampla/shared";

definePageMeta({ middleware: ["auth"] });
usePageTitle("pages.accountUsername.title");

const { t } = useI18n();
const authStore = useAuthStore();
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const username = ref(authStore.profile?.username ?? "");
const loading = ref(false);
const error = ref("");
const success = ref(false);

async function onSubmit() {
  if (!user.value) return;

  const trimmed = username.value.trim();
  if (!trimmed) return;

  loading.value = true;
  error.value = "";

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ username: trimmed })
    .eq("id", user.value.id);

  loading.value = false;

  if (updateError) {
    // Postgres unique_violation (23505) — `profiles.username unique` kısıtı.
    if (updateError.code === "23505" || /duplicate key|already exists/i.test(updateError.message)) {
      error.value = t("pages.accountUsername.usernameTaken");
    } else {
      error.value = t("pages.accountUsername.genericError");
    }
    return;
  }

  await authStore.fetchProfile();
  success.value = true;
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div v-if="success" class="kl-card flex flex-col items-center gap-3 px-4 py-8 text-center">
      <span class="text-3xl">✅</span>
      <p class="font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ t("pages.accountUsername.successToast") }}
      </p>
      <NuxtLink to="/hesabim" class="kl-btn-primary mt-2 inline-block">{{ t("common.back") }}</NuxtLink>
    </div>

    <form v-else class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <label class="text-sm font-semibold text-brand-charcoal/70 dark:text-neutral-400">
        {{ t("pages.accountUsername.label") }}
      </label>
      <input
        v-model="username"
        type="text"
        :placeholder="t('pages.accountUsername.placeholder')"
        class="kl-input"
        required
      />

      <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

      <button type="submit" class="kl-btn-primary mt-2" :disabled="loading || !username.trim()">
        {{ loading ? t("pages.accountUsername.submitting") : t("pages.accountUsername.submit") }}
      </button>
    </form>
  </div>
</template>
