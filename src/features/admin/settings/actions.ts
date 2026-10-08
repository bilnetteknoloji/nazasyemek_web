"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import sitemap from "@/app/sitemap";
import { requireAdmin } from "@/features/admin/auth/session";
import { refreshSite } from "@/features/admin/revalidate";
import type { ActionState } from "@/features/admin/ui/form-message";
import { verificationCode, type SeoSettings } from "@/lib/content/seo-types";
import { TAGS } from "@/lib/content/tags";
import { submitToIndexNow } from "@/lib/server/indexnow";

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

/**
 * Arama motoru doğrulama kodları. Meta etiketinin tamamı yapıştırılsa da
 * yalnızca kod saklanır. IndexNow anahtarı ilk kayıtta üretilir ve korunur.
 */
export async function saveSeo(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const fields = ["google", "yandex", "bing"] as const;
  const codes: Record<(typeof fields)[number], string> = { google: "", yandex: "", bing: "" };
  for (const field of fields) {
    const raw = String(formData.get(field) ?? "");
    const code = verificationCode(raw);
    if (raw.trim() && !code) return { ok: false, message: "Doğrulama kodlarından biri okunamadı. Yalnızca kodu ya da meta etiketini yapıştırın." };
    codes[field] = code;
  }
  const { data } = await supabase.from("settings").select("value").eq("key", "seo").maybeSingle();
  const previous = (data?.value as Partial<SeoSettings> | undefined) ?? {};
  const indexNowKey = previous.indexNowKey || randomBytes(16).toString("hex");
  const { error } = await save("seo", { ...codes, indexNowKey });
  if (error) return { ok: false, message: "Kaydedilemedi." };
  refreshAll();
  revalidatePath("/indexnow.txt");
  return { ok: true, message: "Kaydedildi. Arama motoru panelinde \"Doğrula\" düğmesine basabilirsiniz." };
}

/** Sitedeki tüm sayfaları (site haritası) IndexNow ile Bing ve Yandex'e bildirir. */
export async function notifyAllPages(): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("settings").select("value").eq("key", "seo").maybeSingle();
  const key = (data?.value as Partial<SeoSettings> | undefined)?.indexNowKey;
  if (!key) return { ok: false, message: "Önce bu kartı bir kez kaydedin; bildirim anahtarı oluşturulsun." };
  if (process.env.NODE_ENV !== "production") return { ok: false, message: "Bildirim yalnızca canlı sitede gönderilir." };
  const entries = await sitemap();
  const result = await submitToIndexNow(
    key,
    entries.map((entry) => new URL(entry.url).pathname),
  );
  if (result.ok) {
    return { ok: true, message: `${entries.length} sayfa Bing ve Yandex'e bildirildi.` };
  }
  return {
    ok: false,
    message:
      result.status === 403
        ? "Anahtar doğrulanamadı. Siteyi yeniden yayınladıktan birkaç dakika sonra tekrar deneyin."
        : `Bildirim gönderilemedi (${result.status || "bağlantı"}). Biraz sonra tekrar deneyin.`,
  };
}
