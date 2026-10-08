import { ChevronDown, UserRound } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/features/admin/ui/badge";
import { ConfirmAction } from "@/features/admin/ui/confirm-action";
import { formatDateTime, timeAgo } from "@/features/admin/ui/format";
import { cn } from "@/lib/cn";
import { deleteSubmission, setSubmissionStatus } from "./actions";
import {
  kindLabel,
  submissionStatusLabel,
  submissionStatuses,
  submissionStatusTone,
} from "./labels";
import type { SubmissionRow } from "./queries";
import { ReachButtons } from "./reach-buttons";

/**
 * Talep satırı: kapalıyken özet (firma, form, zaman, durum), açılınca
 * formdaki tüm alanlar, durum düğmeleri ve iletişim kısayolları.
 */
export function SubmissionCard({
  submission,
  showContact = true,
}: {
  submission: Omit<SubmissionRow, "contact"> & { contact?: SubmissionRow["contact"] };
  showContact?: boolean;
}) {
  const { contact } = submission;
  const fields = submission.data.fields ?? {};
  const title = contact?.company || contact?.name || (submission.data.company as string) || "İsimsiz talep";
  const subtitle = [contact?.name, fields["Günlük öğün"] ?? fields["Günlük kişi sayısı"]]
    .filter(Boolean)
    .join(" · ");

  return (
    <details className="group border-b border-neutral-200 last:border-b-0 open:bg-neutral-50/60">
      <summary className="pressable flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className={cn(
            "size-2 shrink-0 rounded-full",
            submission.status === "yeni" ? "bg-[#8b3a2b]" : "bg-transparent",
          )}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[14px] font-medium text-neutral-900">{title}</span>
          <span className="truncate text-[13px] text-neutral-500">
            {kindLabel[submission.kind] ?? submission.kind}
            {subtitle ? ` · ${subtitle}` : ""}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[12px] text-neutral-500">{timeAgo(submission.created_at)}</span>
          <Badge tone={submissionStatusTone[submission.status]}>{submissionStatusLabel[submission.status]}</Badge>
        </span>
        <ChevronDown className="size-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180" aria-hidden />
      </summary>

      <div className="flex flex-col gap-4 px-4 pb-5 sm:px-5 sm:pl-10">
        <dl className="grid gap-x-6 gap-y-2.5 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2">
          {Object.entries(fields).map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-[12px] text-neutral-500">{label}</dt>
              <dd className="text-[14px] break-words whitespace-pre-line text-neutral-900">{value || "—"}</dd>
            </div>
          ))}
          <div>
            <dt className="text-[12px] text-neutral-500">Gönderim</dt>
            <dd className="text-[14px] text-neutral-900">{formatDateTime(submission.created_at)}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <ReachButtons phone={contact?.phone ?? null} email={contact?.email ?? null} />
          {showContact && contact ? (
            <Link
              href={`/admin/musteriler/${contact.id}`}
              className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600 hover:text-neutral-900"
            >
              <UserRound className="size-4" aria-hidden />
              Müşteri kartı
            </Link>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Durum">
            {submissionStatuses.map((status) => (
              <form key={status} action={setSubmissionStatus.bind(null, submission.id, status)}>
                <button
                  type="submit"
                  aria-pressed={submission.status === status}
                  className={cn(
                    "pressable h-8 rounded-full border px-3 text-[13px] font-medium pointer-coarse:h-10",
                    submission.status === status
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900",
                  )}
                >
                  {submissionStatusLabel[status]}
                </button>
              </form>
            ))}
          </div>
          <ConfirmAction
            action={deleteSubmission.bind(null, submission.id)}
            message="Bu talep kalıcı olarak silinsin mi? Müşteri kartı silinmez."
          />
        </div>
      </div>
    </details>
  );
}
