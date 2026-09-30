"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Img } from "@/components/ui/Img";
import type { GalleryItem } from "@/data/media";
import { asset } from "@/lib/asset";

type LightboxProps = {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

/**
 * Tam ekran galeri görüntüleyici (fotoğraf ve video).
 *
 * - body'ye portal edilir: StackLayer'ın transform'u ve header'ın backdrop-blur'u
 *   `position: fixed` için yeni konumlama bağlamı yaratıyor.
 * - Üst şerit / sahne / alt yazı ızgarası; sahne `place-items-center`. Görsel kutusu
 *   oran ve ekran yüksekliğinden hesaplanır (yüklenmeyi beklemez) — yerleşim zıplamaz,
 *   her öğe ekranın tam ortasında durur.
 * - Oklar, ← → tuşları ve dokunmatik kaydırma; sondan başa sarar. Komşu görseller
 *   önceden yüklenir. Escape / arka plana tıklama kapatır; kaydırma kilitlenir ve
 *   kapanınca odak açan öğeye döner.
 */
export function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const reduced = useReducedMotion();
  const isOpen = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + items.length) % items.length);
    },
    [index, onChange, items.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, step]);

  // Komşu fotoğrafları önceden yükle: geçişte boş kare görünmesin.
  useEffect(() => {
    if (index === null) return;
    for (const delta of [1, -1]) {
      const neighbour = items[(index + delta + items.length) % items.length];
      if (neighbour?.type === "photo") new window.Image().src = asset(neighbour.src);
    }
  }, [index, items]);

  const item = index === null ? null : items[index];

  // Açılması yalnızca tıklamayla olur, bu yüzden portal sunucuda render edilmez.
  if (typeof document === "undefined") return null;

  const navButton =
    "absolute top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25";

  return createPortal(
    <AnimatePresence>
      {item && index !== null ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Galeri görüntüleyici"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 grid grid-rows-[auto_minmax(0,1fr)_auto] bg-black/92 backdrop-blur-sm"
          onClick={onClose}
          onTouchStart={(event) => {
            touchX.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchX.current === null) return;
            const dx = event.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-sm text-white/80 sm:px-6 sm:py-4">
            <span aria-live="polite" className="tabular-nums">
              {index + 1} / {items.length}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="rounded-full p-2.5 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>

          {/* Sahne: kalan alanın tamamı, içerik tam ortada. */}
          <div className="relative grid min-h-0 place-items-center px-4 sm:px-20">
            <motion.figure
              key={item.src}
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative grid size-full place-items-center"
              onClick={(event) => event.stopPropagation()}
            >
              {item.type === "video" ? (
                <>
                  <video
                    controls
                    autoPlay
                    playsInline
                    poster={asset(item.thumb)}
                    className="max-h-[calc(100dvh-9rem)] max-w-full rounded-xl object-contain"
                  >
                    <source src={asset(item.src)} type="video/mp4" />
                  </video>
                  {/* Videoya filigran dosyada işlenemediği için üstte gösterilir. */}
                  <Img
                    src="/brand/logo-light.png"
                    alt=""
                    aria-hidden
                    width={96}
                    height={99}
                    className="pointer-events-none absolute right-[3%] bottom-16 h-auto w-[10%] min-w-10 opacity-70 drop-shadow-md"
                  />
                </>
              ) : (
                // Kutu boyutu yüklemeden bağımsız: genişlik = min(sahne, kullanılabilir
                // yükseklik × oran). `w-auto` yüklenmemiş görselde 0 genişlik veriyordu.
                <Img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="92vw"
                  className="h-auto rounded-xl bg-white/5 object-contain shadow-2xl"
                  style={{
                    aspectRatio: `${item.width} / ${item.height}`,
                    width: `min(100%, calc((100dvh - 9rem) * ${(item.width / item.height).toFixed(4)}))`,
                  }}
                />
              )}
            </motion.figure>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
              aria-label="Önceki"
              className={`${navButton} left-2 sm:left-6`}
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
              aria-label="Sonraki"
              className={`${navButton} right-2 sm:right-6`}
            >
              <ChevronRight className="size-6" aria-hidden />
            </button>
          </div>

          <p className="px-6 pt-2 pb-5 text-center text-sm text-white/75">{item.alt}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
