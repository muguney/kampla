<script setup lang="ts">
/**
 * Konum Ekle — 6 adımlı sihirbaz (PRD 5.G, design/18-24 "Konum Ekle - *.png").
 * Faz 4'te tüm adımlar gerçek form state'ine (`useLocationWizardStore`) ve
 * adım 6'da gerçek Supabase insert'e bağlandı.
 */
import { useLocationWizardStore } from "~/stores/locationWizard";

// PRD 5.A — konum ekleme sihirbazının tamamı bir "aksiyon"dur: misafir kullanıcı
// bu sayfaya girmeye çalışırsa girişe yönlendirilir (bkz. middleware/auth.ts).
definePageMeta({ layout: "auth", middleware: ["auth"] });

const route = useRoute();
const router = useRouter();
const wizard = useLocationWizardStore();

const stepMeta = [
  { key: "wizard.step1", icon: "📍" },
  { key: "wizard.step2", icon: "🏷️" },
  { key: "wizard.step3", icon: "🛠️" },
  { key: "wizard.step4", icon: "📝" },
  { key: "wizard.step5", icon: "📷" },
  { key: "wizard.step6", icon: "✅" },
];

const step = computed(() => {
  const raw = Number(route.params.step);
  return Number.isFinite(raw) && raw >= 1 && raw <= 6 ? raw : 1;
});

usePageTitle(stepMeta[step.value - 1].key);

/**
 * "Devam Et" butonunun aktiflik koşulu (PRD 5.G). Adım 1/2 zorunlu seçim
 * gerektirir, adım 3 (hizmetler) opsiyoneldir, adım 4'te yalnızca `name`
 * zorunlu (diğer her şey opsiyonel), adım 5 (fotoğraf) tamamen opsiyoneldir.
 * Adım 6'nın kendi "Kaydet" butonu vardır (bkz. WizardStep6Confirm.vue),
 * paylaşılan footer adım 6'da gösterilmez.
 */
const isStepValid = computed(() => {
  switch (step.value) {
    case 1:
      return wizard.lat !== null && wizard.lng !== null;
    case 2:
      return wizard.locationType !== null;
    case 3:
      return true;
    case 4:
      return wizard.name.trim().length > 0;
    case 5:
      return true;
    default:
      return true;
  }
});

const goTo = (n: number) => {
  if (n < 1 || n > 6) return;
  router.push(`/konum-ekle/${n}`);
};

onBeforeUnmount(() => {
  // Sihirbazdan tamamen çıkılırsa state sıfırlanır (adımlar arası geçişte korunur).
  if (!router.currentRoute.value.path.startsWith("/konum-ekle")) {
    wizard.reset();
  }
});
</script>

<template>
  <div class="flex flex-1 flex-col">
    <header class="flex items-center justify-between px-4 py-3">
      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label="Kapat"
        @click="router.push('/')"
      >
        ✕
      </button>
      <LayoutLogo size="sm" :with-wordmark="false" />
    </header>

    <!-- Adım göstergesi -->
    <div class="flex justify-center gap-1.5 px-4 pb-4">
      <span
        v-for="n in 6"
        :key="n"
        class="h-1.5 flex-1 max-w-10 rounded-pill"
        :class="n <= step ? 'bg-brand-orange' : 'bg-neutral-200 dark:bg-neutral-700'"
      />
    </div>

    <div class="flex flex-1 flex-col px-6 py-6">
      <div class="mb-6 flex items-center gap-3">
        <span class="text-3xl">{{ stepMeta[step - 1].icon }}</span>
        <h1 class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">
          {{ $t(stepMeta[step - 1].key) }}
        </h1>
      </div>

      <WizardStep1Location v-if="step === 1" />
      <WizardStep2Type v-else-if="step === 2" />
      <WizardStep3Amenities v-else-if="step === 3" />
      <WizardStep4Details v-else-if="step === 4" />
      <WizardStep5Photos v-else-if="step === 5" />
      <WizardStep6Confirm v-else-if="step === 6" />
    </div>

    <footer v-if="step < 6" class="flex items-center justify-between gap-3 px-6 py-4">
      <button
        type="button"
        class="kl-btn-outline"
        :disabled="step === 1"
        @click="goTo(step - 1)"
      >
        Geri
      </button>
      <button
        type="button"
        class="kl-btn-primary"
        :disabled="!isStepValid"
        @click="goTo(step + 1)"
      >
        Devam Et
      </button>
    </footer>
  </div>
</template>
