import "server-only";

import {
  certificates as staticCertificates,
  gallery as staticGallery,
  type Certificate,
  type GalleryGroup,
  type GalleryItem,
} from "@/data/media";
import { createPublicClient } from "@/lib/supabase/public";
import { TAGS } from "./tags";

/** Belgeler: panelde kayıt varsa o, yoksa `src/data/media.ts`. */
export async function getCertificates(): Promise<Certificate[]> {
  const supabase = createPublicClient([TAGS.certificates]);
  if (!supabase) return staticCertificates;
  const { data, error } = await supabase
    .from("certificates")
    .select("id, title, subtitle, pdf_url, thumb_url, thumb_width, thumb_height")
    .order("sort")
    .order("created_at");
  if (error) {
    console.error("[belgeler] okunamadı", error.message);
    return staticCertificates;
  }
  if (!data?.length) return staticCertificates;
  return data.map((row) => ({
    id: String(row.id),
    title: row.title,
    subtitle: row.subtitle ?? "",
    pdf: row.pdf_url,
    thumb: row.thumb_url
      ? {
          src: row.thumb_url,
          width: row.thumb_width ?? 900,
          height: row.thumb_height ?? 1274,
        }
      : null,
  }));
}

/** Galeri: panelde kayıt varsa o, yoksa `src/data/media.ts`. */
export async function getGallery(): Promise<GalleryItem[]> {
  const supabase = createPublicClient([TAGS.gallery]);
  if (!supabase) return staticGallery;
  const { data, error } = await supabase
    .from("gallery_items")
    .select("type, grp, alt, src, thumb, width, height")
    .order("sort")
    .order("created_at");
  if (error) {
    console.error("[galeri] okunamadı", error.message);
    return staticGallery;
  }
  if (!data?.length) return staticGallery;
  return data.map((row) => ({
    type: row.type === "video" ? "video" : "photo",
    group: row.grp as GalleryGroup,
    alt: row.alt ?? "",
    src: row.src,
    thumb: row.thumb,
    width: row.width,
    height: row.height,
  }));
}
