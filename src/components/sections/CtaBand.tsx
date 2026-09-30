import { ArrowRight, Phone } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/data/site";

export function CtaBand() {
  return (
    <Section className="pb-24">
      <Reveal className="from-brand-800 via-brand-600 to-accent-500 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br px-8 py-14 text-center sm:px-14 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_0%,rgb(255_255_255/0.12),transparent_70%)]"
        />
        <div className="relative">
          <h2 className="font-display text-cream mx-auto max-w-2xl text-3xl leading-[1.15] sm:text-4xl">
            Kurumunuz için örnek menü ve fiyat teklifi hazırlayalım
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/80">
            Öğün sayınızı ve vardiya düzeninizi paylaşın; bir iş günü içinde
            dönüş yapalım, dilerseniz deneme servisi planlayalım.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/teklif-al" variant="light" size="lg">
              Teklif Alın
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </ButtonLink>
            <a
              href={site.phoneHref}
              className="border-cream/25 text-cream hover:border-cream/50 inline-flex items-center justify-center gap-2 rounded-full border px-8 py-4 text-base font-semibold transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:bg-white/5"
            >
              <Phone className="size-4" aria-hidden />
              {site.phone}
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
