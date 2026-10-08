import "server-only";

import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/env";

/**
 * Ziyaretçi adına (publishable key = `anon`) okuyan istemci; RLS yalnızca
 * yayındaki içeriği gösterir. İstekler Next'in veri önbelleğine `tags` ile
 * yazılır, panel kayıtta `updateTag(tag)` ile tazeler. `revalidate` ileri
 * tarihli blog yazılarının kendiliğinden görünmesi için.
 *
 * Değişkenler tanımlı değilse `null` döner — çağıran dosyadaki veriye düşer.
 */
export function createPublicClient(tags: string[], revalidate = 3600) {
  const env = supabaseEnv();
  if (!env) return null;

  return createClient(env.url, env.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { tags, revalidate } }),
    },
  });
}
