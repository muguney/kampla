import { defineStore } from "pinia";
import type { Subscription } from "@kampla/shared";

/** PRD 5.P — Ücretsiz/Premium abonelik durumu. Faz 9'da RevenueCat ile dolacak. */
export const useSubscriptionStore = defineStore("subscription", {
  state: () => ({
    subscription: null as Subscription | null,
  }),
  getters: {
    isActive: (state) => state.subscription?.status === "active",
  },
});
