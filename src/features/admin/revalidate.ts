import "server-only";

import { revalidatePath, updateTag } from "next/cache";

/**
 * Panelde içerik değişince sitenin önbelleğini tazeler: veri etiketi
 * (`updateTag`, bir sonraki istekte taze veri) + ilgili sayfalar.
 */
export function refreshSite(tag: string, paths: string[] = []) {
  updateTag(tag);
  for (const path of paths) revalidatePath(path);
}
