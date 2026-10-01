import { BadgeCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { hygieneStandards, productionLicense } from "@/data/production";

/** Stitch Üretim bölüm 4: hijyen ve kalite standartları. */
export function HygieneStandards() {
  return (
    <Section className="bg-cream">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Laboratuvar Güvencesi"
          title="Hijyen ve Kalite Standartlarımız"
          description="Üretim tesisimizde biyolojik güvenlik ve lezzet şansa bırakılmaz; süreçler düzenli denetimlerle izlenir."
          className="lg:max-w-2xl"
        />

        <Reveal
          delay={0.1}
          className="border-line shadow-soft rounded-2xl border bg-white p-5 lg:max-w-xs"
        >
          <p className="text-brand-800 flex items-center gap-2 text-sm font-bold">
            <BadgeCheck className="text-sage-600 size-5 shrink-0" aria-hidden />
            {productionLicense.authority}
          </p>
          <p className="text-muted mt-2 text-xs leading-relaxed">
            {productionLicense.text}
          </p>
        </Reveal>
      </div>

      <ul className="mobile-rail mt-14 md:grid gap-6 sm:grid-cols-2">
        {hygieneStandards.map((item, index) => (
          <Reveal
            as="li"
            key={item.title}
            delay={(index % 2) * 0.08}
            className="border-line/70 shadow-soft flex gap-5 rounded-3xl border bg-white p-6"
          >
            <span className="bg-sage-100 text-sage-700 flex size-12 shrink-0 items-center justify-center rounded-2xl">
              <item.icon className="size-5" aria-hidden />
            </span>
            <span>
              <span className="text-ink block font-bold">{item.title}</span>
              <span className="text-subtle mt-2 block text-sm leading-relaxed">
                {item.text}
              </span>
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
