import { ArrowDown, ArrowUp, Download, EyeOff, Play } from "lucide-react";
import type { Metadata } from "next";
import { gallery as staticGallery } from "@/data/media";
import {
  deleteGalleryItem,
  importStaticGallery,
  moveGalleryItem,
  updateGalleryItem,
} from "@/features/admin/gallery/actions";
import { GalleryItemEditor } from "@/features/admin/gallery/item-editor";
import { galleryGroups } from "@/features/admin/gallery/labels";
import { listGalleryItems } from "@/features/admin/gallery/queries";
import { GalleryUploader } from "@/features/admin/gallery/uploader";
import { adminButton } from "@/features/admin/ui/button";
import { Card } from "@/features/admin/ui/card";
import { ConfirmAction } from "@/features/admin/ui/confirm-action";
import { PageHeader } from "@/features/admin/ui/page-header";
import { SubmitButton } from "@/features/admin/ui/submit-button";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Galeri" };

const groupLabel = Object.fromEntries(galleryGroups.map((group) => [group.id, group.label]));

export default async function GalleryAdminPage() {
  const items = await listGalleryItems();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Galeri" lead="/galeri sayfası, ana sayfa ve üretim sayfasındaki fotoğraflar." />

      {items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-5 sm:p-6">
          <p className="text-[14px] font-medium text-neutral-900">Sitede şu an mevcut galeri gösteriliyor</p>
          <p className="text-[13px] text-neutral-500">
            Sitedeki {staticGallery.length} fotoğraf ve videoyu panele aktarın; sonra sıralayabilir, gizleyebilir
            ve yeni fotoğraf ekleyebilirsiniz. Aktarmadan yüklenen ilk fotoğraf, mevcut galerinin yerini alır.
          </p>
          <form action={importStaticGallery}>
            <SubmitButton variant="secondary" pendingLabel="Aktarılıyor…">
              <Download aria-hidden />
              Mevcut galeriyi aktar
            </SubmitButton>
          </form>
        </Card>
      ) : null}

      <GalleryUploader />

      {items.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <li key={item.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="relative aspect-[4/3] bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(item.thumb)}
                  alt={item.alt}
                  loading="lazy"
                  className={`size-full object-cover ${item.visible ? "" : "opacity-40 grayscale"}`}
                />
                {item.type === "video" ? (
                  <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
                    <Play className="size-3" aria-hidden />
                    Video
                  </span>
                ) : null}
                {!item.visible ? (
                  <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] text-neutral-700">
                    <EyeOff className="size-3" aria-hidden />
                    Gizli
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col gap-1 p-2.5">
                <p className="truncate text-[12px] text-neutral-500">{groupLabel[item.grp] ?? item.grp}</p>
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <form action={moveGalleryItem.bind(null, item.id, -1)}>
                      <button
                        type="submit"
                        disabled={index === 0}
                        aria-label="Öne al"
                        className={adminButton({ variant: "ghost", size: "sm", className: "w-8 px-0" })}
                      >
                        <ArrowUp aria-hidden />
                      </button>
                    </form>
                    <form action={moveGalleryItem.bind(null, item.id, 1)}>
                      <button
                        type="submit"
                        disabled={index === items.length - 1}
                        aria-label="Geri al"
                        className={adminButton({ variant: "ghost", size: "sm", className: "w-8 px-0" })}
                      >
                        <ArrowDown aria-hidden />
                      </button>
                    </form>
                  </div>
                  <div className="flex">
                    <GalleryItemEditor item={item} action={updateGalleryItem.bind(null, item.id)} />
                    <ConfirmAction
                      compact
                      action={deleteGalleryItem.bind(null, item.id)}
                      message="Bu öğe galeriden silinsin mi?"
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
