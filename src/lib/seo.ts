import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Sayfa meta etiketleri: başlık, açıklama, canonical ve paylaşım (Open Graph,
 * Twitter) birlikte. Sayfa kendi `openGraph`'ını vermezse Next kökteki ana
 * sayfa başlığını kullanır — WhatsApp/Facebook önizlemesi her sayfada aynı
 * görünür. Görsel verilmezse sitenin genel paylaşım görseli kullanılır.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const fullTitle = `${title} | ${site.name} Yemek`;
  // Sondaki / önemli: trailingSlash açık, eğik çizgisiz adres 308 ile yönlenir.
  const images = [image ? { url: image } : { url: "/opengraph-image/", width: 1200, height: 630 }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...(type === "article" ? { type, publishedTime } : { type }),
      locale: "tr_TR",
      siteName: `${site.name} Yemek`,
      url: path,
      title: fullTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
