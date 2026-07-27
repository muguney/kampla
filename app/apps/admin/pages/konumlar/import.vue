<script setup lang="ts">
/**
 * Excel/CSV Toplu İçe Aktarma — PRD 5.R, 7.1 / TASKS.md Faz 8.
 * Akış: şablon indir → dosya yükle (client-side CSV parse) → satır bazlı
 * doğrulama (zorunlu alanlar + enum'lar + lat/lng aralığı) → önizleme
 * (geçerli/geçersiz satır ayrımı) → yalnızca geçerli satırların `locations`
 * tablosuna `source='import'`, `status='published'` ile toplu (satır satır)
 * insert edilmesi + `location_amenities` insert'i.
 *
 * Harici bir CSV/parsing paketi eklenmedi (görev kısıtı) — `parseCSV` basit
 * bir state machine ile tırnak içindeki virgülleri/newline'ları handle eder.
 */
import type { AccommodationType, Amenity, Database, Location, LocationType, Season } from "@kampla/shared";
import { ACCOMMODATION_TYPES, AMENITIES, LOCATION_TYPE_LABELS_TR, LOCATION_TYPES, SEASONS } from "@kampla/shared";

definePageMeta({ middleware: "admin" });

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

/** Beklenen kolon başlıkları (şablon indirme ve doğrulamada kullanılır). */
const TEMPLATE_HEADER = [
  "name",
  "location_type",
  "description",
  "lat",
  "lng",
  "phone",
  "website_url",
  "facebook_url",
  "instagram_url",
  "youtube_url",
  "x_url",
  "accommodation_types",
  "season",
  "city",
  "region",
  "amenities",
];

const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(message: string) {
  toast.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = null), 4000);
}

/** Satır bazlı doğrulama sonucu. */
interface ParsedRow {
  rowNumber: number; // Dosyadaki gerçek satır no (header = 1. satır)
  raw: Record<string, string>;
  errors: string[];
  valid: boolean;
  name: string;
  locationType: LocationType | null;
  city: string | null;
  amenities: Amenity[];
  insertPayload: Partial<Location> | null;
}

interface ImportSummary {
  successCount: number;
  failCount: number;
  failures: { rowNumber: number; name: string; error: string }[];
}

const fileName = ref<string | null>(null);
const parsing = ref(false);
const parseError = ref<string | null>(null);
const parsedRows = ref<ParsedRow[]>([]);
const importing = ref(false);
const importSummary = ref<ImportSummary | null>(null);

const validRows = computed(() => parsedRows.value.filter((r) => r.valid));
const invalidRows = computed(() => parsedRows.value.filter((r) => !r.valid));

/**
 * Basit CSV parser: virgülle ayırır, çift tırnak (`"..."`) içindeki virgül/newline'ları
 * korur, `""` kaçış dizisini tek `"` olarak çözer. Harici paket gerektirmez.
 */
function parseCSV(text: string): string[][] {
  const clean = text.replace(/^﻿/, ""); // Excel BOM
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];

    if (inQuotes) {
      if (char === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\r") {
      // \r\n durumunda \n adımında satır kapatılır, burada yok sayılır
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

function typeLabel(type: LocationType | null) {
  return type ? LOCATION_TYPE_LABELS_TR[type] : "—";
}

function downloadTemplate() {
  const example = [
    "Örnek Kamp Alanı",
    "free-caravan",
    "Örnek açıklama",
    "36.8969",
    "30.7133",
    "+905551112233",
    "https://example.com",
    "",
    "",
    "",
    "",
    "caravan;tent",
    "summer",
    "Antalya",
    "Kaş",
    "electricity;water-fill",
  ];

  const csv = `${TEMPLATE_HEADER.join(",")}\n${example.join(",")}\n`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kampla-konum-import-sablonu.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Tek bir satırı doğrular ve (geçerliyse) insert'e hazır payload üretir. */
function validateRow(raw: Record<string, string>, rowNumber: number): ParsedRow {
  const errors: string[] = [];

  const name = (raw.name ?? "").trim();
  if (!name) errors.push("name (ad) zorunludur");

  const locationTypeRaw = (raw.location_type ?? "").trim();
  let locationType: LocationType | null = null;
  if (!locationTypeRaw) {
    errors.push("location_type zorunludur");
  } else if (!(LOCATION_TYPES as readonly string[]).includes(locationTypeRaw)) {
    errors.push(`location_type geçersiz değer: "${locationTypeRaw}"`);
  } else {
    locationType = locationTypeRaw as LocationType;
  }

  const latRaw = (raw.lat ?? "").trim();
  let lat: number | null = null;
  if (!latRaw) {
    errors.push("lat zorunludur");
  } else {
    const parsedLat = Number(latRaw);
    if (Number.isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      errors.push(`lat geçersiz (sayısal ve -90..90 arası olmalı): "${latRaw}"`);
    } else {
      lat = parsedLat;
    }
  }

  const lngRaw = (raw.lng ?? "").trim();
  let lng: number | null = null;
  if (!lngRaw) {
    errors.push("lng zorunludur");
  } else {
    const parsedLng = Number(lngRaw);
    if (Number.isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      errors.push(`lng geçersiz (sayısal ve -180..180 arası olmalı): "${lngRaw}"`);
    } else {
      lng = parsedLng;
    }
  }

  const accommodationTypes: AccommodationType[] = [];
  const accommodationRaw = (raw.accommodation_types ?? "").trim();
  if (accommodationRaw) {
    for (const token of accommodationRaw.split(";")) {
      const value = token.trim();
      if (!value) continue;
      if (!(ACCOMMODATION_TYPES as readonly string[]).includes(value)) {
        errors.push(`accommodation_types geçersiz değer: "${value}"`);
      } else {
        accommodationTypes.push(value as AccommodationType);
      }
    }
  }

  let season: Season | null = null;
  const seasonRaw = (raw.season ?? "").trim();
  if (seasonRaw) {
    if (!(SEASONS as readonly string[]).includes(seasonRaw)) {
      errors.push(`season geçersiz değer: "${seasonRaw}"`);
    } else {
      season = seasonRaw as Season;
    }
  }

  const amenities: Amenity[] = [];
  const amenitiesRaw = (raw.amenities ?? "").trim();
  if (amenitiesRaw) {
    for (const token of amenitiesRaw.split(";")) {
      const value = token.trim();
      if (!value) continue;
      if (!(AMENITIES as readonly string[]).includes(value)) {
        errors.push(`amenities geçersiz değer: "${value}"`);
      } else {
        amenities.push(value as Amenity);
      }
    }
  }

  const city = (raw.city ?? "").trim() || null;
  const valid = errors.length === 0;

  let insertPayload: Partial<Location> | null = null;
  if (valid && locationType && lat !== null && lng !== null) {
    insertPayload = {
      name,
      location_type: locationType,
      description: (raw.description ?? "").trim() || null,
      lat,
      lng,
      phone: (raw.phone ?? "").trim() || null,
      website_url: (raw.website_url ?? "").trim() || null,
      facebook_url: (raw.facebook_url ?? "").trim() || null,
      instagram_url: (raw.instagram_url ?? "").trim() || null,
      youtube_url: (raw.youtube_url ?? "").trim() || null,
      x_url: (raw.x_url ?? "").trim() || null,
      accommodation_types: accommodationTypes,
      season,
      city,
      region: (raw.region ?? "").trim() || null,
      source: "import",
      status: "published",
    };
  }

  return { rowNumber, raw, errors, valid, name, locationType, city, amenities, insertPayload };
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  fileName.value = file.name;
  parseError.value = null;
  importSummary.value = null;
  parsedRows.value = [];
  parsing.value = true;

  try {
    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length < 2) {
      parseError.value = "Dosya boş veya yalnızca başlık satırı içeriyor.";
      return;
    }

    const header = rows[0].map((h) => h.trim());
    const requiredHeaders = ["name", "location_type", "lat", "lng"];
    const missingHeaders = requiredHeaders.filter((h) => !header.includes(h));

    if (missingHeaders.length > 0) {
      parseError.value = `Eksik zorunlu kolon(lar): ${missingHeaders.join(", ")}`;
      return;
    }

    const dataRows = rows.slice(1).filter((cells) => cells.some((cell) => cell.trim() !== ""));

    parsedRows.value = dataRows.map((cells, idx) => {
      const raw: Record<string, string> = {};
      header.forEach((columnName, i) => {
        raw[columnName] = (cells[i] ?? "").trim();
      });
      return validateRow(raw, idx + 2);
    });
  } catch {
    parseError.value = "Dosya okunamadı veya ayrıştırılamadı.";
  } finally {
    parsing.value = false;
    target.value = "";
  }
}

async function importRows() {
  if (!user.value) {
    importSummary.value = {
      successCount: 0,
      failCount: 0,
      failures: [{ rowNumber: 0, name: "-", error: "Oturum bulunamadı, lütfen tekrar giriş yapın." }],
    };
    return;
  }

  const rows = validRows.value;
  if (rows.length === 0) return;

  importing.value = true;
  importSummary.value = null;

  const failures: { rowNumber: number; name: string; error: string }[] = [];
  let successCount = 0;

  for (const row of rows) {
    if (!row.insertPayload) continue;

    const payload: Partial<Location> = {
      ...row.insertPayload,
      created_by: user.value.id,
    };

    const { data, error } = await supabase.from("locations").insert(payload).select("id").single();

    if (error || !data) {
      failures.push({ rowNumber: row.rowNumber, name: row.name, error: error?.message ?? "Bilinmeyen hata" });
      continue;
    }

    if (row.amenities.length > 0) {
      const amenityRows = row.amenities.map((amenity) => ({ location_id: data.id, amenity }));
      const { error: amenityError } = await supabase.from("location_amenities").insert(amenityRows);

      if (amenityError) {
        failures.push({
          rowNumber: row.rowNumber,
          name: row.name,
          error: `Konum eklendi ancak imkanlar kaydedilemedi: ${amenityError.message}`,
        });
        continue;
      }
    }

    successCount++;
  }

  importing.value = false;
  importSummary.value = { successCount, failCount: failures.length, failures };

  if (successCount > 0) {
    showToast(`${successCount} konum başarıyla içe aktarıldı.`);
  }
}
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-brand-charcoal">Excel/CSV Toplu İçe Aktarma</h1>
    <p class="mb-6 text-sm text-neutral-500">
      Şablonu indirin, doldurun ve yükleyin. Satırlar doğrulandıktan sonra yalnızca geçerli olanlar
      <code class="rounded bg-neutral-100 px-1 py-0.5 text-xs">source='import'</code> ile içe aktarılır.
    </p>

    <div v-if="toast" class="mb-4 rounded-control bg-green-50 px-4 py-2 text-sm text-green-700">
      {{ toast }}
    </div>

    <!-- Şablon indirme -->
    <div class="mb-4 rounded-card border border-neutral-200 bg-white p-5">
      <h2 class="mb-2 text-sm font-semibold text-brand-charcoal">1. Şablon indir</h2>
      <p class="mb-3 text-sm text-neutral-500">
        Kolon başlıkları: <code class="text-xs">{{ TEMPLATE_HEADER.join(", ") }}</code>. Çoklu değerler
        (<code class="text-xs">accommodation_types</code>, <code class="text-xs">amenities</code>) noktalı virgülle
        ayrılır, örn. <code class="text-xs">caravan;tent</code>.
      </p>
      <button
        type="button"
        class="rounded-control border border-brand-orange px-4 py-2 text-sm font-medium text-brand-orange hover:bg-brand-orange hover:text-white"
        @click="downloadTemplate"
      >
        Şablon İndir (.csv)
      </button>
    </div>

    <!-- Dosya yükleme -->
    <div class="mb-4 rounded-card border border-neutral-200 bg-white p-5">
      <h2 class="mb-2 text-sm font-semibold text-brand-charcoal">2. Dosya yükle</h2>
      <input
        type="file"
        accept=".csv"
        class="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-control file:border-0 file:bg-brand-orange file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-orange-dark"
        @change="handleFileChange"
      />
      <p v-if="fileName" class="mt-2 text-xs text-neutral-500">Seçilen dosya: {{ fileName }}</p>
      <p v-if="parsing" class="mt-2 text-sm text-neutral-500">Ayrıştırılıyor...</p>
      <p v-if="parseError" class="mt-2 text-sm text-red-600" role="alert">{{ parseError }}</p>
    </div>

    <!-- Önizleme -->
    <div v-if="parsedRows.length > 0" class="mb-4 rounded-card border border-neutral-200 bg-white p-5">
      <h2 class="mb-3 text-sm font-semibold text-brand-charcoal">3. Önizleme</h2>
      <p class="mb-4 text-sm text-neutral-600">
        <span class="font-medium text-green-700">{{ validRows.length }} geçerli satır</span>
        ·
        <span class="font-medium text-red-600">{{ invalidRows.length }} geçersiz satır</span>
      </p>

      <div v-if="validRows.length > 0" class="mb-5 overflow-hidden rounded-control border border-neutral-200">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th class="px-4 py-2">Satır</th>
              <th class="px-4 py-2">Ad</th>
              <th class="px-4 py-2">Tür</th>
              <th class="px-4 py-2">Şehir</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in validRows" :key="row.rowNumber" class="border-b border-neutral-100 last:border-0">
              <td class="px-4 py-2 text-neutral-400">{{ row.rowNumber }}</td>
              <td class="px-4 py-2 font-medium text-brand-charcoal">{{ row.name }}</td>
              <td class="px-4 py-2 text-neutral-600">{{ typeLabel(row.locationType) }}</td>
              <td class="px-4 py-2 text-neutral-600">{{ row.city ?? "—" }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="invalidRows.length > 0" class="rounded-control border border-red-200 bg-red-50 p-4">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">Geçersiz satırlar</p>
        <ul class="flex flex-col gap-1 text-sm text-red-700">
          <li v-for="row in invalidRows" :key="row.rowNumber">
            <span class="font-medium">Satır {{ row.rowNumber }}:</span> {{ row.errors.join("; ") }}
          </li>
        </ul>
      </div>

      <div class="mt-5 flex justify-end">
        <button
          type="button"
          :disabled="validRows.length === 0 || importing"
          class="rounded-control bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
          @click="importRows"
        >
          {{ importing ? "İçe aktarılıyor..." : `İçe Aktar (${validRows.length} satır)` }}
        </button>
      </div>
    </div>

    <!-- İçe aktarma sonucu -->
    <div v-if="importSummary" class="rounded-card border border-neutral-200 bg-white p-5">
      <h2 class="mb-2 text-sm font-semibold text-brand-charcoal">Sonuç</h2>
      <p class="mb-2 text-sm text-neutral-600">
        <span class="font-medium text-green-700">{{ importSummary.successCount }} satır başarıyla eklendi.</span>
        <span v-if="importSummary.failCount > 0" class="ml-2 font-medium text-red-600">
          {{ importSummary.failCount }} satır başarısız oldu.
        </span>
      </p>
      <ul v-if="importSummary.failures.length > 0" class="flex flex-col gap-1 text-sm text-red-700">
        <li v-for="failure in importSummary.failures" :key="`${failure.rowNumber}-${failure.name}`">
          <span class="font-medium">Satır {{ failure.rowNumber }} ({{ failure.name }}):</span> {{ failure.error }}
        </li>
      </ul>
    </div>
  </div>
</template>
