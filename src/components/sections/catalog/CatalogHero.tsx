import { Img as Image } from "@/components/ui/Img";
import { BookOpen, UtensilsCrossed } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HeroBackdrop } from "@/components/layout/HeroBackdrop";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { catalogHero } from "@/data/catalog";
import { heroShell } from "@/lib/hero-shell";
import { cn } from "@/lib/cn";

/** Stitch Katalog bölüm 1. */
export function CatalogHero() {
  return (
    <section
      className={cn(
        heroShell,
        "bg-white w-full overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24",
      )}
    >
      <HeroBackdrop photo={catalogHero.photo} opacity="opacity-[0.10]" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="bg-brand-800/10 text-brand-800 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
                <BookOpen className="size-4" aria-hidden />
                {catalogHero.badge}
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="font-display text-ink mt-6 text-4xl leading-[1.1] font-bold sm:text-5xl">
                {catalogHero.title}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-subtle mt-6 text-base leading-relaxed sm:text-lg">
                {catalogHero.description}
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-8">
              <ButtonLink href="/teklif-al" size="lg">
                <UtensilsCrossed className="size-4" aria-hidden />
                Ücretsiz numune isteyin
              </ButtonLink>
            </Reveal>

            <dl className="border-line mt-9 grid grid-cols-3 gap-4 border-t pt-6">
              {catalogHero.figures.map((figure, index) => (
                <Reveal key={figure.label} delay={0.26 + index * 0.05}>
                  <dt className="sr-only">{figure.label}</dt>
                  <dd>
                    <span className="font-display text-brand-800 block text-2xl font-bold sm:text-3xl">
                      {figure.value}
                    </span>
                    <span className="text-muted mt-1 block text-xs">
                      {figure.label}
                    </span>
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>

          <Reveal delay={0.1} className="relative">
            <div className="shadow-lift overflow-hidden rounded-[2rem]">
              <Image
                src={catalogHero.photo.src}
                alt={catalogHero.photo.alt}
                width={catalogHero.photo.width}
                height={catalogHero.photo.height}
                priority
                sizes="(max-width: 1024px) 92vw, 560px"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="shadow-lift border-line mt-4 rounded-2xl border bg-white/95 p-5 backdrop-blur lg:absolute lg:-bottom-8 lg:left-8 lg:mt-0 lg:max-w-xs">
              <p className="text-ink font-bold">{catalogHero.captionTitle}</p>
              <p className="text-muted mt-2 text-xs leading-relaxed">
                {catalogHero.captionText}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
