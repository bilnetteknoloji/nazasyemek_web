import { ArrowDown, ArrowUp, ChevronRight, Download, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { menuWeeks as staticWeeks } from "@/data/menu";
import { createWeek, importStaticMenu, moveWeek } from "@/features/admin/menu/actions";
import { listWeeks } from "@/features/admin/menu/queries";
import { adminButton } from "@/features/admin/ui/button";
import { Card } from "@/features/admin/ui/card";
import { timeAgo } from "@/features/admin/ui/format";
import { PageHeader } from "@/features/admin/ui/page-header";
import { SubmitButton } from "@/features/admin/ui/submit-button";

export const metadata: Metadata = { title: "Menü" };

export default async function MenuAdminPage() {
  const weeks = await listWeeks();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Menü"
        lead="/menu sayfasındaki haftalık tabldot menüsü."
        actions={
          <form action={createWeek}>
            <SubmitButton pendingLabel="Ekleniyor…">
              <Plus aria-hidden />
              Hafta ekle
            </SubmitButton>
          </form>
        }
      />

      {weeks.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-5 sm:p-6">
          <p className="text-[14px] font-medium text-neutral-900">Sitede şu an örnek menü gösteriliyor</p>
          <p className="text-[13px] text-neutral-500">
            {staticWeeks.length} haftalık örnek menüyü panele aktarıp düzenleyebilir ya da sıfırdan hafta
            ekleyebilirsiniz. Panelde en az bir dolu hafta olduğunda site onu gösterir.
          </p>
          <form action={importStaticMenu}>
            <SubmitButton variant="secondary" pendingLabel="Aktarılıyor…">
              <Download aria-hidden />
              Örnek menüyü aktar
            </SubmitButton>
          </form>
        </Card>
      ) : (
        <Card flush className="overflow-hidden">
          <ul>
            {weeks.map((week, index) => (
              <li key={week.id} className="flex items-center gap-2 border-b border-neutral-200 pr-2 last:border-b-0">
                <Link
                  href={`/admin/menu/${week.id}`}
                  className="pressable flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 sm:px-5"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[14px] font-medium text-neutral-900">{week.label}</span>
                    <span className="truncate text-[13px] text-neutral-500">
                      {week.days.length
                        ? week.days.map((day) => day.main).join(" · ")
                        : "Boş — sitede görünmez"}
                    </span>
                  </span>
                  <span className="shrink-0 text-[12px] text-neutral-400 max-sm:hidden">{timeAgo(week.updated_at)}</span>
                  <ChevronRight className="size-4 shrink-0 text-neutral-300" aria-hidden />
                </Link>
                <form action={moveWeek.bind(null, week.id, -1)}>
                  <button
                    type="submit"
                    disabled={index === 0}
                    aria-label={`${week.label} yukarı`}
                    className={adminButton({ variant: "ghost", size: "sm", className: "w-8 px-0" })}
                  >
                    <ArrowUp aria-hidden />
                  </button>
                </form>
                <form action={moveWeek.bind(null, week.id, 1)}>
                  <button
                    type="submit"
                    disabled={index === weeks.length - 1}
                    aria-label={`${week.label} aşağı`}
                    className={adminButton({ variant: "ghost", size: "sm", className: "w-8 px-0" })}
                  >
                    <ArrowDown aria-hidden />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
