import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {/* Stitch: rounded-full bg-primary/10 text-primary, uppercase tracking-wider */}
      {eyebrow ? (
        <p
          className={cn(
            "inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-wider uppercase",
            tone === "dark"
              ? "bg-white/10 text-accent-300"
              : "bg-brand-800/10 text-brand-800",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display mt-4 text-3xl leading-[1.15] sm:text-4xl",
          tone === "dark" ? "text-cream" : "text-brand-900",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed",
            tone === "dark" ? "text-brand-100/80" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
