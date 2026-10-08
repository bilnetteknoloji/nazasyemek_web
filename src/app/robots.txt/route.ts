import { site } from "@/data/site";

// Statik yayında derleme anında üretilir.
export const dynamic = "force-static";

/**
 * robots.txt — Next'in `robots.ts` biçimi Yandex'in `Clean-param` yönergesini
 * desteklemediği için düz metin. `Clean-param`, reklam/kampanya parametreli
 * adreslerin (?utm_source=… vb.) ayrı sayfa sayılmasını önler.
 */
export function GET() {
  const disallow = ["Disallow: /api/", "Disallow: /admin/"];
  const body = [
    "User-agent: *",
    "Allow: /",
    ...disallow,
    "",
    "User-agent: Yandex",
    "Allow: /",
    ...disallow,
    "Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&gclid&fbclid&yclid&msclkid&igshid",
    "",
    `Sitemap: ${site.url}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
