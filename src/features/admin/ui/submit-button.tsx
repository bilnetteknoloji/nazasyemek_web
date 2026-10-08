"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { adminButton, type ButtonVariant } from "./button";

/** Form gönderilirken kendini kilitleyen ve dönen ikon gösteren düğme. */
export function SubmitButton({
  children,
  pendingLabel = "Kaydediliyor…",
  variant = "primary",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: ButtonVariant;
  size?: "sm" | "md";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={adminButton({ variant, size, className })}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" aria-hidden />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
