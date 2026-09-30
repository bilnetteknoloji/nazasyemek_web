"use client";

import { useMemo, useState } from "react";
import { Img as Image } from "@/components/ui/Img";
import { Expand, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { gallery, type GalleryGroup } from "@/data/media";

/** Grup sırası ve adları; öğeler `npm run assets` → `buildGallery` içinde atanır. */
const groupLabels: Record<GalleryGroup, string> = {
  tesis: "Üretim Tesisi",
  mutfak: "Mutfak & Hazırlık",
  kumanya: "Kumanya & Paket Öğün",
  servis: "Servis & Sunum",
  organizasyon: "Organizasyon",
  video: "Videolar",
};

const columnClass = {
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-3 lg:grid-cols-4",
} as const;

export function GalleryGrid({
  limit,
  withFilters = true,
  columns = 4,
  groups,
}: {
  limit?: number;
  withFilters?: boolean;
  columns?: 3 | 4;
  /** Yalnızca bu gruplar (ör. önizlemelerde videosuz). Verilmezse hepsi. */
  groups?: GalleryGroup[];
}) {
  const [filter, setFilter] = useState<GalleryGroup | "tumu">("tumu");
  const [index, setIndex] = useState<number | null>(null);

  const pool = useMemo(
    () => (groups ? gallery.filter((item) => groups.includes(item.group)) : gallery),
    [groups],
  );

  const filters = useMemo(
    () =>
      (Object.keys(groupLabels) as GalleryGroup[])
        .map((id) => ({
          id,
          label: groupLabels[id],
          count: pool.filter((item) => item.group === id).length,
        }))
        .filter((item) => item.count > 0),
    [pool],
  );

  const list = useMemo(() => {
    const filtered = filter === "tumu" ? pool : pool.filter((item) => item.group === filter);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [filter, limit, pool]);

  const chip = (active: boolean) =>
    cn(
      "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
      active
        ? "border-brand-800 bg-brand-800 text-cream shadow-soft"
        : "border-line text-muted hover:border-brand-200 hover:text-brand-800 bg-white/70",
    );
  const countClass = (active: boolean) =>
    cn(
      "rounded-full px-1.5 text-[11px] tabular-nums",
      active ? "bg-white/20" : "bg-container",
    );

  return (
    <div>
      {withFilters ? (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setFilter("tumu");
              setIndex(null);
            }}
            aria-pressed={filter === "tumu"}
            className={chip(filter === "tumu")}
          >
            Tümü
            <span className={countClass(filter === "tumu")}>{pool.length}</span>
          </button>
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setFilter(item.id);
                setIndex(null);
              }}
              aria-pressed={filter === item.id}
              className={chip(filter === item.id)}
            >
              {item.label}
              <span className={countClass(filter === item.id)}>{item.count}</span>
            </button>
          ))}
        </div>
      ) : null}

      {/* Eşit oranlı tile'lar: satırlar her kırılma noktasında hizalı kalır. */}
      <ul className={cn("grid grid-cols-2 gap-3 sm:gap-4", columnClass[columns])}>
        {list.map((item, i) => (
          <Reveal
            as="li"
            key={item.src}
            delay={(i % 4) * 0.05}
            className="group border-line/70 shadow-soft hover:shadow-lift relative overflow-hidden rounded-2xl border bg-white transition-shadow duration-500"
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block w-full cursor-zoom-in"
              aria-label={`${item.alt} — ${item.type === "video" ? "oynat" : "büyüt"}`}
            >
              <span className="block aspect-[4/3] overflow-hidden bg-black">
                <Image
                  src={item.thumb}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 32vw, 24vw"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
              </span>

              {item.type === "video" ? (
                <>
                  <span
                    aria-hidden
                    className="text-brand-800 absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition-transform duration-300 group-hover:scale-110"
                  >
                    <Play className="ml-0.5 size-6 fill-current" />
                  </span>
                  {/* Videolarda filigran dosyaya işlenemediği için üstte gösterilir. */}
                  <Image
                    src="/brand/logo-light.png"
                    alt=""
                    aria-hidden
                    width={96}
                    height={99}
                    className="pointer-events-none absolute right-[3%] bottom-[3%] h-auto w-[10%] opacity-70 drop-shadow"
                  />
                </>
              ) : null}

              <span
                aria-hidden
                className="from-brand-950/75 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              <span
                aria-hidden
                className="text-cream absolute inset-x-4 bottom-3 translate-y-2 text-left text-xs leading-snug opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
              >
                {item.alt}
              </span>

              {item.type === "photo" ? (
                <span
                  aria-hidden
                  className="text-brand-800 absolute top-3 right-3 flex size-8 scale-90 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
                >
                  <Expand className="size-4" />
                </span>
              ) : null}
            </button>
          </Reveal>
        ))}
      </ul>

      <Lightbox
        items={list}
        index={index}
        onClose={() => setIndex(null)}
        onChange={setIndex}
      />
    </div>
  );
}
