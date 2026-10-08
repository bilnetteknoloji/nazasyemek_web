import type { Metadata } from "next";
import { BarList, ColumnChart, Stat, TrafficChart } from "@/features/admin/analytics/charts";
import { getOverview, getRecentViews, periods, type Period, type Row } from "@/features/admin/analytics/queries";
import { kindLabel } from "@/features/admin/contacts/labels";
import { RecentList } from "@/features/admin/analytics/recent-list";
import { countryLabel, deviceLabel, pageLabel } from "@/features/admin/analytics/labels";
import { Card, CardHeader } from "@/features/admin/ui/card";
import { PageHeader } from "@/features/admin/ui/page-header";
import { FilterChips } from "@/features/admin/ui/segmented";

export const metadata: Metadata = { title: "Analiz" };

const periodLabel: Record<Period, string> = { 1: "Bugün", 7: "Son 7 gün", 30: "Son 30 gün", 90: "Son 90 gün" };
const weekdayLabel = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const rows = (items: Row[] | undefined, label: (name: string) => string = (name) => name) =>
  (items ?? []).map((item) => ({ label: label(item.name), value: item.views }));

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ gun?: string }> }) {
  const requested = Number((await searchParams).gun);
  const days: Period = periods.includes(requested as Period) ? (requested as Period) : 30;
  const [overview, recent] = await Promise.all([getOverview(days), getRecentViews(100)]);
  const { groups } = overview;
  const conversion = overview.visits ? Math.round((overview.submissions / overview.visits) * 1000) / 10 : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analiz"
        lead="Çerezsiz ziyaret ölçümü. IP ve tarayıcı kimliği saklanmaz; cihaz, sistem ve şehir yalnızca sınıf olarak tutulur."
      />
      <FilterChips
        active={String(days)}
        items={periods.map((value) => ({ value: String(value), label: periodLabel[value], href: `/admin/analiz?gun=${value}` }))}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Ziyaretçi" value={overview.visitors} hint="Günlük tekil kişi" />
        <Stat label="Ziyaret" value={overview.visits} previous={overview.previous.visits} hint="Önceki döneme göre" />
        <Stat label="Görüntüleme" value={overview.views} previous={overview.previous.views} hint="Önceki döneme göre" />
        <Stat label="Talep" value={overview.submissions} previous={overview.previous.submissions} hint="Form gönderimi" />
        <Stat label="Şu an sitede" value={overview.live} hint="Son 5 dakika" />
        <Stat label="Ziyaret başına sayfa" value={overview.pagesPerVisit} />
        <Stat label="Tek sayfada çıkma" value={overview.bounce} suffix="%" hint="Tek sayfa görüp ayrılan" />
        <Stat label="Talebe dönüşme" value={conversion} suffix="%" hint="Talep / ziyaret" />
      </div>

      <Card className="p-4 sm:p-5">
        <TrafficChart series={overview.series} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Cihaz" />
          <BarList items={rows(groups.devices, (name) => deviceLabel[name] ?? name)} />
        </Card>
        <Card>
          <CardHeader title="İşletim sistemi" />
          <BarList items={rows(groups.os)} />
        </Card>
        <Card>
          <CardHeader title="Tarayıcı" />
          <BarList items={rows(groups.browsers)} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Nereden geldiler?" />
          <BarList items={rows(groups.channels)} />
        </Card>
        <Card>
          <CardHeader title="Arama motorları" />
          <BarList items={rows(groups.engines)} empty="Bu dönemde aramadan gelen yok." />
        </Card>
        <Card>
          <CardHeader title="Kaynak siteler" />
          <BarList items={rows(groups.sources)} />
        </Card>
        <Card>
          <CardHeader title="Ülke" />
          <BarList items={rows(groups.countries, countryLabel)} />
        </Card>
        <Card>
          <CardHeader title="Şehir" />
          <BarList items={rows(groups.cities)} empty="Şehir bilgisi henüz gelmiyor." />
        </Card>
        <Card>
          <CardHeader title="Formlar" />
          <BarList
            items={overview.forms.map((form) => ({ label: kindLabel[form.name] ?? form.name, value: form.views }))}
            empty="Bu dönemde form gönderimi yok."
          />
        </Card>
        <Card>
          <CardHeader title="En çok görüntülenen sayfalar" />
          <BarList items={rows(groups.pages, pageLabel)} />
        </Card>
        <Card>
          <CardHeader title="Giriş sayfaları" />
          <BarList items={rows(groups.entries, pageLabel)} empty="Henüz veri yok (yeni ölçüm)." />
        </Card>
        <Card>
          <CardHeader title="Saatlere göre" />
          <ColumnChart
            label="Saatlere göre görüntüleme"
            items={overview.hours.map((hour) => ({ label: String(hour.hour).padStart(2, "0"), value: hour.views }))}
          />
        </Card>
        <Card>
          <CardHeader title="Günlere göre" />
          <ColumnChart
            label="Haftanın günlerine göre görüntüleme"
            items={overview.weekdays.map((day) => ({ label: weekdayLabel[day.day - 1], value: day.views }))}
          />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Son ziyaretler"
          actions={<span className="text-[12px] text-neutral-500">Son {recent.length} kayıt · listeyi kaydırın</span>}
        />
        <RecentList views={recent} />
      </Card>
    </div>
  );
}
