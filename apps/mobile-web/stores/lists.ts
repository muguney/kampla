import { defineStore } from "pinia";
import type { Database, ListType, MapList } from "@kampla/shared";
import { FREE_TIER_LIMITS } from "@kampla/shared";

type ActionError =
  | "auth-required"
  | "name-required"
  | "limit-reached"
  | "system-list"
  | "not-found"
  | "unknown";

type ActionResult = { success: true } | { success: false; error: ActionError };

/** İki sabit sistem listesinin varsayılan adları — kullanıcı ilk kez `fetchLists()`
 * çağırdığında DB'de yoksa buradaki adlarla lazy-create edilir. UI tarafında bu
 * ham `name` değeri değil, `type`'a göre i18n çevirisi gösterilir (bkz.
 * pages/listelerim/index.vue, [id].vue `pages.myLists.systemListNames.*`) — bu
 * yüzden burada hangi dilde olduğu önemli değil, sadece DB'nin `not null` kısıtını
 * karşılıyor. */
const SYSTEM_LIST_DEFAULT_NAMES: Record<Extract<ListType, "favorites" | "visited">, string> = {
  favorites: "Favorilerim",
  visited: "Ziyaret Edilen Yerler",
};

/** PRD 5.H — Harita Listelerim (Favoriler, Ziyaret Edilenler, özel listeler). */
export const useListsStore = defineStore("lists", {
  state: () => ({
    lists: [] as MapList[],
    isLoading: false,
    error: null as string | null,
  }),
  getters: {
    systemLists: (state) => state.lists.filter((l) => l.type === "favorites" || l.type === "visited"),
    customLists: (state) => state.lists.filter((l) => l.type === "custom"),
    /** PRD 5.H — ücretsiz kullanıcı sınırı yalnızca `type='custom'` listeleri sayar. */
    customListCount: (state) => state.lists.filter((l) => l.type === "custom").length,
  },
  actions: {
    /**
     * Giriş yapmış kullanıcının tüm listelerini çeker. Misafirse (`profile` yok)
     * state'i boşaltıp sessizce çıkar. Sistem listelerinden (favorites/visited)
     * DB'de eksik olanlar bu fonksiyon içinde lazy-create edilir — ayrı bir
     * "hesap oluşturunca otomatik oluştur" mekanizması yok, ilk `/listelerim`
     * ziyaretinde tamamlanır.
     */
    async fetchLists() {
      const authStore = useAuthStore();
      const profileId = authStore.profile?.id;

      if (!profileId) {
        this.lists = [];
        return;
      }

      this.isLoading = true;
      this.error = null;

      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .eq("owner_id", profileId)
        .order("created_at", { ascending: true });

      if (error) {
        this.isLoading = false;
        this.error = error.message;
        return;
      }

      let allLists = (data ?? []) as MapList[];

      const missingSystemTypes = (["favorites", "visited"] as const).filter(
        (type) => !allLists.some((l) => l.type === type)
      );

      if (missingSystemTypes.length > 0) {
        const { data: created, error: createError } = await supabase
          .from("lists")
          .insert(
            missingSystemTypes.map((type) => ({
              owner_id: profileId,
              name: SYSTEM_LIST_DEFAULT_NAMES[type],
              type,
              is_public: false,
            }))
          )
          .select("*");

        if (createError) {
          // Sessizce yoksay: mevcut sistem listeleri (varsa) yine de gösterilir,
          // eksik olan bir sonraki ziyarette tekrar oluşturulmaya çalışılır.
          this.error = createError.message;
        } else if (created) {
          allLists = [...allLists, ...(created as MapList[])];
        }
      }

      this.lists = allLists;
      this.isLoading = false;
    },

    /** PRD 5.H — özel liste oluşturma. Ücretsiz kullanıcı en fazla
     * `FREE_TIER_LIMITS.maxCustomLists` özel liste açabilir (sistem listeleri
     * bu sınıra dahil değil); Premium kullanıcı sınırsız (bkz. stores/filters.ts
     * aynı desen). */
    async createCustomList(name: string): Promise<ActionResult> {
      const authStore = useAuthStore();
      const profileId = authStore.profile?.id;
      if (!profileId) {
        return { success: false, error: "auth-required" };
      }

      const trimmedName = name.trim();
      if (!trimmedName) {
        return { success: false, error: "name-required" };
      }

      if (!authStore.isPremium && this.customListCount >= FREE_TIER_LIMITS.maxCustomLists) {
        return { success: false, error: "limit-reached" };
      }

      this.isLoading = true;
      this.error = null;

      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase
        .from("lists")
        .insert({ owner_id: profileId, name: trimmedName, type: "custom", is_public: false })
        .select("*")
        .single();

      this.isLoading = false;

      if (error || !data) {
        this.error = error?.message ?? "unknown";
        return { success: false, error: "unknown" };
      }

      this.lists.push(data as MapList);
      return { success: true };
    },

    /** Liste adını değiştirir. UI yalnızca özel listeler için "Adını Değiştir"
     * butonu gösterir; store seviyesinde ek bir tip kısıtı yok (sistem listesi
     * adının teknik olarak değişebilmesi zarar vermez, sadece UI'da erişilmiyor). */
    async renameList(id: string, newName: string): Promise<ActionResult> {
      const trimmedName = newName.trim();
      if (!trimmedName) {
        return { success: false, error: "name-required" };
      }

      this.isLoading = true;
      this.error = null;

      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase
        .from("lists")
        .update({ name: trimmedName })
        .eq("id", id)
        .select("*")
        .single();

      this.isLoading = false;

      if (error || !data) {
        this.error = error?.message ?? "unknown";
        return { success: false, error: "unknown" };
      }

      const idx = this.lists.findIndex((l) => l.id === id);
      if (idx !== -1) this.lists[idx] = data as MapList;
      return { success: true };
    },

    /** Yalnızca özel (`type='custom'`) listeler silinebilir — sistem listeleri
     * (favorites/visited) UI'da zaten "Sil" butonu göstermez, burada da güvenlik
     * payı olarak reddediliyor. */
    async deleteList(id: string): Promise<ActionResult> {
      const target = this.lists.find((l) => l.id === id);
      if (!target || target.type !== "custom") {
        return { success: false, error: "system-list" };
      }

      this.isLoading = true;
      this.error = null;

      const supabase = useSupabaseClient<Database>();
      const { error } = await supabase.from("lists").delete().eq("id", id);

      this.isLoading = false;

      if (error) {
        this.error = error.message;
        return { success: false, error: "unknown" };
      }

      this.lists = this.lists.filter((l) => l.id !== id);
      return { success: true };
    },

    /** PRD 5.H — "Profilde Görünür Yap" (`is_public` toggle). Bu, gizlilik onayı
     * gerektiren bir aksiyon olarak tanımlanmış; onay adımı burada değil, çağıran
     * sayfada basit bir inline "emin misin?" UI'ı ile yapılır (bkz.
     * pages/listelerim/[id].vue) — store yalnızca gerçek toggle'ı uygular. */
    async toggleVisibility(id: string): Promise<ActionResult> {
      const target = this.lists.find((l) => l.id === id);
      if (!target) {
        return { success: false, error: "not-found" };
      }

      this.isLoading = true;
      this.error = null;

      const supabase = useSupabaseClient<Database>();
      const { data, error } = await supabase
        .from("lists")
        .update({ is_public: !target.is_public })
        .eq("id", id)
        .select("*")
        .single();

      this.isLoading = false;

      if (error || !data) {
        this.error = error?.message ?? "unknown";
        return { success: false, error: "unknown" };
      }

      const idx = this.lists.findIndex((l) => l.id === id);
      if (idx !== -1) this.lists[idx] = data as MapList;
      return { success: true };
    },
  },
});
