import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { aboutFigures } from "@/data/about";

/** Stitch Hakkımızda bölüm 2: terracotta zeminde dört rakam. */
export function AboutFigures() {
  return (
    <section className="bg-brand-600 w-full py-14 text-white sm:py-16">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-9 sm:gap-10 lg:grid-cols-4">
          {aboutFigures.map((figure, index) => (
            <Reveal key={figure.label} delay={index * 0.07}>
              <figure.icon className="text-brand-200 size-7" aria-hidden />
              <dt className="sr-only">{figure.label}</dt>
              <dd>
                <span className="font-display mt-4 block text-4xl leading-none font-bold sm:text-5xl">
                  {figure.value}
                  {figure.unit ? (
                    <span className="text-brand-200 ml-0.5 text-2xl">{figure.unit}</span>
                  ) : null}
                </span>
                <span className="mt-3 block font-semibold">{figure.label}</span>
                <span className="mt-1 block text-sm text-white/70">{figure.note}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
