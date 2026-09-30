"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { NavGroup } from "@/data/site";

/**
 * Header açılır menüsü.
 * Masaüstünde hover ile açılır, klavye ve dokunmatikte tıklamayla çalışır;
 * Escape ve dışarı tıklama kapatır.
 */
export function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  const menuId = useId();

  const active = group.items.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const openNow = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // Buton ile panel arasındaki boşlukta menü kapanmasın diye kısa gecikme.
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-300",
          active
            ? "bg-brand-800/10 text-brand-900"
            : open
              ? "bg-brand-800/5 text-brand-900"
              : "text-muted hover:text-brand-800 hover:bg-brand-800/5",
        )}
      >
        <group.icon className="size-4 shrink-0" aria-hidden />
        {group.label}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        id={menuId}
        hidden={!open}
        className="border-line/70 shadow-lift absolute top-full left-1/2 z-50 mt-3 w-80 -translate-x-1/2 rounded-2xl border bg-white p-2"
      >
        <ul>
          {group.items.map((item) => {
            const itemActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={itemActive ? "page" : undefined}
                  className={cn(
                    "group/item flex items-start gap-3 rounded-xl px-3 py-3 transition-colors",
                    itemActive ? "bg-container" : "hover:bg-cream-deep",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                      itemActive
                        ? "bg-brand-800 text-white"
                        : "bg-brand-800/10 text-brand-800 group-hover/item:bg-brand-800 group-hover/item:text-white",
                    )}
                  >
                    <item.icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        itemActive ? "text-brand-800" : "text-ink",
                      )}
                    >
                      {item.label}
                    </span>
                    {item.description ? (
                      <span className="text-muted mt-0.5 block text-xs leading-snug">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
