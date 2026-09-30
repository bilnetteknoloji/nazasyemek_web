import { Img as Image } from "@/components/ui/Img";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/data/media";

const highlights = [
  "ISO 22000 ve HACCP kurallarına göre üretim",
  "Her öğünden 72 saat şahit numune",
  "Diyetisyen desteğiyle hazırlanan aylık menüler",
  "Sıcaklık takipli, planlı teslimat",
];

const kitchen = photos.find((photo) => photo.src.endsWith("nazas3.webp")) ?? photos[0];
const team = photos.find((photo) => photo.src.endsWith("nazas9.webp")) ?? photos[1];

export function AboutTeaser() {
  return (
    <Section className="bg-cream-deep/60">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="shadow-lift overflow-hidden rounded-[2rem]">
            <Image
              src={kitchen.src}
              alt={kitchen.alt}
              width={kitchen.width}
              height={kitchen.height}
              sizes="(max-width: 1024px) 92vw, 520px"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/4]"
            />
          </div>
          <div className="shadow-lift absolute right-0 -bottom-8 hidden w-48 overflow-hidden rounded-2xl border-4 border-white lg:block">
            <Image
              src={team.src}
              alt={team.alt}
              width={team.width}
              height={team.height}
              sizes="192px"
              className="h-36 w-full object-cover"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="bg-brand-800/10 text-brand-800 inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-wider uppercase">
              Hakkımızda
            </p>
            <h2 className="font-display text-brand-900 mt-4 text-3xl leading-[1.15] sm:text-4xl">
              Mutfağımızda hazırlanan her öğün, belgeli bir sürecin sonucu
            </h2>
            <p className="text-muted mt-5 leading-relaxed">
              Bağcılar&apos;daki endüstriyel mutfağımızda, gıda güvenliği yönetim
              sistemimize uygun olarak günlük üretim yapıyoruz. Hammadde kabulünden
              servise kadar her aşama kayıt altında tutulur; sıcaklık, hijyen ve
              porsiyon kontrolleri düzenli olarak yapılır.
            </p>
          </Reveal>

          <ul className="mt-8 space-y-4">
            {highlights.map((item, index) => (
              <Reveal as="li" key={item} delay={index * 0.06} className="flex gap-3">
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
