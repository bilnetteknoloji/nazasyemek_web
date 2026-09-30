"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

/** Bölümün bir üsttekinin altından çıkarken kat ettiği yol (px). */
export const STACK_SHIFT = 180;

const TONES = {
  // Bölümün kendi açık zeminini ezer; komşu bölümler arasında kenar belli olsun.
  white: "bg-white [&>section]:bg-white!",
  off: "bg-cream [&>section]:bg-cream!",
  // Koyu / görselli bölümler kendi zeminini korur.
  own: "bg-cream",
} as const;

export type StackTone = keyof typeof TONES;

/**
 * Ana sayfa bölüm katmanı: her bölüm bir üsttekinin *altında* durur
 * (z-index aşağı doğru azalır) ve görünüme girerken yukarıdan, üst bölümün
 * yuvarlatılmış alt kenarının altından kayarak yerine oturur.
 *
 * Kaydırma boyunca kayma miktarı aşağıdaki bölümlerde hep daha büyük
 * olduğundan bölümler arasında boşluk açılmaz; son bölümün altındaki
 * boşluğu sayfadaki `StackFooterFill` kapatır.
 *
 * Kayma elemanın kendisine uygulandığı için içerideki `position: fixed`
 * öğeler (ör. Lightbox) portal ile body'ye taşınmalıdır.
 */
export function StackLayer({
  depth,
  shift = true,
  tone = "own",
  className,
  children,
}: {
  /** Üstten alta azalan z-index. */
  depth: number;
  /** İlk bölüm (hero) kaymaz, yalnızca üstte durur. */
  shift?: boolean;
  /** Beyaz / kirli beyaz dönüşümü. */
  tone?: StackTone;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-STACK_SHIFT, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ zIndex: depth, y: shift && !reduce ? y : 0 }}
      className={cn(
        "relative overflow-clip rounded-b-3xl sm:rounded-b-[3rem]",
        // Alt kenarın gölgesi bir alttaki bölümün üstüne düşer: geçiş net okunur.
        "shadow-[0_18px_32px_-12px_rgba(30,27,24,0.28),0_48px_80px_-24px_rgba(30,27,24,0.30)]",
        TONES[tone],
        // Üst bölümün yuvarlatılmış köşelerinin altında bu bölüm görünsün.
        shift && "-mt-6 sm:-mt-12",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/**
 * Son katman kaydığında footer ile arasında açılacak şeridi, footer zemin
 * rengiyle ve en altta kalarak doldurur. Yerleşimde yer kaplamaz.
 */
export function StackFooterFill() {
  return (
    <div
      aria-hidden
      className="bg-container-high relative z-0"
      style={{ height: STACK_SHIFT, marginTop: -STACK_SHIFT }}
    />
  );
}
