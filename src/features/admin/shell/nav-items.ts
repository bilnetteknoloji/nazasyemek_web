import {
  Award,
  House,
  ChartLine,
  Images,
  Inbox,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; icon: LucideIcon; tab?: boolean };

/** `tab: true` olanlar telefondaki alt çubukta; gerisi "Diğer" sayfasında. */
export const navItems: NavItem[] = [
  { href: "/admin", label: "Özet", icon: LayoutDashboard, tab: true },
  { href: "/admin/talepler", label: "Talepler", icon: Inbox, tab: true },
  { href: "/admin/musteriler", label: "Müşteriler", icon: Users, tab: true },
  { href: "/admin/menu", label: "Menü", icon: UtensilsCrossed, tab: true },
  { href: "/admin/ana-sayfa", label: "Ana Sayfa", icon: House },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/belgeler", label: "Belgeler", icon: Award },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/analiz", label: "Analiz", icon: ChartLine },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

/** Etkin bölüm: Özet tam eşleşir, diğerleri alt sayfalarını da kapsar. */
export function useActiveHref() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  return (
    navItems.findLast((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.href ?? null
  );
}
