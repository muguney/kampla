<script setup lang="ts">
/**
 * POI Detay — "Yorumlar" sekmesi (PRD 5.F, design/14-Poi Yorumlar.png).
 * 1-5 yıldız dağılım grafiği + ortalama + toplam yorum sayısı, yorum kartları
 * (boşsa "İlk yorumu sen yaz" boş durumu — PRD 5.O) ve "Yorum yazın" modalı.
 * Faz 3 salt okunur: yeni yorum yalnızca bu bileşenin yerel state'ine eklenir,
 * gerçek `reviews` tablosuna insert Faz 5'te eklenecek (PRD 6.8).
 */
import { getReviewsForLocation, type MockLocationCard, type MockReview } from "@kampla/shared";

const props = defineProps<{ location: MockLocationCard }>();

const { t, locale } = useI18n();
const authStore = useAuthStore();
const route = useRoute();

const localReviews = ref<MockReview[]>(getReviewsForLocation(props.location.id));
const reviewCount = ref(props.location.rating_count);
const isReviewModalOpen = ref(false);

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;

/**
 * Gerçek şemada per-yıldız kırılım yok (`Location.rating_avg`/`rating_count`
 * yalnızca toplam ortalama/adet tutar, bkz. packages/shared/src/types.ts).
 * Bu yüzden dağılım çubukları, ortalamaya göre deterministik/gerçekçi görünüşlü
 * bir sahte dağılımdan üretilir — Faz 5'te `reviews` tablosu üzerinden
 * `GROUP BY rating` ile gerçek dağılıma bağlanacak.
 */
const distribution = computed<Record<number, number>>(() => {
  const count = reviewCount.value;
  const avg = props.location.rating_avg;
  if (count === 0) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const clampedAvg = Math.min(5, Math.max(1, avg || 5));
  const weights = [1, 2, 3, 4, 5].map((star) => Math.max(0.02, 1 - Math.abs(star - clampedAvg) / 3.2) ** 3);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  const result: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  [1, 2, 3, 4, 5].forEach((star, i) => {
    result[star] = Math.round((weights[i] / totalWeight) * count);
  });
  return result;
});

function barPercent(star: number): number {
  if (reviewCount.value === 0) return 0;
  return Math.min(100, (distribution.value[star] / reviewCount.value) * 100);
}

function starDisplay(rating: number): { filled: string; empty: string } {
  const rounded = Math.round(rating);
  return { filled: "★".repeat(rounded), empty: "★".repeat(5 - rounded) };
}

function openReviewModal() {
  if (!authStore.isLoggedIn) {
    navigateTo(`/giris?redirect=${encodeURIComponent(route.fullPath)}`);
    return;
  }
  isReviewModalOpen.value = true;
}

function handleSubmitReview(payload: { rating: number; comment: string }) {
  const newReview: MockReview = {
    id: `local-review-${Date.now()}`,
    location_id: props.location.id,
    user_id: authStore.profile?.id ?? "guest",
    username: authStore.profile?.username ?? "—",
    avatar_url: authStore.profile?.avatar_url ?? null,
    rating: payload.rating,
    comment: payload.comment || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localReviews.value = [newReview, ...localReviews.value];
  reviewCount.value += 1;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(locale.value === "en" ? "en-GB" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}
</script>

<template>
  <div class="flex flex-col gap-6 px-4 py-5">
    <!-- Değerlendirme dağılımı -->
    <section>
      <h2 class="mb-3 text-sm font-bold text-brand-charcoal/70 dark:text-neutral-300">
        {{ t("pages.poiDetail.reviewsTab.ratingTitle") }}
      </h2>
      <div class="flex items-center gap-4">
        <div class="flex-1 space-y-1.5">
          <div v-for="star in STAR_LEVELS" :key="star" class="flex items-center gap-2">
            <span class="w-2 text-xs text-brand-charcoal/60 dark:text-neutral-400">{{ star }}</span>
            <div class="h-2 flex-1 overflow-hidden rounded-pill bg-neutral-200 dark:bg-neutral-700">
              <div class="h-full rounded-pill bg-poi-shower" :style="{ width: barPercent(star) + '%' }" />
            </div>
          </div>
        </div>
        <div class="flex w-20 shrink-0 flex-col items-center text-center">
          <span class="text-3xl font-extrabold text-brand-charcoal dark:text-neutral-100">
            {{ location.rating_avg.toFixed(1) }}
          </span>
          <span class="text-sm">
            <span class="text-poi-shower">{{ starDisplay(location.rating_avg).filled }}</span
            ><span class="text-neutral-300 dark:text-neutral-600">{{ starDisplay(location.rating_avg).empty }}</span>
          </span>
          <span class="mt-0.5 text-xs text-brand-charcoal/60 dark:text-neutral-400">
            {{ t("pages.poiDetail.reviewsTab.totalReviews", { count: reviewCount }) }}
          </span>
        </div>
      </div>

      <button type="button" class="kl-btn-outline mt-4 w-full" @click="openReviewModal">
        ✏️ {{ t("pages.poiDetail.reviewsTab.writeReview") }}
      </button>
    </section>

    <!-- Yorum kartları -->
    <section v-if="localReviews.length > 0" class="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
      <article v-for="review in localReviews" :key="review.id" class="flex flex-col gap-2 py-4 first:pt-0">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <img
              v-if="review.avatar_url"
              :src="review.avatar_url"
              :alt="review.username"
              class="h-9 w-9 rounded-full object-cover"
            />
            <span
              v-else
              class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-bold text-brand-orange"
            >
              {{ review.username.charAt(0).toUpperCase() }}
            </span>
            <div>
              <p class="text-sm font-semibold text-brand-orange">{{ review.username }}</p>
              <p class="text-xs text-brand-charcoal/50 dark:text-neutral-500">{{ formatDate(review.created_at) }}</p>
            </div>
          </div>
          <span class="text-sm">
            <span class="text-poi-shower">{{ starDisplay(review.rating).filled }}</span
            ><span class="text-neutral-300 dark:text-neutral-600">{{ starDisplay(review.rating).empty }}</span>
          </span>
        </div>
        <p v-if="review.comment" class="text-sm leading-relaxed text-brand-charcoal/85 dark:text-neutral-300">
          {{ review.comment }}
        </p>
      </article>
    </section>

    <UiEmptyState
      v-else
      icon="💬"
      :title="t('pages.poiDetail.reviewsTab.emptyTitle')"
      :description="t('pages.poiDetail.reviewsTab.emptyDescription')"
      :cta-label="t('pages.poiDetail.reviewsTab.emptyCta')"
      @cta-click="openReviewModal"
    />

    <PoiReviewModal v-model="isReviewModalOpen" @submit="handleSubmitReview" />
  </div>
</template>
