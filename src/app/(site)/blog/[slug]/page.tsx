import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Img as Image } from "@/components/ui/Img";
import { Markdown } from "@/components/ui/Markdown";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/sections/CtaBand";
import { site } from "@/data/site";
import { getPost } from "@/lib/content/posts";
import { breadcrumbJsonLd } from "@/lib/jsonld";

/** Yazılar panelden gelir; derlemede bilinmeyen adresler istekte üretilir. */
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.excerpt ?? post.body.replace(/[#*_>`\[\]()!-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 155),
    path: `/blog/${post.slug}`,
    image: post.coverUrl ?? undefined,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

const dateFormat = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const crumbs = [
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <PageHero eyebrow={dateFormat.format(new Date(post.publishedAt))} title={post.title} description={post.excerpt ?? undefined} crumbs={crumbs} />

      <Section className="pt-14 sm:pt-20">
        <article className="mx-auto max-w-3xl">
          {post.coverUrl ? (
            <div className="shadow-soft relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl">
              <Image src={post.coverUrl} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
            </div>
          ) : null}
          <Markdown>{post.body}</Markdown>
          <Link href="/blog" className="text-brand-800 mt-12 inline-flex items-center gap-1.5 text-sm font-semibold">
            <ArrowLeft className="size-4" aria-hidden />
            Tüm yazılar
          </Link>
        </article>
      </Section>

      <CtaBand />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt ?? undefined,
          datePublished: post.publishedAt,
          image: post.coverUrl ?? `${site.url}/brand/og-logo.png`,
          publisher: { "@type": "Organization", name: site.legalName },
          mainEntityOfPage: `${site.url}/blog/${post.slug}`,
        }}
      />
    </>
  );
}
