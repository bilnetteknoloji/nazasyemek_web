import { cn } from "@/lib/cn";
import { getStats } from "@/lib/content/site";

/** Stitch: hero'nun altına yapışık, ikonlu hızlı istatistik şeridi. */
export async function QuickStats() {
  const { quickStats } = await getStats();
  return (
    <div className="bg-cream-deep border-line w-full border-b py-4">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-2 items-center gap-4 px-5 sm:px-8 md:grid-cols-4">
        {quickStats.map((stat) => (
          <li key={stat.label} className="flex items-center gap-3 p-2">
            <span
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl",
                stat.tone === "brand"
                  ? "bg-brand-800/10 text-brand-800"
                  : "bg-sage-100 text-sage-700",
              )}
            >
              <stat.icon className="size-6" aria-hidden />
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  "block text-xl leading-none font-bold sm:text-2xl",
                  stat.tone === "brand" ? "text-brand-800" : "text-sage-600",
                )}
              >
                {stat.value}
              </span>
              <span className="text-muted mt-1 block text-xs">{stat.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
