import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Img as Image } from "@/components/ui/Img";
import { Download, FileText } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { photos } from "@/data/media";
import { getCertificates } from "@/lib/content/media";
import { asset } from "@/lib/asset";

const heroPhoto =
  photos.find((photo) => photo.src.endsWith("nazas9.webp")) ?? photos[0];

export const metadata: Metadata = pageMeta({
  title: "Belgelerimiz — ISO 22000, ISO 9001 ve Helal",
  description: "ISO 9001, ISO 22000, ISO 45001, ISO 14001, Helal, GHP ve GMP dâhil kalite ve gıda güvenliği belgelerimiz. Belgeleri PDF olarak inceleyin.",
  path: "/belgelerimiz",
});

export default async function CertificatesPage() {
  const certificates = await getCertificates();
  return (
    <>
      <PageHero
        photo={heroPhoto}
        eyebrow="Belgelerimiz"
        title="Kalite ve gıda güvenliği belgelerimiz"
        description="Yönetim sistemlerimiz bağımsız belgelendirme kuruluşu tarafından denetlenmiş ve belgelendirilmiştir. Belgelerin tamamını PDF olarak inceleyebilirsiniz."
        crumbs={[{ name: "Belgelerimiz", href: "/belgelerimiz" }]}
      />

      <Section className="pt-14 sm:pt-20">
        <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {certificates.map((cert, index) => (
            <Reveal
              as="li"
              key={cert.id}
              delay={(index % 3) * 0.08}
              className="group border-line shadow-soft hover:shadow-lift flex flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-500 hover:-translate-y-1"
            >
              <a
                href={asset(cert.pdf)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col"
              >
                <div className="bg-cream-deep/70 relative aspect-[3/4] overflow-hidden">
                  {cert.thumb ? (
                    <Image
                      src={cert.thumb.src}
                      alt={`${cert.title} belgesi önizlemesi`}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                      className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                    />
                  ) : (
                    <span className="text-brand-300 flex h-full items-center justify-center">
                      <FileText className="size-12" aria-hidden />
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-brand-900 font-semibold">{cert.title}</h2>
                  <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
                    {cert.subtitle}
                  </p>
                  <span className="text-accent-600 mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                    <Download className="size-4" aria-hidden />
                    PDF olarak aç
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand />
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Belgelerimiz", href: "/belgelerimiz" }])}
      />
    </>
  );
}
