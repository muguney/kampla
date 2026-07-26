<script setup lang="ts">
/**
 * Konumlar — Tüm konumları listeleme + admin manuel konum ekleme/düzenleme (PRD 5.R, 7.2, Faz 8).
 * `pages/index.vue`'daki moderasyon kuyruğundan (yalnızca `status='pending'`) farklı olarak
 * burada source/status fark etmeksizin TÜM konumlar listelenir ve admin CRUD yapabilir.
 * Kullanıcı tarafındaki 6 adımlı sihirbazın (bkz. `apps/mobile-web/components/wizard/`) admin
 * karşılığı — PRD notu gereği adım adım değil TEK sayfalık/tek modal'lık form yeterli.
 * Çoklu seçim buton-grid deseni (konum türü / sezon / konaklama / hizmetler) bilerek
 * `WizardStep2Type.vue` / `WizardStep3Amenities.vue` ile aynı tutuldu — tek panelde iki
 * farklı UI dili olmasın diye.
 *
 * Kapsam dışı bırakılanlar (görev notunda belirtildiği gibi):
 * - Harita tabanlı konum seçici (MapLibre admin'de kurulu değil) — lat/lng düz sayısal input.
 * - Fotoğraf upload UI'ı (Supabase Storage) — virgülle ayrılmış URL listesi text input'u yeterli.
 */
import type {
  AccommodationType,
  Amenity,
  Database,
  Location,
  LocationSource,
  LocationStatus,
  LocationType,
  Season,
} from "@kampla/shared";
import {
  ACCOMMODATION_LABELS_TR,
  ACCOMMODATION_TYPES,
  AMENITIES,
  AMENITY_LABELS_TR,
  LOCATION_SOURCES,
  LOCATION_STATUSES,
  LOCATION_TYPE_LABELS_TR,
  LOCATION_TYPES,
  SEASON_LABELS_TR,
  SEASONS,
} from "@kampla/shared";

definePageMeta({ middleware: "admin" });

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

type LocationListRow = Pick<Location, "id" | "name" | "location_type" | "status" | "source" | "city" | "created_at">;

const locations = ref<LocationListRow[]>([]);
const loadingList = ref(false);
const listError = ref<string | null>(null);

const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(message: string) {
  toast.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = null), 4000);
}

const STATUS_LABELS_TR: Record<LocationStatus, string> = {
  pending: "Onay bekliyor",
  published: "Yayında",
  rejected: "Reddedildi",
};

const SOURCE_LABELS_TR: Record<LocationSource, string> = {
  user: "Kullanıcı",
  admin: "Admin (manuel)",
  import: "İçe aktarma",
};

function statusBadgeClass(status: LocationStatus) {
  switch (status) {
    case "published":
      return "bg-green-50 text-green-700";
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "rejected":
      return "bg-red-50 text-red-600";
    default:
      return "bg-neutral-100 text-neutral-600";
  }
}

function typeLabel(row: Pick<Location, "location_type">) {
  return row.location_type ? LOCATION_TYPE_LABELS_TR[row.location_type] : "—";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
}

async function fetchLocations() {
  loadingList.value = true;
  listError.value = null;

  const { data, error } = await supabase
    .from("locations")
    .select("id, name, location_type, status, source, city, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    listError.value = error.message;
    loadingList.value = false;
    return;
  }

  locations.value = (data ?? []) as LocationListRow[];
  loadingList.value = false;
}

// ---- Ekleme/Düzenleme formu ----

type FormState = {
  id: string | null;
  name: string;
  description: string;
  location_type: LocationType | "";
  lat: string;
  lng: string;
  phone: string;
  website_url: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  x_url: string;
  accommodation_types: AccommodationType[];
  season: Season | "";
  city: string;
  region: string;
  amenities: Amenity[];
  photo_urls: string;
  status: LocationStatus;
  source: LocationSource;
};

function emptyForm(): FormState {
  return {
    id: null,
    name: "",
    description: "",
    location_type: "",
    lat: "",
    lng: "",
    phone: "",
    website_url: "",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
    x_url: "",
    accommodation_types: [],
    season: "",
    city: "",
    region: "",
    amenities: [],
    photo_urls: "",
    status: "published",
    source: "admin",
  };
}

const formOpen = ref(false);
const formMode = ref<"create" | "edit">("create");
const form = ref<FormState>(emptyForm());
const formLoading = ref(false);
const formError = ref<string | null>(null);
const saving = ref(false);

function openCreate() {
  formMode.value = "create";
  form.value = emptyForm();
  formError.value = null;
  formOpen.value = true;
}

async function openEdit(row: LocationListRow) {
  formMode.value = "edit";
  formError.value = null;
  formOpen.value = true;
  formLoading.value = true;

  const [{ data: full, error: fullError }, { data: amenityRows }] = await Promise.all([
    supabase.from("locations").select("*").eq("id", row.id).single(),
    supabase.from("location_amenities").select("amenity").eq("location_id", row.id),
  ]);

  formLoading.value = false;

  if (fullError || !full) {
    formError.value = fullError?.message ?? "Konum yüklenemedi.";
    return;
  }

  const location = full as Location;

  form.value = {
    id: location.id,
    name: location.name,
    description: location.description ?? "",
    location_type: location.location_type ?? "",
    lat: String(location.lat),
    lng: String(location.lng),
    phone: location.phone ?? "",
    website_url: location.website_url ?? "",
    facebook_url: location.facebook_url ?? "",
    instagram_url: location.instagram_url ?? "",
    youtube_url: location.youtube_url ?? "",
    x_url: location.x_url ?? "",
    accommodation_types: [...location.accommodation_types],
    season: location.season ?? "",
    city: location.city ?? "",
    region: location.region ?? "",
    amenities: ((amenityRows ?? []) as { amenity: Amenity }[]).map((r) => r.amenity),
    photo_urls: location.photo_urls.join(", "),
    status: location.status,
    source: location.source,
  };
}

function closeForm() {
  formOpen.value = false;
}

function selectLocationType(type: LocationType) {
  form.value.location_type = type;
}

function selectSeason(season: Season) {
  form.value.season = form.value.season === season ? "" : season;
}

function toggleAccommodation(type: AccommodationType) {
  const idx = form.value.accommodation_types.indexOf(type);
  if (idx === -1) form.value.accommodation_types.push(type);
  else form.value.accommodation_types.splice(idx, 1);
}

function toggleAmenity(amenity: Amenity) {
  const idx = form.value.amenities.indexOf(amenity);
  if (idx === -1) form.value.amenities.push(amenity);
  else form.value.amenities.splice(idx, 1);
}

function validateForm(): string | null {
  if (!form.value.name.trim()) return "Konum adı zorunludur.";
  if (!form.value.location_type) return "Konum türü seçilmelidir.";
  if (form.value.lat.trim() === "" || form.value.lng.trim() === "") return "Enlem/Boylam zorunludur.";

  const latNum = Number(form.value.lat);
  const lngNum = Number(form.value.lng);

  if (Number.isNaN(latNum) || latNum < -90 || latNum > 90) return "Enlem -90 ile 90 arasında olmalıdır.";
  if (Number.isNaN(lngNum) || lngNum < -180 || lngNum > 180) return "Boylam -180 ile 180 arasında olmalıdır.";

  return null;
}

function parsePhotoUrls(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

async function syncAmenities(locationId: string, amenities: Amenity[]) {
  const { error: deleteError } = await supabase.from("location_amenities").delete().eq("location_id", locationId);
  if (deleteError) throw deleteError;

  if (amenities.length === 0) return;

  const { error: insertError } = await supabase
    .from("location_amenities")
    .insert(amenities.map((amenity) => ({ location_id: locationId, amenity })));
  if (insertError) throw insertError;
}

async function handleSubmit() {
  const validationMessage = validateForm();
  if (validationMessage) {
    formError.value = validationMessage;
    return;
  }

  saving.value = true;
  formError.value = null;

  const payload = {
    name: form.value.name.trim(),
    description: form.value.description.trim() || null,
    location_type: (form.value.location_type || null) as LocationType | null,
    lat: Number(form.value.lat),
    lng: Number(form.value.lng),
    phone: form.value.phone.trim() || null,
    website_url: form.value.website_url.trim() || null,
    facebook_url: form.value.facebook_url.trim() || null,
    instagram_url: form.value.instagram_url.trim() || null,
    youtube_url: form.value.youtube_url.trim() || null,
    x_url: form.value.x_url.trim() || null,
    accommodation_types: form.value.accommodation_types,
    season: (form.value.season || null) as Season | null,
    city: form.value.city.trim() || null,
    region: form.value.region.trim() || null,
    photo_urls: parsePhotoUrls(form.value.photo_urls),
  };

  try {
    if (formMode.value === "create") {
      if (!user.value) {
        formError.value = "Oturum bulunamadı.";
        saving.value = false;
        return;
      }

      const { data: inserted, error } = await supabase
        .from("locations")
        .insert({
          ...payload,
          created_by: user.value.id,
          source: "admin",
          status: "published",
        })
        .select("id")
        .single();

      if (error || !inserted) throw error ?? new Error("Konum eklenemedi.");

      await syncAmenities((inserted as { id: string }).id, form.value.amenities);

      showToast(`"${payload.name}" eklendi.`);
    } else {
      if (!form.value.id) throw new Error("Konum kimliği bulunamadı.");

      const { error } = await supabase
        .from("locations")
        .update({
          ...payload,
          status: form.value.status,
          source: form.value.source,
        })
        .eq("id", form.value.id);

      if (error) throw error;

      await syncAmenities(form.value.id, form.value.amenities);

      showToast(`"${payload.name}" güncellendi.`);
    }

    saving.value = false;
    formOpen.value = false;
    await fetchLocations();
  } catch (err) {
    saving.value = false;
    formError.value = err instanceof Error ? err.message : "Kaydetme sırasında bir hata oluştu.";
  }
}

onMounted(fetchLocations);
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="mb-1 text-xl font-bold text-brand-charcoal">Konumlar</h1>
        <p class="text-sm text-neutral-500">Tüm konumlar (kaynak/durum fark etmeksizin) — manuel ekleme ve düzenleme.</p>
      </div>
      <button
        type="button"
        class="rounded-control bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark"
        @click="openCreate"
      >
        + Yeni Konum Ekle
      </button>
    </div>

    <div v-if="toast" class="mb-4 rounded-control bg-green-50 px-4 py-2 text-sm text-green-700">
      {{ toast }}
    </div>

    <div v-if="listError" class="mb-4 rounded-control bg-red-50 px-4 py-2 text-sm text-red-600">
      {{ listError }}
    </div>

    <div v-if="loadingList" class="text-sm text-neutral-500">Yükleniyor...</div>

    <div
      v-else-if="locations.length === 0"
      class="rounded-card border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500"
    >
      Henüz konum yok.
    </div>

    <div v-else class="overflow-hidden rounded-card border border-neutral-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th class="px-4 py-3">Ad</th>
            <th class="px-4 py-3">Tür</th>
            <th class="px-4 py-3">Durum</th>
            <th class="px-4 py-3">Kaynak</th>
            <th class="px-4 py-3">Şehir</th>
            <th class="px-4 py-3">Eklenme Tarihi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="location in locations"
            :key="location.id"
            class="cursor-pointer border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
            @click="openEdit(location)"
          >
            <td class="px-4 py-3 font-medium text-brand-charcoal">{{ location.name }}</td>
            <td class="px-4 py-3 text-neutral-600">{{ typeLabel(location) }}</td>
            <td class="px-4 py-3">
              <span class="rounded-pill px-2.5 py-1 text-xs font-medium" :class="statusBadgeClass(location.status)">
                {{ STATUS_LABELS_TR[location.status] }}
              </span>
            </td>
            <td class="px-4 py-3 text-neutral-600">{{ SOURCE_LABELS_TR[location.source] }}</td>
            <td class="px-4 py-3 text-neutral-600">{{ location.city ?? "—" }}</td>
            <td class="px-4 py-3 text-neutral-600">{{ formatDate(location.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Ekleme/Düzenleme formu -->
    <div
      v-if="formOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="closeForm"
    >
      <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card bg-white p-6 shadow-lg">
        <div class="mb-4 flex items-start justify-between">
          <h2 class="text-lg font-bold text-brand-charcoal">
            {{ formMode === "create" ? "Yeni Konum Ekle" : "Konumu Düzenle" }}
          </h2>
          <button type="button" class="text-neutral-400 hover:text-neutral-600" @click="closeForm">✕</button>
        </div>

        <div v-if="formLoading" class="py-6 text-sm text-neutral-500">Yükleniyor...</div>

        <form v-else class="flex flex-col gap-5 text-sm" @submit.prevent="handleSubmit">
          <div>
            <label class="mb-1 block text-xs font-medium text-neutral-500">Ad *</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              placeholder="Konum adı"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-neutral-500">Konum Türü *</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="type in LOCATION_TYPES"
                :key="type"
                type="button"
                class="flex items-center gap-2 rounded-control border-2 px-3 py-2 text-left text-xs font-medium transition-colors"
                :class="
                  form.location_type === type
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-charcoal'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                "
                :aria-pressed="form.location_type === type"
                @click="selectLocationType(type)"
              >
                <span class="h-3 w-3 shrink-0 rounded-full" :class="`bg-poi-${type}`" />
                {{ LOCATION_TYPE_LABELS_TR[type] }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-neutral-500">Açıklama</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              placeholder="Opsiyonel açıklama..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">Enlem (lat) *</label>
              <input
                v-model="form.lat"
                type="number"
                step="any"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
                placeholder="36.8969"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">Boylam (lng) *</label>
              <input
                v-model="form.lng"
                type="number"
                step="any"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
                placeholder="30.7133"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">Şehir</label>
              <input
                v-model="form.city"
                type="text"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">Bölge</label>
              <input
                v-model="form.region"
                type="text"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">Telefon</label>
              <input
                v-model="form.phone"
                type="text"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">Web sitesi</label>
              <input
                v-model="form.website_url"
                type="text"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">Facebook</label>
              <input
                v-model="form.facebook_url"
                type="text"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">Instagram</label>
              <input
                v-model="form.instagram_url"
                type="text"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">YouTube</label>
              <input
                v-model="form.youtube_url"
                type="text"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">X (Twitter)</label>
              <input
                v-model="form.x_url"
                type="text"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-neutral-500">Konaklama İmkanları</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in ACCOMMODATION_TYPES"
                :key="type"
                type="button"
                class="rounded-control border-2 px-3 py-1.5 text-xs font-medium transition-colors"
                :class="
                  form.accommodation_types.includes(type)
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-charcoal'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                "
                :aria-pressed="form.accommodation_types.includes(type)"
                @click="toggleAccommodation(type)"
              >
                {{ ACCOMMODATION_LABELS_TR[type] }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-neutral-500">Sezon</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="season in SEASONS"
                :key="season"
                type="button"
                class="rounded-control border-2 px-3 py-1.5 text-xs font-medium transition-colors"
                :class="
                  form.season === season
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-charcoal'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                "
                :aria-pressed="form.season === season"
                @click="selectSeason(season)"
              >
                {{ SEASON_LABELS_TR[season] }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-neutral-500">Hizmetler / İmkanlar</label>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <button
                v-for="amenity in AMENITIES"
                :key="amenity"
                type="button"
                class="rounded-control border-2 px-2 py-1.5 text-left text-xs font-medium transition-colors"
                :class="
                  form.amenities.includes(amenity)
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-charcoal'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                "
                :aria-pressed="form.amenities.includes(amenity)"
                @click="toggleAmenity(amenity)"
              >
                {{ AMENITY_LABELS_TR[amenity] }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-neutral-500">Fotoğraf URL'leri (virgülle ayırın)</label>
            <input
              v-model="form.photo_urls"
              type="text"
              class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              placeholder="https://.../1.jpg, https://.../2.jpg"
            />
          </div>

          <div v-if="formMode === 'edit'" class="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">Durum</label>
              <select
                v-model="form.status"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              >
                <option v-for="status in LOCATION_STATUSES" :key="status" :value="status">
                  {{ STATUS_LABELS_TR[status] }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-neutral-500">Kaynak</label>
              <select
                v-model="form.source"
                class="w-full rounded-control border border-neutral-300 px-3 py-2 focus:border-brand-orange focus:outline-none"
              >
                <option v-for="source in LOCATION_SOURCES" :key="source" :value="source">
                  {{ SOURCE_LABELS_TR[source] }}
                </option>
              </select>
            </div>
          </div>

          <p v-if="formError" class="text-sm text-red-600" role="alert">{{ formError }}</p>

          <div class="mt-1 flex justify-end gap-2 border-t border-neutral-200 pt-4">
            <button
              type="button"
              class="rounded-control border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              @click="closeForm"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="rounded-control bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark disabled:opacity-60"
            >
              {{ saving ? "Kaydediliyor..." : "Kaydet" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
