"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

/**
 * Ekranın ortasında açılan pop-up.
 * body'ye portal edilir (StackLayer transform'u ve header'ın backdrop-blur'u
 * `position: fixed` için yeni bağlam yaratıyor). Escape ve arka plana tıklama
 * kapatır; açıkken sayfa kaydırması kilitlenir, kapanınca odak geri döner.
 */
export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  // Açılması yalnızca tıklamayla olur, bu yüzden portal sunucuda render edilmez.
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-ink/55 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="shadow-lift flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white"
          >
            <div className="border-line flex items-start justify-between gap-4 border-b px-6 py-5 sm:px-8">
              <div>
                {eyebrow ? (
                  <p className="text-brand-800 text-xs font-semibold tracking-wider uppercase">
                    {eyebrow}
                  </p>
                ) : null}
                <h2
                  id={titleId}
                  className="font-display text-brand-900 mt-1 text-2xl leading-tight"
                >
                  {title}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="text-muted hover:bg-cream-deep hover:text-ink -mr-2 shrink-0 rounded-full p-2 transition-colors"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
