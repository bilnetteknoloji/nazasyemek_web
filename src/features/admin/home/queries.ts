import "server-only";

import { requireAdmin } from "@/features/admin/auth/session";
import { homeSections, settingKey } from "@/lib/content/home-sections";
import { mergeHome } from "@/lib/content/home";

/** Panelde düzenlenecek ana sayfa içeriği: kayıt yoksa sitedeki varsayılan. */
export async function getHomeForEdit() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", homeSections.map((section) => settingKey(section.key)));
  return mergeHome(new Map((data ?? []).map((row) => [String(row.key), row.value])));
}
