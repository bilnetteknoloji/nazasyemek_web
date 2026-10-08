import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteCertificate } from "@/features/admin/certificates/actions";
import { CertificateForm } from "@/features/admin/certificates/certificate-form";
import { getCertificate } from "@/features/admin/certificates/queries";
import { Card } from "@/features/admin/ui/card";
import { ConfirmAction } from "@/features/admin/ui/confirm-action";
import { PageHeader } from "@/features/admin/ui/page-header";

export const metadata: Metadata = { title: "Belge" };

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const certificate = await getCertificate(id);
  if (!certificate) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={certificate.title}
        back={{ href: "/admin/belgeler", label: "Belgeler" }}
        actions={
          <ConfirmAction
            label="Belgeyi sil"
            action={deleteCertificate.bind(null, certificate.id)}
            message={`"${certificate.title}" siteden kaldırılsın mı?`}
          />
        }
      />
      <Card className="p-4 sm:p-6">
        <CertificateForm certificate={certificate} />
      </Card>
    </div>
  );
}
