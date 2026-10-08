import "server-only";

import { requireAdmin } from "@/features/admin/auth/session";

export type Overview = {
  views: number;
  visitors: number;
  submissions: number;
  live: number;
  series: { day: string; views: number; visitors: number }[];
  pages: { path: string; views: number; visitors: number }[];
  sources: { name: string; views: number }[];
  devices: { name: string; views: number }[];
  forms: { name: string; views: number }[];
};

export const periods = [7, 30, 90] as const;
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
