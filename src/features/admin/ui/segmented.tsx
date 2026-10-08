import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Filtre çipleri (bağlantı tabanlı: filtre URL'de durur). Telefonda
 * kenardan kenara yatay kayar.
 */
export function FilterChips({
  items,
  active,
}: {
  items: { href: string; label: string; value: string; count?: number }[];
  active: string;
}) {
  return (
    <nav className="scrollbar-none flex items-center gap-2 overflow-x-auto max-sm:-mx-4 max-sm:px-4 *:shrink-0">
      {items.map((item) => {
        const isActive = item.value === active;
        return (
          <Link
            key={item.value}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "pressable flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium pointer-coarse:h-10",
              isActive
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900",
            )}
          >
            {item.label}
            {item.count !== undefined ? (
              <span className={cn("tabular-nums", isActive ? "text-white/70" : "text-neutral-400")}>
                {item.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
