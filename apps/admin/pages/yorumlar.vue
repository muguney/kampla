<script setup lang="ts">
/**
 * Yorum Moderasyonu — PRD 5.R.
 * `reviews` tablosundaki tüm kullanıcı yorumlarını listeler, adminin
 * uygunsuz yorumları silmesine izin verir. Silme `0006_reviews.sql`'deki
 * `reviews_delete_admin` RLS policy'sine (`public.is_admin()`) dayanır —
 * yeni migration gerekmiyor.
 */
import type { Database, Location, Profile, Review } from "@kampla/shared";

definePageMeta({ middleware: "admin" });

const supabase = useSupabaseClient<Database>();

const reviews = ref<Review[]>([]);
const locationInfo = ref<Record<string, Pick<Location, "id" | "name" | "city">>>({});
const reviewerUsernames = ref<Record<string, string>>({});

const loadingList = ref(false);
const listError = ref<string | null>(null);

const ratingFilter = ref<"all" | 1 | 2 | 3 | 4 | 5>("all");

const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(message: string) {
  toast.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = null), 4000);
}

const deletingId = ref<string | null>(null);
const actionError = ref<string | null>(null);

const ratingTabs: { value: "all" | 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: 5, label: "5 ★" },
  { value: 4, label: "4 ★" },
  { value: 3, label: "3 ★" },
  { value: 2, label: "2 ★" },
  { value: 1, label: "1 ★" },
];

const filteredReviews = computed(() => {
  if (ratingFilter.value === "all") return reviews.value;
  return reviews.value.filter((r) => r.rating === ratingFilter.value);
});

async function fetchReviews() {
  loadingList.value = true;
  listError.value = null;
  actionError.value = null;

  const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });

  if (error) {
    listError.value = error.message;
    loadingList.value = false;
    return;
  }

  reviews.value = (data ?? []) as Review[];

  const locationIds = [...new Set(reviews.value.map((r) => r.location_id).filter((id): id is string => !!id))];
  const reviewerIds = [...new Set(reviews.value.map((r) => r.user_id).filter((id): id is string => !!id))];

  if (locationIds.length > 0) {
    const { data: locations } = await supabase.from("locations").select("id, name, city").in("id", locationIds);
    const rows = (locations ?? []) as Pick<Location, "id" | "name" | "city">[];
    locationInfo.value = Object.fromEntries(rows.map((l) => [l.id, l]));
  } else {
    locationInfo.value = {};
  }

  if (reviewerIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", reviewerIds);
    const rows = (profiles ?? []) as Pick<Profile, "id" | "username">[];
    reviewerUsernames.value = Object.fromEntries(rows.map((p) => [p.id, p.username]));
  } else {
    reviewerUsernames.value = {};
  }

  loadingList.value = false;
}

function locationLabel(review: Review) {
  const location = locationInfo.value[review.location_id];
  if (!location) return "—";
  return location.city ? `${location.name} · ${location.city}` : location.name;
}

function reviewerName(review: Review) {
  return reviewerUsernames.value[review.user_id] ?? "Silinmiş kullanıcı";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
}

function stars(rating: number) {
  return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
}

async function deleteReview(review: Review) {
  if (!confirm("Bu yorumu kalıcı olarak silmek istediğinize emin misiniz?")) return;

  deletingId.value = review.id;
  actionError.value = null;

  const { error } = await supabase.from("reviews").delete().eq("id", review.id);

  deletingId.value = null;

  if (error) {
    actionError.value = error.message;
    return;
  }

  reviews.value = reviews.value.filter((r) => r.id !== review.id);
  showToast("Yorum silindi.");
}

onMounted(fetchReviews);
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-brand-charcoal">Yorum Moderasyonu</h1>
    <p class="mb-6 text-sm text-neutral-500">Kullanıcı yorumları, en yeni önce.</p>

    <div v-if="toast" class="mb-4 rounded-control bg-green-50 px-4 py-2 text-sm text-green-700">
      {{ toast }}
    </div>

    <div v-if="listError" class="mb-4 rounded-control bg-red-50 px-4 py-2 text-sm text-red-600">
      {{ listError }}
    </div>

    <div v-if="actionError" class="mb-4 rounded-control bg-red-50 px-4 py-2 text-sm text-red-600" role="alert">
      {{ actionError }}
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <button
        v-for="tab in ratingTabs"
        :key="tab.value"
        type="button"
        class="rounded-pill px-4 py-1.5 text-xs font-medium transition"
        :class="
          ratingFilter === tab.value
            ? 'bg-brand-orange text-white'
            : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-100'
        "
        @click="ratingFilter = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loadingList" class="text-sm text-neutral-500">Yükleniyor...</div>

    <div
      v-else-if="filteredReviews.length === 0"
      class="rounded-card border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500"
    >
      {{ reviews.length === 0 ? "Hiç yorum yok." : "Bu puanda yorum yok." }}
    </div>

    <div v-else class="overflow-hidden rounded-card border border-neutral-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th class="px-4 py-3">Kullanıcı</th>
            <th class="px-4 py-3">Konum</th>
            <th class="px-4 py-3">Puan</th>
            <th class="px-4 py-3">Yorum</th>
            <th class="px-4 py-3">Tarih</th>
            <th class="px-4 py-3">Aksiyon</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="review in filteredReviews" :key="review.id" class="border-b border-neutral-100 last:border-0">
            <td class="px-4 py-3 align-top text-neutral-600">{{ reviewerName(review) }}</td>
            <td class="px-4 py-3 align-top text-neutral-600">{{ locationLabel(review) }}</td>
            <td class="px-4 py-3 align-top text-amber-500" :title="`${review.rating}/5`">
              {{ stars(review.rating) }}
            </td>
            <td class="max-w-xs px-4 py-3 align-top text-neutral-700">{{ review.comment ?? "—" }}</td>
            <td class="px-4 py-3 align-top text-neutral-600">{{ formatDate(review.created_at) }}</td>
            <td class="px-4 py-3 align-top">
              <button
                type="button"
                :disabled="deletingId === review.id"
                class="rounded-control border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                @click="deleteReview(review)"
              >
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
