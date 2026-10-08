import type { Metadata } from "next";
import { BarList, Stat, TrafficChart } from "@/features/admin/analytics/charts";
import { getOverview, periods, type Period } from "@/features/admin/analytics/queries";
import { kindLabel } from "@/features/admin/contacts/labels";
import { Card, CardHeader } from "@/features/admin/ui/card";
import { PageHeader } from "@/features/admin/ui/page-header";
import { FilterChips } from "@/features/admin/ui/segmented";

export const metadata: Metadata = { title: "Analiz" };

const deviceLabel: Record<string, string> = { mobile: "Telefon", tablet: "Tablet", desktop: "Bilgisayar" };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ gun?: string }> }) {
  const requested = Number((await searchParams).gun);
  const days: Period = periods.includes(requested as Period) ? (requested as Period) : 30;
  const overview = await getOverview(days);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Analiz" lead="Çerezsiz ziyaret ölçümü — kişisel veri tutulmaz." />
      <FilterChips
        active={String(days)}
        items={periods.map((value) => ({ value: String(value), label: `Son ${value} gün`, href: `/admin/analiz?gun=${value}` }))}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Ziyaretçi" value={overview.visitors} hint="Günlük tekil" />
        <Stat label="Görüntüleme" value={overview.views} />
        <Stat label="Talep" value={overview.submissions} hint="Form gönderimi" />
        <Stat label="Şu an sitede" value={overview.live} hint="Son 5 dakika" />
      </div>

      <Card className="p-4 sm:p-5">
        <TrafficChart series={overview.series} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Sayfalar" />
          <BarList items={overview.pages.map((page) => ({ label: page.path, value: page.views }))} />
        </Card>
        <Card>
          <CardHeader title="Kaynaklar" />
          <BarList items={overview.sources.map((source) => ({ label: source.name, value: source.views }))} />
        </Card>
        <Card>
          <CardHeader title="Cihazlar" />
          <BarList items={overview.devices.map((device) => ({ label: deviceLabel[device.name] ?? device.name, value: device.views }))} />
        </Card>
        <Card>
          <CardHeader title="Formlar" />
          <BarList
            items={overview.forms.map((form) => ({ label: kindLabel[form.name] ?? form.name, value: form.views }))}
            empty="Bu dönemde form gönderimi yok."
          />
        </Card>
      </div>
    </div>
  );
}
