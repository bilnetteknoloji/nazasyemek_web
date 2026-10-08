import { Monitor, Smartphone, Tablet } from "lucide-react";
import type { RecentView } from "./queries";
import { deviceLabel, flag, pageLabel, regionName } from "./labels";
import { ScrollAfter } from "./scroll-after";

const deviceIcon = { mobile: Smartphone, tablet: Tablet, desktop: Monitor } as const;

const time = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function sourceLabel(view: RecentView) {
  if (view.source) return view.source;
  if (view.referrer) return view.referrer;
  return view.entry ? "Doğrudan" : "Site içi";
}

const languageNames = new Intl.DisplayNames(["tr"], { type: "language" });
const languageLabel = (code: string) => {
  try {
    return languageNames.of(code.split("-")[0]) ?? code;
  } catch {
    return code;
  }
};

/** Ziyaretçi kodu: günlük değişen karmanın ilk 4 hanesi — aynı gün aynı kişinin sayfalarını eşler. */
const visitorTag = (visitor: string) => visitor.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase();

function Chip({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" }) {
  return (
    <span
      className={
        tone === "green"
          ? "rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11.5px] font-medium text-emerald-700"
          : "rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11.5px] text-neutral-600"
      }
    >
      {children}
    </span>
  );
}

/**
 * Son ziyaretler: kutuda 5 satır görünür, gerisi kutunun içinde kayar.
 * Her satırda bilinen her şey: cihaz, sistem, tarayıcı, ekran, dil, konum,
 * kaynak, ilk giriş ve günlük ziyaretçi kodu.
 */
export function RecentList({ views }: { views: RecentView[] }) {
  if (!views.length) return <p className="px-4 py-6 text-[13px] text-neutral-500 sm:px-5">Henüz ziyaret yok.</p>;
  return (
    <ScrollAfter count={5} className="divide-y divide-neutral-100 overscroll-contain">
      {views.map((view, index) => {
        const Icon = deviceIcon[view.device as keyof typeof deviceIcon] ?? Monitor;
        const place = [view.city, view.region && view.region !== view.city ? view.region : null, view.country ? regionName(view.country) : null]
          .filter(Boolean)
          .join(", ");
        return (
          <li key={`${view.at}-${index}`} className="flex min-h-20 items-start gap-3 px-4 py-3 text-[13px] sm:px-5">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
              <Icon className="size-[18px]" aria-hidden />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="truncate font-medium text-neutral-900">{pageLabel(view.path)}</span>
                <span className="shrink-0 text-[12px] text-neutral-400 tabular-nums">{time.format(new Date(view.at))}</span>
              </span>
              <span className="flex flex-wrap items-center gap-1">
                <Chip>{deviceLabel[view.device] ?? view.device}</Chip>
                {view.os ? <Chip>{view.os}</Chip> : null}
                {view.browser ? <Chip>{view.browser}</Chip> : null}
                {view.screen ? <Chip>{view.screen}px ekran</Chip> : null}
                {view.lang ? <Chip>{languageLabel(view.lang)}</Chip> : null}
              </span>
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-neutral-500">
                <span>
                  {view.country ? flag(view.country) : "🌐"} {place || "Konum bilinmiyor"}
                </span>
                <span>· {sourceLabel(view)}</span>
                {view.entry ? <Chip tone="green">İlk giriş</Chip> : null}
                <span className="text-neutral-400" title="Aynı gün aynı ziyaretçinin sayfaları aynı kodu taşır">
                  · Ziyaretçi {visitorTag(view.visitor)}
                </span>
              </span>
            </span>
          </li>
        );
      })}
    </ScrollAfter>
  );
}

