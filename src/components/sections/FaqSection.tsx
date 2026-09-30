import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { faqs } from "@/data/faq";

export function FaqSection({ limit }: { limit?: number }) {
  return (
    <Section id="sss">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16">
        <SectionHeading
          eyebrow="Sık sorulan sorular"
          title="Merak edilenler"
          description="Aradığınız yanıtı bulamadıysanız bizi arayın; kurumunuza özel süreci birlikte planlayalım."
        />
        <Reveal delay={0.1}>
          <Accordion items={limit ? faqs.slice(0, limit) : faqs} />
        </Reveal>
      </div>
    </Section>
  );
}
