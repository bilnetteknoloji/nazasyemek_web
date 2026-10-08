import type { Metadata } from "next";
import { asset } from "@/lib/asset";

/**
 * Panel arama motorlarına kapalı; robots.txt ayrıca /admin'i engeller.
 * Manifest + appleWebApp: telefonda "Ana Ekrana Ekle" ile tam ekran,
 * tarayıcı çubuğu olmadan uygulama gibi açılır.
 */
export const metadata: Metadata = {
  title: { default: "NAZ-AŞ Panel", template: "%s · NAZ-AŞ Panel" },
  robots: { index: false, follow: false },
  manifest: asset("/admin/manifest.webmanifest"),
  appleWebApp: { capable: true, title: "NAZ-AŞ Panel", statusBarStyle: "default" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-admin className="flex min-h-dvh flex-1 flex-col bg-neutral-50 text-neutral-900">
      {children}
    </div>
  );
}
