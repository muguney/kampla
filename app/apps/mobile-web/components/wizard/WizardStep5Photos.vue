<script setup lang="ts">
/**
 * Konum Ekle — Adım 5: Fotoğraf Ekle (PRD 5.G madde 5).
 * Çoklu fotoğraf yükleme, gerçek Supabase Storage upload (`location-photos`
 * bucket'ı — bkz. supabase/migrations/0010_location_photos.sql). Yüklenen
 * dosyaların public URL'leri `wizard.photos`'a yazılır. Bu adım opsiyoneldir
 * (0 foto ile devam edilebilir, PRD'de zorunluluk yok) — "Devam Et" her zaman
 * aktif kalır, [step].vue içindeki `isStepValid` case 5 için `true` döner.
 *
 * Dosyalar `${auth.uid()}/${uuid}.${ext}` yoluna yüklenir (bkz. migration'daki
 * update/delete "own folder" policy'leri ile tutarlı).
 */
import type { Database } from "@kampla/shared";
import { useLocationWizardStore } from "~/stores/locationWizard";

const { t } = useI18n();
const wizard = useLocationWizardStore();
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadError = ref("");

function triggerFilePicker() {
  fileInput.value?.click();
}

async function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) return;

  uploading.value = true;
  uploadError.value = "";

  for (const file of Array.from(files)) {
    if (!file.type.startsWith("image/")) continue;

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const ownerId = user.value?.id ?? "anon";
    const path = `${ownerId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("location-photos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      uploadError.value = error.message;
      continue;
    }

    const { data } = supabase.storage.from("location-photos").getPublicUrl(path);
    wizard.photos.push(data.publicUrl);
  }

  uploading.value = false;
  // Aynı dosyayı tekrar seçebilmek için input'u sıfırla.
  input.value = "";
}

function removePhoto(index: number) {
  // Not: storage'daki dosya silinmiyor (MVP kapsamı dışında — orphan temizliği
  // ileride bir cron/admin aksiyonu ile yapılabilir), yalnızca formdan kaldırılır.
  wizard.photos.splice(index, 1);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-brand-charcoal/70 dark:text-neutral-300">
      {{ t("wizard.photosStep.hint") }}
    </p>

    <div
      class="flex flex-col gap-1.5 rounded-control border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-200"
    >
      <p class="font-bold">{{ t("wizard.photosStep.rulesTitle") }}</p>
      <ul class="list-disc pl-4">
        <li>{{ t("wizard.photosStep.rulesNoSelfie") }}</li>
        <li>{{ t("wizard.photosStep.rulesLandscape") }}</li>
        <li>{{ t("wizard.photosStep.rulesRemoval") }}</li>
      </ul>
    </div>

    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="onFilesSelected"
    />

    <button type="button" class="kl-btn-outline" :disabled="uploading" @click="triggerFilePicker">
      <span v-if="uploading">⏳</span>
      <span v-else>📷</span>
      {{ uploading ? t("wizard.photosStep.uploading") : t("wizard.photosStep.addButton") }}
    </button>

    <p v-if="uploadError" class="text-xs font-medium text-red-500 dark:text-red-400">
      {{ uploadError }}
    </p>

    <div v-if="wizard.photos.length > 0" class="grid grid-cols-3 gap-3">
      <div
        v-for="(url, index) in wizard.photos"
        :key="url"
        class="relative aspect-square overflow-hidden rounded-control bg-neutral-100 dark:bg-neutral-800"
      >
        <img :src="url" class="h-full w-full object-cover" :alt="`photo-${index}`" />
        <button
          type="button"
          class="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
          :aria-label="t('wizard.photosStep.removeAria')"
          @click="removePhoto(index)"
        >
          ✕
        </button>
      </div>
    </div>

    <p v-else class="text-center text-xs font-medium text-brand-charcoal/50 dark:text-neutral-500">
      {{ t("wizard.photosStep.emptyHint") }}
    </p>
  </div>
</template>
