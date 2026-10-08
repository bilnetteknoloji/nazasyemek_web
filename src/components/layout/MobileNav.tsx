"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mail, MapPin, Phone, Smartphone, X } from "lucide-react";
import { isNavGroup, mainNav } from "@/data/site";
import { useSite } from "@/components/SiteProvider";
import { ButtonLink } from "@/components/ui/Button";
import { SocialLinks, WhatsAppIcon } from "@/components/ui/SocialIcons";

/** Alt sekme çubuğundaki "Menü" bu olayla çekmeceyi açar. */
export const OPEN_MOBILE_NAV = "naz:open-mobile-nav";

export function MobileNav() {
  const site = useSite();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_MOBILE_NAV, onOpen);
    return () => window.removeEventListener(OPEN_MOBILE_NAV, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>

      {/*
        Çekmece portal ile body'ye taşınır: <header> üzerindeki backdrop-blur,
        içindeki `position: fixed` öğeler için yeni bir konumlama bağlamı
        yarattığından çekmece header yüksekliğine sıkışıyordu.
      */}
      {typeof document === "undefined"
        ? null
        : createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menü"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-brand-950 fixed inset-0 z-50 flex flex-col lg:hidden"
                >
                  <div className="flex h-20 shrink-0 items-center justify-between px-5 sm:px-8">
                    <span className="text-cream/60 text-xs font-semibold tracking-[0.28em] uppercase">
                      Menü
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Menüyü kapat"
                      className="text-cream/80 hover:bg-cream/10 hover:text-cream rounded-full p-2.5 transition-colors"
                    >
                      <X className="size-6" aria-hidden />
                    </button>
                  </div>

                  <nav
                    aria-label="Mobil menü"
                    className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8"
                  >
                    {mainNav.map((entry, index) =>
                      isNavGroup(entry) ? (
                        <motion.div
                          key={entry.label}
                          initial={reduced ? false : { opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.06 * index,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="py-2"
                        >
                          <p className="text-cream/45 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
                            <entry.icon className="size-3.5" aria-hidden />
                            {entry.label}
                          </p>
                          <ul className="border-cream/10 mt-2 space-y-1 border-l pl-4">
                            {entry.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setOpen(false)}
                                  className="text-cream font-display hover:text-accent-300 flex items-center gap-3 py-1.5 text-xl transition-colors"
                                >
                                  <item.icon className="text-accent-300 size-5 shrink-0" aria-hidden />
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={entry.href}
                          initial={reduced ? false : { opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.06 * index,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <Link
                            href={entry.href}
                            onClick={() => setOpen(false)}
                            className="text-cream font-display hover:text-accent-300 flex items-center gap-3 py-2.5 text-2xl transition-colors"
                          >
                            <entry.icon className="text-accent-300 size-6 shrink-0" aria-hidden />
                            {entry.label}
                          </Link>
                        </motion.div>
                      ),
                    )}
                  </nav>

                  <div className="border-cream/10 shrink-0 space-y-3 border-t px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
                    <ButtonLink
                      href="/teklif-al"
                      variant="light"
                      size="lg"
                      className="w-full"
                      onClick={() => setOpen(false)}
                    >
                      Teklif Alın
                    </ButtonLink>
                    <div className="text-cream/70 space-y-2 text-sm">
                      <a
                        href={site.phoneHref}
                        className="flex items-center gap-3"
                      >
                        <Phone className="text-accent-400 size-4" aria-hidden />
                        {site.phone}
                      </a>
                      <a
                        href={`https://wa.me/${site.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3"
                      >
                        <WhatsAppIcon className="size-4 text-[#25D366]" />
                        WhatsApp: {site.whatsappDisplay}
                      </a>
                      <a href={site.mobileHref} className="flex items-center gap-3">
                        <Smartphone className="text-accent-400 size-4" aria-hidden />
                        Mobil: {site.mobile}
                      </a>
                      <a
                        href={`mailto:${site.email}`}
                        className="flex items-center gap-3"
                      >
                        <Mail className="text-accent-400 size-4" aria-hidden />
                        {site.email}
                      </a>
                      <p className="flex items-start gap-3">
                        <MapPin
                          className="text-accent-400 mt-0.5 size-4 shrink-0"
                          aria-hidden
                        />
                        {site.address.full}
                      </p>
                      <SocialLinks size="sm" className="pt-2" />
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )}
    </>
  );
}
