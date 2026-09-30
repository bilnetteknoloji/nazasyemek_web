import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { legalNav, flatNav, site } from "@/data/site";

// Statik yayında derleme anında üretilir.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { href: "/", priority: 1 },
    ...flatNav
      .filter((item) => item.href !== "/")
      .map((item) => ({ href: item.href, priority: 0.8 })),
    { href: "/teklif-al", priority: 0.9 },
    ...legalNav.map((item) => ({ href: item.href, priority: 0.3 })),
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.href === "/" ? "" : route.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...services.map((service) => ({
      url: `${site.url}/hizmetlerimiz/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
