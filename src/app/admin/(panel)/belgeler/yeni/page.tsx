import type { Metadata } from "next";
import { requireAdmin } from "@/features/admin/auth/session";
import { CertificateForm } from "@/features/admin/certificates/certificate-form";
import { Card } from "@/features/admin/ui/card";
import { PageHeader } from "@/features/admin/ui/page-header";

export const metadata: Metadata = { title: "Belge ekle" };

export default async function NewCertificatePage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Belge ekle" back={{ href: "/admin/belgeler", label: "Belgeler" }} />
      <Card className="p-4 sm:p-6">
        <CertificateForm />
      </Card>
    </div>
  );
}
