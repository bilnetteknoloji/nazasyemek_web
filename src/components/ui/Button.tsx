import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-[var(--ease-out-expo)] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Stitch: bg-primary-container + shadow-[0_4px_16px_rgba(139,58,43,0.22)]
  primary:
    "bg-brand-600 text-white shadow-glow hover:-translate-y-0.5 hover:bg-brand-800",
  outline:
    "border border-brand-200 bg-white/70 text-brand-800 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white hover:shadow-soft",
  ghost: "text-brand-700 hover:bg-brand-50",
  // Stitch: koyu terracotta zeminlerde beyaz buton, koyu kırmızı metin.
  light:
    "bg-white text-brand-800 shadow-soft hover:-translate-y-0.5 hover:bg-cream",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string };

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: CommonProps & React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
