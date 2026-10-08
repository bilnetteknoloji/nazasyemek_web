import { cn } from "@/lib/cn";

/** Günlük görüntüleme sütunları (ziyaretçi koyu, görüntüleme açık). */
export function TrafficChart({ series }: { series: { day: string; views: number; visitors: number }[] }) {
  const max = Math.max(1, ...series.map((point) => point.views));
  const label = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" });
  const step = Math.ceil(series.length / 7);

  return (
    <figure className="flex flex-col gap-2">
      <div className="flex h-44 items-end gap-[2px]" role="img" aria-label="Günlük görüntüleme ve ziyaretçi grafiği">
        {series.map((point) => (
          <div key={point.day} className="group relative flex h-full flex-1 items-end" title={`${label.format(new Date(point.day))}: ${point.views} görüntüleme, ${point.visitors} ziyaretçi`}>
            <div className="relative w-full rounded-t-[3px] bg-neutral-200" style={{ height: `${(point.views / max) * 100}%` }}>
              <div className="absolute inset-x-0 bottom-0 rounded-t-[3px] bg-neutral-900" style={{ height: `${point.views ? (point.visitors / point.views) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-neutral-400">
        {series
          .filter((_, index) => index % step === 0)
          .map((point) => (
            <span key={point.day}>{label.format(new Date(point.day))}</span>
          ))}
      </div>
      <figcaption className="flex gap-4 text-[12px] text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-neutral-900" aria-hidden />
          Ziyaretçi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-neutral-200" aria-hidden />
          Görüntüleme
        </span>
      </figcaption>
    </figure>
  );
}

/** Yatay çubuklu sıralı liste (sayfalar, kaynaklar, cihazlar). */
export function BarList({
  items,
  empty = "Henüz veri yok.",
  className,
}: {
  items: { label: string; value: number }[];
  empty?: string;
  className?: string;
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  if (!items.length) return <p className="px-4 py-6 text-[13px] text-neutral-500 sm:px-5">{empty}</p>;
  return (
    <ul className={cn("flex flex-col gap-1 p-3", className)}>
      {items.map((item) => (
        <li key={item.label} className="relative flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-[13px]">
          <span className="absolute inset-y-0 left-0 rounded-md bg-neutral-100" style={{ width: `${(item.value / max) * 100}%` }} aria-hidden />
          <span className="relative truncate text-neutral-900">{item.label}</span>
          <span className="relative font-medium text-neutral-600 tabular-nums">{item.value.toLocaleString("tr-TR")}</span>
        </li>
      ))}
    </ul>
  );
}

/** Önceki döneme göre değişim yüzdesi; önceki dönem boşsa gösterilmez. */
function Change({ value, previous }: { value: number; previous: number }) {
  if (!previous) return null;
  const change = Math.round(((value - previous) / previous) * 100);
  return (
    <span className={cn("text-[12px] font-medium tabular-nums", change >= 0 ? "text-emerald-600" : "text-red-600")}>
      {change >= 0 ? "▲" : "▼"} %{Math.abs(change)}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
  previous,
  suffix,
}: {
  label: string;
  value: number;
  hint?: string;
  previous?: number;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4">
      <span className="text-[13px] text-neutral-500">{label}</span>
      <span className="flex items-baseline gap-2">
        <span className="text-[26px] leading-8 font-semibold tracking-[-0.5px] tabular-nums">
          {suffix === "%" ? "%" : null}
          {value.toLocaleString("tr-TR")}
        </span>
        {previous !== undefined ? <Change value={value} previous={previous} /> : null}
      </span>
      {hint ? <span className="text-[12px] text-neutral-400">{hint}</span> : null}
    </div>
  );
}

/** Dikey sütunlar (saat ve gün dağılımı); en yoğun sütun koyu. */
export function ColumnChart({ items, label }: { items: { label: string; value: number }[]; label: string }) {
  const max = Math.max(1, ...items.map((item) => item.value));
  const peak = items.reduce((best, item) => (item.value > best.value ? item : best), items[0]);
  const every = items.length > 12 ? 3 : 1;
  return (
    <figure className="flex flex-col gap-2 p-4 sm:p-5">
      <div className="flex h-32 items-end gap-[3px]" role="img" aria-label={label}>
        {items.map((item) => (
          <div key={item.label} className="flex h-full flex-1 items-end" title={`${item.label}: ${item.value} görüntüleme`}>
            <div
              className={cn("w-full rounded-t-[3px]", item === peak && item.value ? "bg-neutral-900" : "bg-neutral-300")}
              style={{ height: `${Math.max(item.value ? 4 : 0, (item.value / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-[3px] text-[10.5px] text-neutral-400">
        {items.map((item, index) => (
          <span key={item.label} className="flex-1 text-center">
            {index % every === 0 ? item.label : ""}
          </span>
        ))}
      </div>
      {peak?.value ? (
        <figcaption className="text-[12px] text-neutral-500">
          En yoğun: <strong className="font-medium text-neutral-900">{peak.label}</strong>
        </figcaption>
      ) : null}
    </figure>
  );
}
