import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getGallery } from "@/lib/content/media";
import { GalleryGrid } from "./GalleryGrid";

export async function GalleryPreview() {
  const gallery = await getGallery();
  return (
    <Section>
      <SectionHeading
        eyebrow="Galeri"
        title="Mutfaktan servise, işimizi görün"
        description="Üretim alanımızdan, kumanya hazırlığından ve kurumsal organizasyonlarımızdan kareler."
        align="center"
      />

      <div className="mt-12">
        <GalleryGrid
          items={gallery}
          limit={8}
          withFilters={false}
          groups={["tesis", "mutfak", "kumanya", "servis"]}
        />
      </div>

      <Reveal className="mt-12 text-center">
        <ButtonLink href="/galeri" variant="outline" size="lg">
          Tüm galeriye gidin
        </ButtonLink>
      </Reveal>
    </Section>
  );
}
