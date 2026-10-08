import { ArrowDown, ArrowUp, ChevronRight, Download, EyeOff, FileText, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { certificates as staticCertificates } from "@/data/media";
import { importStaticCertificates, moveCertificate } from "@/features/admin/certificates/actions";
import { listCertificates } from "@/features/admin/certificates/queries";
import { adminButton } from "@/features/admin/ui/button";
import { Card } from "@/features/admin/ui/card";
import { PageHeader } from "@/features/admin/ui/page-header";
import { SubmitButton } from "@/features/admin/ui/submit-button";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Belgeler" };

export default async function CertificatesAdminPage() {
  const certificates = await listCertificates();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Belgeler"
        lead="/belgelerimiz, ana sayfa ve footer'daki sertifikalar."
        actions={
          <Link href="/admin/belgeler/yeni" className={adminButton()}>
            <Plus aria-hidden />
            Belge ekle
          </Link>
        }
      />

      {certificates.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-5 sm:p-6">
          <p className="text-[14px] font-medium text-neutral-900">Sitede şu an mevcut {staticCertificates.length} belge gösteriliyor</p>
          <p className="text-[13px] text-neutral-500">
            Önce mevcut belgeleri panele aktarın; sonra sıralayabilir, gizleyebilir ya da yenisini ekleyebilirsiniz.
            Aktarmadan eklenen ilk belge, mevcut listenin yerini alır.
          </p>
          <form action={importStaticCertificates}>
            <SubmitButton variant="secondary" pendingLabel="Aktarılıyor…">
              <Download aria-hidden />
              Mevcut belgeleri aktar
            </SubmitButton>
          </form>
        </Card>
      ) : (
        <Card flush className="overflow-hidden">
          <ul>
            {certificates.map((cert, index) => (
              <li key={cert.id} className="flex items-center gap-1 border-b border-neutral-200 pr-2 last:border-b-0">
                <Link
                  href={`/admin/belgeler/${cert.id}`}
                  className="pressable flex min-w-0 flex-1 items-center gap-3 px-4 py-3 hover:bg-neutral-50 sm:px-5"
                >
                  {cert.thumb_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset(cert.thumb_url)}
                      alt=""
                      loading="lazy"
                      className="h-14 w-10 shrink-0 rounded border border-neutral-200 object-cover"
                    />
                  ) : (
                    <span className="flex h-14 w-10 shrink-0 items-center justify-center rounded border border-neutral-200 bg-neutral-50">
                      <FileText className="size-4 text-neutral-400" aria-hidden />
                    </span>
                  )}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2 text-[14px] font-medium text-neutral-900">
                      <span className="truncate">{cert.title}</span>
                      {!cert.visible ? <EyeOff className="size-3.5 shrink-0 text-neutral-400" aria-label="Gizli" /> : null}
                    </span>
                    <span className="truncate text-[13px] text-neutral-500">{cert.subtitle}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-neutral-300" aria-hidden />
                </Link>
                <form action={moveCertificate.bind(null, cert.id, -1)}>
                  <button type="submit" disabled={index === 0} aria-label="Yukarı" className={adminButton({ variant: "ghost", size: "sm", className: "w-8 px-0" })}>
                    <ArrowUp aria-hidden />
                  </button>
                </form>
                <form action={moveCertificate.bind(null, cert.id, 1)}>
                  <button
                    type="submit"
                    disabled={index === certificates.length - 1}
                    aria-label="Aşağı"
                    className={adminButton({ variant: "ghost", size: "sm", className: "w-8 px-0" })}
                  >
                    <ArrowDown aria-hidden />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
