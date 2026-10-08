import { cn } from "@/lib/cn";

const variants = {
  /** Tek baskın eylem: siyah (Vercel tarzı). */
  primary: "bg-neutral-900 text-white hover:bg-neutral-800",
  secondary: "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
  ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
} as const;

export type ButtonVariant = keyof typeof variants;

const sizes = {
  sm: "h-8 px-3 text-[13px] pointer-coarse:h-10",
  md: "h-9 px-3.5 text-[14px] pointer-coarse:h-11",
} as const;

/**
 * Panel düğmesi: sade, kenarlıklı, tek renk birincil. Sitenin terracotta
 * CTA'larından ayrıdır. Dokunmatikte hedef 44px'e büyür.
 */
export function adminButton({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
} = {}) {
  return cn(
    "pressable inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap outline-none select-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
    variants[variant],
    sizes[size],
    className,
  );
}
