import "server-only";

import { services } from "@/data/services";
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
    "@id": `${site.url}/#isletme`,
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
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.legalName} ${site.address.full}`)}`,
    knowsLanguage: "tr",
    contactPoint: [
      { telephone: site.phone, contactType: "customer service", name: "Sabit hat" },
      { telephone: site.mobile, contactType: "sales", name: "Mobil" },
      { telephone: site.whatsappDisplay, contactType: "customer service", name: "WhatsApp" },
    ].map((point) => ({
      "@type": "ContactPoint",
      ...point,
      areaServed: "TR",
      availableLanguage: "Turkish",
    })),
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.short,
        url: `${site.url}/hizmetlerimiz/${service.slug}`,
      },
    })),
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

/** Site bilgisi (Google'da site adı ve Yandex'te site kartı için). */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${staticSite.url}/#site`,
    name: `${staticSite.name} Yemek`,
    alternateName: [staticSite.legalName, "NAZAŞ Yemek", "Nazaş Yemek"],
    url: staticSite.url,
    inLanguage: "tr-TR",
    publisher: { "@id": `${staticSite.url}/#isletme` },
  };
}

/** Hizmet detay sayfası: işletmeye bağlı Service. */
export function serviceJsonLd(service: { slug: string; title: string; description: string; image: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.description,
    image: `${staticSite.url}${service.image}`,
    url: `${staticSite.url}/hizmetlerimiz/${service.slug}`,
    provider: { "@id": `${staticSite.url}/#isletme` },
    areaServed: { "@type": "City", name: "İstanbul" },
  };
}
