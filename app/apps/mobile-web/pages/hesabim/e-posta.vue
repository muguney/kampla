<script setup lang="ts">
/**
 * E-Posta Değiştir — PRD 5.J (Faz 6). `supabase.auth.updateUser({ email })`
 * çağrısı Supabase'de varsayılan olarak hem eski hem yeni adrese bir onay
 * bağlantısı gönderir; e-posta yalnızca kullanıcı bu bağlantıya tıklayınca
 * gerçekten değişir (bkz. Supabase Auth "Secure email change" ayarı).
 */
import type { Database } from "@kampla/shared";

definePageMeta({ middleware: ["auth"] });
usePageTitle("pages.accountEmail.title");

const { t } = useI18n();
const authStore = useAuthStore();
const supabase = useSupabaseClient<Database>();

const newEmail = ref("");
const loading = ref(false);
const error = ref("");
const sent = ref(false);

async function onSubmit() {
  const trimmed = newEmail.value.trim();
  if (!trimmed) return;

  loading.value = true;
  error.value = "";

  const { error: updateError } = await supabase.auth.updateUser({ email: trimmed });

  loading.value = false;

  if (updateError) {
    error.value = updateError.message || t("pages.accountEmail.genericError");
    return;
  }

  // NOT (kapsam dışı — bilinçli): `profiles.email` kolonu burada HEMEN
  // güncellenmiyor, çünkü `auth.users.email` onay linkine tıklanana kadar
  // değişmiyor. `profiles.email`'in `auth.users.email` ile senkron kalması için
  // ileride bir `auth.users` UPDATE trigger'ı / webhook eklenmesi gerekiyor
  // (bkz. TASKS.md) — bu görev bunu kapsamıyor.
  sent.value = true;
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div v-if="sent" class="kl-card flex flex-col items-center gap-3 px-4 py-8 text-center">
      <span class="text-3xl">✉️</span>
      <p class="font-semibold text-brand-charcoal dark:text-neutral-100">
        {{ t("pages.accountEmail.checkEmailTitle") }}
      </p>
      <p class="text-sm text-brand-charcoal/70 dark:text-neutral-400">
        {{ t("pages.accountEmail.checkEmailBody") }}
      </p>
      <NuxtLink to="/hesabim" class="kl-btn-primary mt-2 inline-block">{{ t("common.back") }}</NuxtLink>
    </div>

    <form v-else class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <label class="text-sm font-semibold text-brand-charcoal/70 dark:text-neutral-400">
        {{ t("pages.accountEmail.label") }}
      </label>
      <p class="text-xs text-brand-charcoal/50 dark:text-neutral-500">
        {{ t("pages.accountEmail.currentLabel") }}: {{ authStore.profile?.email }}
      </p>
      <input
        v-model="newEmail"
        type="email"
        :placeholder="t('pages.accountEmail.placeholder')"
        class="kl-input"
        autocomplete="email"
        required
      />

      <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

      <button type="submit" class="kl-btn-primary mt-2" :disabled="loading || !newEmail.trim()">
        {{ loading ? t("pages.accountEmail.submitting") : t("pages.accountEmail.submit") }}
      </button>
    </form>
  </div>
</template>
