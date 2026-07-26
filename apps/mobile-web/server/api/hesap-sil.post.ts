import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";
import type { Database } from "@kampla/shared";

/**
 * POST /api/hesap-sil — PRD 5.J "Hesabımı kalıcı olarak sil" (Faz 6).
 *
 * Akış:
 * 1. `serverSupabaseUser(event)` — `@nuxtjs/supabase`'in server-side helper'ı.
 *    İsteğin `Cookie` header'ındaki (aynı origin'den gelen `$fetch` çağrıları
 *    tarayıcı tarafından otomatik taşır) Supabase oturum çerezinden kullanıcıyı
 *    doğrular. JWT geçersiz/süresi dolmuşsa `error` fırlatır, oturum yoksa `null`
 *    döner — her iki durumda da 401 döndürüyoruz.
 * 2. `serverSupabaseServiceRole<Database>(event)` — service-role anahtarıyla
 *    (bkz. nuxt.config.ts `supabase.serviceKey`, env: `SUPABASE_SERVICE_ROLE_KEY`)
 *    oluşturulmuş bir admin client. Bu anahtar yalnızca burada, sunucu tarafında
 *    kullanılır; istemciye hiçbir şekilde expose edilmez.
 * 3. `auth.admin.deleteUser(user.id)` — `auth.users` satırını siler.
 *    `public.profiles.id` → `auth.users.id` FK'i `on delete cascade` olduğu için
 *    (bkz. supabase/migrations/0002_profiles.sql) `profiles` satırı da otomatik
 *    silinir; ayrıca `reviews`/`lists`/... tablolarındaki kullanıcıya bağlı
 *    satırların cascade davranışı ilgili migration'lardaki FK tanımına bağlıdır
 *    (bu görevin kapsamı dışında, burada elle bir şey silinmiyor).
 *
 * ÖNEMLİ: Bu route service-role anahtarı gerektirdiği için sandbox/test
 * ortamında (gerçek `SUPABASE_SERVICE_ROLE_KEY` olmadan) runtime olarak
 * çalıştırılıp uçtan uca doğrulanamadı — yalnızca `vue-tsc --noEmit` ile
 * tip güvenliği doğrulandı. Canlıya almadan önce gerçek bir Supabase
 * projesiyle manuel test edilmeli.
 */
export default defineEventHandler(async (event) => {
  let user: Awaited<ReturnType<typeof serverSupabaseUser>>;

  try {
    user = await serverSupabaseUser(event);
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Geçersiz veya süresi dolmuş oturum.",
    });
  }

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Oturum bulunamadı. Lütfen giriş yapıp tekrar deneyin.",
    });
  }

  const adminClient = serverSupabaseServiceRole<Database>(event);

  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Hesap silinirken bir sorun oluştu.",
    });
  }

  return { success: true };
});
