"use client";

import { ExternalLink, KeyRound, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/features/admin/auth/actions";
import { Dialog } from "@/features/admin/ui/dialog";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

const itemClass =
  "pressable flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] text-neutral-900 hover:bg-neutral-100 pointer-coarse:min-h-12";

function Avatar({ email }: { email: string | null }) {
  return (
    <span
      aria-hidden
      className="flex size-8 items-center justify-center rounded-full bg-linear-135 from-[#8b3a2b] to-[#4e7c48] text-[12px] font-semibold text-white uppercase"
    >
      {email?.[0] ?? "N"}
    </span>
  );
}

function MenuBody({ email, onNavigate }: { email: string | null; onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      {email ? <p className="truncate px-3 pt-1 pb-2 text-[13px] text-neutral-500">{email}</p> : null}
      <a href={asset("/")} target="_blank" rel="noreferrer" className={itemClass}>
        <ExternalLink className="size-4 text-neutral-500" aria-hidden />
        Siteyi görüntüle
      </a>
      <Link href="/admin/ayarlar#sifre" onClick={onNavigate} className={itemClass}>
        <KeyRound className="size-4 text-neutral-500" aria-hidden />
        Şifre değiştir
      </Link>
      <div className="my-1 h-px bg-neutral-200" />
      <form action={signOut}>
        <button type="submit" className={cn(itemClass, "text-red-600")}>
          <LogOut className="size-4" aria-hidden />
          Çıkış yap
        </button>
      </form>
    </div>
  );
}

/**
 * Hesap menüsü: masaüstünde avatara bağlı açılır panel, telefonda alttan
 * açılan sayfa. Cihaz CSS ile ayrılır.
 */
export function AccountMenu({ email }: { email: string | null }) {
  const [dropdown, setDropdown] = useState(false);
  const [sheet, setSheet] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdown) return;
    const onDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setDropdown(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setDropdown(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropdown]);

  return (
    <>
      <div ref={ref} className="relative hidden lg:block">
        <button
          type="button"
          aria-label="Hesap"
          aria-haspopup="menu"
          aria-expanded={dropdown}
          onClick={() => setDropdown((value) => !value)}
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
        >
          <Avatar email={email} />
        </button>
        {dropdown ? (
          <div className="absolute top-full right-0 z-50 mt-2 w-64 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl">
            <MenuBody email={email} onNavigate={() => setDropdown(false)} />
          </div>
        ) : null}
      </div>

      <button
        type="button"
        aria-label="Hesap"
        aria-haspopup="dialog"
        onClick={() => setSheet(true)}
        className="pressable flex size-11 items-center justify-center rounded-full lg:hidden"
      >
        <Avatar email={email} />
      </button>
      <Dialog open={sheet} onClose={() => setSheet(false)} label="Hesap" className="lg:hidden">
        <div className="px-3 pt-2 pb-4">
          <MenuBody email={email} onNavigate={() => setSheet(false)} />
        </div>
      </Dialog>
    </>
  );
}
