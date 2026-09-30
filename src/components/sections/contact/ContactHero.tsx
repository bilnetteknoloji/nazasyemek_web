import { Container } from "@/components/ui/Container";
import { HeroBackdrop } from "@/components/layout/HeroBackdrop";
import { Reveal } from "@/components/ui/Reveal";
import { contactHero } from "@/data/contact";
import { heroShell } from "@/lib/hero-shell";
import { cn } from "@/lib/cn";

/** Stitch İletişim bölüm 1. */
export function ContactHero() {
  return (
    <section
      className={cn(
        heroShell,
        "bg-white w-full overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20",
      )}
    >
      <HeroBackdrop photo={contactHero.photo} />
      <Container>
        <div className="max-w-3xl">
          <Reveal>
            <p className="bg-brand-800/10 text-brand-800 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
              <contactHero.icon className="size-4" aria-hidden />
              {contactHero.badge}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="font-display text-ink mt-6 text-4xl leading-[1.1] font-bold sm:text-5xl">
              {contactHero.title}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-subtle mt-6 text-base leading-relaxed sm:text-lg">
              {contactHero.description}
            </p>
          </Reveal>

          <ul className="mt-8 flex flex-wrap gap-3">
            {contactHero.chips.map((chip, index) => (
              <Reveal
                as="li"
                key={chip.label}
                delay={0.18 + index * 0.06}
                className="border-line text-subtle shadow-soft flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm"
              >
                <chip.icon
                  className="text-brand-800 size-4 shrink-0"
                  aria-hidden
                />
                {chip.label}
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
