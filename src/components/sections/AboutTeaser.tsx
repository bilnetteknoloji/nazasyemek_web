import { Img as Image } from "@/components/ui/Img";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getHome } from "@/lib/content/home";

export async function AboutTeaser() {
  const { about } = await getHome();
  return (
    <Section className="bg-cream-deep/60">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="shadow-lift overflow-hidden rounded-[2rem]">
            <Image
              src={about.photo}
              alt=""
              width={1600}
              height={1280}
              sizes="(max-width: 1024px) 92vw, 520px"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/4]"
            />
          </div>
          <div className="shadow-lift absolute right-0 -bottom-8 hidden w-48 overflow-hidden rounded-2xl border-4 border-white lg:block">
            <Image
              src={about.photoSmall}
              alt=""
              width={600}
              height={450}
              sizes="192px"
              className="h-36 w-full object-cover"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="bg-brand-800/10 text-brand-800 inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-wider uppercase">
              {about.eyebrow}
            </p>
            <h2 className="font-display text-brand-900 mt-4 text-3xl leading-[1.15] sm:text-4xl">
              {about.title}
            </h2>
            <p className="text-muted mt-5 leading-relaxed">
              {about.text}
            </p>
          </Reveal>

          <ul className="mt-8 space-y-4">
            {about.highlights.map((item, index) => (
              <Reveal as="li" key={index} delay={index * 0.06} className="flex gap-3">
                <CheckCircle2 className="text-accent-600 mt-0.5 size-5 shrink-0" aria-hidden />
                <span className="text-brand-800 text-sm sm:text-base">{item}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2} className="mt-9">
            <ButtonLink href="/hakkimizda" variant="outline" size="lg">
              Bizi daha yakından tanıyın
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
