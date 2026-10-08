import "server-only";

import { requireAdmin } from "@/features/admin/auth/session";

export type Row = { name: string; views: number; visitors: number };

export type Overview = {
  views: number;
  visitors: number;
  visits: number;
  submissions: number;
  bounce: number;
  pagesPerVisit: number;
  previous: { views: number; visits: number; submissions: number };
  live: number;
  series: { day: string; views: number; visitors: number }[];
  hours: { hour: number; views: number }[];
  weekdays: { day: number; views: number }[];
  groups: Partial<
    Record<
      "pages" | "entries" | "sources" | "channels" | "engines" | "devices" | "os" | "browsers" | "countries" | "cities",
      Row[]
    >
  >;
  forms: { name: string; views: number }[];
};

export type RecentView = {
  at: string;
  path: string;
  device: string;
  os: string | null;
  browser: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  lang: string | null;
  screen: number | null;
  visitor: string;
  referrer: string | null;
  source: string | null;
  entry: boolean;
};

export const periods = [1, 7, 30, 90] as const;
export type Period = (typeof periods)[number];

/** Son `days` gün (bugün dahil, Türkiye saatine göre). */
export async function getOverview(days: number) {
  const { supabase } = await requireAdmin();
  const to = new Date();
  const istanbulMidnight = new Date(
    new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(to) + "T00:00:00+03:00",
  );
  const from = new Date(istanbulMidnight.getTime() - (days - 1) * 86_400_000);
  const { data, error } = await supabase.rpc("analytics_overview", {
    p_from: from.toISOString(),
    p_to: new Date(to.getTime() + 60_000).toISOString(),
  });
  if (error) throw new Error(error.message);
  return data as Overview;
}

/** Son ziyaretler: her sayfa görüntülemesi cihaz, konum ve kaynağıyla. */
export async function getRecentViews(limit = 100) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("page_views")
    .select("at, path, device, os, browser, country, city, region, lang, screen, visitor, referrer, source, entry")
    .order("at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as RecentView[];
}
