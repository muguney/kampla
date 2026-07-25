<script setup lang="ts">
/**
 * POI özet kartı (bottom-sheet) — bir harita pin'ine tıklandığında açılır
 * (PRD 5.B, design/2-Ana Ekran.png). Fotoğraf/renk bloğu, ad, mesafe
 * (kullanıcı konumu varsa), puan ve "Detaylar"/"Yol Tarifi" aksiyonları.
 */
import {
  distanceKm,
  formatDistanceKm,
  LOCATION_TYPE_LABELS_EN,
  LOCATION_TYPE_LABELS_TR,
  ratingColor,
  type MockLocationCard,
} from "@kampla/shared";
import type { UserLocation } from "~/composables/useMap";

const props = defineProps<{
  location: MockLocationCard;
  userLocation?: UserLocation | null;
}>();

defineEmits<{ close: [] }>();

const { t, locale } = useI18n();

const typeLabel = computed(() => {
  const type = props.location.location_type;
  if (!type) return "";
  return locale.value === "en" ? LOCATION_TYPE_LABELS_EN[type] : LOCATION_TYPE_LABELS_TR[type];
});

// Mesafe hesaplaması `@kampla/shared` içinde tek kaynaktan gelir (bkz. packages/shared/src/geo.ts)
// — pages/liste.vue de aynı fonksiyonu kullanır.
const distanceLabel = computed(() => {
  if (!props.userLocation) return null;
  const km = distanceKm(props.userLocation, { lat: props.location.lat, lng: props.location.lng });
  return formatDistanceKm(km);
});

const hasRating = computed(() => props.location.rating_count > 0);
</script>

<template>
  <Teleport to="body">
    <Transition name="kampla-slide-up">
      <!--
        Figma node 64:4384: harita pin'ine tıklanınca açılan kart, ekranın alt
        kenarına yapışık bir bottom-sheet DEĞİL — alt navigasyonun ÜZERİNDE
        yüzen, dört köşesi yuvarlak bir kart (screenshot'ta kart altında hâlâ
        harita + alt nav görünüyor). Kapat (✕) butonu da kartın üst kenarını
        hafifçe taşacak şekilde konumlanıyor. Sürükleme tutamacı Figma'da yok.
      -->
      <div v-if="location" class="fixed inset-0 z-50" @click="$emit('close')">
        <div class="absolute inset-0 bg-black/30" />

        <div
          class="kl-card absolute inset-x-5 bottom-[calc(6rem+env(safe-area-inset-bottom))] p-4"
          role="dialog"
          aria-modal="true"
          :aria-label="location.name"
          @click.stop
        >
          <button
            type="button"
            class="absolute -top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-charcoal shadow-[0_0_10px_rgba(0,0,0,0.15)] dark:bg-neutral-800 dark:text-neutral-100"
            :aria-label="t('common.cancel')"
            @click="$emit('close')"
          >
            ✕
          </button>

          <div class="flex gap-3">
            <!--
              Fotoğraf (mock veride yoksa kategori renginde nötr blok).
              TODO(figma-assets, 2026-07-26): node 121:1099'daki favori/kalp
              butonu (fotoğrafın sol-üst köşesinde) bu oturumda eklenemedi —
              Figma MCP rate limit'e takıldı ve sandbox ağı figma.com asset
              CDN'ini engellediği için gerçek "ant-design:heart-filled"
              ikonunun baytları indirilemedi; kafadan ikon uydurmamak için
              atlandı.
            -->
            <div
              class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-control"
              :class="!location.photo_url ? `bg-poi-${location.location_type}` : ''"
            >
              <img
                v-if="location.photo_url"
                :src="location.photo_url"
                :alt="location.name"
                class="h-full w-full object-cover"
              />
            </div>

            <div class="min-w-0 flex-1">
              <h3 class="truncate text-base font-bold text-brand-charcoal dark:text-neutral-100">
                {{ location.name }}
              </h3>
              <p class="mt-0.5 text-xs font-semibold text-brand-orange">{{ typeLabel }}</p>

              <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-brand-charcoal/70 dark:text-neutral-400">
                <span v-if="hasRating" class="inline-flex items-center gap-1">
                  <IconsAppIcon name="star-solid" class="h-3 w-3" :style="{ color: ratingColor }" />
                  {{ location.rating_avg.toFixed(1) }}
                  <span>({{ location.rating_count }})</span>
                </span>
                <span v-else>{{ t("map.poiCard.noRating") }}</span>

                <span v-if="distanceLabel" class="inline-flex items-center gap-1">
                  <span>·</span>
                  <span>{{ distanceLabel }}</span>
                </span>
              </div>
            </div>
          </div>

          <p
            v-if="location.description"
            class="mt-3 line-clamp-2 text-sm text-brand-charcoal/80 dark:text-neutral-300"
          >
            {{ location.description }}
          </p>

          <!--
            Figma node 64:4384: buton renkleri PRD'deki ilk tahminin TERSİ —
            "Detaylar" koyu/antrasit (#444, kl-btn-secondary) SOLDA, "Yol
            Tarifi" turuncu (#fe8542, kl-btn-primary) SAĞDA. Sıra ve renk
            burada Figma screenshot'ına göre düzeltildi.
          -->
          <div class="mt-4 flex gap-3">
            <NuxtLink :to="`/konum/${location.id}`" class="kl-btn-secondary flex-1">
              {{ t("map.poiCard.detailsCta") }}
            </NuxtLink>

            <!-- TODO(Faz 3/F): Gerçek rota/navigasyon entegrasyonu (Valhalla/OSRM, PRD 7.1). Şimdilik yalnızca görsel. -->
            <button type="button" class="kl-btn-primary flex-1">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m3 11 18-8-8 18-2-8-8-2Z" stroke-linejoin="round" stroke-linecap="round" />
              </svg>
              {{ t("map.poiCard.directionsCta") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.kampla-slide-up-enter-active,
.kampla-slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.kampla-slide-up-enter-from,
.kampla-slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
