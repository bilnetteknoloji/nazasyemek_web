import { ClipboardCheck, Phone } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { tastingCta } from "@/data/about";
import { getSite } from "@/lib/content/site";

/** Stitch Hakkımızda bölüm 6: ücretsiz tadım menüsü daveti. */
export async function TastingCta() {
  const site = await getSite();
  return (
    <Section className="pb-24">
      <Reveal className="from-brand-800 via-brand-600 to-accent-500 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br px-8 py-14 text-center sm:px-14 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_0%,rgb(255_255_255/0.12),transparent_70%)]"
        />
        <div className="relative">
          <p className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold tracking-wider text-white uppercase">
            {tastingCta.eyebrow}
          </p>
          <h2 className="font-display mx-auto mt-5 max-w-2xl text-3xl leading-tight text-white sm:text-4xl">
            {tastingCta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/80">
            {tastingCta.text}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/teklif-al" variant="light" size="lg">
              <ClipboardCheck className="size-4" aria-hidden />
              Ücretsiz numune ve teklif isteyin
            </ButtonLink>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-semibold text-white transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/5"
            >
              <Phone className="size-4" aria-hidden />
              {site.phone}
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
