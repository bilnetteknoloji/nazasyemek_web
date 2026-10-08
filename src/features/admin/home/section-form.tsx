"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ImagePlus, Loader2, Plus, Trash2, Video } from "lucide-react";
import { processImage, uploadBlob } from "@/features/admin/media/upload";
import { adminButton } from "@/features/admin/ui/button";
import { Field, inputClass } from "@/features/admin/ui/field";
import { FormMessage, type ActionState } from "@/features/admin/ui/form-message";
import { asset } from "@/lib/asset";
import type { FieldDef, SectionDef, SectionItem, SectionValue } from "@/lib/content/home-sections";
import { saveHomeSection } from "./actions";

/** Görseli tarayıcıda 1920 px WebP'ye çevirip `media/anasayfa/` altına yükler. */
async function uploadImage(file: File) {
  const { blob } = await processImage(file, { maxSize: 1920 });
  return uploadBlob(blob, "anasayfa", "webp");
}

const preview = (src: string) => (src.startsWith("/") ? asset(src) : src);

function ImageField({
  id,
  label,
  hint,
  value,
  onChange,
  onError,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  onError: (message: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadImage(file));
    } catch {
      onError("Görsel yüklenemedi. Başka bir görsel deneyin.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-neutral-900">{label}</span>
      <div className="flex items-center gap-3">
        <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview(value)} alt="" className="size-full object-cover" />
          ) : null}
          {uploading ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="size-5 animate-spin" aria-hidden />
            </span>
          ) : null}
        </div>
        <label htmlFor={id} className={adminButton({ variant: "secondary", size: "sm", className: "cursor-pointer" })}>
          <ImagePlus aria-hidden />
          {value ? "Değiştir" : "Görsel seç"}
        </label>
        <input
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={uploading}
          onChange={(event) => {
            void onFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      {hint ? <p className="text-[12px] text-neutral-500">{hint}</p> : null}
    </div>
  );
}

function TextField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field id={id} label={field.label} hint={field.hint}>
      {field.kind === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          maxLength={field.max}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          id={id}
          maxLength={field.max}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      )}
    </Field>
  );
}

/**
 * Bir ana sayfa bölümünün düzenleme kartı. Kapalı başlar; açılınca bölümün
 * yazıları ve görselleri, en altta tek "Kaydet" düğmesi.
 */
export function HomeSectionForm({ def, initial }: { def: SectionDef; initial: SectionValue }) {
  const [value, setValue] = useState(initial);
  const [state, setState] = useState<ActionState>(null);
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();
  const list = def.list;
  const items = list ? ((value[list.name] as SectionItem[] | undefined) ?? []) : [];

  const setField = (name: string, next: string) => setValue((current) => ({ ...current, [name]: next }));
  const setItems = (next: SectionItem[]) => list && setValue((current) => ({ ...current, [list.name]: next }));
  const setItemField = (index: number, name: string, next: string) =>
    setItems(items.map((item, i) => (i === index ? { ...item, [name]: next } : item)));
  const move = (index: number, by: number) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + by, 0, item);
    setItems(next);
  };
  const onError = (message: string) => setState({ ok: false, message });

  async function addSlide(file: File | undefined) {
    if (!file || !list) return;
    setAdding(true);
    try {
      const src = await uploadImage(file);
      setItems([...items, { src, caption: "" }]);
    } catch {
      onError("Görsel yüklenemedi. Başka bir görsel deneyin.");
    } finally {
      setAdding(false);
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => setState(await saveHomeSection(def.key, value)));
  }

  return (
    <details className="group rounded-xl border border-neutral-200 bg-white open:shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 select-none sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold text-neutral-900">{def.title}</span>
          {def.hint ? <span className="text-[12.5px] text-neutral-500">{def.hint}</span> : null}
        </span>
        <ChevronDown className="size-5 shrink-0 text-neutral-400 transition-transform group-open:rotate-180" aria-hidden />
      </summary>

      <form onSubmit={onSubmit} className="flex flex-col gap-5 border-t border-neutral-200 p-4 sm:p-5">
        {def.fields.map((field) => {
          const id = `${def.key}-${field.name}`;
          const current = String(value[field.name] ?? "");
          return field.kind === "image" ? (
            <ImageField
              key={field.name}
              id={id}
              label={field.label}
              hint={field.hint}
              value={current}
              onChange={(next) => setField(field.name, next)}
              onError={onError}
            />
          ) : (
            <TextField key={field.name} id={id} field={field} value={current} onChange={(next) => setField(field.name, next)} />
          );
        })}

        {list ? (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-[13px] font-semibold text-neutral-900">{list.label}</legend>
            {items.map((item, index) => (
              <div key={`${index}-${item.src ?? ""}`} className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50/60 p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-[13px] font-medium text-neutral-600">
                    {list.itemLabel} {index + 1}
                    {item.video ? (
                      <span className="flex items-center gap-1 rounded-full bg-neutral-200 px-2 py-0.5 text-[11px]">
                        <Video className="size-3" aria-hidden />
                        Video — görsel kapak olarak kullanılır
                      </span>
                    ) : null}
                  </span>
                  {!list.fixed ? (
                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Yukarı taşı"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                        className={adminButton({ variant: "ghost", size: "sm", className: "px-2" })}
                      >
                        <ArrowUp aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label="Aşağı taşı"
                        disabled={index === items.length - 1}
                        onClick={() => move(index, 1)}
                        className={adminButton({ variant: "ghost", size: "sm", className: "px-2" })}
                      >
                        <ArrowDown aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label="Sil"
                        disabled={items.length <= list.min}
                        onClick={() => setItems(items.filter((_, i) => i !== index))}
                        className={adminButton({ variant: "ghost", size: "sm", className: "px-2 text-red-600 hover:text-red-700" })}
                      >
                        <Trash2 aria-hidden />
                      </button>
                    </span>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {list.fields.map((field) => {
                    const id = `${def.key}-${index}-${field.name}`;
                    const current = item[field.name] ?? "";
                    return field.kind === "image" ? (
                      <div key={field.name} className="sm:col-span-2">
                        <ImageField
                          id={id}
                          label={field.label}
                          hint={field.hint}
                          value={current}
                          onChange={(next) => setItemField(index, field.name, next)}
                          onError={onError}
                        />
                      </div>
                    ) : (
                      <div key={field.name} className={field.kind === "textarea" ? "sm:col-span-2" : undefined}>
                        <TextField id={id} field={field} value={current} onChange={(next) => setItemField(index, field.name, next)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {!list.fixed && items.length < list.max ? (
              <label className={adminButton({ variant: "secondary", className: "w-fit cursor-pointer" })}>
                {adding ? <Loader2 className="animate-spin" aria-hidden /> : <Plus aria-hidden />}
                {list.itemLabel} ekle
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={adding}
                  onChange={(event) => {
                    void addSlide(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>
            ) : null}
          </fieldset>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4">
          <FormMessage state={state} />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] text-neutral-500">Boş bırakılan alan sitedeki ilk hâline döner.</p>
            <button type="submit" disabled={pending || adding} className={adminButton()}>
              {pending ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Kaydediliyor…
                </>
              ) : (
                "Kaydet"
              )}
            </button>
          </div>
        </div>
      </form>
    </details>
  );
}
