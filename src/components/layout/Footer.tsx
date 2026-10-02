import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SocialLinks, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { PhoneNaz } from "@/components/ui/PhoneNaz";
import { certificates } from "@/data/media";
import { legalNav, flatNav, site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-container-high text-subtle">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1.2fr]">
          <div>
            <Image
              src="/brand/logo.png"
              alt={`${site.legalName} logosu`}
              width={260}
              height={267}
              className="h-20 w-auto"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed">
              {site.description}
            </p>
            <SocialLinks className="mt-6" />
          </div>

          <nav aria-label="Alt menü">
            <h2 className="text-brand-900 text-sm font-semibold tracking-[0.2em] uppercase">
              Sayfalar
            </h2>
            <ul className="mt-6 space-y-3 text-sm">
              {flatNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-brand-800 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/teklif-al" className="hover:text-brand-800 transition-colors">
                  Teklif Alın
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-brand-900 text-sm font-semibold tracking-[0.2em] uppercase">
              İletişim
            </h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-600 mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{site.address.full}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-brand-600 mt-0.5 size-4 shrink-0" aria-hidden />
                <a href={site.phoneHref} className="hover:text-brand-800 transition-colors">
                  <PhoneNaz />
                </a>
              </li>
              <li className="flex items-center gap-3">
                <WhatsAppIcon className="size-4 shrink-0 text-[#25D366]" />
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-800 transition-colors"
                >
                  WhatsApp: {site.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-600 size-4 shrink-0" aria-hidden />
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-brand-800 transition-colors"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="text-brand-600 mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{site.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-line mt-14 border-t pt-10">
          <h2 className="text-muted text-xs font-semibold tracking-[0.28em] uppercase">
            Kalite ve gıda güvenliği belgelerimiz
          </h2>
          <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
            {certificates.map((cert) => (
              <li
                key={cert.id}
                className="border-line text-subtle rounded-full border bg-white/60 px-3 py-1 text-xs"
              >
                {cert.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-line mt-10 flex flex-col gap-4 border-t pt-8 text-xs lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {site.legalName}. Tüm hakları saklıdır.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-brand-800 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Tasarım & geliştirme: yalnızca logo (metin yok, kullanıcı kararı). */}
          <Image
            src="/brand/bilnet-yazilim.png"
            alt="Tasarım ve geliştirme: Bilnet Yazılım"
            title="Tasarım ve geliştirme: Bilnet Yazılım"
            width={426}
            height={112}
            className="h-7 w-auto shrink-0 self-start lg:self-auto"
          />
        </div>
      </div>
    </footer>
  );
}
