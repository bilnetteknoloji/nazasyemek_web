import type { Metadata } from "next";
import { createContact } from "@/features/admin/contacts/actions";
import { ContactForm } from "@/features/admin/contacts/contact-form";
import { requireAdmin } from "@/features/admin/auth/session";
import { Card } from "@/features/admin/ui/card";
import { PageHeader } from "@/features/admin/ui/page-header";

export const metadata: Metadata = { title: "Yeni müşteri" };

export default async function NewContactPage() {
  await requireAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Yeni müşteri" back={{ href: "/admin/musteriler", label: "Müşteriler" }} />
      <Card className="p-4 sm:p-6">
        <ContactForm action={createContact} submitLabel="Müşteriyi ekle" />
      </Card>
    </div>
  );
}
