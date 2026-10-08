import type { Metadata } from "next";
import { CalendarCheck, PhoneCall, Utensils } from "lucide-react";
import { photos } from "@/data/media";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getSite } from "@/lib/content/site";

const heroPhoto =
  photos.find((photo) => photo.src.endsWith("nazas7.webp")) ?? photos[0];

export const metadata: Metadata = {
  title: "Teklif Alın",
  description:
    "Kurumunuzun öğün ihtiyacını paylaşın; örnek menü ve fiyat teklifimizi bir iş günü içinde hazırlayalım.",
  alternates: { canonical: "/teklif-al" },
};

const steps = [
  {
    icon: Utensils,
    title: "İhtiyacınızı paylaşın",
    text: "Öğün sayısı, vardiya düzeni ve hizmet türünü formda belirtin.",
  },
  {
    icon: PhoneCall,
    title: "Bir iş günü içinde dönüş",
    text: "Ekibimiz sizi arar, eksik bilgileri tamamlar ve keşif planlar.",
  },
  {
    icon: CalendarCheck,
    title: "Örnek menü ve deneme servisi",
    text: "Teklifle birlikte örnek menü sunar, dilerseniz tadım düzenleriz.",
  },
];

export default async function QuotePage() {
  const site = await getSite();
  return (
    <>
      <PageHero
        photo={heroPhoto}
        eyebrow="Teklif"
        title="Kurumunuza özel teklif hazırlayalım"
        description="Formu doldurmanız yaklaşık iki dakika sürer. Acil talepleriniz için doğrudan telefonla da ulaşabilirsiniz."
        crumbs={[{ name: "Teklif Alın", href: "/teklif-al" }]}
      />

      <Section className="pt-14 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <div>
            <ul className="space-y-6">
              {steps.map((step, index) => (
                <Reveal as="li" key={step.title} delay={index * 0.08} className="flex gap-4">
                  <span className="bg-brand-50 text-brand-800 flex size-11 shrink-0 items-center justify-center rounded-2xl">
                    <step.icon className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="text-brand-900 block font-semibold">
                      {step.title}
                    </span>
                    <span className="text-muted mt-1 block text-sm leading-relaxed">
                      {step.text}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>

            <Reveal
              delay={0.28}
              className="border-line mt-8 rounded-3xl border bg-white/70 p-6"
            >
              <p className="text-muted text-sm leading-relaxed">
                Telefonla ulaşmak isterseniz:
              </p>
              <a
                href={site.phoneHref}
                className="text-brand-900 font-display hover:text-accent-600 mt-2 block text-2xl transition-colors"
              >
                {site.phone}
              </a>
              <p className="text-muted mt-3 text-xs">{site.workingHours}</p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <QuoteForm />
          </Reveal>
        </div>
      </Section>

      <JsonLd data={breadcrumbJsonLd([{ name: "Teklif Alın", href: "/teklif-al" }])} />
    </>
  );
}
