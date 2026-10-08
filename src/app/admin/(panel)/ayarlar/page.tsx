import type { Metadata } from "next";
import { saveContact, saveStats } from "@/features/admin/settings/actions";
import { ContactSettingsForm, PasswordForm, StatsSettingsForm } from "@/features/admin/settings/forms";
import { getSettings } from "@/features/admin/settings/queries";
import { Card, CardHeader } from "@/features/admin/ui/card";
import { PageHeader } from "@/features/admin/ui/page-header";

export const metadata: Metadata = { title: "Ayarlar" };

export default async function SettingsPage() {
  const { contact, stats } = await getSettings();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Ayarlar" lead="Sitedeki iletişim bilgileri ve rakamlar." />
      <Card>
        <CardHeader title="İletişim bilgileri" />
        <div className="p-4 sm:p-5">
          <ContactSettingsForm action={saveContact} values={contact} />
        </div>
      </Card>
      <Card>
        <CardHeader title="Ana sayfa rakamları" />
        <div className="p-4 sm:p-5">
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
            Şu anki rakamlar tasarımdan gelen örnek değerlerdir. Yayında yanıltıcı olmaması için gerçek değerlerle
            değiştirin.
          </p>
          <StatsSettingsForm action={saveStats} values={stats} />
        </div>
      </Card>
      <Card>
        <div id="sifre" className="scroll-mt-28">
          <CardHeader title="Şifre" />
        </div>
        <div className="p-4 sm:p-5">
          <PasswordForm />
        </div>
      </Card>
    </div>
  );
}
