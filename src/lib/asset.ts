/**
 * public/ altındaki dosyalara basePath ekler.
 *
 * Next.js, `images.unoptimized` açıkken `next/image` src'lerine basePath
 * uygulamıyor; video, PDF ve poster yolları da olduğu gibi kalıyor. Site alt
 * klasöre yüklendiğinde (NEXT_BASE_PATH=/out) bu yollar 404 verdiği için
 * public varlıklarına bu yardımcı üzerinden erişilir.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!basePath) return path;
  if (!path.startsWith("/")) return path;
  if (path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}
