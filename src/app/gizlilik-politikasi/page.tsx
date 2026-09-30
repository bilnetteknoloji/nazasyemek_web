import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalBody } from "@/components/layout/LegalPage";
import { privacyBlocks, legalUpdatedAt } from "@/data/legal";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "NAZ-AŞ Yemek internet sitesi gizlilik politikası.",
  alternates: { canonical: "/gizlilik-politikasi" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Yasal"
        title="Gizlilik Politikası"
        crumbs={[{ name: "Gizlilik Politikası", href: "/gizlilik-politikasi" }]}
      />
      <LegalBody blocks={privacyBlocks} updatedAt={legalUpdatedAt} />
    </>
  );
}
