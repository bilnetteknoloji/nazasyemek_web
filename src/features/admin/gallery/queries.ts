import "server-only";

import { requireAdmin } from "@/features/admin/auth/session";

export type GalleryRow = {
  id: string;
  type: "photo" | "video";
  grp: string;
  alt: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  visible: boolean;
  sort: number;
};

export async function listGalleryItems() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("gallery_items")
    .select("id, type, grp, alt, src, thumb, width, height, visible, sort")
    .order("sort")
    .order("created_at");
  return (data ?? []) as GalleryRow[];
}
