import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/data/services";

export function ServicesGrid({
  limit,
  withCta = false,
}: {
  limit?: number;
  withCta?: boolean;
}) {
  const list = limit ? services.slice(0, limit) : services;

  return (
    <Section id="hizmetler">
      <SectionHeading
        eyebrow="Hizmetlerimiz"
        title="Her kuruma göre kurgulanan öğün çözümleri"
        description="Vardiya düzeninize, mekânınıza ve öğün sayınıza göre planlanan hizmet modelleri. Tümü aynı üretim ve hijyen standardıyla yürütülür."
      />

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((service, index) => (
          <Reveal
            as="li"
            key={service.slug}
            delay={(index % 3) * 0.08}
            className="group border-line shadow-soft hover:shadow-lift relative overflow-hidden rounded-3xl border bg-white transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
          >
            <Link href={`/hizmetlerimiz/${service.slug}`} className="block">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="from-brand-950/70 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
                />
                <span className="text-brand-800 absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-full bg-white/90 backdrop-blur">
                  <service.icon className="size-5" aria-hidden />
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-brand-900 flex items-start justify-between gap-3 text-lg font-semibold">
                  {service.title}
                  <ArrowUpRight
                    className="text-accent-600 mt-1 size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </h3>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {service.short}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>

      {withCta ? (
        <Reveal className="mt-12 text-center">
          <ButtonLink href="/hizmetlerimiz" variant="outline" size="lg">
            Tüm hizmetleri inceleyin
          </ButtonLink>
        </Reveal>
      ) : null}
    </Section>
  );
}
