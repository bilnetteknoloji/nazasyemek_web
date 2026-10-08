import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseEnv } from "@/lib/env";

/**
 * Oturumlu istemci: panelde admin adına okur/yazar, RLS'ye tabidir.
 * Server Component içinde çerez yazılamadığı için `setAll` sessizce yutulur —
 * oturum tazeleme proxy'de yapılır (src/proxy.ts).
 */
export async function createClient() {
  const cookieStore = await cookies();
  const env = requireSupabaseEnv();

  return createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component'ten çağrıldı; proxy oturumu zaten tazeliyor.
        }
      },
    },
  });
}
