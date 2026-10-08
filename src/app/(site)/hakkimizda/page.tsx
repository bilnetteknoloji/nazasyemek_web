import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutFigures } from "@/components/sections/about/AboutFigures";
import { Philosophy } from "@/components/sections/about/Philosophy";
import { TeamSection } from "@/components/sections/about/TeamSection";
import { CertificateHighlights } from "@/components/sections/about/CertificateHighlights";
import { TastingCta } from "@/components/sections/about/TastingCta";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = pageMeta({
  title: "Hakkımızda — Bağcılar'da Toplu Yemek Üretimi",
  description: "NAZ-AŞ Yemek, Bağcılar Mahmutbey'deki belgeli mutfağında fabrika, işyeri ve okullara günlük toplu yemek hizmeti veren İstanbul merkezli catering firmasıdır.",
  path: "/hakkimizda",
});

/** Bölüm sırası Stitch "Hakkımızda | NAZ-AŞ Toplu Yemek Hizmetleri" ekranından. */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutFigures />
      <Philosophy />
      <TeamSection />
      <CertificateHighlights />
      <TastingCta />
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Hakkımızda", href: "/hakkimizda" }])}
      />
    </>
  );
}
