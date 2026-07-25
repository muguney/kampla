/** Uygulama açılışında kayıtlı tema tercihini uygular (PRD 5.L). */
export default defineNuxtPlugin(() => {
  const { init } = useTheme();
  init();
});
