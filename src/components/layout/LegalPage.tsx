import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export type LegalBlock = { heading: string; paragraphs: string[]; list?: string[] };

/** KVKK / gizlilik / çerez metinleri için ortak okuma düzeni. */
export function LegalBody({
  blocks,
  updatedAt,
}: {
  blocks: LegalBlock[];
  updatedAt: string;
}) {
  return (
    <Section className="pt-14 sm:pt-20">
      <div className="max-w-3xl">
        <Reveal>
          <p className="text-muted text-sm">Son güncelleme: {updatedAt}</p>
        </Reveal>

        {blocks.map((block, index) => (
          <Reveal key={block.heading} delay={Math.min(index * 0.04, 0.2)} className="mt-10">
            <h2 className="font-display text-brand-900 text-xl sm:text-2xl">
              {block.heading}
            </h2>
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-muted mt-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
            {block.list ? (
              <ul className="text-muted mt-4 space-y-2">
                {block.list.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="bg-accent-500 mt-2.5 size-1.5 shrink-0 rounded-full" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
