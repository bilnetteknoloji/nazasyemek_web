import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalBody } from "@/components/layout/LegalPage";
import { kvkkBlocks, legalUpdatedAt } from "@/data/legal";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "NAZ-AŞ Yemek kişisel verilerin korunması kanunu aydınlatma metni.",
  alternates: { canonical: "/kvkk" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Yasal"
        title="KVKK Aydınlatma Metni"
        crumbs={[{ name: "KVKK Aydınlatma Metni", href: "/kvkk" }]}
      />
      <LegalBody blocks={kvkkBlocks} updatedAt={legalUpdatedAt} />
    </>
  );
}
