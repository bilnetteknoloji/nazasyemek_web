import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { adminButton } from "./button";

/** Önceki / sonraki sayfalama. `href(n)` sayfa n'nin bağlantısını üretir. */
export function Pagination({ page, pages, href }: { page: number; pages: number; href: (page: number) => string }) {
  if (pages <= 1) return null;
  const link = (target: number, label: string, icon: React.ReactNode) =>
    target < 1 || target > pages ? (
      <span aria-disabled className={adminButton({ variant: "secondary", className: "opacity-50" })}>
        {icon}
        <span className="max-sm:sr-only">{label}</span>
      </span>
    ) : (
      <Link href={href(target)} className={adminButton({ variant: "secondary" })}>
        {icon}
        <span className="max-sm:sr-only">{label}</span>
      </Link>
    );

  return (
    <nav aria-label={`Sayfa ${page} / ${pages}`} className="flex items-center justify-between gap-3">
      {link(page - 1, "Önceki", <ChevronLeft aria-hidden />)}
      <span className="text-[13px] text-neutral-500">
        Sayfa {page} / {pages}
      </span>
      {link(page + 1, "Sonraki", <ChevronRight aria-hidden />)}
    </nav>
  );
}
