"use client";

import { adminButton } from "@/features/admin/ui/button";

export default function PanelError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 py-12">
      <h1 className="text-[20px] font-semibold">Bir şeyler ters gitti</h1>
      <p className="text-[14px] text-neutral-500">
        Sayfa yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.
      </p>
      <button type="button" onClick={reset} className={adminButton()}>
        Tekrar dene
      </button>
    </div>
  );
}
