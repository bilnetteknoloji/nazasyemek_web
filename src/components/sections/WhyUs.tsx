import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Img } from "@/components/ui/Img";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { advantages } from "@/data/home";

/** Stitch: "Neden NAZ-AŞ Toplu Yemek Hizmetleri?" — üç avantaj kartı. */
export function WhyUs() {
  return (
    // Arka plan: servicebg (Son Fotolar) üzerine hafif siyah perde; başlık
    // koyu zemin tonunda, kartlar beyaz kalır.
    <Section className="bg-inverse relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Img
          src="/gorseller/bg/servicebg.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <SectionHeading
        tone="dark"
        eyebrow="Kurumsal Avantajlarımız"
        title="Neden NAZ-AŞ Toplu Yemek Hizmetleri?"
        description="Yüksek kapasiteli endüstriyel üretimimizi zanaatkâr mutfak özeni ve sıkı denetim süreçleriyle buluşturuyoruz."
        align="center"
      />

      <ul className="mt-14 grid gap-6 md:grid-cols-3">
        {advantages.map((item, index) => (
          <Reveal
            as="li"
            key={item.title}
            delay={index * 0.08}
            className="group border-line/70 shadow-soft hover:shadow-lift flex flex-col rounded-3xl border bg-white p-7 transition-all duration-500 hover:-translate-y-1"
          >
            <span
              className={cn(
                "flex size-16 items-center justify-center rounded-2xl transition-colors duration-300",
                item.tone === "brand"
                  ? "bg-brand-800/10 text-brand-800 group-hover:bg-brand-800 group-hover:text-white"
                  : "bg-sage-100 text-sage-700 group-hover:bg-sage-600 group-hover:text-white",
              )}
            >
              <item.icon className="size-7" aria-hidden />
            </span>

            <h3 className="text-ink mt-6 text-xl font-bold">{item.title}</h3>
            <p className="text-subtle mt-3 flex-1 text-sm leading-relaxed">
              {item.text}
            </p>

            <Link
              href={item.href}
              className="text-brand-800 hover:text-accent-500 mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            >
              {item.linkLabel}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
