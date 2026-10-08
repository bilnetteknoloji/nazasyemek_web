"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Yerel `<dialog>`: masaüstünde ortada pencere, telefonda alttan açılan
 * sayfa (bottom sheet). Escape ve arka plana tıklama kapatır; odak
 * tarayıcı tarafından içeride tutulur.
 */
export function Dialog({
  open,
  onClose,
  label,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto bg-white p-0 text-neutral-900 backdrop:bg-black/30 backdrop:backdrop-blur-[2px]",
        // Telefon: alttan sayfa · masaüstü: ortada pencere
        "max-sm:mt-auto max-sm:rounded-t-2xl max-sm:pb-[env(safe-area-inset-bottom)]",
        "sm:m-auto sm:max-w-md sm:rounded-2xl sm:border sm:border-neutral-200 sm:shadow-2xl",
        className,
      )}
    >
      <span aria-hidden className="mx-auto mt-2.5 block h-1 w-10 rounded-full bg-neutral-200 sm:hidden" />
      {open ? children : null}
    </dialog>
  );
}
