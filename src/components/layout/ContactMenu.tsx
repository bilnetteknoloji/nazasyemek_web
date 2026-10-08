"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Clock, Mail, MapPin, Phone, Smartphone } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSite } from "@/components/SiteProvider";
import { PhoneNaz } from "@/components/ui/PhoneNaz";
import { SocialLinks, WhatsAppIcon } from "@/components/ui/SocialIcons";

/**
 * Header'daki iletişim menüsü.
 * Stitch'in sağ üstteki segmented pill grubuyla aynı biçim dilinde;
 * telefon, WhatsApp ve e-postayı tek bir açılır alanda toplar.
 * Mobilde yalnızca tek yuvarlak telefon düğmesi görünür ve menüyü açar;
 * üç numara (sabit hat, mobil, WhatsApp) menünün başında alt alta durur.
 */
export function ContactMenu() {
  const site = useSite();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const phones = [
    {
      label: "Sabit hat",
      href: site.phoneHref,
      icon: <Phone className="text-brand-600 mt-0.5 size-4 shrink-0" aria-hidden />,
      number: <PhoneNaz display={site.phoneDisplay} label={site.phone} />,
    },
    {
      label: "Mobil",
      href: site.mobileHref,
      icon: <Smartphone className="text-brand-600 mt-0.5 size-4 shrink-0" aria-hidden />,
      number: <PhoneNaz display={site.mobileDisplay} label={site.mobile} />,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/${site.whatsapp}`,
      external: true,
      icon: <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-[#25D366]" />,
      number: site.whatsappDisplay,
    },
  ];

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="İletişim"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "text-brand-800 bg-container flex size-10 items-center justify-center rounded-full transition-colors lg:hidden",
          open && "bg-brand-800 text-white",
        )}
      >
        <Phone className="size-[18px]" aria-hidden />
      </button>

      <div className="bg-container hidden items-center gap-1 rounded-full p-1 lg:flex">
        <a
          href={site.phoneHref}
          className="text-brand-800 shadow-soft flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-bold whitespace-nowrap transition-colors"
        >
          <Phone className="size-4 shrink-0" aria-hidden />
          <span className="hidden xl:inline">{site.phone}</span>
          <span className="sr-only xl:hidden">Telefon: {site.phone}</span>
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="Diğer iletişim kanalları"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "text-muted hover:text-brand-800 rounded-full p-1.5 transition-colors",
            open && "text-brand-800",
          )}
        >
          <ChevronDown
            className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>

      <div
        hidden={!open}
        className="border-line/70 shadow-lift absolute top-full right-0 z-50 mt-2 w-72 rounded-2xl border bg-white p-2 max-lg:mt-3 max-lg:w-[calc(100vw-1.5rem)] max-lg:max-w-sm"
      >
        <ul className="space-y-1">
          {phones.map((phone) => (
            <li key={phone.label}>
              <a
                href={phone.href}
                {...(phone.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="hover:bg-cream-deep flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors"
              >
                {phone.icon}
                <span>
                  <span className="text-ink block text-sm font-semibold">{phone.label}</span>
                  <span className="text-muted block text-xs">{phone.number}</span>
                </span>
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${site.email}`}
              className="hover:bg-cream-deep flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors"
            >
              <Mail className="text-brand-600 mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                <span className="text-ink block text-sm font-semibold">E-posta</span>
                <span className="text-muted block text-xs">{site.email}</span>
              </span>
            </a>
          </li>
        </ul>

        <div className="border-line mt-2 space-y-2 border-t px-3 pt-3 max-lg:hidden">
          <p className="text-muted flex items-start gap-2 text-xs leading-relaxed">
            <MapPin className="text-brand-400 mt-0.5 size-3.5 shrink-0" aria-hidden />
            {site.address.full}
          </p>
          <p className="text-muted flex items-center gap-2 text-xs">
            <Clock className="text-brand-400 size-3.5 shrink-0" aria-hidden />
            {site.workingHours}
          </p>
          <SocialLinks size="sm" className="pt-1 pb-1" />
        </div>
      </div>
    </div>
  );
}
