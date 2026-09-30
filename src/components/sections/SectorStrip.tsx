import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { sectors } from "@/data/home";

/** Stitch: "Güvenilir Çözüm Ortağı" — hizmet verilen sektör şeridi. */
export function SectorStrip() {
  return (
    <section className="w-full bg-white py-8">
      <Container>
        <Reveal className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="shrink-0 text-center md:text-left">
            <span className="text-muted block text-xs font-semibold tracking-wider uppercase">
              Güvenilir Çözüm Ortağı
            </span>
            <span className="text-ink text-base font-semibold sm:text-lg">
              Organize Sanayi &amp; Kurumsal Hizmet Alanlarımız
            </span>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-75 transition-opacity duration-300 hover:opacity-100 md:justify-end">
            {sectors.map((sector) => (
              <li
                key={sector.label}
                className="text-subtle/70 flex items-center gap-1.5 text-sm font-bold tracking-tighter sm:text-base"
              >
                <sector.icon className="size-6 shrink-0" aria-hidden />
                {sector.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
