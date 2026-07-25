<script setup lang="ts">
/**
 * Konum Ekle — 6 adımlı sihirbaz (PRD 5.G, design/18-24 "Konum Ekle - *.png").
 * Faz 0: yalnızca adım navigasyonu iskeleti. Form state Faz 4'te
 * `useLocationWizard()` composable'ı üzerinden gerçek verilerle doldurulacak.
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

    <div class="flex-1 px-6 py-6">
      <div class="mb-6 flex items-center gap-3">
        <span class="text-3xl">{{ stepMeta[step - 1].icon }}</span>
        <h1 class="text-lg font-bold text-brand-charcoal dark:text-neutral-100">
          {{ $t(stepMeta[step - 1].key) }}
        </h1>
      </div>

      <UiPlaceholderScreen
        icon="🚧"
        description="Bu adımın formu ilerleyen fazda (Faz 4) doldurulacak."
      />
    </div>

    <footer class="flex items-center justify-between gap-3 px-6 py-4">
      <button
        type="button"
        class="kl-btn-outline"
        :disabled="step === 1"
        @click="goTo(step - 1)"
      >
        Geri
      </button>
      <button
        v-if="step < 6"
        type="button"
        class="kl-btn-primary"
        @click="goTo(step + 1)"
      >
        Devam Et
      </button>
      <button v-else type="button" class="kl-btn-primary" disabled>
        Onayla ve Kaydet
      </button>
    </footer>
  </div>
</template>
