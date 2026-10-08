import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/**
 * Panel sayfa başlığı. Telefonda iOS'taki "büyük başlık" gibi okunur; geri
 * bağlantısı detay sayfalarında başlığın üstünde durur.
 */
export function PageHeader({
  title,
  lead,
  actions,
  back,
}: {
  title: string;
  lead?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="flex flex-col gap-3">
      {back ? (
        <Link
          href={back.href}
          className="pressable -ml-1 flex w-fit items-center gap-0.5 text-[14px] font-medium text-neutral-500 hover:text-neutral-900 pointer-coarse:min-h-11"
        >
          <ChevronLeft className="size-[18px]" aria-hidden />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-[26px] leading-8 font-semibold tracking-[-0.6px] text-balance text-neutral-900 lg:text-[24px]">
            {title}
          </h1>
          {lead ? <p className="text-[14px] text-neutral-500">{lead}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
