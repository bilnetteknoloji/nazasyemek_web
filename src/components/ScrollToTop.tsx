"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Her sayfa değişiminde görünümü anında en üste alır.
 * Tarayıcının kendi kaydırma geri yüklemesi ve App Router'ın kaydırma
 * yönetimi birleşince sayfalar bazen aşağıdan açılıyordu.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Sayfa içi çapa bağlantısıyla gelindiyse (ör. /uretim#surec) karışma.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
