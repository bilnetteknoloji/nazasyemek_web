"use client";

import { FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { processImage, uploadBlob } from "@/features/admin/media/upload";
import { adminButton } from "@/features/admin/ui/button";
import { Field, inputClass } from "@/features/admin/ui/field";
import { FormMessage, type ActionState } from "@/features/admin/ui/form-message";
import { asset } from "@/lib/asset";
import { saveCertificate } from "./actions";
import type { CertificateRow } from "./queries";

/**
 * Belge formu: başlık, alt başlık, PDF ve önizleme görseli. Dosyalar önce
 * tarayıcıdan Storage'a yüklenir, sonra kayıt yazılır. Önizleme görseli
 * verilmezse sitede belge ikonu gösterilir.
 */
export function CertificateForm({ certificate }: { certificate?: CertificateRow }) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const pdf = form.get("pdf") as File | null;
    const image = form.get("image") as File | null;

    if (!certificate && !pdf?.size) {
      setState({ ok: false, message: "PDF dosyası seçin." });
      return;
    }
    if (pdf?.size && pdf.type !== "application/pdf") {
      setState({ ok: false, message: "Belge dosyası PDF olmalı." });
      return;
    }

    setPending(true);
    setState(null);
    try {
      const pdfUrl = pdf?.size ? await uploadBlob(pdf, "belgeler", "pdf") : certificate!.pdf_url;
      let thumb = {
        url: certificate?.thumb_url ?? null,
        width: certificate?.thumb_width ?? null,
        height: certificate?.thumb_height ?? null,
      };
      if (image?.size) {
        const processed = await processImage(image, { maxSize: 1274 });
        thumb = {
          url: await uploadBlob(processed.blob, "belgeler", "webp"),
          width: processed.width,
          height: processed.height,
        };
      }
      const result = await saveCertificate(certificate?.id ?? null, {
        title: String(form.get("title") ?? ""),
        subtitle: String(form.get("subtitle") ?? ""),
        visible: form.get("visible") === "on",
        pdf_url: pdfUrl,
        thumb_url: thumb.url,
        thumb_width: thumb.width,
        thumb_height: thumb.height,
      });
      setState(result);
      if (result?.ok && !certificate) {
        router.push("/admin/belgeler");
        return;
      }
      router.refresh();
    } catch (error) {
      setState({ ok: false, message: error instanceof Error ? error.message : "Kaydedilemedi." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="cert-title" label="Başlık" hint="Örn. ISO 22000:2018">
          <input id="cert-title" name="title" required maxLength={120} defaultValue={certificate?.title} className={inputClass} />
        </Field>
        <Field id="cert-subtitle" label="Alt başlık" hint="Örn. Gıda Güvenliği Yönetim Sistemi">
          <input id="cert-subtitle" name="subtitle" maxLength={200} defaultValue={certificate?.subtitle} className={inputClass} />
        </Field>
        <Field
          id="cert-pdf"
          label={certificate ? "PDF (değiştirmek için seçin)" : "PDF"}
          hint={certificate ? undefined : "En fazla 20 MB."}
        >
          <input id="cert-pdf" name="pdf" type="file" accept="application/pdf" className={inputClass} />
        </Field>
        <Field id="cert-image" label="Önizleme görseli" hint="Belgenin ilk sayfasının fotoğrafı ya da ekran görüntüsü.">
          <input id="cert-image" name="image" type="file" accept="image/*" className={inputClass} />
        </Field>
      </div>

      {certificate ? (
        <div className="flex items-center gap-4">
          {certificate.thumb_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset(certificate.thumb_url)} alt="" className="h-28 w-20 rounded-md border border-neutral-200 object-cover" />
          ) : (
            <span className="flex h-28 w-20 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
              <FileText className="size-6 text-neutral-400" aria-hidden />
            </span>
          )}
          <a href={asset(certificate.pdf_url)} target="_blank" rel="noreferrer" className="text-[13px] font-medium underline">
            Mevcut PDF&apos;i aç
          </a>
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-[14px]">
        <input type="checkbox" name="visible" defaultChecked={certificate?.visible ?? true} className="size-4 accent-neutral-900" />
        Sitede göster
      </label>

      <FormMessage state={state} />
      <div className="flex justify-end">
        <button type="submit" disabled={pending} className={adminButton()}>
          {pending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Yükleniyor…
            </>
          ) : certificate ? (
            "Kaydet"
          ) : (
            "Belgeyi ekle"
          )}
        </button>
      </div>
    </form>
  );
}
