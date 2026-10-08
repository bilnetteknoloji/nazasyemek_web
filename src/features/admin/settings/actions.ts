"use server";

import { z } from "zod";
import { requireAdmin } from "@/features/admin/auth/session";
import { refreshSite } from "@/features/admin/revalidate";
import type { ActionState } from "@/features/admin/ui/form-message";
import { TAGS } from "@/lib/content/tags";

const phone = z
  .string()
  .trim()
  .regex(/^[0-9 ()+-]{10,20}$/, "Telefon numarası geçersiz (ör. 0212 470 16 29).");
const url = z
  .string()
  .trim()
  .max(300)
  .refine((value) => !value || /^https:\/\/\S+$/.test(value), "Adres https:// ile başlamalı.");

const contactSchema = z.object({
  phone,
  mobile: phone,
  whatsapp: phone,
  email: z.email("Geçerli bir e-posta yazın."),
  workingHours: z.string().trim().min(3).max(120),
  instagram: url,
  tiktok: url,
  facebook: url,
});

/** Tüm site sayfaları iletişim bilgisini kullandığı için kökten tazelenir. */
const refreshAll = () => refreshSite(TAGS.settings, ["/"]);

async function save(key: string, value: unknown) {
  const { supabase } = await requireAdmin();
  return supabase.from("settings").upsert({ key, value });
}

export async function saveContact(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Form geçersiz." };
  const { error } = await save("contact", parsed.data);
  if (error) return { ok: false, message: "Kaydedilemedi." };
  refreshAll();
  return { ok: true, message: "İletişim bilgileri sitede güncellendi." };
}

const short = (max: number) => z.string().trim().max(max);

export async function saveStats(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const get = (name: string) => String(formData.get(name) ?? "");
  const parsed = z
    .object({
      quick: z.array(z.object({ value: short(20), label: short(60) })).length(4),
      capacity: z.array(z.object({ label: short(40), value: short(20), plus: short(4), note: short(120) })).length(4),
    })
    .safeParse({
      quick: [0, 1, 2, 3].map((i) => ({ value: get(`quick.${i}.value`), label: get(`quick.${i}.label`) })),
      capacity: [0, 1, 2, 3].map((i) => ({
        label: get(`capacity.${i}.label`),
        value: get(`capacity.${i}.value`),
        plus: get(`capacity.${i}.plus`),
        note: get(`capacity.${i}.note`),
      })),
    });
  if (!parsed.success) return { ok: false, message: "Alanlardan biri çok uzun." };
  const { error } = await save("stats", parsed.data);
  if (error) return { ok: false, message: "Kaydedilemedi." };
  refreshAll();
  return { ok: true, message: "Rakamlar ana sayfada güncellendi." };
}
