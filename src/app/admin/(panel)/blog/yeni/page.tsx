import type { Metadata } from "next";
import { requireAdmin } from "@/features/admin/auth/session";
import { PostForm } from "@/features/admin/posts/post-form";
import { PageHeader } from "@/features/admin/ui/page-header";

export const metadata: Metadata = { title: "Yeni yazı" };

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Yeni yazı" back={{ href: "/admin/blog", label: "Blog" }} />
      <PostForm />
    </div>
  );
}
