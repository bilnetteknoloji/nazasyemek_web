"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { Img as Image } from "@/components/ui/Img";
import { gallery } from "@/data/media";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";

const STORAGE_KEY = "naz-welcome-video";
const OPEN_DELAY = 1200;

const film = gallery.find((item) => item.type === "video" && item.src.endsWith("/tanitim.mp4"));

/**
 * İlk ziyarette açılan küçük tanıtım videosu pop-up'ı; altında slogan.
 * Ziyaretçi başına bir kez: kapatılınca localStorage'a yazılır.
 * `ui/Modal.tsx` gibi body'ye portal edilir (StackLayer transform'u ve header'ın
 * backdrop-blur'u `position: fixed` için yeni bağlam yaratıyor).
 */
export function WelcomeVideo() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!film) return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Depolama kapalıysa (gizli pencere vb.) yine bir kez gösterilir.
    }
    const timer = window.setTimeout(() => setOpen(true), OPEN_DELAY);
    return () => window.clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // yok say
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, close]);

  if (!film || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-ink/60 fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${site.name} tanıtım videosu`}
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="shadow-lift relative w-[min(78vw,calc(min(64vh,540px)*9/16))] overflow-hidden rounded-3xl bg-white"
          >
            <div className="relative aspect-[9/16] bg-black">
              <video
                src={asset(film.src)}
                poster={asset(film.thumb)}
                autoPlay={!reduced}
                muted
                loop
                playsInline
                controls
                preload="metadata"
                className="absolute inset-0 size-full object-cover"
              />
              {/* Filigran dosyaya işlenemediği için üstte gösterilir (galeri videolarıyla aynı). */}
              <Image
                src="/brand/logo-light.png"
                alt=""
                aria-hidden
                width={96}
                height={99}
                className="pointer-events-none absolute top-3 left-3 h-auto w-[14%] opacity-80 drop-shadow"
              />
            </div>

            <p className="font-display px-4 py-3.5 text-center text-lg leading-tight font-extrabold text-red-600 sm:text-xl">
              {site.slogan}.
            </p>

            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Kapat"
              className="text-ink absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-colors hover:bg-white"
            >
              <X className="size-5" aria-hidden />
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
