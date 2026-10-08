import { cn } from "@/lib/cn";

/**
 * Panel kartı: ince kenarlık, gölgesiz. `flush` verilirse telefonda
 * kenardan kenara uzanır — uygulama listesi gibi.
 */
export function Card({
  as: Element = "div",
  flush = false,
  className,
  children,
}: {
  as?: "div" | "section" | "article";
  flush?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Element
      className={cn(
        "rounded-xl border border-neutral-200 bg-white",
        flush && "max-sm:-mx-4 max-sm:rounded-none max-sm:border-x-0",
        className,
      )}
    >
      {children}
    </Element>
  );
}

/** Kart içi başlık satırı: başlık solda, eylemler sağda, altında ayraç. */
export function CardHeader({
  title,
  actions,
  className,
}: {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-12 items-center justify-between gap-3 border-b border-neutral-200 px-4 py-2.5 sm:px-5",
        className,
      )}
    >
      <h2 className="text-[14px] font-semibold text-neutral-900">{title}</h2>
      {actions}
    </div>
  );
}

/** Boş liste durumu. */
export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <p className="text-[14px] font-medium text-neutral-900">{title}</p>
      {children ? <div className="text-[13px] text-neutral-500">{children}</div> : null}
    </div>
  );
}
