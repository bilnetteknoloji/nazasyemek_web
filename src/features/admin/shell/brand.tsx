import { Slash } from "lucide-react";
import Link from "next/link";
import { asset } from "@/lib/asset";

/** "NAZ-AŞ / Panel" — Vercel'deki ekip / proje kırıntısı gibi. */
export function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-1.5 text-[15px] font-semibold tracking-[-0.2px] text-neutral-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/brand/logo.svg")} alt="" className="size-7" />
      <span>NAZ-AŞ</span>
      <Slash className="size-4 -rotate-12 text-neutral-300" strokeWidth={1.5} aria-hidden />
      <span className="font-medium text-neutral-500">Panel</span>
    </Link>
  );
}
