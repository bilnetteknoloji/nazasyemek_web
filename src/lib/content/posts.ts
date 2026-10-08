import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { TAGS } from "./tags";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  publishedAt: string;
};

export type Post = PostSummary & { body: string };

const SUMMARY = "slug, title, excerpt, cover_url, published_at";

type Row = {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
  body?: string;
};

const toSummary = (row: Row): PostSummary => ({
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  coverUrl: row.cover_url,
  publishedAt: row.published_at ?? new Date().toISOString(),
});

/** Yayındaki yazılar (RLS yalnızca yayında + tarihi gelmiş olanları döner). */
export async function getPosts(): Promise<PostSummary[]> {
  const supabase = createPublicClient([TAGS.posts], 300);
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select(SUMMARY)
    .order("published_at", { ascending: false })
    .limit(100);
  if (error) {
    console.error("[blog] okunamadı", error.message);
    return [];
  }
  return (data ?? []).map(toSummary);
}

export async function getPost(slug: string): Promise<Post | null> {
  const supabase = createPublicClient([TAGS.posts], 300);
  if (!supabase) return null;
  const { data } = await supabase
    .from("posts")
    .select(`${SUMMARY}, body`)
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  return { ...toSummary(data), body: data.body ?? "" };
}
