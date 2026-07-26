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

            <!-- TODO(Faz 3/F): Gerçek rota/navigasyon entegrasyonu (Valhalla/OSRM, PRD 7.1). Şimdilik yalnızca görsel.
                 İkon design/icons-export/direction.svg (döşenmiş yol tabelası) — design/4-Ana Ekran - Konuma
                 tıklanınca.png'deki "YOL TARİFİ" butonuyla görsel doğrulandı. -->
            <button type="button" class="kl-btn-primary flex-1">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5871 10.2409C12.1204 10.2409 11.6729 10.4263 11.3429 10.7563C11.0129 11.0863 10.8275 11.5339 10.8275 12.0006V14.9333C10.8275 15.0889 10.7657 15.2381 10.6557 15.3481C10.5457 15.4581 10.3965 15.5199 10.2409 15.5199C10.0854 15.5199 9.93618 15.4581 9.82618 15.3481C9.71618 15.2381 9.65438 15.0889 9.65438 14.9333V12.0006C9.65438 11.2228 9.96337 10.4768 10.5134 9.92682C11.0634 9.37682 11.8093 9.06783 12.5871 9.06783H13.5174L12.7584 8.30883C12.6516 8.19821 12.5924 8.05004 12.5938 7.89625C12.5951 7.74246 12.6568 7.59535 12.7656 7.4866C12.8743 7.37784 13.0214 7.31616 13.1752 7.31482C13.329 7.31348 13.4772 7.37261 13.5878 7.47945L15.3474 9.2391C15.4574 9.3491 15.5192 9.49826 15.5192 9.65379C15.5192 9.80933 15.4574 9.95849 15.3474 10.0685L13.5878 11.8281C13.5337 11.8842 13.469 11.9288 13.3974 11.9596C13.3258 11.9903 13.2489 12.0065 13.171 12.0072C13.0931 12.0079 13.0159 11.993 12.9438 11.9635C12.8717 11.934 12.8062 11.8905 12.7511 11.8354C12.6961 11.7803 12.6525 11.7148 12.623 11.6428C12.5935 11.5707 12.5787 11.4934 12.5794 11.4156C12.58 11.3377 12.5962 11.2607 12.627 11.1891C12.6577 11.1176 12.7024 11.0529 12.7584 10.9988L13.5174 10.2409H12.5871ZM9.92654 3.85926C10.1989 3.58684 10.5222 3.37075 10.8781 3.22332C11.234 3.07588 11.6154 3 12.0006 3C12.3858 3 12.7672 3.07588 13.1231 3.22332C13.479 3.37075 13.8023 3.58684 14.0746 3.85926L20.1407 9.92654C20.4132 10.1989 20.6292 10.5222 20.7767 10.8781C20.9241 11.234 21 11.6154 21 12.0006C21 12.3858 20.9241 12.7672 20.7767 13.1231C20.6292 13.479 20.4132 13.8023 20.1407 14.0746L14.0746 20.1407C13.8023 20.4132 13.479 20.6292 13.1231 20.7767C12.7672 20.9241 12.3858 21 12.0006 21C11.6154 21 11.234 20.9241 10.8781 20.7767C10.5222 20.6292 10.1989 20.4132 9.92654 20.1407L3.85926 14.0746C3.58684 13.8023 3.37075 13.479 3.22332 13.1231C3.07588 12.7672 3 12.3858 3 12.0006C3 11.6154 3.07588 11.234 3.22332 10.8781C3.37075 10.5222 3.58684 10.1989 3.85926 9.92654L9.92654 3.85926ZM13.2441 4.68864C12.9141 4.35876 12.4666 4.17344 12 4.17344C11.5334 4.17344 11.0859 4.35876 10.7559 4.68864L4.68864 10.7571C4.35876 11.0871 4.17344 11.5346 4.17344 12.0012C4.17344 12.4678 4.35876 12.9153 4.68864 13.2452L10.7559 19.3125C11.0859 19.6424 11.5334 19.8277 12 19.8277C12.4666 19.8277 12.9141 19.6424 13.2441 19.3125L19.3114 13.2452C19.6412 12.9153 19.8266 12.4678 19.8266 12.0012C19.8266 11.5346 19.6412 11.0871 19.3114 10.7571L13.2441 4.68864Z" fill="currentColor" />
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
