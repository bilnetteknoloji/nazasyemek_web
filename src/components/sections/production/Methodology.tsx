import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { methodology } from "@/data/production";

/** Stitch Üretim bölüm 2: 5 aşamalı üretim metodolojisi. */
export function Methodology() {
  return (
    <Section id="surec" className="bg-cream">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Titiz Operasyonel Döngü"
          title="5 Aşamalı Üretim Metodolojimiz"
          description="Her tabakta aynı lezzet, her lokmada mutlak güvenlik için hammaddeden masaya kadar ödün vermeyen bir yaklaşım."
          className="lg:max-w-2xl"
        />
        <Reveal delay={0.1}>
          <span className="bg-sage-100 text-sage-700 inline-block rounded-full px-4 py-2 text-xs font-semibold">
            Kesintisiz 72 saat izlenebilirlik
          </span>
        </Reveal>
      </div>

      <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {methodology.map((stage, index) => (
          <Reveal
            as="li"
            key={stage.step}
            delay={index * 0.07}
            className="border-line/70 shadow-soft relative flex flex-col rounded-3xl border bg-white p-6"
          >
            <span className="bg-brand-800 text-cream font-display absolute -top-4 left-6 flex size-9 items-center justify-center rounded-full text-sm">
              {stage.step}
            </span>

            <span className="bg-container text-brand-800 mt-4 flex size-12 items-center justify-center rounded-2xl">
              <stage.icon className="size-5" aria-hidden />
            </span>

            <h3 className="text-ink mt-5 text-base font-bold">{stage.title}</h3>
            <p className="text-subtle mt-3 flex-1 text-sm leading-relaxed">{stage.text}</p>

            <p className="border-line mt-5 border-t pt-4 text-xs">
              <span className="text-muted block">{stage.controlLabel}</span>
              <span className="text-sage-700 mt-0.5 block font-semibold">
                {stage.controlValue}
              </span>
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
