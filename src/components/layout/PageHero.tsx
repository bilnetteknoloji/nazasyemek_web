import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";
import { heroShell } from "@/lib/hero-shell";
import { HeroBackdrop } from "./HeroBackdrop";
import { photos } from "@/data/media";
import { Reveal } from "@/components/ui/Reveal";

type Crumb = { name: string; href: string };

const fallbackPhoto =
  photos.find((p) => p.src.endsWith("nazas14.webp")) ?? photos[0];

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs = [],
  photo = fallbackPhoto,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  photo?: { src: string };
  /**
   * `light`: soluk görsel sayfa zeminine erir (varsayılan).
   * `dark`: görsel hafif bulanık, üstünde siyah perde; bölüm yuvarlatılmış
   * alt kenarı ve gölgesiyle sayfanın geri kalanından ayrı durur.
   */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <section
      className={cn(
        heroShell,
        "overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20",
        dark ? "bg-inverse pb-20 sm:pb-28" : "bg-white",
      )}
    >
      {dark ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Img
            src={photo.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover object-center blur-[3px]"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>
      ) : (
        <HeroBackdrop photo={photo} />
      )}
      <Container>
        <Reveal>
          <nav
            aria-label="Sayfa yolu"
            className={cn("text-xs", dark ? "text-white/70" : "text-muted")}
          >
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "transition-colors",
                    dark ? "hover:text-white" : "hover:text-brand-800",
                  )}
                >
                  Ana Sayfa
                </Link>
              </li>
              {crumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-1">
                  <ChevronRight className="size-3.5" aria-hidden />
                  {index === crumbs.length - 1 ? (
                    <span
                      className={dark ? "text-brand-200" : "text-brand-700"}
                    >
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className={cn(
                        "transition-colors",
                        dark ? "hover:text-white" : "hover:text-brand-800",
                      )}
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </Reveal>

        <div className="mt-8 max-w-3xl">
          {eyebrow ? (
            <Reveal>
              <p
                className={cn(
                  "inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-wider uppercase",
                  dark
                    ? "text-accent-300 bg-white/10 backdrop-blur-sm"
                    : "bg-brand-800/10 text-brand-800",
                )}
              >
                {eyebrow}
              </p>
            </Reveal>
          ) : null}
          <Reveal delay={0.06}>
            <h1
              className={cn(
                "font-display mt-4 text-4xl leading-[1.1] sm:text-5xl",
                dark ? "text-white drop-shadow-md" : "text-brand-900",
              )}
            >
              {title}
            </h1>
          </Reveal>
          {description ? (
            <Reveal delay={0.12}>
              <p
                className={cn(
                  "mt-6 text-base leading-relaxed sm:text-lg",
                  dark ? "text-white/85" : "text-muted",
                )}
              >
                {description}
              </p>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
