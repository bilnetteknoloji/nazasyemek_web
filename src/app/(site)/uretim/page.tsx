import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getGallery } from "@/lib/content/media";
import { ProductionHero } from "@/components/sections/production/ProductionHero";
import { Methodology } from "@/components/sections/production/Methodology";
import { ServiceModels } from "@/components/sections/production/ServiceModels";
import { HygieneStandards } from "@/components/sections/production/HygieneStandards";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { QuickQuote } from "@/components/sections/QuickQuote";
import { UsageNote } from "@/components/sections/UsageNote";
import { facilityVisitNote } from "@/data/notes";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = pageMeta({
  title: "Üretim Tesisimiz ve Hijyen Süreçleri",
  description: "NAZ-AŞ Yemek üretim tesisi: hammadde kabulünden sevkiyata beş aşamalı üretim, hijyen ve gıda güvenliği standartları, kurumsal hizmet modelleri.",
  path: "/uretim",
});

/** Bölüm sırası Stitch "Üretim Tesisimiz & Süreçler | NAZ-AŞ" ekranından. */
export default async function ProductionPage() {
  const gallery = await getGallery();
  return (
    <>
      <ProductionHero />
      <Methodology />
      <ServiceModels />
      <HygieneStandards />

      <Section className="bg-cream">
        <UsageNote note={facilityVisitNote} />
      </Section>

      <Section className="bg-cream-deep">
        <SectionHeading
          eyebrow="Şeffaf Mutfak"
          title="Tesis ve Üretim Galerisi"
          description="Üretim alanımızdan, porsiyonlama hattımızdan ve servis düzenimizden kareler."
          align="center"
        />
        <div className="mt-12">
          <GalleryGrid
            items={gallery}
            limit={8}
            withFilters={false}
            groups={["tesis", "mutfak", "kumanya"]}
          />
        </div>
      </Section>

      <QuickQuote />

      <JsonLd
        data={breadcrumbJsonLd([{ name: "Üretim Tesisimiz", href: "/uretim" }])}
      />
    </>
  );
}
