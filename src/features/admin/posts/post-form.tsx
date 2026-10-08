"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { processImage, uploadBlob } from "@/features/admin/media/upload";
import { adminButton } from "@/features/admin/ui/button";
import { Field, inputClass } from "@/features/admin/ui/field";
import { FormMessage, type ActionState } from "@/features/admin/ui/form-message";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { savePost } from "./actions";
import type { PostRow } from "./queries";
import { slugify } from "./slug";

/** ISO → datetime-local değeri (Türkiye saati). */
function toLocal(iso: string | null) {
  if (!iso) return "";
  const date = new Date(new Date(iso).getTime() + 3 * 3600_000);
  return date.toISOString().slice(0, 16);
}

/**
 * Yazı düzenleyici. Gövde Markdown: ## başlık, **kalın**, - liste, [bağlantı](adres).
 * Kapak görseli tarayıcıda 1600 px WebP'ye çevrilip yüklenir.
 */
export function PostForm({ post }: { post?: PostRow }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [cover, setCover] = useState<string | null>(post?.cover_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<ActionState>(null);

  async function onCover(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const { blob } = await processImage(file, { maxSize: 1600 });
      setCover(await uploadBlob(blob, "blog", "webp"));
    } catch {
      setState({ ok: false, message: "Kapak görseli yüklenemedi." });
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    const result = await savePost(post?.id ?? null, {
      title,
      slug,
      excerpt: String(form.get("excerpt") ?? ""),
      body: String(form.get("body") ?? ""),
      cover_url: cover,
      status: form.get("status") === "yayinda" ? "yayinda" : "taslak",
      published_at: String(form.get("published_at") ?? ""),
    }).catch(() => ({ ok: false, message: "Kaydedilemedi." }) as ActionState & { id?: string });
    setPending(false);
    setState(result);
    if (result?.ok && !post && result.id) router.replace(`/admin/blog/${result.id}`);
    else router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-4">
        <Field id="post-title" label="Başlık">
          <input
            id="post-title"
            value={title}
            required
            maxLength={160}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            className={cn(inputClass, "text-[16px] font-medium")}
          />
        </Field>
        <Field id="post-excerpt" label="Özet" hint="Listede ve arama sonuçlarında görünür (en fazla 300 karakter).">
          <textarea id="post-excerpt" name="excerpt" rows={2} maxLength={300} defaultValue={post?.excerpt ?? ""} className={inputClass} />
        </Field>
        <Field id="post-body" label="Yazı" hint="## Ara başlık · **kalın** · - madde · [bağlantı](https://…)">
          <textarea
            id="post-body"
            name="body"
            rows={18}
            required
            defaultValue={post?.body ?? ""}
            className={cn(inputClass, "font-mono text-[13px] leading-6")}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4">
          <Field id="post-status" label="Durum">
            <select id="post-status" name="status" defaultValue={post?.status ?? "taslak"} className={inputClass}>
              <option value="taslak">Taslak</option>
              <option value="yayinda">Yayında</option>
            </select>
          </Field>
          <Field id="post-date" label="Yayın tarihi" hint="İleri bir tarih seçilirse o gün yayınlanır.">
            <input
              id="post-date"
              name="published_at"
              type="datetime-local"
              defaultValue={toLocal(post?.published_at ?? null)}
              className={inputClass}
            />
          </Field>
          <Field id="post-slug" label="Adres" hint={`/blog/${slug || "…"}`}>
            <input
              id="post-slug"
              value={slug}
              required
              maxLength={80}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(slugify(event.target.value));
              }}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
          <span className="text-[13px] font-medium">Kapak görseli</span>
          {cover ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="" className="aspect-video w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setCover(null)}
                aria-label="Kapağı kaldır"
                className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 shadow"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          ) : null}
          <label className={adminButton({ variant: "secondary", className: "cursor-pointer" })}>
            {uploading ? <Loader2 className="animate-spin" aria-hidden /> : <ImagePlus aria-hidden />}
            {cover ? "Değiştir" : "Görsel seç"}
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => void onCover(event.target.files?.[0])} />
          </label>
        </div>

        <FormMessage state={state} />
        <button type="submit" disabled={pending || uploading} className={adminButton()}>
          {pending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Kaydediliyor…
            </>
          ) : (
            "Kaydet"
          )}
        </button>
        {post?.status === "yayinda" ? (
          <a href={asset(`/blog/${post.slug}/`)} target="_blank" rel="noreferrer" className="text-center text-[13px] font-medium underline">
            Sitede görüntüle
          </a>
        ) : null}
      </div>
    </form>
  );
}
