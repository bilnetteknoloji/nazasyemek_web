import type { Metadata } from "next";
import { getMenuWeeks } from "@/lib/content/menu";
import { CatalogHero } from "@/components/sections/catalog/CatalogHero";
import { PackagingStandards } from "@/components/sections/catalog/PackagingStandards";
import { DietitianSupport } from "@/components/sections/catalog/DietitianSupport";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MenuWeeks } from "@/components/sections/MenuWeeks";
import { FeaturedMenu } from "@/components/sections/FeaturedMenu";
import { CtaBand } from "@/components/sections/CtaBand";
import { UsageNote } from "@/components/sections/UsageNote";
import { mealUsageNote } from "@/data/notes";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Menü & Katalog",
  description:
    "NAZ-AŞ Yemek dört haftalık örnek tabldot menüsü, ambalaj ve servis standartları ile kurumsal diyetisyen desteği.",
  alternates: { canonical: "/menu" },
};

/** Bölüm sırası Stitch "Ürün & Menü Kataloğu | NAZ-AŞ" ekranından. */
export default async function MenuPage() {
  const weeks = await getMenuWeeks();
  return (
    <>
      <CatalogHero />

      <Section className="bg-cream-deep">
        <SectionHeading
          eyebrow="Örnek Kalori & Porsiyon Kartları"
          title="Dört Haftalık Örnek Tabldot Menümüz"
          description="Menüler kalori ve besin dengesi gözetilerek hazırlanır; kurumunuzun talepleri, dinî ve tıbbi kısıtlar doğrultusunda birlikte netleştirilir."
          align="center"
        />
        <div className="mt-12">
          <MenuWeeks weeks={weeks} />
        </div>

        <Reveal className="border-line text-muted mt-12 rounded-2xl border border-dashed p-5 text-sm">
          Bu sayfadaki menü, hizmet kapsamını göstermek için hazırlanmış örnek bir
          plandır. Kurumunuza özel menü, ihtiyaç analizi sonrasında birlikte
          oluşturulur.
        </Reveal>

        <div className="mt-16">
          <UsageNote note={mealUsageNote} />
        </div>
      </Section>

      <FeaturedMenu />
      <PackagingStandards />
      <DietitianSupport />
      <CtaBand />

      <JsonLd data={breadcrumbJsonLd([{ name: "Menü & Katalog", href: "/menu" }])} />
    </>
  );
}
