import { site } from "@/data/site";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

/** Sağ altta sabit WhatsApp butonu — resmi logo ve marka yeşili (#25D366). */
export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
      className="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.55)] ring-4 ring-white/70 transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:bg-[#1ebe5b] sm:right-8 sm:bottom-8"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
