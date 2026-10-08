"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { certificates as staticCertificates } from "@/data/media";
import { requireAdmin } from "@/features/admin/auth/session";
import { removeStoredFile } from "@/features/admin/media/actions";
import { refreshSite } from "@/features/admin/revalidate";
import type { ActionState } from "@/features/admin/ui/form-message";
import { TAGS } from "@/lib/content/tags";

const refresh = () => refreshSite(TAGS.certificates, ["/belgelerimiz", "/", "/hakkimizda", "/admin/belgeler"]);

/** Dosya adresi: Storage ya da sitenin kendi /belgeler/ klasörü. */
const fileUrl = z
  .string()
  .refine((url) => url.startsWith("/belgeler/") || url.includes("/storage/v1/object/public/media/"));

const certificateSchema = z.object({
  title: z.string().trim().min(1, "Başlık gerekli.").max(120),
  subtitle: z.string().trim().max(200),
  visible: z.boolean(),
  pdf_url: fileUrl,
  thumb_url: fileUrl.nullable(),
  thumb_width: z.number().int().positive().nullable(),
  thumb_height: z.number().int().positive().nullable(),
});

export type CertificateInput = z.input<typeof certificateSchema>;

export async function saveCertificate(id: string | null, input: CertificateInput): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Form geçersiz." };

  if (id) {
    const { data: previous } = await supabase.from("certificates").select("pdf_url, thumb_url").eq("id", id).maybeSingle();
    const { error } = await supabase.from("certificates").update(parsed.data).eq("id", id);
    if (error) return { ok: false, message: "Kaydedilemedi." };
    // Değiştirilen eski dosyalar Storage'dan silinir.
    if (previous?.pdf_url !== parsed.data.pdf_url) await removeStoredFile(previous?.pdf_url);
    if (previous?.thumb_url !== parsed.data.thumb_url) await removeStoredFile(previous?.thumb_url);
    refresh();
    return { ok: true, message: "Belge kaydedildi." };
  }

  const { count } = await supabase.from("certificates").select("id", { count: "exact", head: true });
  const { error } = await supabase.from("certificates").insert({ ...parsed.data, sort: (count ?? 0) + 1 });
  if (error) return { ok: false, message: "Eklenemedi." };
  refresh();
  return { ok: true, message: "Belge eklendi." };
}

export async function deleteCertificate(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("certificates").select("pdf_url, thumb_url").eq("id", id).maybeSingle();
  await supabase.from("certificates").delete().eq("id", id);
  await Promise.all([removeStoredFile(data?.pdf_url), removeStoredFile(data?.thumb_url)]);
  refresh();
  redirect("/admin/belgeler");
}

export async function moveCertificate(id: string, direction: -1 | 1) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("certificates").select("id").order("sort").order("created_at");
  const ids = (data ?? []).map((row) => row.id as string);
  const from = ids.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ids.length) return;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  await Promise.all(ids.map((rowId, index) => supabase.from("certificates").update({ sort: index + 1 }).eq("id", rowId)));
  refresh();
}

/** Sitedeki 11 sertifikayı (src/data/media.ts) panelde yönetilebilir yapar. */
export async function importStaticCertificates() {
  const { supabase } = await requireAdmin();
  const { count } = await supabase.from("certificates").select("id", { count: "exact", head: true });
  if (count) return;
  await supabase.from("certificates").insert(
    staticCertificates.map((cert, index) => ({
      title: cert.title,
      subtitle: cert.subtitle,
      pdf_url: cert.pdf,
      thumb_url: cert.thumb?.src ?? null,
      thumb_width: cert.thumb?.width ?? null,
      thumb_height: cert.thumb?.height ?? null,
      sort: index + 1,
    })),
  );
  refresh();
}
