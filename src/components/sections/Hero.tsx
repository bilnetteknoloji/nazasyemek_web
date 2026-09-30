import { ArrowRight, BadgeCheck, Factory } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HeroSlider } from "./HeroSlider";
import { QuickStats } from "./QuickStats";
import { heroBadge, heroSlides } from "@/data/home";

/**
 * Stitch: tam genişlikte koyu banner, üstte içerik katmanı, altında
 * ince hızlı istatistik şeridi.
 */
export function Hero() {
  return (
    <section className="bg-inverse relative w-full overflow-hidden text-white">
      <div className="relative flex min-h-[560px] w-full items-center overflow-hidden lg:min-h-[640px]">
        <HeroSlider slides={heroSlides} />

        {/* Okunabilirlik gradyanları. Masaüstünde görselin sol kenarı zaten
            maskeyle eridiği için hafif tutulur; görsel karartılmaz. */}
        <div
          aria-hidden
          className="from-inverse via-inverse/85 lg:via-inverse/40 absolute inset-0 bg-gradient-to-r to-transparent lg:w-1/2"
        />
        <div
          aria-hidden
          className="from-inverse/90 to-inverse/50 lg:from-inverse/60 absolute inset-0 bg-gradient-to-t via-transparent lg:to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
          <div className="flex max-w-2xl flex-col gap-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 shadow-lg backdrop-blur-md">
              <BadgeCheck
                className="text-sage-300 size-4 shrink-0"
                aria-hidden
              />
              {heroBadge}
            </p>

            <h1 className="font-display text-4xl leading-tight tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-[56px] lg:leading-[68px]">
              Aş&apos;a{" "}
              <span className="text-brand-200 font-normal italic">Lezzet</span>{" "}
              Katıyoruz.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-white/85 drop-shadow-sm sm:text-lg">
              Modern endüstriyel mutfaklarımız, usta aşçılarımız ve hijyen
              sertifikalı süreçlerimizle kurumlara sıcak, sağlıklı ve dengeli
              yemek üretiyoruz.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <ButtonLink href="/teklif-al" size="lg">
                Kurumsal Teklif Alın
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

      <QuickStats />
    </section>
  );
}
