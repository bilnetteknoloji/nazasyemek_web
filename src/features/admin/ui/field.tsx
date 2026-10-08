import { cn } from "@/lib/cn";

/** Panel girdileri: beyaz zemin, odakta halka, hatada kırmızı halka. */
export const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[14px] leading-5 text-neutral-900 outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-4 focus-visible:ring-neutral-900/5 aria-invalid:border-red-500 aria-invalid:ring-4 aria-invalid:ring-red-500/10 pointer-coarse:py-2.5 pointer-coarse:text-[16px]";

/** Etiket + denetim + ipucu/hata. */
export function Field({
  id,
  label,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-neutral-900">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-hata`} role="alert" className="text-[12px] text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-ipucu`} className="text-[12px] text-neutral-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function fieldAria(id: string, error?: string, hint?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-hata` : hint ? `${id}-ipucu` : undefined,
  } as const;
}
