import { getSeo } from "@/lib/content/site";

// Ayarlar etiketiyle önbellekte; panelde anahtar üretilince tazelenir.
export const dynamic = "force-static";

/**
 * IndexNow anahtar dosyası (Bing, Yandex). Bildirimlerde `keyLocation` olarak
 * bu adres verilir; içerik yalnızca anahtardır. Anahtar panelde üretilir.
 */
export async function GET() {
  const { indexNowKey } = await getSeo();
  if (!indexNowKey) return new Response("Not found", { status: 404 });
  return new Response(indexNowKey, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
