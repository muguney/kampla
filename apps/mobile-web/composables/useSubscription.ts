/**
 * Placeholder — RevenueCat / Premium abonelik yönetimi Faz 9'da burada
 * kurulacak (PRD 5.P, 6.9). Şimdilik `stores/subscription.ts` store'una
 * ince bir composable sarmalayıcı.
 */
import { useSubscriptionStore } from "~/stores/subscription";

export function useSubscription() {
  return useSubscriptionStore();
}
