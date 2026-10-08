"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { AccountMenu } from "./account-menu";
import { Brand } from "./brand";
import { navItems, useActiveHref } from "./nav-items";

/**
 * Masaüstü: Vercel tarzı iki katlı başlık — üstte marka ve hesap, altta
 * sekmeler. Etkin sekmenin alt çizgisi ve üzerine gelinen sekmenin zemini
 * sekmeler arasında kayar. Telefonda yalnızca üst kat kalır; gezinme alttaki
 * sekme çubuğundadır.
 */
export function Header({ email, newCount }: { email: string | null; newCount: number }) {
  const active = useActiveHref();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />
        <AccountMenu email={email} />
      </div>

      <nav aria-label="Panel" className="mx-auto hidden max-w-6xl lg:block lg:px-5" onMouseLeave={() => setHovered(null)}>
        <ul className="-mb-px flex">
          {navItems.map(({ href, label }) => {
            const isActive = active === href;
            return (
              <li key={href} className="relative">
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => setHovered(href)}
                  onFocus={() => setHovered(href)}
                  className={cn(
                    "relative flex h-11 items-center gap-1.5 px-3 text-[14px] outline-none transition-colors",
                    isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900",
                  )}
                >
                  {hovered === href ? (
                    <motion.span
                      layoutId="admin-tab-hover"
                      className="absolute inset-x-0 inset-y-2 -z-10 rounded-lg bg-neutral-100"
                      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                    />
                  ) : null}
                  {label}
                  {href === "/admin/talepler" && newCount > 0 ? (
                    <span className="rounded-full bg-[#8b3a2b] px-1.5 text-[11px] leading-[18px] font-semibold text-white tabular-nums">
                      {newCount}
                    </span>
                  ) : null}
                </Link>
                {isActive ? (
                  <motion.span
                    layoutId="admin-tab-active"
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-neutral-900"
                    transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
