"use client";

import { Pencil } from "lucide-react";
import { useActionState, useState } from "react";
import { adminButton } from "@/features/admin/ui/button";
import { Dialog } from "@/features/admin/ui/dialog";
import { Field, inputClass } from "@/features/admin/ui/field";
import { FormMessage, type ActionState } from "@/features/admin/ui/form-message";
import { SubmitButton } from "@/features/admin/ui/submit-button";
import { asset } from "@/lib/asset";
import { galleryGroups } from "./labels";
import type { GalleryRow } from "./queries";

/** Galeri öğesi düzenleme: açıklama, grup, görünürlük. */
export function GalleryItemEditor({
  item,
  action,
}: {
  item: GalleryRow;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(action, null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Düzenle"
        className={adminButton({ variant: "ghost", size: "sm", className: "w-8 px-0" })}
      >
        <Pencil aria-hidden />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} label="Galeri öğesi">
        <form action={formAction} className="flex flex-col gap-4 p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(item.thumb)} alt="" className="aspect-video w-full rounded-lg bg-neutral-100 object-cover" />
          <Field id={`alt-${item.id}`} label="Açıklama (alt metin)" hint="Görme engelliler ve arama motorları için kısa açıklama.">
            <input id={`alt-${item.id}`} name="alt" defaultValue={item.alt} maxLength={200} className={inputClass} />
          </Field>
          <Field id={`grp-${item.id}`} label="Grup">
            <select id={`grp-${item.id}`} name="grp" defaultValue={item.grp} className={inputClass}>
              {galleryGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.label}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-[14px]">
            <input type="checkbox" name="visible" defaultChecked={item.visible} className="size-4 accent-neutral-900" />
            Sitede göster
          </label>
          <FormMessage state={state} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className={adminButton({ variant: "secondary" })}>
              Kapat
            </button>
            <SubmitButton>Kaydet</SubmitButton>
          </div>
        </form>
      </Dialog>
    </>
  );
}
