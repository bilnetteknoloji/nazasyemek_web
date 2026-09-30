import { BadgeCheck, Info, Leaf, Printer } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { dietitianSupport } from "@/data/catalog";

const notes = [
  {
    icon: Leaf,
    title: "Diyet ve alternatif menü",
    text: "Diyet, glutensiz ve laktozsuz alternatifler talep üzerine planlanır.",
  },
  {
    icon: Info,
    title: "Alerjen bilgilendirmesi",
    text: "Menüdeki alerjenler yemekhane panolarında ve listelerde belirtilir.",
  },
  {
    icon: Printer,
    title: "Yazdırılabilir liste",
    text: "Aylık menü listesi panoya asılabilecek biçimde paylaşılır.",
  },
];

/** Stitch Katalog bölüm 5: kurumsal diyetisyen desteği. */
export function DietitianSupport() {
  return (
    <Section className="bg-container/60">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-muted text-xs font-semibold tracking-wider uppercase">
            {dietitianSupport.eyebrow}
          </p>
          <h2 className="font-display text-ink mt-3 text-3xl leading-tight font-bold sm:text-4xl">
            {dietitianSupport.title}
          </h2>
          <p className="text-subtle mt-5 leading-relaxed">{dietitianSupport.text}</p>

          <ul className="mt-7 flex flex-wrap gap-3">
            {dietitianSupport.badges.map((badge) => (
              <li
                key={badge}
                className="border-line text-subtle shadow-soft flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm"
              >
                <BadgeCheck className="text-sage-600 size-4 shrink-0" aria-hidden />
                {badge}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ButtonLink href="/teklif-al" size="lg">
              Kurumunuza özel menü isteyin
            </ButtonLink>
          </div>
        </Reveal>

        <ul className="grid gap-4">
          {notes.map((note, index) => (
            <Reveal
              as="li"
              key={note.title}
              delay={index * 0.07}
              className="border-line/70 shadow-soft flex gap-4 rounded-2xl border bg-white p-5"
            >
              <span className="bg-sage-100 text-sage-700 flex size-11 shrink-0 items-center justify-center rounded-xl">
                <note.icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="text-ink block font-semibold">{note.title}</span>
                <span className="text-muted mt-1 block text-sm leading-relaxed">
                  {note.text}
                </span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
