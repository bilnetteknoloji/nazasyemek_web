import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalBody } from "@/components/layout/LegalPage";
import { cookieBlocks, legalUpdatedAt } from "@/data/legal";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "NAZ-AŞ Yemek internet sitesi çerez politikası.",
  alternates: { canonical: "/cerez-politikasi" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Yasal"
        title="Çerez Politikası"
        crumbs={[{ name: "Çerez Politikası", href: "/cerez-politikasi" }]}
      />
      <LegalBody blocks={cookieBlocks} updatedAt={legalUpdatedAt} />
    </>
  );
}
