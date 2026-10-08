import { flatNav, legalNav } from "@/data/site";

/** Analiz ekranındaki ortak etiketler (sayfa adı, cihaz, ülke). */
export const deviceLabel: Record<string, string> = { mobile: "Telefon", tablet: "Tablet", desktop: "Bilgisayar" };

/** Yol yerine sayfa adı: "/hakkimizda" → "Hakkımızda". */
const pageNames = new Map<string, string>([
  ["/", "Ana Sayfa"],
  ["/teklif-al", "Teklif Al"],
  ["/blog", "Blog"],
  ...[...flatNav, ...legalNav].map((item) => [item.href, item.label] as [string, string]),
]);
export const pageLabel = (path: string) => {
  const name = pageNames.get(path);
  if (name) return name;
  if (path.startsWith("/hizmetlerimiz/")) return `Hizmet: ${path.split("/")[2]}`;
  if (path.startsWith("/blog/")) return `Blog: ${path.split("/")[2]}`;
  return path;
};

const regionNames = new Intl.DisplayNames(["tr"], { type: "region" });
export const flag = (code: string) =>
  /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((char) => 0x1f1a5 + char.charCodeAt(0))) : "🌐";
export const regionName = (code: string) => {
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
};
export const countryLabel = (code: string) =>
  /^[A-Z]{2}$/.test(code) ? `${flag(code)} ${regionName(code)}` : "🌐 Bilinmiyor";

