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
});

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
  if (!env || BOT.test(userAgent) || !allow(ip)) return noContent();

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
  const width = parsed.data.width;

  const supabase = createAdminClient();
  const { error } = await supabase.from("page_views").insert({
    path,
    referrer: referrerHost(parsed.data.referrer, new URL(request.url).hostname),
    source: parsed.data.source.toLowerCase() || null,
    device: width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop",
    visitor,
  });
  if (error) console.error("[analiz] kayıt başarısız", error.message);

  if (Math.random() < 0.001) {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000);
    await supabase.from("page_views").delete().lt("at", cutoff.toISOString());
  }

  return noContent();
}
