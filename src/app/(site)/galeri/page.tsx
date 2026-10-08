import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getGallery } from "@/lib/content/media";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { photos } from "@/data/media";

const heroPhoto =
  photos.find((photo) => photo.src.endsWith("nazas1.webp")) ?? photos[0];

export const metadata: Metadata = pageMeta({
  title: "Galeri — Mutfağımız ve Yemek Servisimiz",
  description: "NAZ-AŞ Yemek mutfağından, kumanya hazırlığından, yemekhane servisinden ve kurumsal organizasyonlardan fotoğraf ve videolar.",
  path: "/galeri",
});

export default async function GalleryPage() {
  const gallery = await getGallery();
  return (
    <>
      <PageHero
        photo={heroPhoto}
        eyebrow="Galeri"
        title="Mutfağımızdan ve sahadan kareler"
        description="Üretim tesisimiz, mutfağımız, kumanya hazırlığımız ve servis düzenimizden fotoğraf ve videolar."
        crumbs={[{ name: "Galeri", href: "/galeri" }]}
      />

      <Section className="pt-14 sm:pt-20">
        <GalleryGrid items={gallery} />
      </Section>

      <Section className="bg-cream-deep">
        <InstagramFeed />
      </Section>

      <CtaBand />
      <JsonLd data={breadcrumbJsonLd([{ name: "Galeri", href: "/galeri" }])} />
    </>
  );
}
