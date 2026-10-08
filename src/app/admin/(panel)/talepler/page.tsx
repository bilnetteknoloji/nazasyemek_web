import type { Metadata } from "next";
import { submissionStatuses, submissionStatusLabel, type SubmissionStatus } from "@/features/admin/contacts/labels";
import { listSubmissions, PAGE_SIZE, submissionCounts } from "@/features/admin/contacts/queries";
import { SubmissionCard } from "@/features/admin/contacts/submission-card";
import { Card, Empty } from "@/features/admin/ui/card";
import { withParams } from "@/features/admin/ui/format";
import { PageHeader } from "@/features/admin/ui/page-header";
import { Pagination } from "@/features/admin/ui/pagination";
import { FilterChips } from "@/features/admin/ui/segmented";

export const metadata: Metadata = { title: "Talepler" };

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string; sayfa?: string }>;
}) {
  const params = await searchParams;
  const status = submissionStatuses.includes(params.durum as SubmissionStatus)
    ? (params.durum as SubmissionStatus)
    : undefined;
  const page = Math.max(1, Number(params.sayfa) || 1);
  const [{ submissions, total }, counts] = await Promise.all([
    listSubmissions({ status, page }),
    submissionCounts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Talepler" lead="Teklif ve hızlı ön hesaplama formlarından gelenler." />
      <FilterChips
        active={status ?? "all"}
        items={[
          { value: "all", label: "Tümü", href: "/admin/talepler", count: counts.all ?? 0 },
          ...submissionStatuses.map((value) => ({
            value,
            label: submissionStatusLabel[value],
            href: withParams("/admin/talepler", { durum: value }),
            count: counts[value] ?? 0,
          })),
        ]}
      />
      <Card flush className="overflow-hidden">
        {submissions.length ? (
          submissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} />)
        ) : (
          <Empty title="Talep yok">Sitedeki formlardan gelen talepler burada görünür.</Empty>
        )}
      </Card>
      <Pagination
        page={page}
        pages={Math.ceil(total / PAGE_SIZE)}
        href={(n) => withParams("/admin/talepler", { durum: status, sayfa: n })}
      />
    </div>
  );
}
