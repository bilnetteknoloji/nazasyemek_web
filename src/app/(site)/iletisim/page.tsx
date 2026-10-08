import type { Metadata } from "next";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { ContactCards } from "@/components/sections/contact/ContactCards";
import { VisitGuide } from "@/components/sections/contact/VisitGuide";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { FaqSection } from "@/components/sections/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${site.legalName} — ${site.address.full}. Toplu yemek ve catering talepleriniz için bize ulaşın.`,
  alternates: { canonical: "/iletisim" },
};

/** Bölüm sırası Stitch "İletişim" ekranından. */
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactCards />

      <VisitGuide />
      <Section className="bg-cream-deep">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <SectionHeading
            eyebrow="Keşif Talebi"
            title="Hızlı İletişim & Keşif Talep Formu"
            description="Çalışan sayınız ve yemekhane durumunuza göre kurumunuza özel menü ve fiyat analizi hazırlayalım."
          />
          <Reveal delay={0.1}>
            <QuoteForm />
          </Reveal>
        </div>
      </Section>
      <FaqSection limit={5} />

      <JsonLd
        data={breadcrumbJsonLd([{ name: "İletişim", href: "/iletisim" }])}
      />
    </>
  );
}
