import "server-only";

import { capacity, quickStats } from "@/data/home";
import { requireAdmin } from "@/features/admin/auth/session";
import type { StatsSettings } from "@/lib/content/stats-types";
import { emptySeo, type SeoSettings } from "@/lib/content/seo-types";
import { defaultContact, type ContactSettings } from "@/lib/site-contact";

/** Ayarların panelde düzenlenecek hâli: kayıt yoksa sitedeki değerler. */
export async function getSettings() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("settings").select("key, value").in("key", ["contact", "stats", "seo"]);
  const byKey = new Map((data ?? []).map((row) => [row.key, row.value]));
  const contact = { ...defaultContact, ...((byKey.get("contact") as Partial<ContactSettings>) ?? {}) };
  const saved = (byKey.get("stats") as Partial<StatsSettings> | undefined) ?? {};
  const stats: StatsSettings = {
    quick: quickStats.map((item, index) => ({
      value: saved.quick?.[index]?.value || item.value,
      label: saved.quick?.[index]?.label || item.label,
    })),
    capacity: capacity.map((item, index) => ({
      label: saved.capacity?.[index]?.label || item.label,
      value: saved.capacity?.[index]?.value || item.value,
      plus: saved.capacity?.[index]?.plus ?? item.plus ?? "",
      note: saved.capacity?.[index]?.note || item.note,
    })),
  };
  const seo: SeoSettings = { ...emptySeo, ...((byKey.get("seo") as Partial<SeoSettings>) ?? {}) };
  return { contact, stats, seo };
}
