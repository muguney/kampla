import { defineStore } from "pinia";
import { FREE_TIER_LIMITS, type LocationType } from "@kampla/shared";

/** PRD 5.D — Harita/Liste filtreleri. Faz 2'de haritaya bağlanacak. */
export const useFiltersStore = defineStore("filters", {
  state: () => ({
    activeTypes: [] as LocationType[],
  }),
  getters: {
    isAtFreeLimit: (state) => state.activeTypes.length >= FREE_TIER_LIMITS.maxActiveFilters,
  },
  actions: {
    toggle(type: LocationType, isPremium: boolean) {
      const idx = this.activeTypes.indexOf(type);
      if (idx !== -1) {
        this.activeTypes.splice(idx, 1);
        return;
      }
      if (!isPremium && this.isAtFreeLimit) return;
      this.activeTypes.push(type);
    },
    clear() {
      this.activeTypes = [];
    },
  },
});
