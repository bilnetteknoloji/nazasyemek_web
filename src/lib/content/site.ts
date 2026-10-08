import "server-only";

import { cache } from "react";
import { capacity as staticCapacity, quickStats as staticQuickStats } from "@/data/home";
import { createPublicClient } from "@/lib/supabase/public";
import { resolveSite, type ContactSettings } from "@/lib/site-contact";
import { emptySeo, type SeoSettings } from "./seo-types";
import type { StatsSettings } from "./stats-types";
import { TAGS } from "./tags";

async function readSetting<T>(key: string): Promise<T | null> {
  const supabase = createPublicClient([TAGS.settings]);
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    console.error(`[ayarlar] ${key} okunamadı`, error.message);
    return null;
  }
  return (data?.value as T | undefined) ?? null;
}

/** Site bilgileri: iletişim kanalları panelden, gerisi `src/data/site.ts`. */
export const getSite = cache(async () =>
  resolveSite(await readSetting<Partial<ContactSettings>>("contact")),
);

/** Ana sayfa rakamları: ikon ve renkler dosyadan, değer ve yazılar panelden. */
export const getStats = cache(async () => {
  const stats = await readSetting<Partial<StatsSettings>>("stats");
  return {
    quickStats: staticQuickStats.map((item, index) => ({
      ...item,
      ...pick(stats?.quick?.[index], ["value", "label"]),
    })),
    capacity: staticCapacity.map((item, index) => ({
      ...item,
      ...pick(stats?.capacity?.[index], ["label", "value", "plus", "note"]),
    })),
  };
});

/** Arama motoru doğrulama kodları ve IndexNow anahtarı. */
export const getSeo = cache(async (): Promise<SeoSettings> => ({
  ...emptySeo,
  ...((await readSetting<Partial<SeoSettings>>("seo")) ?? {}),
}));

/** Yalnızca dolu metin alanlarını alır; boş bırakılan alan dosyadaki değerde kalır. */
function pick<K extends string>(source: Partial<Record<K, unknown>> | undefined, keys: K[]) {
  const out: Partial<Record<K, string>> = {};
  if (!source) return out;
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && (value.trim() !== "" || key === "plus")) {
      out[key] = value.trim();
    }
  }
  return out;
}
