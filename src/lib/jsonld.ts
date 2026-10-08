import "server-only";

import { site as staticSite } from "@/data/site";
import { getCertificates } from "@/lib/content/media";
import { getSite } from "@/lib/content/site";

/** LocalBusiness / FoodEstablishment yapısal verisi (iletişim ve belgeler panelden). */
export async function organizationJsonLd() {
  const [site, certificates] = await Promise.all([
    getSite(),
    getCertificates(),
  ]);
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: `${site.legalName}`,
    alternateName: site.name,
    description: site.description,
    slogan: site.tagline,
    url: site.url,
    telephone: site.phone,
    // Yalnızca doğrulanmış hesaplar (Facebook linki henüz geçici bir arama).
    sameAs: Object.values(site.social)
      .filter((account) => account.verified)
      .map((account) => account.href),
    email: site.email,
    image: `${site.url}/brand/og-logo.png`,
    logo: `${site.url}/brand/logo.png`,
    priceRange: "₺₺",
    servesCuisine: "Türk mutfağı",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.district,
      addressRegion: site.address.city,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "City", name: "İstanbul" },
    openingHours: "Mo-Sa 08:00-18:00",
    hasCredential: certificates.map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      name: cert.title,
      description: cert.subtitle,
    })),
  };
}

/** Sayfa bazlı BreadcrumbList üretir. */
export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Ana Sayfa", href: "/" }, ...items].map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${staticSite.url}${item.href}`,
      }),
    ),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
