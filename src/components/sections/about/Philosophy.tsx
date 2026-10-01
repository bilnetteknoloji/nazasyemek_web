import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { philosophy } from "@/data/about";

/** Stitch Hakkımızda bölüm 3: misyon / vizyon / değerler. */
export function Philosophy() {
  return (
    <Section className="bg-cream">
      <SectionHeading
        eyebrow="Kurumsal Felsefemiz"
        title="Lezzet, Bilim ve Hijyenin Kesişim Noktası"
        description="Toplu beslenme yönetimini salt bir yemek servisi değil, çalışan verimliliği ve yaşam kalitesinin temel direği olarak konumlandırıyoruz."
        align="center"
      />

      <ul className="mobile-rail mt-14 md:grid gap-6 lg:grid-cols-3">
        {philosophy.map((item, index) => (
          <Reveal
            as="li"
            key={item.step}
            delay={index * 0.08}
            className="border-line/70 shadow-soft flex flex-col rounded-3xl border bg-white p-7"
          >
            <span className="bg-brand-800/10 text-brand-800 flex size-14 items-center justify-center rounded-2xl">
              <item.icon className="size-6" aria-hidden />
            </span>

            <p className="text-muted mt-6 text-xs font-semibold tracking-wider uppercase">
              {item.step}
            </p>
            <h3 className="text-ink mt-2 text-lg font-bold">{item.title}</h3>

            {item.text ? (
              <p className="text-subtle mt-3 flex-1 text-sm leading-relaxed">
                {item.text}
              </p>
            ) : null}

            {item.list ? (
              <ul className="mt-4 flex-1 space-y-3">
                {item.list.map((entry) => (
                  <li key={entry.label} className="flex gap-2.5">
                    <CheckCircle2
                      className="text-sage-600 mt-0.5 size-4 shrink-0"
                      aria-hidden
                    />
                    <span className="text-subtle text-sm leading-relaxed">
                      <strong className="text-ink font-semibold">{entry.label}:</strong>{" "}
                      {entry.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="border-line text-muted mt-6 flex items-center gap-2 border-t pt-4 text-xs">
              <item.tagIcon className="text-sage-600 size-4 shrink-0" aria-hidden />
              {item.tag}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
