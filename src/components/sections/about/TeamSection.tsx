import { Img as Image } from "@/components/ui/Img";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { kitchenDiscipline, teamRoles } from "@/data/about";

/** Stitch Hakkımızda bölüm 4: ekip kartları + mutfak disiplini bloğu. */
export function TeamSection() {
  return (
    <Section className="bg-cream-deep">
      <SectionHeading
        eyebrow="Usta Kadro & Bilimsel Yaklaşım"
        title="Mutfaktaki Başarımızın Arkasındaki Ekip"
        description="Her reçeteyi diyetisyenlerimizin kalori analizleri, kalite yöneticilerimizin laboratuvar testleri ve baş aşçılarımızın ustalığıyla hayata geçiriyoruz."
        align="center"
      />

      <ul className="mobile-rail mt-14 md:grid gap-6 [--rail-item:74%] sm:grid-cols-2 lg:grid-cols-4">
        {teamRoles.map((member, index) => (
          <Reveal
            as="li"
            key={member.role}
            delay={(index % 4) * 0.07}
            className="border-line/70 shadow-soft hover:shadow-lift flex flex-col rounded-3xl border bg-white p-6 transition-shadow duration-500"
          >
            <span className="bg-container text-brand-800 flex size-14 items-center justify-center rounded-2xl">
              <member.icon className="size-6" aria-hidden />
            </span>
            <p className="text-sage-600 mt-5 text-xs font-semibold tracking-wider uppercase">
              {member.credential}
            </p>
            <h3 className="text-ink mt-2 font-bold">{member.role}</h3>
            <p className="text-subtle mt-3 flex-1 text-sm leading-relaxed">
              {member.text}
            </p>
            <p className="border-line text-muted mt-5 flex items-center gap-2 border-t pt-4 text-xs">
              <member.tagIcon className="text-brand-600 size-4 shrink-0" aria-hidden />
              {member.tag}
            </p>
          </Reveal>
        ))}
      </ul>

      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="shadow-lift overflow-hidden rounded-[2rem]">
          <Image
            src={kitchenDiscipline.photo.src}
            alt={kitchenDiscipline.photo.alt}
            width={kitchenDiscipline.photo.width}
            height={kitchenDiscipline.photo.height}
            sizes="(max-width: 1024px) 92vw, 520px"
            className="aspect-[5/4] w-full object-cover"
          />
        </Reveal>

        <div>
          <Reveal>
            <p className="text-muted text-xs font-semibold tracking-wider uppercase">
              {kitchenDiscipline.eyebrow}
            </p>
            <h3 className="font-display text-ink mt-3 text-2xl leading-tight font-bold sm:text-3xl">
              {kitchenDiscipline.title}
            </h3>
            <p className="text-subtle mt-5 leading-relaxed">{kitchenDiscipline.text}</p>
          </Reveal>

          <ul className="mt-7 space-y-4">
            {kitchenDiscipline.points.map((point, index) => (
              <Reveal as="li" key={point.text} delay={index * 0.06} className="flex gap-3">
                <point.icon className="text-sage-600 mt-0.5 size-5 shrink-0" aria-hidden />
                <span className="text-ink text-sm sm:text-base">{point.text}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
