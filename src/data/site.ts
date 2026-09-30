import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Factory,
  FileText,
  House,
  Images,
  LayoutGrid,
  Mail,
  ShieldCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react";

/**
 * Kurumsal bilgiler ve navigasyon.
 * Adres ve unvan sertifikalardan doğrulandı; telefon, WhatsApp ve sosyal medya
 * hesapları müşteriden geldi. TODO işaretli alanlar hâlâ yer tutucu.
 */

export const site = {
  name: "NAZ-AŞ",
  legalName: "NAZ-AŞ YEMEK",
  tagline: "Aş'a Lezzet Katar",
  description:
    "Fabrika, işyeri, okul ve kurumlara ISO belgeli mutfağımızda hazırlanan günlük tabldot, kumanya ve organizasyon yemeği hizmeti.",
  // Yayında NEXT_PUBLIC_SITE_URL ile ezilir; canonical/sitemap/OG adresleri buradan üretilir.
  // TODO: gerçek alan adı belli olunca yayın ortamında bu değişken ayarlanmalı.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nazasyemek.com",
  address: {
    street: "Mahmutbey Mah. Kültür Cad. No: 25/A",
    district: "Bağcılar",
    city: "İstanbul",
    country: "TR",
    full: "Mahmutbey Mah. Kültür Cad. No: 25/A, Bağcılar / İstanbul",
  },
  phone: "0212 470 16 29",
  phoneHref: "tel:+902124701629",
  whatsapp: "905454701629", // wa.me biçimi (ülke kodu, başında + ve 0 yok)
  whatsappDisplay: "0545 470 16 29",
  // Yalnızca iletişim sayfasında gösterilir.
  mobile: "0543 205 86 86",
  mobileHref: "tel:+905432058686",
  email: "info@nazasyemek.com",
  // Formlar (Hızlı Ön Hesaplama, Teklif) bu adrese FormSubmit ile mail olarak düşer.
  formEndpoint:
    process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "https://formsubmit.co/ajax/info@nazasyemek.com",
  workingHours: "Pazartesi – Cumartesi, 08:00 – 18:00",
  social: {
    instagram: { label: "nazasyemek", href: "https://www.instagram.com/nazasyemek/", verified: true },
    tiktok: { label: "nazasyemek", href: "https://www.tiktok.com/@nazasyemek", verified: true },
    facebook: {
      label: "Naz-Aş Yemek",
      // TODO: gerçek sayfa linki müşteriden gelecek; şimdilik Facebook araması.
      href: "https://www.facebook.com/search/top?q=Naz-A%C5%9F%20Yemek",
      verified: false,
    },
  },
} as const;

export type NavItem = { label: string; href: string; icon: LucideIcon; description?: string };
export type NavGroup = { label: string; icon: LucideIcon; items: NavItem[] };
export type NavEntry = NavItem | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;

/**
 * Ana menü. Yakın konulu sayfalar açılır gruplarda toplanır — düz liste
 * sekiz başlığa çıkınca header sıkışıyordu.
 */
export const mainNav: NavEntry[] = [
  { label: "Ana Sayfa", href: "/", icon: House },
  { label: "Hakkımızda", href: "/hakkimizda", icon: Users },
  {
    label: "Çözümlerimiz",
    icon: LayoutGrid,
    items: [
      {
        label: "Hizmetlerimiz",
        href: "/hizmetlerimiz",
        icon: UtensilsCrossed,
        description: "Tabldot, kumanya, organizasyon ve yerinde mutfak",
      },
      {
        label: "Üretim Tesisimiz",
        href: "/uretim",
        icon: Factory,
        description: "Beş aşamalı üretim süreci ve hijyen standartları",
      },
      {
        label: "Menü & Katalog",
        href: "/menu",
        icon: BookOpen,
        description: "Dört haftalık örnek menü ve servis standartları",
      },
    ],
  },
  {
    label: "Kurumsal Güvence",
    icon: ShieldCheck,
    items: [
      {
        label: "Belgelerimiz",
        href: "/belgelerimiz",
        icon: Award,
        description: "ISO, Helal, GHP ve GMP sertifikalarımız",
      },
      {
        label: "Galeri",
        href: "/galeri",
        icon: Images,
        description: "Mutfağımızdan ve sahadan fotoğraflar",
      },
    ],
  },
  { label: "İletişim", href: "/iletisim", icon: Mail },
];

/** Footer ve sitemap için düzleştirilmiş liste. */
export const flatNav: NavItem[] = mainNav.flatMap((entry) =>
  isNavGroup(entry) ? entry.items : [entry],
);

export const legalNav: NavItem[] = [
  { label: "KVKK Aydınlatma Metni", href: "/kvkk", icon: FileText },
  { label: "Gizlilik Politikası", href: "/gizlilik-politikasi", icon: FileText },
  { label: "Çerez Politikası", href: "/cerez-politikasi", icon: FileText },
];

// Kapasite rakamları src/data/home.ts içindeki `capacity` alanına taşındı.
