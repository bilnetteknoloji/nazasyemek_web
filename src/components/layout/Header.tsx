"use client";

import { useEffect, useState } from "react";
import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { isNavGroup, mainNav, site } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import { NavDropdown } from "./NavDropdown";
import { ContactMenu } from "./ContactMenu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Tam genişlik bar yerine ortada yüzen cam kapsül. Dış katman tıklamayı
    // geçirir; yalnızca kapsül etkileşimli. Kapsüldeki backdrop-blur `fixed`
    // çocuklar için yeni bağlam yaratır — MobileNav bu yüzden body'ye portal.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex w-full items-center justify-between gap-3 rounded-full border pr-2 pl-3 backdrop-blur-xl transition-all duration-500 ease-[var(--ease-out-expo)] sm:pl-5",
          scrolled
            ? "h-16 max-w-6xl border-white/80 bg-white/90 shadow-[0_10px_30px_-10px_rgb(30_27_24/0.25)]"
            : "h-[76px] max-w-6xl border-white/60 bg-white/75 shadow-[0_8px_28px_-12px_rgb(30_27_24/0.22)]",
        )}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label={`${site.legalName} ana sayfa`}
        >
          <span className="flex flex-col items-center">
            <Image
              src="/brand/logo.svg"
              alt=""
              width={935}
              height={960}
              priority
              unoptimized
              className={cn(
                "w-auto transition-all duration-500 ease-[var(--ease-out-expo)]",
                scrolled ? "h-9" : "h-11",
              )}
            />
            <span className="mt-0.5 text-[10px] leading-none font-extrabold whitespace-nowrap text-red-600">
              {site.slogan}
            </span>
          </span>
          <span className="sr-only">{site.legalName}</span>
        </Link>

        <nav aria-label="Ana menü" className="hidden items-center gap-0.5 lg:flex">
          {mainNav.map((entry) => {
            if (isNavGroup(entry)) {
              return <NavDropdown key={entry.label} group={entry} />;
            }

            const active =
              pathname === entry.href ||
              (entry.href !== "/" && pathname.startsWith(`${entry.href}/`));

            return (
              <Link
                key={entry.href}
                href={entry.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-300",
                  active
                    ? "bg-brand-800/10 text-brand-900"
                    : "text-muted hover:text-brand-800 hover:bg-brand-800/5",
                )}
              >
                <entry.icon className="size-4 shrink-0" aria-hidden />
                {entry.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ContactMenu />
          <ButtonLink href="/teklif-al" size="sm" className="hidden rounded-full whitespace-nowrap sm:inline-flex">
            Teklif Alın
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
