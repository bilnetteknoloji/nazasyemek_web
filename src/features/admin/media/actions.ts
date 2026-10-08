"use server";

import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/features/admin/auth/session";
import { requireSupabaseEnv } from "@/lib/env";
import { MEDIA_BUCKET, mediaUrl } from "@/lib/supabase/storage";

const folders = ["galeri", "belgeler", "blog", "anasayfa"] as const;
const extensions = ["webp", "jpg", "png", "pdf", "mp4"] as const;

export type UploadTarget = {
  signedUrl: string;
  publicUrl: string;
  path: string;
  apiKey: string;
};

/**
 * Tarayıcının dosyayı doğrudan Storage'a yüklemesi için tek kullanımlık
 * imzalı adres üretir (dosya Next sunucusundan geçmez → boyut sınırı yok).
 * Yalnızca admin çağırabilir; yol sunucuda üretilir.
 */
export async function createUploadTarget(
  folder: (typeof folders)[number],
  extension: (typeof extensions)[number],
): Promise<UploadTarget> {
  const { supabase } = await requireAdmin();
  if (!folders.includes(folder) || !extensions.includes(extension)) {
    throw new Error("Geçersiz yükleme hedefi.");
  }
  const path = `${folder}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error("Yükleme adresi alınamadı.");
  const env = requireSupabaseEnv();
  return {
    signedUrl: data.signedUrl,
    path,
    publicUrl: mediaUrl(env.url, path),
    // Publishable key tarayıcıya açılmak için tasarlanmıştır; yazma yetkisi
    // imzalı adresteki tek kullanımlık belirteçten gelir.
    apiKey: env.publishableKey,
  };
}

/** Storage adresinden dosyayı siler (sitenin kendi /public dosyalarına dokunmaz). */
export async function removeStoredFile(url: string | null | undefined) {
  if (!url) return;
  const { supabase } = await requireAdmin();
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index < 0) return;
  await supabase.storage.from(MEDIA_BUCKET).remove([url.slice(index + marker.length)]);
}
