"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

/**
 * Çerezsiz sayfa görüntüleme kaydı: her gezinmede yol, yönlendiren site ve
 * ekran genişliği `/api/pv`'ye gönderilir. Kişisel veri toplanmaz (bkz.
 * supabase/migrations → page_views). Statik yayında uç nokta yoksa istek
 * sessizce düşer.
 */
export function PageViewBeacon() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const body = JSON.stringify({
      path: pathname,
      // Yönlendiren yalnızca ilk sayfada anlamlıdır; site içi gezinmede boş.
      referrer: first.current ? document.referrer : "",
      source: params.get("utm_source") ?? "",
      width: window.innerWidth,
    });
    first.current = false;
    try {
      const url = asset("/api/pv");
      if (!navigator.sendBeacon?.(url, new Blob([body], { type: "application/json" }))) {
        void fetch(url, { method: "POST", body, keepalive: true }).catch(() => {});
      }
    } catch {
      // Ölçüm hiçbir zaman ziyaretçiyi etkilememeli.
    }
  }, [pathname]);

  return null;
}
