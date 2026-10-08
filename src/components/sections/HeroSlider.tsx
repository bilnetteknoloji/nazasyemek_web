"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Img as Image } from "@/components/ui/Img";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import type { HeroSlide } from "@/data/home";

/*
 * Slayt düzeni: masaüstünde görsel hero'nun sağ ~%68'ini kaplar — üst, alt ve
 * sağ kenara tam oturur (`cover`), sol kenarı maskeyle koyu zemine (`bg-inverse`)
 * yumuşakça erir; metin solda düz zeminde okunur. Mobilde görsel tüm kutuyu kaplar.
 */
const mediaClass = "absolute inset-0 size-full object-cover object-center";

function SlideFrame({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={!active}
      className={cn(
        "absolute inset-0 transition-opacity duration-700",
        "lg:left-auto lg:w-[68%] lg:[mask-image:linear-gradient(to_right,transparent,black_42%)]",
        active ? "opacity-100" : "opacity-0",
      )}
    >
      {children}
    </div>
  );
}

/**
 * Video slaytı. Sunucu ve istemci aynı işaretlemeyi üretir (poster'lı <video>);
 * dosya yalnızca slayt aktifken yüklenip oynatılır, pasifken durdurulur.
 * Hareket azaltma tercihinde hiç oynatılmaz, poster kalır.
 */
function VideoSlide({ slide, active }: { slide: HeroSlide; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!active) {
      element.pause();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.preload = "auto";
    void element.play().catch(() => {
      // Otomatik oynatma engellenirse poster görseli kalır.
    });
  }, [active]);

  return (
    <SlideFrame active={active}>
      <video
        ref={ref}
        className={mediaClass}
        poster={asset(slide.src)}
        muted
        loop
        playsInline
        preload="none"
      >
        <source src={asset(slide.video!)} type="video/mp4" />
      </video>
    </SlideFrame>
  );
}

/**
 * Stitch hero slider'ı: tam kaplayan görsel ya da video, yan oklar ve alt noktalar.
 * Mobil ve tablette oklar yok, parmakla kaydırılır; noktalar ortada.
 * Otomatik geçiş prefers-reduced-motion altında durur.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);

  const go = useCallback(
    (delta: number) =>
      setActive((i) => (i + delta + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(id);
  }, [go, active]);

  // Mobilde parmakla kaydırarak geçiş (yatay hareket 40px'i aşarsa).
  const touchX = useRef<number | null>(null);

  return (
    <>
      <div
        className="absolute inset-0"
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchX.current === null) return;
          const dx = event.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        {slides.map((slide, index) =>
          slide.video ? (
            <VideoSlide
              key={slide.src}
              slide={slide}
              active={index === active}
            />
          ) : (
            <SlideFrame key={slide.src} active={index === active}>
              <Image
                src={slide.src}
                alt={index === 0 ? slide.caption : ""}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 68vw, 100vw"
                className={mediaClass}
              />
            </SlideFrame>
          ),
        )}
      </div>

      {/* Oklar sağ altta: hiçbir genişlikte başlık metniyle çakışmaz. */}
      <div className="absolute right-8 bottom-10 z-20 hidden items-center gap-2 lg:flex">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Önceki görsel"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Sonraki görsel"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1.5 backdrop-blur-sm lg:bottom-10 lg:left-8 lg:translate-x-0 lg:gap-2 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`${index + 1}. görsele geç`}
            aria-current={index === active}
            className={cn(
              "h-2 rounded-full transition-all duration-300 lg:h-2.5",
              index === active
                ? "bg-brand-100 w-6 lg:w-8"
                : "w-2 bg-white/40 hover:bg-white/60 lg:w-2.5 lg:bg-white/30",
            )}
          />
        ))}
      </div>
    </>
  );
}
