<script setup lang="ts">
/**
 * Kamp.la ikon seti — Figma "5- Liste Ekranı" (52:266), "6-Filtre" (132:1271) ve
 * "10-Arama Ekranı" (255:7148) node'larından `get_design_context` ile alınan
 * ekran görüntüleri referans alınarak hazırlanmıştır.
 *
 * NOT (dürüstlük notu — bkz. STATUS.md): Figma dosyasındaki gerçek ikon export'ları
 * (`download_assets`/`get_screenshot`) bu oturumda Figma MCP'nin Starter plan
 * çağrı kotasının dolması nedeniyle indirilemedi ("You've reached the Figma MCP
 * tool call limit on the Starter plan"). Bu bileşendeki path'ler, screenshot'larda
 * görülen gerçek glif biçimlerine (kalp, yıldız, P harfi, çadır, karavan, damla,
 * çamaşır makinesi, duş başlığı, harita/filtre/hedef/arama/geri/pin/₺ rozeti)
 * elle yakınsanmış SVG'lerdir — emoji veya "kafadan" ikon DEĞİL, ama Figma'nın
 * orijinal bayt-bayt export'u da DEĞİL. Kota sıfırlanınca (veya plan
 * yükseltilince) `download_assets` ile değiştirilmesi gerekir. Kaynak dosyalar
 * `assets/icons/*.svg` altında, bu bileşen aynı path verisini `currentColor` ile
 * boyanabilir şekilde satır içi kullanır.
 */
export type IconName =
  | "heart-line"
  | "heart-solid"
  | "star-solid"
  | "star-line"
  | "filter"
  | "locate"
  | "map"
  | "close"
  | "search"
  | "back"
  | "pin"
  | "fee-badge"
  | "poi-caravan"
  | "poi-parking"
  | "poi-tent"
  | "poi-water"
  | "poi-laundry"
  | "poi-shower";

const props = withDefaults(defineProps<{ name: IconName }>(), {});
void props;
</script>

<template>
  <svg v-if="name === 'heart-line'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20.25s-7.5-4.55-10.13-9.1C.4 8.36 1.6 4.9 4.85 3.85 7.2 3.1 9.7 4 12 6.6c2.3-2.6 4.8-3.5 7.15-2.75 3.25 1.05 4.45 4.51 2.98 7.3-2.63 4.55-10.13 9.1-10.13 9.1Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="name === 'heart-solid'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20.25s-7.5-4.55-10.13-9.1C.4 8.36 1.6 4.9 4.85 3.85 7.2 3.1 9.7 4 12 6.6c2.3-2.6 4.8-3.5 7.15-2.75 3.25 1.05 4.45 4.51 2.98 7.3-2.63 4.55-10.13 9.1-10.13 9.1Z" fill="currentColor"/>
  </svg>
  <svg v-else-if="name === 'star-solid'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5l2.9 6.02 6.6.86-4.85 4.6 1.27 6.56L12 17.4l-5.92 3.14 1.27-6.56-4.85-4.6 6.6-.86L12 2.5Z" fill="currentColor"/>
  </svg>
  <svg v-else-if="name === 'star-line'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5l2.9 6.02 6.6.86-4.85 4.6 1.27 6.56L12 17.4l-5.92 3.14 1.27-6.56-4.85-4.6 6.6-.86L12 2.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  </svg>
  <svg v-else-if="name === 'filter'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="8" cy="6" r="2.1" fill="currentColor"/>
    <circle cx="16" cy="12" r="2.1" fill="currentColor"/>
    <circle cx="10" cy="18" r="2.1" fill="currentColor"/>
  </svg>
  <svg v-else-if="name === 'locate'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 2v3.3M12 18.7V22M22 12h-3.3M5.3 12H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="name === 'map'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4 3.6 5.8a1 1 0 0 0-.6.9v12.4a1 1 0 0 0 1.34.94L9 18.2l6 2 5.4-1.8a1 1 0 0 0 .6-.9V5.1a1 1 0 0 0-1.34-.94L15 6l-6-2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M9 4v14.2M15 6v14" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  </svg>
  <svg v-else-if="name === 'close'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="name === 'search'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
    <path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="name === 'back'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <svg v-else-if="name === 'pin'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.5s7-6.44 7-12.32A7 7 0 0 0 5 9.18C5 15.06 12 21.5 12 21.5Z" fill="currentColor"/>
    <circle cx="12" cy="9" r="2.4" fill="white"/>
  </svg>
  <svg v-else-if="name === 'fee-badge'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="white" stroke="currentColor" stroke-width="1.4"/>
    <path d="M12 6.8v10.4M14.6 9.2c0-1-1-1.7-2.35-1.7-1.5 0-2.45.8-2.45 1.85 0 2.55 4.9 1.2 4.9 3.75 0 1.1-1.05 1.9-2.55 1.9-1.35 0-2.35-.7-2.5-1.7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="name === 'poi-caravan'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 8.5h13a1.5 1.5 0 0 1 1.5 1.5v5.5h-16V9a.5.5 0 0 1 .5-.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M17 11h2.6l2.4 2.6v2H17v-4.6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="6.5" cy="17.3" r="1.7" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="18" cy="17.3" r="1.7" stroke="currentColor" stroke-width="1.5"/>
    <path d="M5 11.5h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="name === 'poi-parking'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9.3" stroke="currentColor" stroke-width="1.6"/>
    <path d="M9.8 16.5V7.5h3.1a2.7 2.7 0 1 1 0 5.4H9.8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="name === 'poi-tent'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3.5 21 18.5H3L12 3.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M12 9.5 17 18.5H7L12 9.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M12 3.5v6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="name === 'poi-water'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.8s6.2 6.9 6.2 11.4a6.2 6.2 0 1 1-12.4 0C5.8 9.7 12 2.8 12 2.8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  </svg>
  <svg v-else-if="name === 'poi-laundry'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3.5" y="3" width="17" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="7" cy="6" r=".9" fill="currentColor"/>
    <circle cx="10" cy="6" r=".9" fill="currentColor"/>
    <circle cx="12" cy="14" r="4.6" stroke="currentColor" stroke-width="1.5"/>
    <path d="M9.3 14a2.7 2.7 0 0 0 5.4 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="name === 'poi-shower'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 9.5a4.5 4.5 0 0 1 8.6-1.8M6 9.5h13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.5 13v1.2M11 13v1.2M14.5 13v1.2M9.2 16v1.2M12.7 16v1.2M16.2 16v1.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
  </svg>
</template>
