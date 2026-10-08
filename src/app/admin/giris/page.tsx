import type { Metadata } from "next";
import { SignInForm } from "@/features/admin/auth/sign-in-form";
import { Brand } from "@/features/admin/shell/brand";
import { Card } from "@/features/admin/ui/card";

export const metadata: Metadata = { title: "Giriş" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { hata } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 pt-[calc(3rem+env(safe-area-inset-top))] pb-[calc(3rem+env(safe-area-inset-bottom))]">
      <Brand />
      <Card className="w-full max-w-sm p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.4px]">Panele giriş</h1>
          <p className="text-[14px] text-neutral-500">Talepleri, menüyü ve site içeriğini yönetin.</p>
        </div>
        <SignInForm
          initialError={hata === "yetki" ? "Bu hesabın panele erişim yetkisi yok." : null}
        />
      </Card>
    </main>
  );
}
