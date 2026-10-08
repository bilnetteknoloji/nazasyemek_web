import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { legalNav, flatNav, site } from "@/data/site";
import { getHome } from "@/lib/content/home";
import { getGallery } from "@/lib/content/media";
import { getPosts } from "@/lib/content/posts";

// Statik yayında derleme anında üretilir; Node yayınında blog etiketiyle tazelenir.
export const dynamic = "force-static";

/** Görsel adresleri site haritasında tam adres olmalı (Storage adresleri zaten tam). */
const absolute = (src: string) => (src.startsWith("http") ? src : `${site.url}${src}`);

/**
 * Site haritası. Görseller de eklenir: Google Görseller ve Yandex Kartinki
 * sayfadaki fotoğrafları buradan da bulur.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, gallery, home] = await Promise.all([getPosts(), getGallery(), getHome()]);
  const now = new Date();
  const url = (href: string) => `${site.url}${href === "/" ? "" : href}`;

  const images: Record<string, string[]> = {
    "/": [
      ...home.hero.slides.map((slide) => slide.src),
      ...home.chain.steps.map((step) => step.photo),
      ...home.menu.dishes.map((dish) => dish.photo),
    ],
    "/galeri": gallery.filter((item) => item.type === "photo").map((item) => item.src),
  };

  const staticRoutes = [
    { href: "/", priority: 1, changeFrequency: "weekly" as const },
    ...flatNav
      .filter((item) => item.href !== "/")
      .map((item) => ({ href: item.href, priority: 0.8, changeFrequency: "monthly" as const })),
    { href: "/teklif-al", priority: 0.9, changeFrequency: "yearly" as const },
    { href: "/blog", priority: 0.6, changeFrequency: "weekly" as const },
    ...legalNav.map((item) => ({ href: item.href, priority: 0.2, changeFrequency: "yearly" as const })),
  ];

  return [
    ...staticRoutes
      .filter((route, index, all) => all.findIndex((other) => other.href === route.href) === index)
      .map((route) => ({
        url: url(route.href),
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        ...(images[route.href]?.length ? { images: [...new Set(images[route.href])].slice(0, 1000).map(absolute) } : {}),
      })),
    ...services.map((service) => ({
      url: url(`/hizmetlerimiz/${service.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [absolute(service.image)],
    })),
    ...posts.map((post) => ({
      url: url(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    })),
  ];
}
