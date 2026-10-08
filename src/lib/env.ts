import "server-only";

/**
 * Sunucu ortam değişkenleri. Supabase anahtarları yalnızca sunucuda okunur
 * (NEXT_PUBLIC_ değil). Tanımlı değilse site panelsiz çalışır: içerik
 * `src/data/` dosyalarından gelir, formlar yalnızca e-postaya gider.
 */
export type SupabaseEnv = {
  url: string;
  publishableKey: string;
  secretKey: string;
};

export function supabaseEnv(): SupabaseEnv | null {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !publishableKey || !secretKey) return null;
  return { url, publishableKey, secretKey };
}

/** Panel ve API rotaları için: değişkenler yoksa açık bir hatayla durur. */
export function requireSupabaseEnv(): SupabaseEnv {
  const env = supabaseEnv();
  if (!env) {
    throw new Error(
      "SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY ve SUPABASE_SECRET_KEY tanımlı değil (.env.local).",
    );
  }
  return env;
}
