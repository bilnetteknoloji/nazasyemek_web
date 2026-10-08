import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deletePost } from "@/features/admin/posts/actions";
import { PostForm } from "@/features/admin/posts/post-form";
import { getPostById } from "@/features/admin/posts/queries";
import { ConfirmAction } from "@/features/admin/ui/confirm-action";
import { PageHeader } from "@/features/admin/ui/page-header";

export const metadata: Metadata = { title: "Yazı" };

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={post.title}
        back={{ href: "/admin/blog", label: "Blog" }}
        actions={
          <ConfirmAction label="Yazıyı sil" action={deletePost.bind(null, post.id)} message={`"${post.title}" silinsin mi?`} />
        }
      />
      <PostForm key={post.updated_at} post={post} />
    </div>
  );
}
