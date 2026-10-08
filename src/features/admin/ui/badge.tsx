import { cn } from "@/lib/cn";

const tones = {
  brand: "bg-[#8b3a2b]/10 text-[#8b3a2b]",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  muted: "bg-neutral-100 text-neutral-600",
} as const;

export type BadgeTone = keyof typeof tones;

/** Durum rozeti — yumuşak zemin, küçük yazı. */
export function Badge({
  tone = "muted",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[12px] leading-5 font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
