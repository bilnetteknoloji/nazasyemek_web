import { ArrowRight, Newspaper } from "lucide-react";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Img as Image } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/sections/CtaBand";
import { photos } from "@/data/media";
import { getPosts } from "@/lib/content/posts";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const heroPhoto = photos.find((photo) => photo.src.endsWith("nazas2.webp")) ?? photos[0];

export const metadata: Metadata = pageMeta({
  title: "Blog — Toplu Yemek ve Beslenme Yazıları",
  description: "NAZ-AŞ Yemek'ten haberler, duyurular, kurumsal beslenme, menü planlama ve gıda güvenliği üzerine yazılar.",
  path: "/blog",
});

const dateFormat = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        photo={heroPhoto}
        eyebrow="Blog"
        title="Mutfağımızdan haberler"
        description="Duyurular, menü yenilikleri ve toplu beslenme üzerine yazılar."
        crumbs={[{ name: "Blog", href: "/blog" }]}
      />

      <Section className="pt-14 sm:pt-20">
        {posts.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={Math.min(index, 5) * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group border-line shadow-soft flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-transform hover:-translate-y-1"
                >
                  <div className="bg-cream-deep relative aspect-[16/10]">
                    {post.coverUrl ? (
                      <Image src={post.coverUrl} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    ) : (
                      <span className="flex size-full items-center justify-center">
                        <Newspaper className="text-brand-800/30 size-10" aria-hidden />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <time dateTime={post.publishedAt} className="text-muted text-xs font-medium">
                      {dateFormat.format(new Date(post.publishedAt))}
                    </time>
                    <h2 className="font-display text-brand-900 text-xl leading-snug">{post.title}</h2>
                    {post.excerpt ? <p className="text-muted line-clamp-3 text-sm leading-relaxed">{post.excerpt}</p> : null}
                    <span className="text-brand-800 mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold">
                      Devamını oku
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        ) : (
          <p className="text-muted py-10 text-center">Yakında burada yazılarımızı paylaşacağız.</p>
        )}
      </Section>

      <CtaBand />
      <JsonLd data={breadcrumbJsonLd([{ name: "Blog", href: "/blog" }])} />
    </>
  );
}
