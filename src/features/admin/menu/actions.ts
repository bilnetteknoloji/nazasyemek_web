"use server";

import { redirect } from "next/navigation";
import { menuWeeks as staticWeeks } from "@/data/menu";
import { requireAdmin } from "@/features/admin/auth/session";
import { refreshSite } from "@/features/admin/revalidate";
import type { ActionState } from "@/features/admin/ui/form-message";
import { TAGS } from "@/lib/content/tags";
import { parseWeekForm } from "./schema";

const refresh = () => refreshSite(TAGS.menu, ["/menu", "/admin/menu"]);

export async function createWeek() {
  const { supabase } = await requireAdmin();
  const { count } = await supabase.from("menu_weeks").select("id", { count: "exact", head: true });
  const next = (count ?? 0) + 1;
  const { data, error } = await supabase
    .from("menu_weeks")
    .insert({ label: `${next}. Hafta`, days: [], sort: next })
    .select("id")
    .single();
  if (error) throw new Error("Hafta eklenemedi.");
  redirect(`/admin/menu/${data.id}`);
}

export async function updateWeek(id: string, _previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = parseWeekForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Form geçersiz." };

  // Ana yemeği boş gün sitede gösterilmez.
  const days = parsed.data.days.filter((day) => day.main);
  const { error } = await supabase.from("menu_weeks").update({ label: parsed.data.label, days }).eq("id", id);
  if (error) return { ok: false, message: "Kaydedilemedi." };
  refresh();
  return {
    ok: true,
    message: days.length ? `Kaydedildi — ${days.length} gün sitede.` : "Kaydedildi. Ana yemek girilmediği için bu hafta sitede görünmez.",
  };
}

export async function deleteWeek(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("menu_weeks").delete().eq("id", id);
  refresh();
  redirect("/admin/menu");
}

/** Haftayı listede bir yukarı/aşağı taşır (sıra numaralarını baştan yazar). */
export async function moveWeek(id: string, direction: -1 | 1) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("menu_weeks").select("id").order("sort").order("created_at");
  const ids = (data ?? []).map((row) => row.id as string);
  const from = ids.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ids.length) return;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  await Promise.all(ids.map((rowId, index) => supabase.from("menu_weeks").update({ sort: index + 1 }).eq("id", rowId)));
  refresh();
}

/** Sitedeki örnek menüyü (src/data/menu.ts) düzenlenebilir hâle getirir. */
export async function importStaticMenu() {
  const { supabase } = await requireAdmin();
  const { count } = await supabase.from("menu_weeks").select("id", { count: "exact", head: true });
  if (count) return;
  await supabase
    .from("menu_weeks")
    .insert(staticWeeks.map((week, index) => ({ label: week.label, days: week.days, sort: index + 1 })));
  refresh();
}
