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
    // Mobil ve tablette (lg altı) kapsül yerine ekrana yapışık, ince uygulama
    // çubuğu: solda logo + slogan yan yana, sağda tek iletişim düğmesi.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 lg:px-4 lg:pt-4">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex w-full items-center justify-between gap-3 backdrop-blur-xl transition-all duration-500 ease-[var(--ease-out-expo)]",
          "max-lg:border-line/60 max-lg:h-[60px] max-lg:border-b max-lg:bg-white/90 max-lg:pr-3 max-lg:pl-4",
          scrolled && "max-lg:shadow-[0_6px_20px_-12px_rgb(30_27_24/0.3)]",
          "lg:rounded-full lg:border lg:pr-2 lg:pl-5",
          scrolled
            ? "lg:h-16 lg:max-w-6xl lg:border-white/80 lg:bg-white/90 lg:shadow-[0_10px_30px_-10px_rgb(30_27_24/0.25)]"
            : "lg:h-[76px] lg:max-w-6xl lg:border-white/60 lg:bg-white/75 lg:shadow-[0_8px_28px_-12px_rgb(30_27_24/0.22)]",
        )}
      >
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3"
          aria-label={`${site.legalName} ana sayfa`}
        >
          <span className="flex items-center gap-2.5 lg:flex-col lg:gap-0">
            <Image
              src="/brand/logo.svg"
              alt=""
              width={935}
              height={960}
              priority
              unoptimized
              className={cn(
                "h-9 w-auto transition-all duration-500 ease-[var(--ease-out-expo)]",
                scrolled ? "lg:h-9" : "lg:h-11",
              )}
            />
            <span className="text-[13px] leading-none font-extrabold whitespace-nowrap text-red-600 lg:mt-0.5 lg:text-[10px]">
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
          <ButtonLink href="/teklif-al" size="sm" className="hidden rounded-full whitespace-nowrap lg:inline-flex">
            Teklif Alın
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
