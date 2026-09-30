"use client";

import { ScrollToTop } from "@/components/ScrollToTop";

/**
 * Route geçişlerinde ortak yumuşak giriş + sayfa başına dönüş.
 * Giriş CSS animasyonudur; prefers-reduced-motion altında globals.css
 * süreyi sıfırladığı için hareket kapanır ve SSR/istemci çıktısı aynı kalır.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <div className="page-enter">{children}</div>
    </>
  );
}
