"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/cn";
import { testimonials } from "@/data/faq";

export function TestimonialSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 6000, stopOnInteraction: true }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="flex touch-pan-y">
          {testimonials.map((item) => (
            <li
              key={item.company}
              className="min-w-0 shrink-0 grow-0 basis-full pr-5 sm:basis-1/2 lg:basis-1/3"
            >
              <figure className="border-line shadow-soft flex h-full flex-col rounded-3xl border bg-white p-7">
                <Quote className="text-accent-400 size-8" aria-hidden />
                <blockquote className="text-brand-800 mt-5 flex-1 text-sm leading-relaxed sm:text-base">
                  {item.quote}
                </blockquote>
                <figcaption className="border-line mt-6 border-t pt-5">
                  <p className="text-brand-900 text-sm font-semibold">{item.name}</p>
                  <p className="text-muted mt-1 text-xs">{item.company}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Önceki referans"
          className="border-line text-brand-800 hover:border-brand-300 rounded-full border bg-white/70 p-2.5 transition-colors"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>

        <div className="flex gap-2">
          {testimonials.map((item, index) => (
            <button
              key={item.company}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`${index + 1}. referansa git`}
              aria-current={index === selected}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === selected ? "bg-brand-800 w-7" : "bg-brand-200 w-2.5",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Sonraki referans"
          className="border-line text-brand-800 hover:border-brand-300 rounded-full border bg-white/70 p-2.5 transition-colors"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
