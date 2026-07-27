<script setup lang="ts">
/** Sosyal Medya Hesapları — PRD 5.J (Faz 6). 5 opsiyonel URL alanı, tek
 * `.update()` çağrısıyla `profiles` tablosuna yazılır. */
import type { Database } from "@kampla/shared";

definePageMeta({ middleware: ["auth"] });
usePageTitle("pages.accountSocial.title");

const { t } = useI18n();
const authStore = useAuthStore();
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const website = ref(authStore.profile?.website_url ?? "");
const facebook = ref(authStore.profile?.facebook_url ?? "");
const instagram = ref(authStore.profile?.instagram_url ?? "");
const x = ref(authStore.profile?.x_url ?? "");
const youtube = ref(authStore.profile?.youtube_url ?? "");

const loading = ref(false);
const error = ref("");
const success = ref(false);

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

async function onSubmit() {
  if (!user.value) return;

  loading.value = true;
  error.value = "";
  success.value = false;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      website_url: emptyToNull(website.value),
      facebook_url: emptyToNull(facebook.value),
      instagram_url: emptyToNull(instagram.value),
      x_url: emptyToNull(x.value),
      youtube_url: emptyToNull(youtube.value),
    })
    .eq("id", user.value.id);

  if (updateError) {
    loading.value = false;
    error.value = t("pages.accountSocial.genericError");
    return;
  }

  await authStore.fetchProfile();
  loading.value = false;
  success.value = true;
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <input
        v-model="website"
        type="url"
        :placeholder="t('pages.accountSocial.websitePlaceholder')"
        class="kl-input"
      />
      <input
        v-model="facebook"
        type="url"
        :placeholder="t('pages.accountSocial.facebookPlaceholder')"
        class="kl-input"
      />
      <input
        v-model="instagram"
        type="url"
        :placeholder="t('pages.accountSocial.instagramPlaceholder')"
        class="kl-input"
      />
      <input v-model="x" type="url" :placeholder="t('pages.accountSocial.xPlaceholder')" class="kl-input" />
      <input
        v-model="youtube"
        type="url"
        :placeholder="t('pages.accountSocial.youtubePlaceholder')"
        class="kl-input"
      />

      <p v-if="success" class="text-sm font-medium text-green-600">{{ t("pages.accountSocial.successToast") }}</p>
      <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

      <button type="submit" class="kl-btn-primary mt-2" :disabled="loading">
        {{ loading ? t("pages.accountSocial.submitting") : t("pages.accountSocial.submit") }}
      </button>
    </form>
  </div>
</template>
