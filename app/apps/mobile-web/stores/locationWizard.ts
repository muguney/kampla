import { defineStore } from "pinia";
import type { AccommodationType, Amenity, LocationType, Season } from "@kampla/shared";

/** PRD 5.G — Konum Ekle 6 adımlı sihirbaz state'i. Faz 4'te uçtan uca bağlanacak. */
export const useLocationWizardStore = defineStore("locationWizard", {
  state: () => ({
    step: 1,
    lat: null as number | null,
    lng: null as number | null,
    locationType: null as LocationType | null,
    amenities: [] as Amenity[],
    name: "",
    description: "",
    phone: "",
    websiteUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    xUrl: "",
    accommodationTypes: [] as AccommodationType[],
    season: null as Season | null,
    photos: [] as string[],
    agreedToTerms: false,
  }),
  actions: {
    reset() {
      this.$reset();
    },
  },
});
