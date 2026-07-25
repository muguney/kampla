import { defineStore } from "pinia";
import type { MapList } from "@kampla/shared";

/** PRD 5.H — Harita Listelerim (Favoriler, Ziyaret Edilenler, özel listeler). Faz 5'te dolacak. */
export const useListsStore = defineStore("lists", {
  state: () => ({
    lists: [] as MapList[],
    isLoading: false,
  }),
});
