import { Img as Image } from "@/components/ui/Img";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { productionChain } from "@/data/home";

/** Stitch: "Tarladan Sofraya 3 Aşamalı Üretim Süreci". */
export function ProductionChain() {
  return (
    <Section className="bg-container/60 relative overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Mükemmeliyet Zinciri"
          title="Tarladan Sofraya 3 Aşamalı Üretim Süreci"
          className="lg:max-w-xl"
        />
        <Reveal delay={0.1}>
          <p className="text-subtle max-w-sm text-sm leading-relaxed">
            Her porsiyon yemeğin ardında tavizsiz soğuk zincir koruması ve
            sıcaklık takip kayıtları bulunur.
          </p>
        </Reveal>
      </div>

      <ol className="mobile-rail mt-14 md:grid gap-6 md:grid-cols-3">
        {productionChain.map((stage, index) => (
          <Reveal
            as="li"
            key={stage.step}
            delay={index * 0.08}
            className="border-line/70 shadow-soft flex flex-col overflow-hidden rounded-3xl border bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-6 pt-6">
              <span className="font-display text-brand-200 text-4xl leading-none">
                {stage.step}
              </span>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
                  stage.tagTone === "sage"
                    ? "bg-sage-100 text-sage-700"
                    : "bg-brand-100 text-brand-800",
                )}
              >
                {stage.tag}
              </span>
            </div>

            <div className="mt-5 px-6">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={stage.photo.src}
                  alt={stage.photo.alt}
                  width={stage.photo.width}
                  height={stage.photo.height}
                  sizes="(max-width: 768px) 92vw, 32vw"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-ink text-lg font-bold">{stage.title}</h3>
              <p className="text-subtle mt-3 flex-1 text-sm leading-relaxed">
                {stage.text}
              </p>
              <p className="border-line text-muted mt-5 flex items-center gap-2 border-t pt-4 text-xs">
                <stage.footnoteIcon className="text-sage-600 size-4 shrink-0" aria-hidden />
                {stage.footnote}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
