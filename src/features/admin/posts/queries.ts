import "server-only";

import { requireAdmin } from "@/features/admin/auth/session";

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_url: string | null;
  status: "taslak" | "yayinda";
  published_at: string | null;
  updated_at: string;
};

export type PostListRow = PostRow & { scheduled: boolean };

const COLUMNS = "id, slug, title, excerpt, body, cover_url, status, published_at, updated_at";

export async function listPosts() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("posts")
    .select(COLUMNS)
    .order("published_at", { ascending: false, nullsFirst: true })
    .order("updated_at", { ascending: false });
  const now = Date.now();
  // Yayında ama tarihi gelmemiş: sitede o gün görünür.
  return ((data ?? []) as PostRow[]).map((post) => ({
    ...post,
    scheduled: post.status === "yayinda" && !!post.published_at && new Date(post.published_at).getTime() > now,
  })) as PostListRow[];
}

export async function getPostById(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("posts").select(COLUMNS).eq("id", id).maybeSingle();
  return (data as PostRow | null) ?? null;
}
