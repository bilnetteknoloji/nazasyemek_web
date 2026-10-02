import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/data/services";

export function Process() {
  return (
    <Section className="bg-cream-deep/60">
      <SectionHeading
        eyebrow="Nasıl çalışırız"
        title="İlk görüşmeden düzenli servise beş adım"
        description="Süreci baştan netleştiriyor, deneme servisiyle beklentileri birlikte doğruluyoruz."
        align="center"
      />

      <ol className="mobile-rail mt-14 md:grid gap-6 [--rail-pt:1.25rem] [--rail-item:70%] sm:grid-cols-2 lg:grid-cols-5">
        {processSteps.map((step, index) => (
          <Reveal
            as="li"
            key={step.title}
            delay={index * 0.08}
            className="border-line shadow-soft relative rounded-3xl border bg-white p-6"
          >
            <span className="bg-brand-800 text-cream font-display absolute -top-4 left-6 flex size-9 items-center justify-center rounded-full text-sm">
              {index + 1}
            </span>
            <h3 className="text-brand-900 mt-4 text-base font-semibold">
              {step.title}
            </h3>
            <p className="text-muted mt-3 text-sm leading-relaxed">{step.text}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
