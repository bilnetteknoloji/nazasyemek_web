import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { packagingStandards } from "@/data/catalog";

/** Stitch Katalog bölüm 4: ambalaj ve servis standartları. */
export function PackagingStandards() {
  return (
    <Section className="bg-cream border-line border-y">
      <SectionHeading
        eyebrow="Lojistik & Sunum Teknolojileri"
        title="Ambalaj ve Servis Standartlarımız"
        description="Yemeklerin mutfaktan çıktığı sıcaklık ve tazelikte masaya ulaşması için endüstriyel ambalaj çözümleri kullanıyoruz."
        align="center"
      />

      <ul className="mt-14 grid gap-6 lg:grid-cols-3">
        {packagingStandards.map((item, index) => (
          <Reveal
            as="li"
            key={item.title}
            delay={index * 0.08}
            className="border-line/70 shadow-soft flex flex-col rounded-3xl border bg-white p-7"
          >
            <span className="bg-brand-800/10 text-brand-800 flex size-14 items-center justify-center rounded-2xl">
              <item.icon className="size-6" aria-hidden />
            </span>
            <h3 className="text-ink mt-6 text-lg font-bold">{item.title}</h3>
            <p className="text-subtle mt-3 flex-1 text-sm leading-relaxed">{item.text}</p>

            <ul className="border-line mt-5 space-y-2 border-t pt-4">
              {item.points.map((point) => (
                <li key={point} className="text-muted flex gap-2 text-xs">
                  <Check className="text-sage-600 mt-0.5 size-3.5 shrink-0" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
