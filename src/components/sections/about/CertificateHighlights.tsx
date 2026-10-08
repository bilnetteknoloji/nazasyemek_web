import { BadgeCheck, FileText } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getCertificates } from "@/lib/content/media";

/**
 * Stitch Hakkımızda bölüm 5: sertifika kartları.
 * İçerik uydurulmadı — PDF'lerden okunan gerçek belge listesi kullanılıyor.
 */
export async function CertificateHighlights({ limit = 6 }: { limit?: number }) {
  const certificates = await getCertificates();
  return (
    <Section className="bg-cream">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Uluslararası Akreditasyonlar"
          title="Sertifikalarımız & Kalite Güvencemiz"
          className="lg:max-w-xl"
        />
        <Reveal delay={0.1}>
          <ButtonLink href="/belgelerimiz" variant="outline">
            <FileText className="size-4" aria-hidden />
            Tüm sertifikalarımızı inceleyin
          </ButtonLink>
        </Reveal>
      </div>

      <ul className="mobile-rail mt-12 md:grid gap-5 [--rail-item:70%] sm:grid-cols-2 lg:grid-cols-3">
        {certificates.slice(0, limit).map((cert, index) => (
          <Reveal
            as="li"
            key={cert.id}
            delay={(index % 3) * 0.07}
            className="border-line/70 shadow-soft hover:shadow-lift rounded-3xl border bg-white p-6 transition-shadow duration-500"
          >
            <span className="bg-sage-100 text-sage-700 flex size-12 items-center justify-center rounded-2xl">
              <BadgeCheck className="size-5" aria-hidden />
            </span>
            <p className="text-muted mt-5 text-xs font-semibold tracking-wider uppercase">
              {cert.subtitle}
            </p>
            <h3 className="text-ink mt-1 text-lg font-bold">{cert.title}</h3>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
