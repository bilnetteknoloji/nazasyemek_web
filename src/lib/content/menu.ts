import "server-only";

import { menuWeeks as staticWeeks, type Meal, type MenuWeek } from "@/data/menu";
import { createPublicClient } from "@/lib/supabase/public";
import { TAGS } from "./tags";

/** Haftalık menü: panelde hafta varsa o, yoksa `src/data/menu.ts`. */
export async function getMenuWeeks(): Promise<MenuWeek[]> {
  const supabase = createPublicClient([TAGS.menu]);
  if (!supabase) return staticWeeks;
  const { data, error } = await supabase
    .from("menu_weeks")
    .select("id, label, days")
    .order("sort")
    .order("created_at");
  if (error) {
    console.error("[menü] okunamadı", error.message);
    return staticWeeks;
  }
  const weeks = (data ?? [])
    .map((row) => ({
      id: String(row.id),
      label: String(row.label),
      days: (Array.isArray(row.days) ? row.days : []) as Meal[],
    }))
    .filter((week) => week.days.length > 0);
  return weeks.length > 0 ? weeks : staticWeeks;
}
