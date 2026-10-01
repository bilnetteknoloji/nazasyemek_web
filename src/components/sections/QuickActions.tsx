import { Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { site } from "@/data/site";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.legalName}, ${site.address.full}`,
)}`;

const actions = [
  { label: "Ara", href: site.phoneHref, icon: Phone, tint: "text-brand-700" },
  {
    label: "WhatsApp",
    href: `https://wa.me/${site.whatsapp}`,
    icon: WhatsAppIcon,
    tint: "text-[#25D366]",
    external: true,
  },
  { label: "Konum", href: mapsHref, icon: MapPin, tint: "text-brand-700", external: true },
  { label: "E-posta", href: `mailto:${site.email}`, icon: Mail, tint: "text-brand-700" },
];

/** Mobilde hero altında yan yana dört hızlı iletişim kısayolu. */
export function QuickActions() {
  return (
    <div className="bg-cream-deep border-line border-b px-5 pt-5 pb-1 sm:px-8 lg:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-4 gap-2.5">
        {actions.map(({ label, href, icon: Icon, tint, external }) => (
          <li key={label}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="shadow-soft flex flex-col items-center gap-1.5 rounded-2xl bg-white py-3 transition-transform active:scale-95"
            >
              <Icon className={`size-5 ${tint}`} />
              <span className="text-ink text-[11px] font-semibold">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
