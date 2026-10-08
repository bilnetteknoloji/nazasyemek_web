"use client";

import { Ellipsis } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@/features/admin/ui/dialog";
import { cn } from "@/lib/cn";
import { navItems, useActiveHref } from "./nav-items";

const tabs = navItems.filter((item) => item.tab);
const more = navItems.filter((item) => !item.tab);

/**
 * Telefon / tablet alt sekme çubuğu — yerel uygulama gezinmesi. Dört ana
 * bölüm + "Diğer" (alttan açılan sayfa). Etkin sekmenin arkasındaki hap
 * seçimle birlikte kayar; Talepler'de yeni talep sayısı rozet olarak görünür.
 */
export function TabBar({ newCount }: { newCount: number }) {
  const active = useActiveHref();
  const [sheet, setSheet] = useState(false);
  const moreActive = more.some((item) => item.href === active);

  const pill = (
    <motion.span
      layoutId="admin-tabbar-pill"
      className="absolute inset-0 rounded-full bg-neutral-100"
      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
    />
  );
  const tabClass = (isActive: boolean) =>
    cn(
      "pressable flex min-h-[58px] flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium",
      isActive ? "text-neutral-900" : "text-neutral-500",
    );

  return (
    <>
      <nav
        aria-label="Panel"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto flex max-w-lg px-1.5">
          {tabs.map(({ href, label, icon: Icon }) => {
            const isActive = active === href;
            const badge = href === "/admin/talepler" && newCount > 0;
            return (
              <li key={href} className="flex flex-1">
                <Link href={href} aria-current={isActive ? "page" : undefined} className={tabClass(isActive)}>
                  <span className="relative flex h-8 w-14 items-center justify-center">
                    {isActive ? pill : null}
                    <Icon className="relative size-[21px]" strokeWidth={isActive ? 2.2 : 1.8} aria-hidden />
                    {badge ? (
                      <span className="absolute -top-0.5 right-2 min-w-4 rounded-full bg-[#8b3a2b] px-1 text-center text-[10px] leading-4 font-semibold text-white tabular-nums ring-2 ring-white">
                        {newCount > 99 ? "99+" : newCount}
                      </span>
                    ) : null}
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
          <li className="flex flex-1">
            <button type="button" onClick={() => setSheet(true)} className={tabClass(moreActive)}>
              <span className="relative flex h-8 w-14 items-center justify-center">
                {moreActive ? pill : null}
                <Ellipsis className="relative size-[21px]" strokeWidth={moreActive ? 2.2 : 1.8} aria-hidden />
              </span>
              Diğer
            </button>
          </li>
        </ul>
      </nav>

      <Dialog open={sheet} onClose={() => setSheet(false)} label="Diğer bölümler" className="lg:hidden">
        <ul className="grid grid-cols-3 gap-2 p-4">
          {more.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setSheet(false)}
                className={cn(
                  "pressable flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-[13px] font-medium",
                  active === href ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-700",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </Dialog>
    </>
  );
}
