import type { Metadata } from "next";
import { notifyAllPages, saveContact, saveSeo } from "@/features/admin/settings/actions";
import { ContactSettingsForm, PasswordForm, SeoSettingsForm } from "@/features/admin/settings/forms";
import { getSettings } from "@/features/admin/settings/queries";
import { Card, CardHeader } from "@/features/admin/ui/card";
import { PageHeader } from "@/features/admin/ui/page-header";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Ayarlar" };

export default async function SettingsPage() {
  const { contact, seo } = await getSettings();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Ayarlar" lead="İletişim bilgileri, arama motorları ve şifre. Ana sayfa rakamları Ana Sayfa bölümünde." />
      <Card>
        <CardHeader title="İletişim bilgileri" />
        <div className="p-4 sm:p-5">
          <ContactSettingsForm action={saveContact} values={contact} />
        </div>
      </Card>
      <Card>
        <div id="arama-motorlari" className="scroll-mt-28">
          <CardHeader title="Arama motorları (Google, Yandex, Bing)" />
        </div>
        <div className="p-4 sm:p-5">
          <SeoSettingsForm action={saveSeo} notify={notifyAllPages} values={seo} siteUrl={site.url} />
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
