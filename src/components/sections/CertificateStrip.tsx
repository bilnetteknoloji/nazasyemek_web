import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { getCertificates } from "@/lib/content/media";

export async function CertificateStrip() {
  const certificates = await getCertificates();
  return (
    <Section className="bg-inverse">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="text-accent-300 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-wider uppercase">
            Belgelerimiz
          </p>
          <h2 className="font-display text-inverse-on mt-4 text-3xl leading-[1.15] sm:text-4xl">
            {certificates.length} ayrı belgeyle kayıt altında
          </h2>
          <p className="text-inverse-on/75 mt-5 leading-relaxed">
            Kalite, gıda güvenliği, hijyen, iş sağlığı ve çevre yönetimi
            sistemlerimiz bağımsız kuruluş tarafından belgelendirilmiştir.
          </p>
          <Link
            href="/belgelerimiz"
            className="text-accent-300 hover:text-accent-400 group mt-7 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            Belgeleri inceleyin
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </Reveal>

        <ul className="mobile-rail md:grid gap-3 [--rail-item:62%] sm:grid-cols-2">
          {certificates.map((cert, index) => (
            <Reveal
              as="li"
              key={cert.id}
              delay={(index % 4) * 0.06}
              className="border-inverse-on/12 hover:border-accent-300/50 flex items-start gap-3 rounded-2xl border bg-white/[0.04] p-4 transition-colors duration-500"
            >
              <BadgeCheck className="text-accent-400 mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="text-inverse-on text-sm font-semibold">{cert.title}</p>
                <p className="text-inverse-on/60 mt-1 text-xs">{cert.subtitle}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
