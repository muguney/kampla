<script setup lang="ts">
/**
 * Hata Bildirimi Kuyruğu — PRD 5.M, 5.R, Faz 8.
 * Kullanıcıların gönderdiği "Hata Bildir" kayıtlarını listeler, durumu
 * (open -> reviewing -> resolved) değiştirir. Durum güncellemesi (basit bir
 * `update`) `0011_notification_triggers.sql`'deki
 * `notify_on_report_status_change` tetikleyicisini otomatik çalıştırır
 * (bildiren kullanıcıya bildirim) — ekstra kod gerekmiyor.
 */
import type { Database, Location, Profile, Report, ReportStatus } from "@kampla/shared";
import { REPORT_STATUS_LABELS_TR, REPORT_STATUSES } from "@kampla/shared";

definePageMeta({ middleware: "admin" });

const supabase = useSupabaseClient<Database>();

const reports = ref<Report[]>([]);
const locationInfo = ref<Record<string, Pick<Location, "id" | "name" | "city">>>({});
const reporterUsernames = ref<Record<string, string>>({});

const loadingList = ref(false);
const listError = ref<string | null>(null);

const statusFilter = ref<"all" | ReportStatus>("all");

const toast = ref<string | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(message: string) {
  toast.value = message;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = null), 4000);
}

const updatingId = ref<string | null>(null);
const actionError = ref<string | null>(null);

const filterTabs: { value: "all" | ReportStatus; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "open", label: REPORT_STATUS_LABELS_TR.open },
  { value: "reviewing", label: REPORT_STATUS_LABELS_TR.reviewing },
  { value: "resolved", label: REPORT_STATUS_LABELS_TR.resolved },
];

const filteredReports = computed(() => {
  if (statusFilter.value === "all") return reports.value;
  return reports.value.filter((r) => r.status === statusFilter.value);
});

async function fetchReports() {
  loadingList.value = true;
  listError.value = null;
  actionError.value = null;

  const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false });

  if (error) {
    listError.value = error.message;
    loadingList.value = false;
    return;
  }

  reports.value = (data ?? []) as Report[];

  const locationIds = [...new Set(reports.value.map((r) => r.location_id).filter((id): id is string => !!id))];
  const reporterIds = [
    ...new Set(reports.value.map((r) => r.reporter_id).filter((id): id is string => !!id)),
  ];

  if (locationIds.length > 0) {
    const { data: locations } = await supabase.from("locations").select("id, name, city").in("id", locationIds);
    const rows = (locations ?? []) as Pick<Location, "id" | "name" | "city">[];
    locationInfo.value = Object.fromEntries(rows.map((l) => [l.id, l]));
  } else {
    locationInfo.value = {};
  }

  if (reporterIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", reporterIds);
    const rows = (profiles ?? []) as Pick<Profile, "id" | "username">[];
    reporterUsernames.value = Object.fromEntries(rows.map((p) => [p.id, p.username]));
  } else {
    reporterUsernames.value = {};
  }

  loadingList.value = false;
}

function locationLabel(report: Report) {
  const location = locationInfo.value[report.location_id];
  if (!location) return "—";
  return location.city ? `${location.name} · ${location.city}` : location.name;
}

function reporterName(report: Report) {
  if (!report.reporter_id) return "Misafir/silinmiş kullanıcı";
  return reporterUsernames.value[report.reporter_id] ?? "Misafir/silinmiş kullanıcı";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
}

const statusBadgeClasses: Record<ReportStatus, string> = {
  open: "bg-red-50 text-red-600",
  reviewing: "bg-yellow-50 text-yellow-700",
  resolved: "bg-green-50 text-green-700",
};

async function setStatus(report: Report, status: ReportStatus) {
  if (report.status === status) return;

  updatingId.value = report.id;
  actionError.value = null;

  const { error } = await supabase.from("reports").update({ status }).eq("id", report.id);

  updatingId.value = null;

  if (error) {
    actionError.value = error.message;
    return;
  }

  const target = reports.value.find((r) => r.id === report.id);
  if (target) target.status = status;

  showToast(`Rapor durumu "${REPORT_STATUS_LABELS_TR[status]}" olarak güncellendi.`);
}

onMounted(fetchReports);
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold text-brand-charcoal">Hata Bildirimi Kuyruğu</h1>
    <p class="mb-6 text-sm text-neutral-500">Kullanıcıların gönderdiği hata bildirimleri, en yeni önce.</p>

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
        v-for="tab in filterTabs"
        :key="tab.value"
        type="button"
        class="rounded-pill px-4 py-1.5 text-xs font-medium transition"
        :class="
          statusFilter === tab.value
            ? 'bg-brand-orange text-white'
            : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-100'
        "
        @click="statusFilter = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loadingList" class="text-sm text-neutral-500">Yükleniyor...</div>

    <div
      v-else-if="filteredReports.length === 0"
      class="rounded-card border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500"
    >
      {{ reports.length === 0 ? "Hiç hata bildirimi yok." : "Bu durumda hata bildirimi yok." }}
    </div>

    <div v-else class="overflow-hidden rounded-card border border-neutral-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th class="px-4 py-3">Açıklama</th>
            <th class="px-4 py-3">Konum</th>
            <th class="px-4 py-3">Bildiren</th>
            <th class="px-4 py-3">Durum</th>
            <th class="px-4 py-3">Tarih</th>
            <th class="px-4 py-3">Aksiyon</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in filteredReports" :key="report.id" class="border-b border-neutral-100 last:border-0">
            <td class="max-w-xs px-4 py-3 align-top text-neutral-700">{{ report.description }}</td>
            <td class="px-4 py-3 align-top text-neutral-600">{{ locationLabel(report) }}</td>
            <td class="px-4 py-3 align-top text-neutral-600">{{ reporterName(report) }}</td>
            <td class="px-4 py-3 align-top">
              <span
                class="rounded-pill px-3 py-1 text-xs font-medium"
                :class="statusBadgeClasses[report.status]"
              >
                {{ REPORT_STATUS_LABELS_TR[report.status] }}
              </span>
            </td>
            <td class="px-4 py-3 align-top text-neutral-600">{{ formatDate(report.created_at) }}</td>
            <td class="px-4 py-3 align-top">
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="status in REPORT_STATUSES"
                  :key="status"
                  type="button"
                  :disabled="updatingId === report.id || report.status === status"
                  class="rounded-control border px-2.5 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
                  :class="
                    report.status === status
                      ? 'border-brand-orange bg-brand-orange text-white'
                      : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                  "
                  @click="setStatus(report, status)"
                >
                  {{ REPORT_STATUS_LABELS_TR[status] }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
