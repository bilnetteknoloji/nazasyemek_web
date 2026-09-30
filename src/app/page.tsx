import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { SectorStrip } from "@/components/sections/SectorStrip";
import { WhyUs } from "@/components/sections/WhyUs";
import { ProductionChain } from "@/components/sections/ProductionChain";
import { CapacityStats } from "@/components/sections/CapacityStats";
import { FeaturedMenu } from "@/components/sections/FeaturedMenu";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { CertificateStrip } from "@/components/sections/CertificateStrip";
import { QuickQuote } from "@/components/sections/QuickQuote";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { StackFooterFill, StackLayer, type StackTone } from "@/components/ui/StackLayer";
import { faqJsonLd } from "@/lib/jsonld";
import { faqs } from "@/data/faq";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Bölüm sırası Stitch tasarımından ("NAZ-AŞ | Ana Sayfa") alındı:
 * hero → sektörler → avantajlar → üretim zinciri → kapasite → günün menüsü
 * → … → hızlı ön hesaplama → CTA.
 * Aradaki hizmetler/galeri/belgeler/SSS bölümleri tasarımda yok; sitenin
 * kendi alt sayfalarına köprü oldukları için korundu.
 */
export default function Home() {
  // Her bölüm bir üsttekinin altından kayarak çıkar (StackLayer). Açık
  // bölümler beyaz / kirli beyaz dönüşümlü; koyu bölümler ("own") kendi zemininde.
  // Sektör şeridi hero ile aynı katmanda: ayrı katman olunca yüklemede hero'nun
  // altında gizli kalıyordu.
  const sections: { key: string; tone: StackTone; node: React.ReactNode }[] = [
    {
      key: "hero",
      tone: "own",
      node: (
        <>
          <Hero />
          <SectorStrip />
        </>
      ),
    },
    { key: "why", tone: "own", node: <WhyUs /> },
    { key: "chain", tone: "off", node: <ProductionChain /> },
    { key: "capacity", tone: "white", node: <CapacityStats /> },
    { key: "menu", tone: "off", node: <FeaturedMenu /> },
    { key: "services", tone: "white", node: <ServicesGrid limit={6} withCta /> },
    { key: "about", tone: "off", node: <AboutTeaser /> },
    { key: "gallery", tone: "white", node: <GalleryPreview /> },
    { key: "certificates", tone: "own", node: <CertificateStrip /> },
    { key: "quote", tone: "off", node: <QuickQuote /> },
    { key: "testimonials", tone: "white", node: <TestimonialsSection /> },
    { key: "faq", tone: "off", node: <FaqSection limit={6} /> },
    { key: "cta", tone: "white", node: <CtaBand /> },
  ];

  return (
    <>
      <div className="relative isolate">
        {sections.map(({ key, tone, node }, index) => (
          <StackLayer
            key={key}
            tone={tone}
            depth={sections.length - index}
            shift={index > 0}
          >
            {node}
          </StackLayer>
        ))}
        <StackFooterFill />
      </div>
      <JsonLd data={faqJsonLd(faqs.slice(0, 6))} />
    </>
  );
}
