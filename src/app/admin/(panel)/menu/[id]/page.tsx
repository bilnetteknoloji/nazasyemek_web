import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteWeek, updateWeek } from "@/features/admin/menu/actions";
import { getWeek } from "@/features/admin/menu/queries";
import { WeekForm } from "@/features/admin/menu/week-form";
import { ConfirmAction } from "@/features/admin/ui/confirm-action";
import { PageHeader } from "@/features/admin/ui/page-header";

export const metadata: Metadata = { title: "Hafta düzenle" };

export default async function WeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const week = await getWeek(id);
  if (!week) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={week.label}
        lead="Ana yemeği boş bırakılan gün sitede gösterilmez."
        back={{ href: "/admin/menu", label: "Menü" }}
        actions={
          <ConfirmAction
            label="Haftayı sil"
            action={deleteWeek.bind(null, week.id)}
            message={`"${week.label}" silinsin mi?`}
          />
        }
      />
      <WeekForm action={updateWeek.bind(null, week.id)} label={week.label} days={week.days} />
    </div>
  );
}
