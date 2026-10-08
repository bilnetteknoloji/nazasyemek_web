import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { addNote, deleteContact, deleteNote, updateContact } from "@/features/admin/contacts/actions";
import { ContactForm } from "@/features/admin/contacts/contact-form";
import { contactStatusLabel, contactStatusTone, kindLabel } from "@/features/admin/contacts/labels";
import { NoteForm } from "@/features/admin/contacts/note-form";
import { getContact } from "@/features/admin/contacts/queries";
import { ReachButtons } from "@/features/admin/contacts/reach-buttons";
import { SubmissionCard } from "@/features/admin/contacts/submission-card";
import { Badge } from "@/features/admin/ui/badge";
import { Card, CardHeader, Empty } from "@/features/admin/ui/card";
import { ConfirmAction } from "@/features/admin/ui/confirm-action";
import { formatDate, formatDateTime, formatPhone } from "@/features/admin/ui/format";
import { PageHeader } from "@/features/admin/ui/page-header";

export const metadata: Metadata = { title: "Müşteri" };

export default async function ContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const result = await getContact(id);
  if (!result) notFound();
  const { contact, notes, submissions } = result;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={contact.company || contact.name || "İsimsiz"}
        lead={[
          contact.company ? contact.name : null,
          contact.phone ? formatPhone(contact.phone) : null,
          contact.email,
        ]
          .filter(Boolean)
          .join(" · ")}
        back={{ href: "/admin/musteriler", label: "Müşteriler" }}
        actions={<Badge tone={contactStatusTone[contact.status]}>{contactStatusLabel[contact.status]}</Badge>}
      />
      <ReachButtons phone={contact.phone} email={contact.email} size="md" />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardHeader title={`Talepler (${submissions.length})`} />
            {submissions.length ? (
              submissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} showContact={false} />
              ))
            ) : (
              <Empty title="Form talebi yok">Bu müşteri panelden eklendi.</Empty>
            )}
          </Card>

          <Card>
            <CardHeader title="Bilgiler" />
            <div className="p-4 sm:p-5">
              <ContactForm action={updateContact.bind(null, contact.id)} contact={contact} />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Notlar" />
            <div className="flex flex-col gap-4 p-4 sm:p-5">
              <NoteForm action={addNote.bind(null, contact.id)} />
              {notes.length ? (
                <ul className="flex flex-col gap-3">
                  {notes.map((note) => (
                    <li key={note.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                      <p className="text-[14px] whitespace-pre-line text-neutral-900">{note.body}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[12px] text-neutral-500">{formatDateTime(note.created_at)}</span>
                        <ConfirmAction
                          compact
                          label="Notu sil"
                          action={deleteNote.bind(null, contact.id, note.id)}
                          message="Bu not silinsin mi?"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Card>

          <Card className="p-4 text-[13px] text-neutral-500 sm:p-5">
            <p>Kayıt: {formatDate(contact.created_at)}</p>
            <p>Kaynak: {contact.source ? kindLabel[contact.source] ?? "Panel" : "—"}</p>
            <div className="mt-4">
              <ConfirmAction
                label="Müşteriyi sil"
                action={deleteContact.bind(null, contact.id)}
                message="Müşteri kartı listeden kaldırılsın mı? Talepleri silinmez; aynı kişi yeniden form gönderirse kart geri gelir."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
