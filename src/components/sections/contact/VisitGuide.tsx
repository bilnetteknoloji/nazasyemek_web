import { Navigation } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { visitInfo } from "@/data/contact";
import { site } from "@/data/site";

const mapQuery = encodeURIComponent(
  `${site.address.street}, ${site.address.district}, ${site.address.city}`,
);

/** Stitch İletişim bölüm 4: ulaşım, ziyaret saatleri ve harita. */
export function VisitGuide() {
  return (
    <Section className="bg-container/60">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow={visitInfo.eyebrow}
          title={visitInfo.title}
          description={visitInfo.description}
          className="lg:max-w-2xl"
        />
        <Reveal delay={0.1}>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-600 shadow-glow hover:bg-accent-500 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            <Navigation className="size-4" aria-hidden />
            Yol tarifi alın
          </a>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <div className="space-y-6">
          <Reveal className="border-line/70 shadow-soft rounded-3xl border bg-white p-6">
            <span className="bg-brand-800/10 text-brand-800 flex size-11 items-center justify-center rounded-2xl">
              <visitInfo.addressIcon className="size-5" aria-hidden />
            </span>
            <p className="text-muted mt-4 text-xs font-semibold tracking-wider uppercase">
              Adres
            </p>
            <p className="text-ink mt-1 font-semibold">{site.address.full}</p>
          </Reveal>

          <Reveal
            delay={0.08}
            className="border-line/70 shadow-soft rounded-3xl border bg-white p-6"
          >
            <p className="text-muted text-xs font-semibold tracking-wider uppercase">
              Ziyaret & Kabul Saatleri
            </p>
            <dl className="divide-line mt-3 divide-y">
              {visitInfo.hours.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5">
                  <dt className="text-subtle text-sm">{row.label}</dt>
                  <dd className="text-ink text-sm font-semibold">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal
            delay={0.16}
            className="border-line/70 bg-sage-100/50 rounded-3xl border p-6"
          >
            <p className="text-sage-700 flex items-center gap-2 text-sm font-bold">
              <visitInfo.note.icon className="size-5 shrink-0" aria-hidden />
              {visitInfo.note.title}
            </p>
            <p className="text-subtle mt-2 text-sm leading-relaxed">
              {visitInfo.note.text}
            </p>
          </Reveal>
        </div>

        <Reveal
          delay={0.1}
          className="shadow-lift border-line min-h-96 overflow-hidden rounded-[2rem] border"
        >
          <iframe
            title={`${site.legalName} konumu`}
            src={`https://www.google.com/maps?q=${mapQuery}&hl=tr&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-96 w-full border-0"
          />
        </Reveal>
      </div>
    </Section>
  );
}
