"use client";

import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { instagramPosts } from "@/data/instagram";
import { site } from "@/data/site";

const EMBED_SCRIPT = "https://www.instagram.com/embed.js";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/**
 * Galeri → Instagram: `data/instagram.ts` içindeki paylaşımlar resmi gömme koduyla.
 * embed.js blockquote'ları iframe'e çevirir; liste sabit olduğu için React yeniden çizmez.
 */
export function InstagramFeed() {
  const { href, label } = site.social.instagram;

  useEffect(() => {
    if (!instagramPosts.length) return;
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    if (document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = EMBED_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Instagram"
          title={`@${label}'ten son paylaşımlar`}
          description="Mutfağımızdan, servislerimizden ve organizasyonlarımızdan güncel kareler Instagram hesabımızda."
        />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-line text-ink hover:border-brand-800/30 shadow-soft inline-flex shrink-0 items-center gap-2.5 rounded-full border bg-white px-5 py-3 text-sm font-semibold transition-colors"
        >
          <InstagramIcon className="size-5" />
          Instagram&apos;da takip edin
          <ArrowUpRight className="text-muted size-4" aria-hidden />
        </a>
      </div>

      {instagramPosts.length ? (
        <ul className="mobile-rail mt-12 gap-6 [--rail-item:88%] md:grid md:grid-cols-2 lg:grid-cols-3">
          {instagramPosts.map((url) => (
            <li key={url} className="flex justify-center">
              <blockquote
                className="instagram-media w-full max-w-[540px] min-w-[300px] overflow-hidden rounded-2xl border border-line bg-white"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-800 flex min-h-[420px] items-center justify-center gap-2 p-6 text-sm font-semibold"
                >
                  <InstagramIcon className="size-5" />
                  Paylaşımı Instagram&apos;da görüntüleyin
                </a>
              </blockquote>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
