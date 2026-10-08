"use client";

import { asset } from "@/lib/asset";
import { createUploadTarget } from "./actions";

type Folder = Parameters<typeof createUploadTarget>[0];
type Extension = Parameters<typeof createUploadTarget>[1];

/** Dosyayı imzalı adrese yükler, herkese açık adresini döner. */
export async function uploadBlob(blob: Blob, folder: Folder, extension: Extension) {
  const target = await createUploadTarget(folder, extension);
  const response = await fetch(target.signedUrl, {
    method: "PUT",
    headers: {
      apikey: target.apiKey,
      "content-type": blob.type || "application/octet-stream",
      "cache-control": "max-age=31536000",
      "x-upsert": "false",
    },
    body: blob,
  });
  if (!response.ok) throw new Error("Dosya yüklenemedi.");
  return target.publicUrl;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Görsel okunamadı."));
    image.src = src;
  });
}

let logo: Promise<HTMLImageElement> | null = null;

/**
 * Görseli tarayıcıda küçültüp WebP'ye çevirir. `watermark` açıkken sağ alta
 * açık renk logo işlenir — `npm run assets` galeri filigranıyla aynı ölçü:
 * genişliğin %10'u, %72 opaklık, hafif gölge.
 */
export async function processImage(
  file: File,
  { maxSize, watermark = false, quality = 0.84 }: { maxSize: number; watermark?: boolean; quality?: number },
) {
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.round(image.naturalWidth * scale);
    const height = Math.round(image.naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Görsel işlenemedi.");
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, width, height);

    if (watermark) {
      logo ??= loadImage(asset("/brand/logo-light.png"));
      const mark = await logo;
      const markWidth = Math.round(width * 0.1);
      const markHeight = Math.round((mark.naturalHeight / mark.naturalWidth) * markWidth);
      const margin = Math.round(width * 0.025);
      context.globalAlpha = 0.72;
      context.shadowColor = "rgba(0,0,0,0.45)";
      context.shadowBlur = Math.max(2, Math.round(markWidth * 0.06));
      context.drawImage(mark, width - markWidth - margin, height - markHeight - margin, markWidth, markHeight);
      context.globalAlpha = 1;
      context.shadowBlur = 0;
    }

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    if (!blob) throw new Error("Görsel dönüştürülemedi.");
    return { blob, width, height };
  } finally {
    URL.revokeObjectURL(url);
  }
}
