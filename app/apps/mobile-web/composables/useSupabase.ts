/**
 * Kamp.la — Supabase erişim composable'ı.
 * `@nuxtjs/supabase` modülü `useSupabaseClient()` / `useSupabaseUser()` autoimport'larını
 * zaten sağlıyor; bu composable PRD 7.2'deki `useSupabase` adlandırmasıyla tutarlılık için
 * ince bir sarmalayıcı sunar. Faz 1'de auth akışları burada genişletilecek.
 */
import type { Database } from "@kampla/shared";

export function useSupabase() {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();

  return { client, user };
}
