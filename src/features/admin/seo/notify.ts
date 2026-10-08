import "server-only";

import { after } from "next/server";
import { requireAdmin } from "@/features/admin/auth/session";
import type { SeoSettings } from "@/lib/content/seo-types";
import { submitToIndexNow } from "@/lib/server/indexnow";

/**
 * Değişen sayfaları yanıt döndükten sonra IndexNow'a bildirir (panel
 * beklemez). Anahtar henüz üretilmemişse sessizce geçer.
 */
export async function notifyLater(paths: string[]) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("settings").select("value").eq("key", "seo").maybeSingle();
  const key = (data?.value as Partial<SeoSettings> | undefined)?.indexNowKey;
  if (!key) return;
  after(async () => {
    const result = await submitToIndexNow(key, paths);
    if (!result.ok && result.status) console.error("[indexnow] bildirim başarısız", result.status);
  });
}
