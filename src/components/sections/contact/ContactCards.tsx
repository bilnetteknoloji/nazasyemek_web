import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SocialLinks } from "@/components/ui/SocialIcons";
import { PhoneNaz } from "@/components/ui/PhoneNaz";
import { contactCards } from "@/data/contact";
import { cn } from "@/lib/cn";

/** Stitch İletişim bölüm 2: iletişim kanalı kartları. */
export function ContactCards() {
  return (
    <Section className="bg-cream pt-14 sm:pt-20">
      <ul className="mobile-rail md:grid gap-6 lg:grid-cols-3">
        {contactCards.map((card, index) => (
          <Reveal
            as="li"
            key={card.title}
            delay={index * 0.08}
            className="border-line/70 shadow-soft hover:shadow-lift flex flex-col rounded-3xl border bg-white p-7 transition-shadow duration-500"
          >
            <span className="bg-brand-800/10 text-brand-800 flex size-14 items-center justify-center rounded-2xl">
              <card.icon className="size-6" aria-hidden />
            </span>

            <p className="text-muted mt-6 text-xs font-semibold tracking-wider uppercase">
              {card.eyebrow}
            </p>
            <h2 className="text-ink mt-1 text-lg font-bold">{card.title}</h2>

            <div className="mt-3 flex-1 space-y-1">
              {card.lines.map((line) => (
                <p key={line} className="text-subtle text-sm leading-relaxed">
                  {line}
                </p>
              ))}
            </div>

            {card.links.length ? (
              <ul className="border-line mt-5 space-y-2 border-t pt-4">
                {card.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={cn(
                        "text-brand-800 hover:text-accent-500 flex gap-2 text-sm font-semibold transition-colors",
                        link.naz ? "items-start" : "items-center",
                      )}
                    >
                      <link.icon
                        className={cn("size-4 shrink-0", link.naz && "mt-0.5", link.iconClassName)}
                      />
                      {link.label}
                      {link.naz ? <PhoneNaz {...link.naz} /> : null}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
        ))}
      </ul>

      <Reveal className="border-line/70 shadow-soft mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl border bg-white px-7 py-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-muted text-xs font-semibold tracking-wider uppercase">
            Sosyal Medya
          </p>
          <h2 className="text-ink mt-1 text-lg font-bold">Bizi takip edin</h2>
        </div>
        <SocialLinks withLabels />
      </Reveal>
    </Section>
  );
}
