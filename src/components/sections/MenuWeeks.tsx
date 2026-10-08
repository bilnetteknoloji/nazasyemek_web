"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame, Salad, Soup, UtensilsCrossed, Wheat } from "lucide-react";
import { cn } from "@/lib/cn";
import type { MenuWeek } from "@/data/menu";

const rows = [
  { key: "soup", label: "Çorba", icon: Soup },
  { key: "main", label: "Ana Yemek", icon: UtensilsCrossed },
  { key: "side", label: "Yan Yemek", icon: Wheat },
  { key: "extra", label: "Tamamlayıcı", icon: Salad },
] as const;

/** Hafta sekmeleri + gün kartları. */
export function MenuWeeks({
  weeks: menuWeeks,
  compact = false,
}: {
  /** Sunucuda `getMenuWeeks()` ile okunur (panel ya da src/data/menu.ts). */
  weeks: MenuWeek[];
  compact?: boolean;
}) {
  const [active, setActive] = useState(0);
  const week = menuWeeks[active];

  return (
    <div>
      {!compact ? (
        <div
          role="tablist"
          aria-label="Menü haftaları"
          className="border-line shadow-soft mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border bg-white/80 p-1.5"
        >
          {menuWeeks.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={index === active}
              aria-controls={`menu-panel-${item.id}`}
              onClick={() => setActive(index)}
              className={cn(
                "relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300",
                index === active ? "text-cream" : "text-muted hover:text-brand-800",
              )}
            >
              {index === active ? (
                <motion.span
                  layoutId="menu-tab"
                  aria-hidden
                  className="bg-brand-800 absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              ) : null}
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}

      {/* initial={false}: ilk render animasyonsuz/görünür; animasyon yalnızca hafta değişiminde. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={week.id}
          id={`menu-panel-${week.id}`}
          role={compact ? undefined : "tabpanel"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
            !compact && "mt-10",
          )}
        >
          {week.days.map((day) => (
            <li
              key={day.day}
              className="border-line shadow-soft hover:shadow-lift flex flex-col rounded-3xl border bg-white p-6 transition-shadow duration-500"
            >
              <div className="border-line flex items-baseline justify-between border-b pb-4">
                <h3 className="text-brand-900 font-display text-xl">{day.day}</h3>
                <span className="text-muted flex items-center gap-1.5 text-xs">
                  <Flame className="text-accent-500 size-3.5" aria-hidden />
                  {day.calories} kcal
                </span>
              </div>

              <dl className="mt-5 space-y-4 text-sm">
                {rows.map((row) => (
                  <div key={row.key} className="flex items-start gap-3">
                    <row.icon className="text-brand-300 mt-0.5 size-4 shrink-0" aria-hidden />
                    <div>
                      <dt className="text-muted text-xs tracking-wide uppercase">
                        {row.label}
                      </dt>
                      <dd className="text-brand-800 mt-0.5 font-medium">
                        {day[row.key]}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
