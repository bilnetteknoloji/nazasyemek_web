import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutFigures } from "@/components/sections/about/AboutFigures";
import { Philosophy } from "@/components/sections/about/Philosophy";
import { TeamSection } from "@/components/sections/about/TeamSection";
import { CertificateHighlights } from "@/components/sections/about/CertificateHighlights";
import { TastingCta } from "@/components/sections/about/TastingCta";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "NAZ-AŞ Yemek; Bağcılar'daki belgeli mutfağında fabrika, işyeri, okul ve kurumlara toplu yemek hizmeti veren bir catering firmasıdır.",
  alternates: { canonical: "/hakkimizda" },
};

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
