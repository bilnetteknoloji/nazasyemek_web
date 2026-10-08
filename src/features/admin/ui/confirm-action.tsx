"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { adminButton } from "./button";
import { Dialog } from "./dialog";

/**
 * Geri alınamaz işlem (silme) için onay penceresi. Onaylanınca `action`
 * (server action) form ile çağrılır.
 */
export function ConfirmAction({
  action,
  label = "Sil",
  message,
  confirmLabel = "Evet, sil",
  compact = false,
}: {
  action: () => Promise<void>;
  label?: string;
  message: string;
  confirmLabel?: string;
  /** Yalnızca ikon (liste satırlarında). */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={compact ? label : undefined}
        className={
          compact
            ? "pressable flex size-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600"
            : "flex w-fit items-center gap-1.5 px-1 text-[13px] font-medium text-red-600 hover:underline"
        }
      >
        <Trash2 className="size-4" aria-hidden />
        {compact ? null : label}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} label={label}>
        <form action={action} onSubmit={() => setOpen(false)} className="flex flex-col gap-5 p-6">
          <p className="text-[14px] text-neutral-900">{message}</p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className={adminButton({ variant: "secondary" })}>
              Vazgeç
            </button>
            <button type="submit" className={adminButton({ variant: "danger" })}>
              {confirmLabel}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
