import { ChevronRight, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { listPosts } from "@/features/admin/posts/queries";
import { Badge } from "@/features/admin/ui/badge";
import { adminButton } from "@/features/admin/ui/button";
import { Card, Empty } from "@/features/admin/ui/card";
import { formatDate } from "@/features/admin/ui/format";
import { PageHeader } from "@/features/admin/ui/page-header";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogAdminPage() {
  const posts = await listPosts();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Blog"
        lead="Haberler, duyurular ve menü yazıları — sitede /blog."
        actions={
          <Link href="/admin/blog/yeni" className={adminButton()}>
            <Plus aria-hidden />
            Yeni yazı
          </Link>
        }
      />
      <Card flush className="overflow-hidden">
        {posts.length ? (
          <ul>
            {posts.map((post) => {
              const { scheduled } = post;
              return (
                <li key={post.id} className="border-b border-neutral-200 last:border-b-0">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="pressable flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 sm:px-5"
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-[14px] font-medium text-neutral-900">{post.title}</span>
                      <span className="truncate text-[13px] text-neutral-500">
                        /blog/{post.slug}
                        {post.published_at ? ` · ${formatDate(post.published_at)}` : ""}
                      </span>
                    </span>
                    <Badge tone={post.status === "taslak" ? "muted" : scheduled ? "amber" : "green"}>
                      {post.status === "taslak" ? "Taslak" : scheduled ? "Zamanlandı" : "Yayında"}
                    </Badge>
                    <ChevronRight className="size-4 shrink-0 text-neutral-300" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty title="Henüz yazı yok">
            İlk yazı yayınlanınca sitede Blog sayfası açılır ve menüde görünür.
          </Empty>
        )}
      </Card>
    </div>
  );
}
