"use client";

import { useEffect, useRef } from "react";
import { videos } from "@/data/media";
import { asset } from "@/lib/asset";

/**
 * Hero görseli. Sunucu ve istemci aynı işaretlemeyi üretir: poster'lı bir
 * <video>. Oynatma yalnızca mount sonrası, hareket tercihi kapalı değilse
 * JS ile başlatılır — böylece hydration uyuşmazlığı olmaz.
 */
export function HeroMedia({ poster, alt }: { poster: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    element.preload = "auto";
    void element.play().catch(() => {
      // Otomatik oynatma engellenirse poster görseli kalır.
    });
  }, []);

  return (
    <video
      ref={ref}
      className="aspect-[4/3] w-full object-cover"
      poster={asset(poster)}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
    >
      <source src={asset(videos[0].src)} type="video/mp4" />
    </video>
  );
}
