import type { Metadata } from "next";
import { Img as Image } from "@/components/ui/Img";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Process } from "@/components/sections/Process";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { services } from "@/data/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/hizmetlerimiz/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) return {};

  return {
    title: service.title,
    description: service.short,
    alternates: { canonical: `/hizmetlerimiz/${service.slug}` },
    openGraph: { title: service.title, description: service.short },
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/hizmetlerimiz/[slug]">) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) notFound();

  const others = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        photo={{ src: service.image }}
        eyebrow="Hizmetlerimiz"
        title={service.title}
        description={service.short}
        crumbs={[
          { name: "Hizmetlerimiz", href: "/hizmetlerimiz" },
          { name: service.title, href: `/hizmetlerimiz/${service.slug}` },
        ]}
      />

      <Section className="pt-14 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal className="shadow-lift overflow-hidden rounded-[2rem]">
            <Image
              src={service.image}
              alt={service.title}
              width={1200}
              height={800}
              sizes="(max-width: 1024px) 92vw, 620px"
              className="aspect-[4/3] w-full object-cover"
              priority
            />
          </Reveal>

          <div>
            <Reveal>
              <span className="bg-brand-50 text-brand-800 inline-flex size-12 items-center justify-center rounded-2xl">
                <service.icon className="size-6" aria-hidden />
              </span>
              <p className="text-muted mt-6 leading-relaxed">{service.description}</p>
            </Reveal>

            <ul className="mt-8 space-y-4">
              {service.features.map((feature, index) => (
                <Reveal
                  as="li"
                  key={feature}
                  delay={index * 0.06}
                  className="flex gap-3"
                >
                  <CheckCircle2
                    className="text-accent-600 mt-0.5 size-5 shrink-0"
                    aria-hidden
                  />
                  <span className="text-brand-800 text-sm sm:text-base">{feature}</span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.24} className="mt-9">
              <ButtonLink href="/teklif-al" size="lg">
                Bu hizmet için teklif alın
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="bg-cream-deep/60">
        <h2 className="font-display text-brand-900 text-2xl sm:text-3xl">
          Diğer hizmetlerimiz
        </h2>
        <ul className="mobile-rail mt-8 md:grid gap-5 [--rail-item:74%] sm:grid-cols-3">
          {others.map((item, index) => (
            <Reveal
              as="li"
              key={item.slug}
              delay={index * 0.08}
              className="border-line shadow-soft hover:shadow-lift rounded-3xl border bg-white p-6 transition-all duration-500 hover:-translate-y-1"
            >
              <Link href={`/hizmetlerimiz/${item.slug}`} className="block">
                <item.icon className="text-brand-400 size-6" aria-hidden />
                <h3 className="text-brand-900 mt-4 font-semibold">{item.title}</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">{item.short}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Process />
      <CtaBand />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Hizmetlerimiz", href: "/hizmetlerimiz" },
          { name: service.title, href: `/hizmetlerimiz/${service.slug}` },
        ])}
      />
    </>
  );
}
