import { ArrowRight, BadgeCheck, Factory } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HeroSlider } from "./HeroSlider";
import { QuickStats } from "./QuickStats";
import { QuickActions } from "./QuickActions";
import { getHome } from "@/lib/content/home";

/** "Aş'a *Lezzet* Katıyoruz." → yıldız içindeki kelime italik ve açık renk. */
function HeroTitle({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <span key={index} className="text-brand-200 font-normal italic">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * Stitch: tam genişlikte koyu banner, üstte içerik katmanı, altında
 * ince hızlı istatistik şeridi.
 */
export async function Hero() {
  const { hero } = await getHome();
  return (
    <section className="bg-cream-deep lg:bg-inverse relative w-full overflow-hidden text-white">
      {/* Mobil ve tablette slider, header'ın altında yuvarlak köşeli bir
          uygulama kartı; masaüstünde tam genişlikte koyu banner. */}
      <div className="bg-inverse relative w-full overflow-hidden max-lg:mx-auto max-lg:mt-[76px] max-lg:aspect-[16/10] max-lg:w-[calc(100%-2rem)] max-lg:rounded-3xl max-lg:shadow-lg sm:max-lg:aspect-[16/9] lg:flex lg:min-h-[640px] lg:items-center">
        <HeroSlider slides={hero.slides} />

        {/* Okunabilirlik gradyanları — yalnız masaüstünde; mobil ve tablette
            hero yalnızca görselden oluşur. Görselin sol kenarı zaten maskeyle
            eridiği için hafif tutulur; görsel karartılmaz. */}
        <div
          aria-hidden
          className="from-inverse lg:via-inverse/40 absolute inset-0 hidden bg-gradient-to-r to-transparent lg:block lg:w-1/2"
        />
        <div
          aria-hidden
          className="from-inverse/60 absolute inset-0 hidden bg-gradient-to-t via-transparent to-transparent lg:block"
        />

        {/* Mobil ve tablette metin gizli (başlık yalnız ekran okuyucuda kalır). */}
        <div className="relative z-10 mx-auto max-lg:sr-only w-full max-w-6xl px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
          <div className="flex max-w-2xl flex-col gap-6">
            <p className="hidden w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 shadow-lg backdrop-blur-md lg:inline-flex">
              <BadgeCheck
                className="text-sage-300 size-4 shrink-0"
                aria-hidden
              />
              {hero.badge}
            </p>

            <h1 className="font-display text-4xl leading-tight tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-[56px] lg:leading-[68px]">
              <HeroTitle text={hero.title} />
            </h1>

            <p className="hidden max-w-xl text-base leading-relaxed text-white/85 drop-shadow-sm sm:text-lg lg:block">
              {hero.lead}
            </p>

            <div className="hidden flex-wrap items-center gap-4 pt-1 lg:flex">
              <ButtonLink href="/teklif-al" size="lg">
                Teklif Alın
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </ButtonLink>
              <ButtonLink
                href="/hakkimizda"
                size="lg"
                className="border border-white/20 bg-white/15 text-white shadow-md backdrop-blur-md hover:-translate-y-0.5 hover:bg-white/25"
              >
                <Factory className="text-sage-300 size-4" aria-hidden />
                Üretim Tesisimizi Keşfedin
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <QuickActions />
      <QuickStats />
    </section>
  );
}
