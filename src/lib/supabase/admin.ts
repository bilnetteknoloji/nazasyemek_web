import "server-only";

import { createClient } from "@supabase/supabase-js";
import { requireSupabaseEnv } from "@/lib/env";

/**
 * Secret key ile çalışan istemci — RLS'yi AŞAR. Yalnızca oturumsuz sunucu
 * işleri için (form kaydı, ziyaret kaydı). Panel işlemleri oturumlu
 * `server.ts` istemcisini kullanır ki RLS devrede kalsın.
 */
export function createAdminClient() {
  const env = requireSupabaseEnv();
  return createClient(env.url, env.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
