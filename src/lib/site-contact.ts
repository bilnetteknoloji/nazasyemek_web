import { site as staticSite } from "@/data/site";

/**
 * Panelden değiştirilebilen iletişim kanalları (settings → `contact`).
 * Telefonlar ekranda göründüğü gibi yazılır ("0212 470 16 29"); arama ve
 * WhatsApp bağlantıları buradan türetilir.
 */
export type ContactSettings = {
  phone: string;
  mobile: string;
  whatsapp: string;
  email: string;
  workingHours: string;
  instagram: string;
  tiktok: string;
  facebook: string;
};

export const defaultContact: ContactSettings = {
  phone: staticSite.phone,
  mobile: staticSite.mobile,
  whatsapp: staticSite.whatsappDisplay,
  email: staticSite.email,
  workingHours: staticSite.workingHours,
  instagram: staticSite.social.instagram.href,
  tiktok: staticSite.social.tiktok.href,
  facebook: staticSite.social.facebook.verified ? staticSite.social.facebook.href : "",
};

type SocialLink = { label: string; href: string; verified: boolean };

/** `src/data/site.ts` ile aynı biçim; iletişim alanları ayarlardan gelir. */
export type Site = Omit<
  typeof staticSite,
  | "phone"
  | "phoneHref"
  | "phoneDisplay"
  | "whatsapp"
  | "whatsappDisplay"
  | "mobile"
  | "mobileHref"
  | "mobileDisplay"
  | "email"
  | "workingHours"
  | "social"
> & {
  phone: string;
  phoneHref: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  mobile: string;
  mobileHref: string;
  mobileDisplay: string;
  email: string;
  workingHours: string;
  social: { instagram: SocialLink; tiktok: SocialLink; facebook: SocialLink };
};

const digits = (value: string) => value.replace(/\D/g, "");

/** 0212 470 16 29 / 212… / +90… → +902124701629 */
export function toE164(value: string) {
  const d = digits(value);
  if (d.length === 11 && d.startsWith("0")) return `+9${d}`;
  if (d.length === 10) return `+90${d}`;
  return `+${d}`;
}

/**
 * Numara aynı kaldıkça "NAZ" tuş takımı gösterimi (0212 470 1 629) korunur;
 * değiştirilirse yazıldığı gibi gösterilir.
 */
function display(value: string, original: string, originalDisplay: string) {
  return digits(value) === digits(original) ? originalDisplay : value;
}

function handle(href: string) {
  return href.replace(/\/+$/, "").split("/").pop()?.replace(/^@/, "") ?? href;
}

export function resolveSite(settings: Partial<ContactSettings> | null): Site {
  const c = { ...defaultContact, ...(settings ?? {}) };
  return {
    ...staticSite,
    phone: c.phone,
    phoneHref: `tel:${toE164(c.phone)}`,
    phoneDisplay: display(c.phone, staticSite.phone, staticSite.phoneDisplay),
    mobile: c.mobile,
    mobileHref: `tel:${toE164(c.mobile)}`,
    mobileDisplay: display(c.mobile, staticSite.mobile, staticSite.mobileDisplay),
    whatsapp: toE164(c.whatsapp).slice(1),
    whatsappDisplay: c.whatsapp,
    email: c.email,
    workingHours: c.workingHours,
    social: {
      instagram: { label: handle(c.instagram), href: c.instagram, verified: Boolean(c.instagram) },
      tiktok: { label: handle(c.tiktok), href: c.tiktok, verified: Boolean(c.tiktok) },
      facebook: c.facebook
        ? { label: staticSite.social.facebook.label, href: c.facebook, verified: true }
        : { ...staticSite.social.facebook },
    },
  };
}
