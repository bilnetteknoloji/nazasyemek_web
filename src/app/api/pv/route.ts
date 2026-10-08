import { createHmac } from "node:crypto";
import { z } from "zod";
import { supabaseEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";

/**
 * Sayfa görüntüleme kaydı (`navigator.sendBeacon`). Yanıt her zaman 204.
 * IP ve tarayıcı saklanmaz; ziyaretçi kimliği günlük dönen, geri çevrilemez
 * bir karmadır.
 */

const allow = createRateLimiter({ limit: 120, windowMs: 60_000 });
const RETENTION_DAYS = 400;
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp/i;

const schema = z.object({
  path: z.string().min(1).max(300),
  referrer: z.string().max(2000).optional().default(""),
  source: z.string().max(60).optional().default(""),
  width: z.number().int().min(0).max(10000),
  // iPadOS kendini Mac olarak tanıtır; dokunmatik ekran ayırt eder.
  touch: z.boolean().optional().default(false),
  // Ziyaretin ilk sayfası (siteye dışarıdan gelinen sayfa).
  entry: z.boolean().optional().default(false),
  lang: z.string().max(35).optional().default(""),
});

/** Tarayıcı kimliğinden kaba işletim sistemi sınıfı; kimliğin kendisi saklanmaz. */
function detectOs(ua: string, touch: boolean) {
  if (/iPhone|iPod/.test(ua)) return "iOS";
  if (/iPad/.test(ua) || (/Macintosh/.test(ua) && touch)) return "iPadOS";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Windows";
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Macintosh|Mac OS X/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return null;
}

/** Sıra önemli: uygulama içi tarayıcılar ve Chromium türevleri Chrome'dan önce. */
function detectBrowser(ua: string) {
  if (/Instagram/.test(ua)) return "Instagram";
  if (/FBAN|FBAV|FB_IAB/.test(ua)) return "Facebook";
  if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return "TikTok";
  if (/YaBrowser/.test(ua)) return "Yandex Browser";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/Edg(e|A|iOS)?\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Firefox|FxiOS/.test(ua)) return "Firefox";
  if (/Chrome|CriOS/.test(ua)) return "Chrome";
  if (/Safari/.test(ua)) return "Safari";
  return null;
}

/** Cloudflare konum başlıkları (ülke her zaman, şehir yalnızca açıksa). */
function location(headers: Headers) {
  const country = (headers.get("cf-ipcountry") ?? headers.get("x-vercel-ip-country") ?? "").toUpperCase();
  const decode = (raw: string) => {
    try {
      return decodeURIComponent(raw).trim().slice(0, 80) || null;
    } catch {
      return raw.trim().slice(0, 80) || null;
    }
  };
  return {
    country: /^[A-Z]{2}$/.test(country) && country !== "XX" && country !== "T1" ? country : null,
    city: decode(headers.get("cf-ipcity") ?? headers.get("x-vercel-ip-city") ?? ""),
    region: decode(headers.get("cf-region") ?? headers.get("x-vercel-ip-country-region") ?? ""),
  };
}

const noContent = () => new Response(null, { status: 204 });

const istanbulDay = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());

function referrerHost(referrer: string, ownHost: string) {
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host && host !== ownHost.replace(/^www\./, "") ? host.slice(0, 255) : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const env = supabaseEnv();
  const userAgent = request.headers.get("user-agent") ?? "";
  const ip = clientIp(request);
  // Proxy arkasında request.url iç adres olabilir; sitenin adı başlıktan okunur.
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").split(":")[0];
  // Geliştirme sunucusu (npm run dev) canlı veritabanını kirletmesin.
  const dev = process.env.NODE_ENV !== "production";
  if (!env || dev || BOT.test(userAgent) || !allow(ip)) return noContent();

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noContent();

  // Panel, API ve dosya istekleri sayılmaz; yol sorgu dizesiz ve sonda / olmadan.
  const path = parsed.data.path.split(/[?#]/)[0].replace(/(.)\/+$/, "$1") || "/";
  if (path.startsWith("/admin") || path.startsWith("/api") || /\.\w+$/.test(path)) {
    return noContent();
  }

  const visitor = createHmac("sha256", env.secretKey)
    .update(`${istanbulDay()}|${ip}|${userAgent}`)
    .digest("base64url")
    .slice(0, 22);
  const { width, touch, entry } = parsed.data;
  // "tr-TR" → "tr-TR"; geçersizse boş.
  const lang = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$/.test(parsed.data.lang) ? parsed.data.lang : null;
  const os = detectOs(userAgent, touch);
  // iPad masaüstü modunda geniş görünür; dokunmatik Mac'i tablet say.
  const device = os === "iPadOS" ? "tablet" : width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";

  const supabase = createAdminClient();
  const { error } = await supabase.from("page_views").insert({
    path,
    referrer: referrerHost(parsed.data.referrer, host),
    source: parsed.data.source.toLowerCase() || null,
    device,
    os,
    browser: detectBrowser(userAgent),
    ...location(request.headers),
    entry,
    lang,
    screen: width || null,
    visitor,
  });
  if (error) console.error("[analiz] kayıt başarısız", error.message);

  if (Math.random() < 0.001) {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000);
    await supabase.from("page_views").delete().lt("at", cutoff.toISOString());
  }

  return noContent();
}
