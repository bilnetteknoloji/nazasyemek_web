import "server-only";

import type { Meal } from "@/data/menu";
import { requireAdmin } from "@/features/admin/auth/session";

export type WeekRow = { id: string; label: string; days: Meal[]; sort: number; updated_at: string };

export async function listWeeks() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("menu_weeks")
    .select("id, label, days, sort, updated_at")
    .order("sort")
    .order("created_at");
  return (data ?? []) as WeekRow[];
}

export async function getWeek(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("menu_weeks")
    .select("id, label, days, sort, updated_at")
    .eq("id", id)
    .maybeSingle();
  return (data as WeekRow | null) ?? null;
}
