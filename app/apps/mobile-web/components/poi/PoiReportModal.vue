<script setup lang="ts">
/**
 * "Hata Bildir" modalı (PRD 5.F, design/16-Poi Detay - Hata Bildir.png).
 * Faz 3 salt okunur: gönderim yalnızca yerel state'te "gönderildi" durumuna
 * geçer, gerçek `reports` tablosuna insert Faz 5'te eklenecek (PRD 6.10).
 */
defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const { t } = useI18n();

const description = ref("");
const submitted = ref(false);

function close() {
  emit("update:modelValue", false);
  // Kapanış animasyonu bitsin diye formu hemen değil, kısa gecikmeyle sıfırla.
  setTimeout(() => {
    description.value = "";
    submitted.value = false;
  }, 250);
}

function submit() {
  if (!description.value.trim()) return;
  // TODO(Faz 5): `reports` tablosuna gerçek insert (PRD 6.10, reporter_id nullable —
  // misafir kullanıcılar da hata bildirebilir). Şimdilik yalnızca UI geri bildirimi.
  submitted.value = true;
}
</script>

<template>
  <Teleport to="body">
    <Transition name="kampla-fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-end justify-center">
        <div class="absolute inset-0 bg-black/40" @click="close" />

        <div
          class="kl-card relative w-full max-w-md rounded-b-none p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
          role="dialog"
          aria-modal="true"
          :aria-label="t('pages.poiDetail.reportModal.title')"
        >
          <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-brand-charcoal dark:text-neutral-100">
              {{ t("pages.poiDetail.reportModal.title") }}
            </h2>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-brand-charcoal/60 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
              :aria-label="t('common.close')"
              @click="close"
            >
              ✕
            </button>
          </div>

          <div v-if="submitted" class="flex flex-col items-center gap-2 py-6 text-center">
            <span class="text-4xl">✅</span>
            <p class="text-sm font-semibold text-brand-charcoal dark:text-neutral-100">
              {{ t("pages.poiDetail.reportModal.submitted") }}
            </p>
          </div>

          <form v-else class="flex flex-col gap-3" @submit.prevent="submit">
            <textarea
              v-model="description"
              rows="4"
              class="kl-input resize-none"
              :placeholder="t('pages.poiDetail.reportModal.placeholder')"
            />
            <div class="flex gap-3">
              <button type="button" class="kl-btn-outline flex-1" @click="close">
                {{ t("common.cancel") }}
              </button>
              <button type="submit" class="kl-btn-primary flex-1" :disabled="!description.trim()">
                {{ t("pages.poiDetail.reportModal.submit") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.kampla-fade-enter-active,
.kampla-fade-leave-active {
  transition: opacity 0.2s ease;
}
.kampla-fade-enter-from,
.kampla-fade-leave-to {
  opacity: 0;
}
</style>
