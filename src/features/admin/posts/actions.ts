"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/features/admin/auth/session";
import { removeStoredFile } from "@/features/admin/media/actions";
import { refreshSite } from "@/features/admin/revalidate";
import { notifyLater } from "@/features/admin/seo/notify";
import type { ActionState } from "@/features/admin/ui/form-message";
import { TAGS } from "@/lib/content/tags";

const postSchema = z.object({
  title: z.string().trim().min(3, "Başlık en az 3 karakter olmalı.").max(160),
  slug: z
    .string()
    .trim()
    .min(3, "Adres en az 3 karakter olmalı.")
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Adreste yalnızca küçük harf, rakam ve tire olabilir."),
  excerpt: z.string().trim().max(300),
  body: z.string().trim().min(1, "Yazı boş olamaz.").max(50_000),
  cover_url: z
    .string()
    .refine((url) => url.includes("/storage/v1/object/public/media/"))
    .nullable(),
  status: z.enum(["taslak", "yayinda"]),
  /** Türkiye saatiyle "2026-10-08T09:30" (datetime-local) ya da boş. */
  published_at: z.string().trim().max(40),
});

export type PostInput = z.input<typeof postSchema>;

/** datetime-local değeri Türkiye saatidir (UTC+3, yaz saati yok). */
const fromLocal = (value: string) => (value ? new Date(`${value}:00+03:00`).toISOString() : null);

export async function savePost(id: string | null, input: PostInput): Promise<ActionState & { id?: string }> {
  const { supabase } = await requireAdmin();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Form geçersiz." };
  const { published_at, ...rest } = parsed.data;
  const row = {
    ...rest,
    excerpt: rest.excerpt || null,
    // Yayına alınan yazının tarihi boşsa şimdi yayınlanır.
    published_at: fromLocal(published_at) ?? (rest.status === "yayinda" ? new Date().toISOString() : null),
  };

  let postId = id;
  if (id) {
    const { data: previous } = await supabase.from("posts").select("cover_url").eq("id", id).maybeSingle();
    const { error } = await supabase.from("posts").update(row).eq("id", id);
    if (error) return { ok: false, message: error.code === "23505" ? "Bu adres başka bir yazıda kullanılıyor." : "Kaydedilemedi." };
    if (previous?.cover_url !== row.cover_url) await removeStoredFile(previous?.cover_url);
  } else {
    const { data, error } = await supabase.from("posts").insert(row).select("id").single();
    if (error) return { ok: false, message: error.code === "23505" ? "Bu adres başka bir yazıda kullanılıyor." : "Kaydedilemedi." };
    postId = data.id;
  }

  refreshSite(TAGS.posts, ["/blog", `/blog/${row.slug}`, "/admin/blog"]);
  // Yayındaki yazı Bing ve Yandex'e hemen bildirilir.
  if (row.status === "yayinda" && row.published_at && new Date(row.published_at) <= new Date()) {
    await notifyLater([`/blog/${row.slug}`, "/blog"]);
  }
  return {
    ok: true,
    id: postId ?? undefined,
    message: row.status === "yayinda" ? "Yazı yayında." : "Taslak kaydedildi.",
  };
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("posts").select("cover_url, slug").eq("id", id).maybeSingle();
  await supabase.from("posts").delete().eq("id", id);
  await removeStoredFile(data?.cover_url);
  refreshSite(TAGS.posts, ["/blog", data?.slug ? `/blog/${data.slug}` : "/blog"]);
  redirect("/admin/blog");
}
