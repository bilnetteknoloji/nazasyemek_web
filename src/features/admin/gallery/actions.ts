"use server";

import { z } from "zod";
import { gallery as staticGallery } from "@/data/media";
import { requireAdmin } from "@/features/admin/auth/session";
import { removeStoredFile } from "@/features/admin/media/actions";
import { refreshSite } from "@/features/admin/revalidate";
import type { ActionState } from "@/features/admin/ui/form-message";
import { TAGS } from "@/lib/content/tags";
import { galleryGroupIds } from "./labels";

const refresh = () => refreshSite(TAGS.gallery, ["/galeri", "/", "/uretim", "/admin/galeri"]);

const storageUrl = z.url().refine((url) => url.includes("/storage/v1/object/public/media/"));

const newItemSchema = z.object({
  src: storageUrl,
  thumb: storageUrl,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  grp: z.enum(galleryGroupIds),
  alt: z.string().trim().max(200),
});

/** Tarayıcıda yüklenen fotoğrafları galeriye ekler (listenin başına). */
export async function addGalleryItems(items: unknown): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = z.array(newItemSchema).min(1).max(50).safeParse(items);
  if (!parsed.success) return { ok: false, message: "Yüklenen dosyalar doğrulanamadı." };

  const { data: first } = await supabase
    .from("gallery_items")
    .select("sort")
    .order("sort")
    .limit(1)
    .maybeSingle();
  const start = (first?.sort ?? 0) - parsed.data.length;
  const { error } = await supabase
    .from("gallery_items")
    .insert(parsed.data.map((item, index) => ({ ...item, type: "photo", sort: start + index })));
  if (error) return { ok: false, message: "Galeriye eklenemedi." };
  refresh();
  return { ok: true, message: `${parsed.data.length} fotoğraf eklendi.` };
}

const updateSchema = z.object({
  alt: z.string().trim().max(200),
  grp: z.enum(galleryGroupIds),
  visible: z.enum(["on"]).optional(),
});

export async function updateGalleryItem(id: string, _previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Form geçersiz." };
  const { error } = await supabase
    .from("gallery_items")
    .update({ alt: parsed.data.alt, grp: parsed.data.grp, visible: parsed.data.visible === "on" })
    .eq("id", id);
  if (error) return { ok: false, message: "Kaydedilemedi." };
  refresh();
  return { ok: true, message: "Kaydedildi." };
}

export async function deleteGalleryItem(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("gallery_items").select("src, thumb").eq("id", id).maybeSingle();
  await supabase.from("gallery_items").delete().eq("id", id);
  await Promise.all([removeStoredFile(data?.src), removeStoredFile(data?.thumb)]);
  refresh();
}

export async function moveGalleryItem(id: string, direction: -1 | 1) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("gallery_items").select("id").order("sort").order("created_at");
  const ids = (data ?? []).map((row) => row.id as string);
  const from = ids.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ids.length) return;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  // Sıra numaraları baştan yazılır (yeni yüklenenler negatif sırayla başa eklenir).
  await Promise.all(ids.map((rowId, index) => supabase.from("gallery_items").update({ sort: index + 1 }).eq("id", rowId)));
  refresh();
}

/** Sitedeki mevcut galeriyi (src/data/media.ts) panelde yönetilebilir yapar. */
export async function importStaticGallery() {
  const { supabase } = await requireAdmin();
  const { count } = await supabase.from("gallery_items").select("id", { count: "exact", head: true });
  if (count) return;
  await supabase.from("gallery_items").insert(
    staticGallery.map((item, index) => ({
      type: item.type,
      grp: item.group,
      alt: item.alt,
      src: item.src,
      thumb: item.thumb,
      width: item.width,
      height: item.height,
      sort: index + 1,
    })),
  );
  refresh();
}
