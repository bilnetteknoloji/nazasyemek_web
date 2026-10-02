import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import {
  Building2,
  CalendarClock,
  Clock,
  Headset,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Smartphone,
  Truck,
} from "lucide-react";
import { photos } from "./media";
import { site } from "./site";

const photo = (name: string) =>
  photos.find((item) => item.src.endsWith(name)) ?? photos[0];

/**
 * İletişim sayfası — yapı Stitch "İletişim" ekranından alındı.
 *
 * ⚠️ Tasarımdaki iletişim bilgileri başka bir firmaya aitti (Bursa adresleri,
 * bursa@/istanbul@nazascatering.com.tr, 444'lü hatlar). Hiçbiri kullanılmadı;
 * gerçek adres (sertifikalardan doğrulandı) ve site.ts'teki kanallar kullanılır.
 * site.ts'teki telefon/e-posta/WhatsApp hâlâ TODO — müşteriden gelecek.
 */

export const contactHero = {
  badge: "Kurumsal Çözüm & İletişim",
  icon: Headset as LucideIcon,
  title: "Bizimle İletişime Geçin",
  description:
    "Kurumunuzun toplu yemek, yerinde mutfak ve catering ihtiyaçları için ekibimizle tanışın; tesisinizi keşfedelim veya şirketinize özel numune tadım menüsü hazırlayalım.",
  chips: [
    { icon: Clock as LucideIcon, label: site.workingHours },
    { icon: CalendarClock as LucideIcon, label: "Bir iş günü içinde geri dönüş" },
    { icon: Truck as LucideIcon, label: "İstanbul geneli dağıtım" },
  ],
  photo: photo("nazas7.webp"),
};

export const contactCards: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  lines: string[];
  links: {
    icon: ComponentType<{ className?: string }>;
    /** İkona özel renk (ör. WhatsApp marka yeşili). */
    iconClassName?: string;
    label: string;
    /** Etiketten sonra PhoneNaz ile gösterilecek numara (son üç hane altında NAZ). */
    naz?: { display: string; label: string };
    href: string;
    external?: boolean;
  }[];
}[] = [
  {
    icon: Building2,
    eyebrow: "Merkez",
    title: "Üretim Tesisi & Yönetim",
    lines: [site.address.full],
    links: [
      {
        icon: Phone,
        label: "",
        naz: { display: site.phoneDisplay, label: site.phone },
        href: site.phoneHref,
      },
      { icon: Mail, label: site.email, href: `mailto:${site.email}` },
    ],
  },
  {
    icon: MessageCircle,
    eyebrow: "Hızlı Hat",
    title: "Anlık İletişim",
    lines: ["Teklif, menü ve keşif talepleriniz için en hızlı kanal."],
    links: [
      {
        icon: Phone,
        label: "Sabit hat:",
        naz: { display: site.phoneDisplay, label: site.phone },
        href: site.phoneHref,
      },
      {
        icon: Smartphone,
        label: "Mobil / GSM:",
        naz: { display: site.mobileDisplay, label: site.mobile },
        href: site.mobileHref,
      },
      {
        icon: WhatsAppIcon,
        iconClassName: "text-[#25D366]",
        label: `WhatsApp: ${site.whatsappDisplay}`,
        href: `https://wa.me/${site.whatsapp}`,
        external: true,
      },
    ],
  },
  {
    icon: Clock,
    eyebrow: "Ziyaret",
    title: "Çalışma Saatleri",
    lines: [site.workingHours, "Pazar: randevulu ziyaret"],
    links: [],
  },
];

export const visitInfo = {
  eyebrow: "Ulaşım & Ziyaret Rehberi",
  title: "Tesisimize Yol Tarifi Alın",
  description:
    "Bağcılar'daki üretim tesisimiz ana arter bağlantılarına yakındır; keşif ve tadım ziyaretleri için randevu alabilirsiniz.",
  hours: [
    { label: "Hafta içi (Pzt – Cuma)", value: "08:00 – 18:00" },
    { label: "Cumartesi", value: "08:00 – 18:00" },
    { label: "Pazar", value: "Randevulu" },
  ],
  note: {
    icon: Truck as LucideIcon,
    title: "Lojistik Kabiliyet",
    text: "Isı yalıtımlı termobox kaplar ve sıcaklık takipli araçlarımızla servis sıcaklığını koruyarak teslimat yapıyoruz.",
  },
  addressIcon: MapPin as LucideIcon,
};
