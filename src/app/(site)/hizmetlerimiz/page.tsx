import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Process } from "@/components/sections/Process";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const heroPhoto = { src: "/gorseller/bg/menubg.webp" };

export const metadata: Metadata = pageMeta({
  title: "Toplu Yemek Hizmetleri: Fabrika, Okul, Kumanya",
  description: "İstanbul'da fabrika ve işyeri yemeği, okul-üniversite menüleri, kumanya, davet ve organizasyon yemeği ile yerinde mutfak işletmeciliği. Ücretsiz teklif alın.",
  path: "/hizmetlerimiz",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        photo={heroPhoto}
        tone="dark"
        eyebrow="Hizmetlerimiz"
        title="Kurumunuzun düzenine göre kurgulanan öğün hizmetleri"
        description="Öğün sayısı, vardiya planı ve mekân koşullarınıza göre farklı hizmet modelleri sunuyoruz. Tümü aynı üretim, hijyen ve raporlama standardıyla yürütülür."
        crumbs={[{ name: "Hizmetlerimiz", href: "/hizmetlerimiz" }]}
      />
      <ServicesGrid />
      <Process />
      <FaqSection limit={5} />
      <CtaBand />
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Hizmetlerimiz", href: "/hizmetlerimiz" }])}
      />
    </>
  );
}
