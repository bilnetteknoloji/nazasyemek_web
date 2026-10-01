"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, House, Menu, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/cn";
import { site } from "@/data/site";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { OPEN_MOBILE_NAV } from "./MobileNav";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

const tab =
  "flex flex-1 flex-col items-center justify-center gap-1 text-[10.5px] font-semibold transition-colors active:scale-95";

/**
 * Mobil alt sekme çubuğu (lg altı): Ana Sayfa · Hizmetler · Teklif · WhatsApp · Menü.
 * "Menü" mevcut tam ekran çekmeceyi açar. Header'dan ayrı render edilir —
 * header'daki backdrop-blur `fixed` öğeler için yeni bağlam yaratıyor.
 */
export function MobileTabBar() {
  const pathname = usePathname();

  const link = (href: string, label: string, Icon: typeof House) => {
    const active = isActive(pathname, href);
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(tab, active ? "text-brand-800" : "text-muted")}
      >
        <Icon className="size-[22px]" strokeWidth={active ? 2.3 : 1.8} aria-hidden />
        {label}
      </Link>
    );
  };

  return (
    <nav
      aria-label="Hızlı menü"
      className="border-line/80 fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(30_27_24/0.18)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch px-2">
        {link("/", "Ana Sayfa", House)}
        {link("/hizmetlerimiz", "Hizmetler", UtensilsCrossed)}

        <Link
          href="/teklif-al"
          aria-current={isActive(pathname, "/teklif-al") ? "page" : undefined}
          className={cn(tab, "text-brand-800")}
        >
          <span className="bg-brand-600 shadow-glow -mt-6 flex size-[52px] items-center justify-center rounded-full text-white ring-4 ring-white">
            <ClipboardList className="size-6" aria-hidden />
          </span>
          Teklif Al
        </Link>

        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(tab, "text-muted")}
        >
          <WhatsAppIcon className="size-[22px] text-[#25D366]" />
          WhatsApp
        </a>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_MOBILE_NAV))}
          aria-haspopup="dialog"
          className={cn(tab, "text-muted")}
        >
          <Menu className="size-[22px]" strokeWidth={1.8} aria-hidden />
          Menü
        </button>
      </div>
    </nav>
  );
}
