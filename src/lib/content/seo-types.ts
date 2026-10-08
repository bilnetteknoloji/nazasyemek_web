/**
 * settings → `seo`: arama motoru doğrulama kodları ve IndexNow anahtarı.
 * Kodlar yalnızca `content` değeridir (meta etiketinin tamamı değil).
 */
export type SeoSettings = {
  google: string;
  yandex: string;
  bing: string;
  /** IndexNow (Bing, Yandex, Seznam, Naver) anahtarı; ilk kayıtta üretilir. */
  indexNowKey: string;
};

export const emptySeo: SeoSettings = { google: "", yandex: "", bing: "", indexNowKey: "" };

/**
 * Yapıştırılan değerden doğrulama kodunu çıkarır: meta etiketinin tamamı
 * (`<meta name="…" content="KOD" />`) ya da yalnızca kod kabul edilir.
 */
export function verificationCode(raw: string) {
  const value = raw.trim();
  const match = value.match(/content\s*=\s*["']([^"']+)["']/i);
  const code = (match ? match[1] : value).trim();
  return /^[A-Za-z0-9_\-=+/.]{4,120}$/.test(code) ? code : "";
}
