import { requireAdmin } from "@/features/admin/auth/session";
import { Header } from "@/features/admin/shell/header";
import { MotionProvider } from "@/features/admin/shell/motion-provider";
import { TabBar } from "@/features/admin/shell/tab-bar";

/**
 * Panel kabuğu. Yetki kontrolü burada da yapılır ama tek başına yeterli
 * değildir — sayfalar ve action'lar kendi `requireAdmin()` çağrısını yapar.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { supabase, email } = await requireAdmin();
  const { count } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "yeni");

  return (
    <MotionProvider>
      <Header email={email} newCount={count ?? 0} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-5 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:pt-10 lg:pb-16">
        {children}
      </main>
      <TabBar newCount={count ?? 0} />
    </MotionProvider>
  );
}
