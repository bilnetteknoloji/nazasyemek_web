import "server-only";

import { site } from "@/data/site";

/**
 * IndexNow: değişen adresleri Bing, Yandex, Seznam ve Naver'a anında bildirir
 * (api.indexnow.org hepsine dağıtır). Google IndexNow kullanmaz; Google için
 * Search Console'a eklenen site haritası yeterlidir.
 *
 * Anahtar dosyası `/indexnow.txt` adresinde yayında olmalı; yerel geliştirme
 * sunucusundan bildirim gönderilmez.
 */
export async function submitToIndexNow(key: string, paths: string[]) {
  if (!key || !paths.length) return { ok: false, status: 0 };
  if (process.env.NODE_ENV !== "production") return { ok: false, status: 0 };
  const origin = new URL(site.url);
  const urlList = [...new Set(paths)].map((path) => new URL(path, origin).toString()).slice(0, 10_000);
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: origin.host,
        key,
        keyLocation: `${origin.origin}/indexnow.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(8000),
    });
    // 200 = alındı, 202 = anahtar doğrulaması bekleniyor.
    return { ok: response.status === 200 || response.status === 202, status: response.status };
  } catch {
    return { ok: false, status: 0 };
  }
}
