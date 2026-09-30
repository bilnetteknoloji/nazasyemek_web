"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  as?: "div" | "li" | "article" | "section";
  delay?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Görünür olunca yumuşak yükselerek beliren sarmalayıcı.
 *
 * Sunucuda ve ilk render'da içerik GÖRÜNÜR çıkar; gizleme sınıfı yalnızca
 * mount sonrası eklenir. Böylece SSR/istemci uyuşmazlığı olmaz, JS çalışmazsa
 * içerik kaybolmaz. prefers-reduced-motion altında hiç gizlenmez.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  y = 24,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    // İlk ekranda zaten görünen öğeler gizlenmez: hem yanıp sönme olmaz
    // hem de IntersectionObserver çalışmazsa içerik görünür kalır.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    element.classList.add("reveal-init");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.remove("reveal-init");
        element.classList.add("reveal-in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(className)}
      style={
        {
          "--reveal-y": `${y}px`,
          animationDelay: delay ? `${delay}s` : undefined,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
