import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { GalleryGrid } from "./GalleryGrid";

export function GalleryPreview() {
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
