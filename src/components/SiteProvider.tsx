"use client";

import { createContext, useContext } from "react";
import { resolveSite, type Site } from "@/lib/site-contact";

const SiteContext = createContext<Site>(resolveSite(null));

/** Panelden gelen iletişim bilgilerini istemci bileşenlerine taşır. */
export function SiteProvider({ value, children }: { value: Site; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

/** İstemci bileşenleri için site bilgisi (sunucuda `getSite()`). */
export const useSite = () => useContext(SiteContext);
