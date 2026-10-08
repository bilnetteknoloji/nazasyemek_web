import { ChevronRight, Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  contactStatuses,
  contactStatusLabel,
  contactStatusTone,
  type ContactStatus,
} from "@/features/admin/contacts/labels";
import { contactCounts, listContacts, PAGE_SIZE } from "@/features/admin/contacts/queries";
import { Badge } from "@/features/admin/ui/badge";
import { adminButton } from "@/features/admin/ui/button";
import { Card, Empty } from "@/features/admin/ui/card";
import { inputClass } from "@/features/admin/ui/field";
import { formatPhone, timeAgo, withParams } from "@/features/admin/ui/format";
import { PageHeader } from "@/features/admin/ui/page-header";
import { Pagination } from "@/features/admin/ui/pagination";
import { FilterChips } from "@/features/admin/ui/segmented";

export const metadata: Metadata = { title: "Müşteriler" };

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; durum?: string; sayfa?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim().slice(0, 100) || undefined;
  const status = contactStatuses.includes(params.durum as ContactStatus)
    ? (params.durum as ContactStatus)
    : undefined;
  const page = Math.max(1, Number(params.sayfa) || 1);
  const [{ contacts, total }, counts] = await Promise.all([
    listContacts({ q, status, page }),
    contactCounts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Müşteriler"
        lead="Formdan gelen ve elle eklenen kurumlar."
        actions={
          <Link href="/admin/musteriler/yeni" className={adminButton()}>
            <Plus aria-hidden />
            Yeni müşteri
          </Link>
        }
      />

      <form className="relative" role="search">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Firma, yetkili, e-posta ya da telefon ara"
          aria-label="Müşteri ara"
          className={`${inputClass} pl-9`}
        />
        {status ? <input type="hidden" name="durum" value={status} /> : null}
      </form>

      <FilterChips
        active={status ?? "all"}
        items={[
          { value: "all", label: "Tümü", href: withParams("/admin/musteriler", { q }), count: counts.all ?? 0 },
          ...contactStatuses.map((value) => ({
            value,
            label: contactStatusLabel[value],
            href: withParams("/admin/musteriler", { q, durum: value }),
            count: counts[value] ?? 0,
          })),
        ]}
      />

      <Card flush className="overflow-hidden">
        {contacts.length ? (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id} className="border-b border-neutral-200 last:border-b-0">
                <Link
                  href={`/admin/musteriler/${contact.id}`}
                  className="pressable flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 sm:px-5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[13px] font-semibold text-neutral-600 uppercase">
                    {(contact.company || contact.name || "?").slice(0, 1)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[14px] font-medium text-neutral-900">
                      {contact.company || contact.name || "İsimsiz"}
                    </span>
                    <span className="truncate text-[13px] text-neutral-500">
                      {[contact.company ? contact.name : null, contact.phone ? formatPhone(contact.phone) : contact.email]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <Badge tone={contactStatusTone[contact.status]}>{contactStatusLabel[contact.status]}</Badge>
                    <span className="text-[12px] text-neutral-500 max-sm:hidden">{timeAgo(contact.last_seen_at)}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-neutral-300" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty title={q ? "Sonuç bulunamadı" : "Henüz müşteri yok"}>
            {q ? "Aramayı değiştirip tekrar deneyin." : "Formdan gelen talepler otomatik olarak buraya eklenir."}
          </Empty>
        )}
      </Card>
      <Pagination
        page={page}
        pages={Math.ceil(total / PAGE_SIZE)}
        href={(n) => withParams("/admin/musteriler", { q, durum: status, sayfa: n })}
      />
    </div>
  );
}
