"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { GalleryGroup } from "@/data/media";
import { processImage, uploadBlob } from "@/features/admin/media/upload";
import { adminButton } from "@/features/admin/ui/button";
import { inputClass } from "@/features/admin/ui/field";
import { FormMessage, type ActionState } from "@/features/admin/ui/form-message";
import { addGalleryItems } from "./actions";
import { galleryGroups } from "./labels";

/**
 * Çoklu fotoğraf yükleme: her dosya tarayıcıda 2048 px'e küçültülür, WebP'ye
 * çevrilir, logo filigranı işlenir; ayrıca 640 px küçük resim üretilir.
 * Dosyalar doğrudan Storage'a gider, sonra tek seferde galeriye eklenir.
 */
export function GalleryUploader() {
  const router = useRouter();
  const inputId = useId();
  const [group, setGroup] = useState<GalleryGroup>("mutfak");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [state, setState] = useState<ActionState>(null);

  async function onFiles(files: FileList | null) {
    const list = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));
    if (!list.length) return;
    setState(null);
    setProgress({ done: 0, total: list.length });
    const items = [];
    try {
      for (const file of list) {
        const [full, thumb] = await Promise.all([
          processImage(file, { maxSize: 2048, watermark: true }),
          processImage(file, { maxSize: 640, watermark: true, quality: 0.8 }),
        ]);
        const [src, thumbUrl] = await Promise.all([
          uploadBlob(full.blob, "galeri", "webp"),
          uploadBlob(thumb.blob, "galeri", "webp"),
        ]);
        items.push({
          src,
          thumb: thumbUrl,
          width: full.width,
          height: full.height,
          grp: group,
          alt: galleryGroups.find((item) => item.id === group)?.label ?? "",
        });
        setProgress((value) => (value ? { ...value, done: value.done + 1 } : value));
      }
      const result = await addGalleryItems(items);
      setState(result);
      router.refresh();
    } catch (error) {
      setState({ ok: false, message: error instanceof Error ? error.message : "Yükleme başarısız." });
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-[14px] font-medium text-neutral-900">Fotoğraf yükle</p>
        <p className="text-[13px] text-neutral-500">
          Birden fazla seçebilirsiniz. Filigran ve boyutlandırma otomatik yapılır; yeni fotoğraflar başa eklenir.
        </p>
      </div>
      <div className="flex gap-2">
        <label htmlFor={`${inputId}-group`} className="sr-only">
          Grup
        </label>
        <select
          id={`${inputId}-group`}
          value={group}
          onChange={(event) => setGroup(event.target.value as GalleryGroup)}
          className={`${inputClass} w-auto`}
        >
          {galleryGroups
            .filter((item) => item.id !== "video")
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
        </select>
        <label
          htmlFor={inputId}
          aria-disabled={progress !== null}
          className={adminButton({ className: progress ? "pointer-events-none opacity-70" : "cursor-pointer" })}
        >
          {progress ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              {progress.done}/{progress.total}
            </>
          ) : (
            <>
              <ImagePlus aria-hidden />
              Seç
            </>
          )}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={progress !== null}
          onChange={(event) => {
            void onFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
      {state ? (
        <div className="sm:basis-full">
          <FormMessage state={state} />
        </div>
      ) : null}
    </div>
  );
}
