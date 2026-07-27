<script setup lang="ts">
/**
 * Konum Ekle — Adım 6: Onayla ve Kaydet (PRD 5.G madde 6).
 * Sözleşme/doğruluk beyanı onay kutusu işaretlenmeden "Kaydet" devre dışı.
 * Kaydet'e basınca gerçek Supabase insert: `locations` (status='pending',
 * source='user', created_by=auth.uid()) + dönen id ile `location_amenities`
 * satırları. Başarıda "Yönetici incelemesinden sonra yayınlanır" mesajı,
 * wizard reset, Ana Ekran'a yönlendirme (buton + birkaç saniye sonra otomatik).
 *
 * Bu adım kendi "Geri"/"Kaydet" aksiyon çubuğunu render eder — [step].vue'daki
 * paylaşılan footer yalnızca adım 1-5 için gösterilir (bkz. [step].vue
 * `v-if="step < 6"`), çünkü kayıt sonrası başarı ekranında "Geri" butonu
 * anlamsız hale geliyor ve bu bileşen kendi state'ine göre karar veriyor.
 */
import type { Database } from "@kampla/shared";
import { useLocationWizardStore } from "~/stores/locationWizard";

const { t } = useI18n();
const router = useRouter();
const wizard = useLocationWizardStore();
const authStore = useAuthStore();
const supabase = useSupabaseClient<Database>();

const submitting = ref(false);
const submitError = ref("");
const success = ref(false);

const canSubmit = computed(() => wizard.agreedToTerms && !submitting.value);

const AUTO_REDIRECT_MS = 4000;

async function handleSubmit() {
  if (!canSubmit.value) return;

  const profileId = authStore.profile?.id;
  if (!profileId) {
    submitError.value = t("wizard.confirmStep.authRequired");
    return;
  }
  if (wizard.lat === null || wizard.lng === null || !wizard.locationType || !wizard.name) {
    // Beklenmedik durum — erken adımlarda geçerlilik zaten sağlanmış olmalı.
    submitError.value = t("wizard.confirmStep.genericError");
    return;
  }

  submitting.value = true;
  submitError.value = "";

  const { data: inserted, error } = await supabase
    .from("locations")
    .insert({
      created_by: profileId,
      name: wizard.name,
      description: wizard.description || null,
      location_type: wizard.locationType,
      lat: wizard.lat,
      lng: wizard.lng,
      phone: wizard.phone || null,
      website_url: wizard.websiteUrl || null,
      facebook_url: wizard.facebookUrl || null,
      instagram_url: wizard.instagramUrl || null,
      youtube_url: wizard.youtubeUrl || null,
      x_url: wizard.xUrl || null,
      accommodation_types: wizard.accommodationTypes,
      season: wizard.season,
      photo_urls: wizard.photos,
      status: "pending",
      source: "user",
    })
    .select("id")
    .single();

  if (error || !inserted) {
    submitting.value = false;
    submitError.value = error?.message ?? t("wizard.confirmStep.genericError");
    return;
  }

  const locationId = (inserted as { id: string }).id;

  if (wizard.amenities.length > 0) {
    const { error: amenityError } = await supabase.from("location_amenities").insert(
      wizard.amenities.map((amenity) => ({ location_id: locationId, amenity }))
    );
    if (amenityError) {
      // Konum zaten oluşturuldu; imkan satırlarındaki bir hata tüm akışı
      // bloklamamalı (kullanıcı için konum yine de "pending" olarak kaydedildi).
      // eslint-disable-next-line no-console
      console.error("location_amenities insert failed", amenityError);
    }
  }

  submitting.value = false;
  success.value = true;
  wizard.reset();

  if (import.meta.client) {
    setTimeout(() => {
      router.push("/");
    }, AUTO_REDIRECT_MS);
  }
}

function goBack() {
  router.push("/konum-ekle/5");
}

function goHome() {
  router.push("/");
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <!-- Başarı ekranı -->
    <div v-if="success" class="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <span class="text-5xl">🎉</span>
      <h2 class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">
        {{ t("wizard.confirmStep.successTitle") }}
      </h2>
      <p class="text-sm text-brand-charcoal/70 dark:text-neutral-300">
        {{ t("wizard.confirmStep.successBody") }}
      </p>
      <button type="button" class="kl-btn-primary mt-2" @click="goHome">
        {{ t("wizard.confirmStep.goHome") }}
      </button>
    </div>

    <!-- Onay formu -->
    <template v-else>
      <div class="flex flex-1 flex-col gap-4">
        <p class="text-sm text-brand-charcoal/70 dark:text-neutral-300">
          {{ t("wizard.confirmStep.hint") }}
        </p>

        <label
          class="flex items-start gap-2 rounded-control border border-neutral-200 bg-white px-4 py-3 text-sm text-brand-charcoal/80 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
        >
          <input v-model="wizard.agreedToTerms" type="checkbox" class="mt-1" />
          <span>{{ t("wizard.confirmStep.agreementLabel") }}</span>
        </label>

        <p v-if="submitError" class="text-sm font-medium text-red-500 dark:text-red-400" role="alert">
          {{ submitError }}
        </p>
      </div>

      <footer class="flex items-center justify-between gap-3 px-0 py-4">
        <button type="button" class="kl-btn-outline" :disabled="submitting" @click="goBack">
          {{ t("wizard.confirmStep.back") }}
        </button>
        <button type="button" class="kl-btn-primary" :disabled="!canSubmit" @click="handleSubmit">
          {{ submitting ? t("wizard.confirmStep.submitting") : t("wizard.confirmStep.submit") }}
        </button>
      </footer>
    </template>
  </div>
</template>
