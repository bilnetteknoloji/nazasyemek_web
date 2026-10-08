import { supabaseEnv } from "@/lib/env";
import { leadSchema } from "@/lib/lead-schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, createRateLimiter } from "@/lib/server/rate-limit";

/**
 * Teklif ve ön hesaplama formlarını panele (CRM) kaydeder. E-posta ayrıca
 * tarayıcıdan FormSubmit'e gider; ikisinden biri başarılıysa form başarılı
 * sayılır (bkz. lib/submit-form.ts).
 */

const allow = createRateLimiter({ limit: 8, windowMs: 10 * 60_000 });

export async function POST(request: Request) {
  if (!supabaseEnv()) return Response.json({ ok: false }, { status: 503 });
  if (!allow(clientIp(request))) return Response.json({ ok: false }, { status: 429 });

  const parsed = leadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false }, { status: 400 });
  const { kind, fields, website, ...identity } = parsed.data;
  // Bal küpü doluysa sessizce başarılı dön.
  if (website) return Response.json({ ok: true });

  const { error } = await createAdminClient().rpc("submit_lead", {
    p_kind: kind,
    p_data: { ...identity, fields },
  });
  if (error) {
    console.error("[talep] kayıt başarısız", error.message);
    return Response.json({ ok: false }, { status: 500 });
  }
  return Response.json({ ok: true });
}
