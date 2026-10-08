import { ArrowRight, CircleCheck, CircleDashed } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Stat } from "@/features/admin/analytics/charts";
import { getOverview } from "@/features/admin/analytics/queries";
import { requireAdmin } from "@/features/admin/auth/session";
import { listSubmissions } from "@/features/admin/contacts/queries";
import { SubmissionCard } from "@/features/admin/contacts/submission-card";
import { Card, CardHeader, Empty } from "@/features/admin/ui/card";
import { PageHeader } from "@/features/admin/ui/page-header";

export const metadata: Metadata = { title: "Özet" };

const greeting = () => {
  const hour = Number(new Intl.DateTimeFormat("tr-TR", { hour: "numeric", hourCycle: "h23", timeZone: "Europe/Istanbul" }).format(new Date()));
  return hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";
};

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const count = (table: string, filter?: [string, string]) => {
    let query = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) query = query.eq(filter[0], filter[1]);
    return query.then(({ count }) => count ?? 0);
  };

  const [overview, latest, newLeads, customers, weeks, certificates, gallery, posts, stats] = await Promise.all([
    getOverview(7).catch(() => null),
    listSubmissions({ page: 1 }),
    count("submissions", ["status", "yeni"]),
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("status", "musteri")
      .is("deleted_at", null)
      .then(({ count }) => count ?? 0),
    count("menu_weeks"),
    count("certificates"),
    count("gallery_items"),
    count("posts", ["status", "yayinda"]),
    supabase.from("settings").select("key").eq("key", "stats").maybeSingle(),
  ]);

  // Panele geçişin kalan adımları: dolu olanlar sitede panelden yönetiliyor.
  const checklist = [
    { done: weeks > 0, label: "Menü panele aktarıldı", href: "/admin/menu" },
    { done: certificates > 0, label: "Belgeler panele aktarıldı", href: "/admin/belgeler" },
    { done: gallery > 0, label: "Galeri panele aktarıldı", href: "/admin/galeri" },
    { done: Boolean(stats.data), label: "Ana sayfa rakamları doğrulandı", href: "/admin/ana-sayfa" },
    { done: posts > 0, label: "İlk blog yazısı yayınlandı", href: "/admin/blog/yeni" },
  ];
  const remaining = checklist.filter((item) => !item.done);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={greeting()} lead="NAZ-AŞ Yemek yönetim paneli." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Link href="/admin/talepler?durum=yeni" className="pressable rounded-xl">
          <Stat label="Yeni talep" value={newLeads} hint="Yanıt bekliyor" />
        </Link>
        <Link href="/admin/musteriler?durum=musteri" className="pressable rounded-xl">
          <Stat label="Müşteri" value={customers} hint="Sözleşmeli kurum" />
        </Link>
        <Link href="/admin/analiz?gun=7" className="pressable rounded-xl">
          <Stat label="Ziyaretçi" value={overview?.visitors ?? 0} hint="Son 7 gün" />
        </Link>
        <Link href="/admin/analiz?gun=7" className="pressable rounded-xl">
          <Stat label="Görüntüleme" value={overview?.views ?? 0} hint="Son 7 gün" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Son talepler"
            actions={
              <Link href="/admin/talepler" className="flex items-center gap-1 text-[13px] font-medium text-neutral-500 hover:text-neutral-900">
                Tümü
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            }
          />
          {latest.submissions.length ? (
            latest.submissions.slice(0, 5).map((submission) => <SubmissionCard key={submission.id} submission={submission} />)
          ) : (
            <Empty title="Henüz talep yok">Teklif ve ön hesaplama formları buraya düşer.</Empty>
          )}
        </Card>

        {remaining.length ? (
          <Card className="h-fit">
            <CardHeader title="Kurulum" actions={<span className="text-[12px] text-neutral-500">{checklist.length - remaining.length}/{checklist.length}</span>} />
            <ul className="p-2">
              {checklist.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="pressable flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] hover:bg-neutral-50">
                    {item.done ? (
                      <CircleCheck className="size-4 shrink-0 text-emerald-600" aria-label="Tamam" />
                    ) : (
                      <CircleDashed className="size-4 shrink-0 text-neutral-400" aria-label="Bekliyor" />
                    )}
                    <span className={item.done ? "text-neutral-400 line-through" : "text-neutral-900"}>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
