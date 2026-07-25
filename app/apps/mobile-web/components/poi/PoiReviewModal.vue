<script setup lang="ts">
/**
 * "Yorum yazın" modalı (PRD 5.F, design/15-Poi Detay Yorum Ekle.png).
 * Yıldız seçimi + serbest metin → "Yorumu yayınla". Faz 3 salt okunur: submit
 * yalnızca `PoiReviewsTab`'daki yerel mock listesine ekler, gerçek `reviews`
 * tablosuna insert Faz 5'te eklenecek (PRD 6.8). Açılmadan önce misafir
 * kontrolü çağıran tarafta yapılır (bkz. components/poi/PoiReviewsTab.vue).
 */
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  "update:modelValue": [boolean];
  submit: [{ rating: number; comment: string }];
}>();

const { t } = useI18n();
const authStore = useAuthStore();

const rating = ref(0);
const hoverRating = ref(0);
const comment = ref("");
const showRatingError = ref(false);

function close() {
  emit("update:modelValue", false);
  setTimeout(() => {
    rating.value = 0;
    hoverRating.value = 0;
    comment.value = "";
    showRatingError.value = false;
  }, 250);
}

function submit() {
  if (rating.value < 1) {
    showRatingError.value = true;
    return;
  }
  emit("submit", { rating: rating.value, comment: comment.value.trim() });
  close();
}

const displayName = computed(() => authStore.profile?.username ?? "");
const avatarUrl = computed(() => authStore.profile?.avatar_url ?? null);
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
          :aria-label="t('pages.poiDetail.reviewModal.title')"
        >
          <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

          <button
            type="button"
            class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-brand-charcoal/60 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
            :aria-label="t('common.close')"
            @click="close"
          >
            ✕
          </button>

          <div class="mb-4 flex flex-col items-center gap-2 text-center">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="displayName"
              class="h-14 w-14 rounded-full object-cover"
            />
            <span
              v-else
              class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-lg font-bold text-brand-orange"
            >
              {{ (displayName || "?").charAt(0).toUpperCase() }}
            </span>
            <p v-if="displayName" class="text-sm font-bold text-brand-orange">{{ displayName }}</p>
          </div>

          <h2 class="mb-2 text-center text-base font-bold text-brand-charcoal dark:text-neutral-100">
            {{ t("pages.poiDetail.reviewModal.title") }}
          </h2>

          <div class="mb-4 flex justify-center gap-1.5" role="radiogroup" :aria-label="t('pages.poiDetail.reviewModal.title')">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="text-3xl leading-none transition-transform hover:scale-110"
              :aria-label="String(star)"
              role="radio"
              :aria-checked="rating === star"
              @mouseenter="hoverRating = star"
              @mouseleave="hoverRating = 0"
              @click="rating = star; showRatingError = false"
            >
              <span :class="(hoverRating || rating) >= star ? 'text-poi-shower' : 'text-neutral-300 dark:text-neutral-600'">★</span>
            </button>
          </div>
          <p v-if="showRatingError" class="mb-3 text-center text-xs font-semibold text-red-500">
            {{ t("pages.poiDetail.reviewModal.ratingRequired") }}
          </p>

          <textarea
            v-model="comment"
            rows="4"
            class="kl-input mb-4 resize-none"
            :placeholder="t('pages.poiDetail.reviewModal.placeholder')"
          />

          <div class="flex gap-3">
            <button type="button" class="kl-btn-outline flex-1" @click="close">
              {{ t("common.cancel") }}
            </button>
            <button type="button" class="kl-btn-primary flex-1" @click="submit">
              {{ t("pages.poiDetail.reviewModal.submit") }}
            </button>
          </div>
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
