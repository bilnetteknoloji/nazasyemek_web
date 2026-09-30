import { Img as Image } from "@/components/ui/Img";
import { BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HeroBackdrop } from "@/components/layout/HeroBackdrop";
import { Reveal } from "@/components/ui/Reveal";
import { aboutHero } from "@/data/about";
import { heroShell } from "@/lib/hero-shell";
import { cn } from "@/lib/cn";

/** Stitch Hakkımızda bölüm 1: rozet + iki renkli başlık + yan görsel kartı. */
export function AboutHero() {
  return (
    <section
      className={cn(
        heroShell,
        "bg-white w-full overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24",
      )}
    >
      <HeroBackdrop photo={aboutHero.photo} opacity="opacity-[0.10]" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="bg-brand-800/10 text-brand-800 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
                <BadgeCheck className="size-4" aria-hidden />
                {aboutHero.badge}
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="font-display text-ink mt-6 text-4xl leading-[1.1] font-bold sm:text-5xl">
                {aboutHero.titleLead}{" "}
                <span className="text-brand-800">{aboutHero.titleAccent}</span>{" "}
                {aboutHero.titleTail}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-subtle mt-6 text-base leading-relaxed sm:text-lg">
                {aboutHero.description}
              </p>
            </Reveal>

            <ul className="mt-8 flex flex-wrap gap-3">
              {aboutHero.chips.map((chip, index) => (
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

          <Reveal delay={0.1} className="relative">
            <div className="shadow-lift overflow-hidden rounded-[2rem]">
              <Image
                src={aboutHero.photo.src}
                alt={aboutHero.photo.alt}
                width={aboutHero.photo.width}
                height={aboutHero.photo.height}
                priority
                sizes="(max-width: 1024px) 92vw, 560px"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <div className="shadow-lift border-line mt-4 rounded-2xl border bg-white/95 p-5 backdrop-blur lg:absolute lg:-bottom-8 lg:left-8 lg:mt-0 lg:max-w-xs">
              <p className="text-muted text-xs font-semibold tracking-wider uppercase">
                {aboutHero.captionEyebrow}
              </p>
              <p className="text-ink mt-1 font-bold">
                {aboutHero.captionTitle}
              </p>
              <p className="text-muted mt-2 text-xs leading-relaxed">
                {aboutHero.captionText}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
