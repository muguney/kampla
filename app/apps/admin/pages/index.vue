<script setup lang="ts">
/**
 * Konum Moderasyon Kuyruğu — PRD 5.M, 5.R, Faz 8.
 * `status='pending'` konumları listeler (en eski önce), detay panelinde
 * onay/red işlemi yapar. Onay/red `locations.status` günceller; bu update
 * `0011_notification_triggers.sql`'deki `notify_on_location_status_change`
 * tetikleyicisini otomatik çalıştırır (kullanıcıya bildirim) — ekstra kod
 * gerekmiyor.
 */
import type { Database, Location, Profile } from "@kampla/shared";
import { ACCOMMODATION_BADGE_LABELS_TR, AMENITY_LABELS_TR, LOCATION_TYPE_LABELS_TR, SEASON_LABELS_TR } from "@kampla/shared";

definePageMeta({ middleware: "admin" });

const supabase = useSupabaseClient<Database>();

const pending = ref<Location[]>([]);
const authorUsernames = ref<Record<string, string>>({});
const loadingList = ref(false);
const listError = ref<string | null>(null);

const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(message: string) {
  toast.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = null), 4000);
}

const selected = ref<Location | null>(null);
const selectedAmenities = ref<string[]>([]);
const detailLoading = ref(false);
const rejectionReason = ref("");
const actionError = ref<string | null>(null);
const actionLoading = ref(false);

async function fetchPending() {
  loadingList.value = true;
  listError.value = null;

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    listError.value = error.message;
    loadingList.value = false;
    return;
  }

  pending.value = (data ?? []) as Location[];

  const ids = [...new Set(pending.value.map((l) => l.created_by).filter((id): id is string => !!id))];

  if (ids.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", ids);
    const rows = (profiles ?? []) as Pick<Profile, "id" | "username">[];
    authorUsernames.value = Object.fromEntries(rows.map((p) => [p.id, p.username]));
  } else {
    authorUsernames.value = {};
  }

  loadingList.value = false;
}

function authorName(location: Location) {
  if (!location.created_by) return "—";
  return authorUsernames.value[location.created_by] ?? location.created_by;
}

function typeLabel(location: Location) {
  return location.location_type ? LOCATION_TYPE_LABELS_TR[location.location_type] : "Referans katmanı";
}

function amenityLabel(amenity: string) {
  return (AMENITY_LABELS_TR as Record<string, string>)[amenity] ?? amenity;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
}

async function openDetail(location: Location) {
  selected.value = location;
  selectedAmenities.value = [];
  rejectionReason.value = "";
  actionError.value = null;
  detailLoading.value = true;

  const { data } = await supabase.from("location_amenities").select("amenity").eq("location_id", location.id);

  selectedAmenities.value = ((data ?? []) as { amenity: string }[]).map((row) => row.amenity);
  detailLoading.value = false;
}

function closeDetail() {
  selected.value = null;
}

async function approve() {
  if (!selected.value) return;
  actionLoading.value = true;
  actionError.value = null;

  const target = selected.value;
  const { error } = await supabase.from("locations").update({ status: "published" }).eq("id", target.id);

  actionLoading.value = false;

  if (error) {
    actionError.value = error.message;
    return;
  }

  pending.value = pending.value.filter((l) => l.id !== target.id);
  showToast(`"${target.name}" onaylandı.`);
  selected.value = null;
}

async function reject() {
  if (!selected.value) return;

  if (!rejectionReason.value.trim()) {
    actionError.value = "Reddetme gerekçesi zorunludur.";
    return;
  }

  actionLoading.value = true;
  actionError.value = null;

  const target = selected.value;
  const { error } = await supabase
    .from("locations")
    .update({ status: "rejected", rejection_reason: rejectionReason.value.trim() })
    .eq("id", target.id);

  actionLoading.value = false;

  if (error) {
    actionError.value = error.message;
    return;
  }

  pending.value = pending.value.filter((l) => l.id !== target.id);
  showToast(`"${target.name}" reddedildi.`);
  selected.value = null;
}

onMounted(fetchPending);
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-brand-charcoal">Konum Moderasyon Kuyruğu</h1>
    <p class="mb-6 text-sm text-neutral-500">Onay bekleyen kullanıcı/import kaynaklı konumlar, en eski önce.</p>

    <div v-if="toast" class="mb-4 rounded-control bg-green-50 px-4 py-2 text-sm text-green-700">
      {{ toast }}
    </div>

    <div v-if="listError" class="mb-4 rounded-control bg-red-50 px-4 py-2 text-sm text-red-600">
      {{ listError }}
    </div>

    <div v-if="loadingList" class="text-sm text-neutral-500">Yükleniyor...</div>

    <div
      v-else-if="pending.length === 0"
      class="rounded-card border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500"
    >
      Bekleyen konum yok.
    </div>

    <div v-else class="overflow-hidden rounded-card border border-neutral-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th class="px-4 py-3">Ad</th>
            <th class="px-4 py-3">Tür</th>
            <th class="px-4 py-3">Şehir</th>
            <th class="px-4 py-3">Ekleyen</th>
            <th class="px-4 py-3">Eklenme Tarihi</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="location in pending" :key="location.id" class="border-b border-neutral-100 last:border-0">
            <td class="px-4 py-3 font-medium text-brand-charcoal">{{ location.name }}</td>
            <td class="px-4 py-3 text-neutral-600">{{ typeLabel(location) }}</td>
            <td class="px-4 py-3 text-neutral-600">{{ location.city ?? "—" }}</td>
            <td class="px-4 py-3 text-neutral-600">{{ authorName(location) }}</td>
            <td class="px-4 py-3 text-neutral-600">{{ formatDate(location.created_at) }}</td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                class="rounded-control border border-brand-orange px-3 py-1.5 text-xs font-medium text-brand-orange hover:bg-brand-orange hover:text-white"
                @click="openDetail(location)"
              >
                İncele
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detay paneli / modal -->
    <div
      v-if="selected"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="closeDetail"
    >
      <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card bg-white p-6 shadow-lg">
        <div class="mb-4 flex items-start justify-between">
          <div>
            <h2 class="text-lg font-bold text-brand-charcoal">{{ selected.name }}</h2>
            <p class="text-sm text-neutral-500">
              {{ typeLabel(selected) }} · {{ selected.city ?? "—" }}<span v-if="selected.region">, {{ selected.region }}</span>
            </p>
          </div>
          <button type="button" class="text-neutral-400 hover:text-neutral-600" @click="closeDetail">✕</button>
        </div>

        <div v-if="detailLoading" class="py-6 text-sm text-neutral-500">Detaylar yükleniyor...</div>

        <div v-else class="flex flex-col gap-4 text-sm">
          <p v-if="selected.description" class="text-neutral-700">{{ selected.description }}</p>

          <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-neutral-600">
            <div v-if="selected.phone"><span class="font-medium">Telefon:</span> {{ selected.phone }}</div>
            <div v-if="selected.website_url">
              <span class="font-medium">Web:</span>
              <a :href="selected.website_url" target="_blank" rel="noopener" class="text-brand-orange underline">link</a>
            </div>
            <div v-if="selected.facebook_url">
              <span class="font-medium">Facebook:</span>
              <a :href="selected.facebook_url" target="_blank" rel="noopener" class="text-brand-orange underline">link</a>
            </div>
            <div v-if="selected.instagram_url">
              <span class="font-medium">Instagram:</span>
              <a :href="selected.instagram_url" target="_blank" rel="noopener" class="text-brand-orange underline">link</a>
            </div>
            <div v-if="selected.youtube_url">
              <span class="font-medium">YouTube:</span>
              <a :href="selected.youtube_url" target="_blank" rel="noopener" class="text-brand-orange underline">link</a>
            </div>
            <div v-if="selected.x_url">
              <span class="font-medium">X:</span>
              <a :href="selected.x_url" target="_blank" rel="noopener" class="text-brand-orange underline">link</a>
            </div>
            <div><span class="font-medium">Koordinat:</span> {{ selected.lat }}, {{ selected.lng }}</div>
            <div v-if="selected.season"><span class="font-medium">Sezon:</span> {{ SEASON_LABELS_TR[selected.season] }}</div>
          </div>

          <div v-if="selected.accommodation_types.length" class="flex flex-wrap gap-2">
            <span
              v-for="type in selected.accommodation_types"
              :key="type"
              class="rounded-pill bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
            >
              {{ ACCOMMODATION_BADGE_LABELS_TR[type] }}
            </span>
          </div>

          <div v-if="selectedAmenities.length" class="flex flex-wrap gap-2">
            <span
              v-for="amenity in selectedAmenities"
              :key="amenity"
              class="rounded-pill bg-brand-cream px-3 py-1 text-xs text-brand-charcoal"
            >
              {{ amenityLabel(amenity) }}
            </span>
          </div>

          <div v-if="selected.photo_urls.length" class="grid grid-cols-4 gap-2">
            <img
              v-for="url in selected.photo_urls"
              :key="url"
              :src="url"
              alt=""
              class="h-20 w-full rounded-control object-cover"
            />
          </div>

          <div class="mt-2 border-t border-neutral-200 pt-4">
            <label class="mb-1 block text-xs font-medium text-neutral-500">
              Reddetme gerekçesi (reddetmek için zorunlu)
            </label>
            <textarea
              v-model="rejectionReason"
              rows="2"
              class="w-full rounded-control border border-neutral-300 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
              placeholder="Gerekçe yazın..."
            ></textarea>

            <p v-if="actionError" class="mt-2 text-sm text-red-600" role="alert">{{ actionError }}</p>

            <div class="mt-3 flex justify-end gap-2">
              <button
                type="button"
                :disabled="actionLoading"
                class="rounded-control border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                @click="reject"
              >
                Reddet
              </button>
              <button
                type="button"
                :disabled="actionLoading"
                class="rounded-control bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark disabled:opacity-60"
                @click="approve"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
