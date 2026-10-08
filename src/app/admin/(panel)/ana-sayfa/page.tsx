import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { getHomeForEdit } from "@/features/admin/home/queries";
import { HomeSectionForm } from "@/features/admin/home/section-form";
import { saveStats } from "@/features/admin/settings/actions";
import { StatsSettingsForm } from "@/features/admin/settings/forms";
import { getSettings } from "@/features/admin/settings/queries";
import { adminButton } from "@/features/admin/ui/button";
import { PageHeader } from "@/features/admin/ui/page-header";
import { homeSections } from "@/lib/content/home-sections";

export const metadata: Metadata = { title: "Ana Sayfa" };

/** Ana sayfa bölümleri, sitedeki sırayla. Rakamlar üretim sürecinden sonra gelir. */
export default async function HomeContentPage() {
  const [home, { stats }] = await Promise.all([getHomeForEdit(), getSettings()]);
  const before = homeSections.filter((def) => ["hero", "sectors", "why", "chain"].includes(def.key));
  const after = homeSections.filter((def) => !before.includes(def));

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Ana Sayfa"
        lead="Ana sayfadaki yazıları ve görselleri buradan değiştirin. Bir bölümü açın, düzenleyin ve o bölümün Kaydet düğmesine basın."
        actions={
          <a href="/" target="_blank" rel="noopener" className={adminButton({ variant: "secondary" })}>
            <ExternalLink aria-hidden />
            Siteyi aç
          </a>
        }
      />
      {before.map((def) => (
        <HomeSectionForm key={def.key} def={def} initial={home[def.key]} />
      ))}
      <details className="group rounded-xl border border-neutral-200 bg-white open:shadow-sm">
        <summary className="flex cursor-pointer list-none flex-col gap-0.5 px-4 py-3.5 select-none sm:px-5 [&::-webkit-details-marker]:hidden">
          <span className="text-[15px] font-semibold text-neutral-900">Rakamlar</span>
          <span className="text-[12.5px] text-neutral-500">Slider altındaki şerit ve kapasite paneli.</span>
        </summary>
        <div className="border-t border-neutral-200 p-4 sm:p-5">
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
            Şu anki rakamlar tasarımdan gelen örnek değerlerdir. Yayında yanıltıcı olmaması için gerçek değerlerle
            değiştirin.
          </p>
          <StatsSettingsForm action={saveStats} values={stats} />
        </div>
      </details>
      {after.map((def) => (
        <HomeSectionForm key={def.key} def={def} initial={home[def.key]} />
      ))}
    </div>
  );
}
