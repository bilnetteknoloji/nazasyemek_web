import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/data/services";

/**
 * Stitch Üretim bölüm 3: kurumsal hizmet modelleri.
 * İçerik uydurulmadı — mevcut `services` verisi kullanılıyor.
 */
export function ServiceModels() {
  return (
    <Section className="bg-container/60">
      <SectionHeading
        eyebrow="Kurumsal Modeller"
        title="İşletmenizin İhtiyacına Uygun Çözümler"
        description="İster kendi tesisinizde mutfak kuralım, ister merkez mutfağımızdan sıcak ve taze sevk edelim."
      />

      <ul className="mt-14 grid gap-6 lg:grid-cols-2">
        {services.map((service, index) => (
          <Reveal
            as="li"
            key={service.slug}
            delay={(index % 2) * 0.08}
            className="group border-line/70 shadow-soft hover:shadow-lift flex flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-500 sm:flex-row"
          >
            <div className="relative aspect-[4/3] shrink-0 overflow-hidden sm:aspect-auto sm:w-56">
              <Image
                src={service.image}
                alt=""
                fill
                sizes="(max-width: 640px) 92vw, 224px"
                className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <span className="bg-container text-brand-800 flex size-11 items-center justify-center rounded-xl">
                <service.icon className="size-5" aria-hidden />
              </span>

              <h3 className="text-ink mt-4 text-lg font-bold">{service.title}</h3>
              <p className="text-subtle mt-2 text-sm leading-relaxed">{service.short}</p>

              <ul className="mt-4 flex-1 space-y-2">
                {service.features.slice(0, 2).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2
                      className="text-sage-600 mt-0.5 size-4 shrink-0"
                      aria-hidden
                    />
                    <span className="text-muted text-xs leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/hizmetlerimiz/${service.slug}`}
                className="text-brand-800 hover:text-accent-500 mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              >
                Ayrıntıları görün
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
