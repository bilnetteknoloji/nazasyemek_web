import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import type { Lead } from "@/lib/lead-schema";

/**
 * Formları FormSubmit üzerinden site.email adresine mail olarak gönderir.
 * Site statik yayınlandığı için (Node yok) tarayıcı doğrudan servise POST eder.
 *
 * ⚠️ FormSubmit, bir adrese gelen ilk gönderimde o adrese bir onay maili yollar;
 * bağlantıya bir kez tıklanana kadar gönderimler iletilmez ve yanıt
 * `success: "false"` döner.
 *
 * `fields` anahtarları maildeki tablo başlıkları olur — Türkçe etiket kullanın.
 *
 * `lead` verilirse talep aynı anda yönetim paneline de kaydedilir
 * (`/api/talep`). İkisinden biri başarılıysa form başarılı sayılır: e-posta
 * henüz onaylanmamış olsa da talep panelde görünür.
 */
export async function submitForm({
  subject,
  fields,
  replyTo,
  lead,
}: {
  subject: string;
  fields: Record<string, string | number>;
  replyTo?: string;
  lead?: Omit<Lead, "fields">;
}): Promise<boolean> {
  const [mailed, saved] = await Promise.all([
    sendMail({ subject, fields, replyTo }),
    lead ? saveLead({ ...lead, fields: stringify(fields) }) : Promise.resolve(false),
  ]);
  return mailed || saved;
}

const stringify = (fields: Record<string, string | number>) =>
  Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, String(value)]));

async function saveLead(lead: Lead): Promise<boolean> {
  try {
    const response = await fetch(asset("/api/talep"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function sendMail({
  subject,
  fields,
  replyTo,
}: {
  subject: string;
  fields: Record<string, string | number>;
  replyTo?: string;
}): Promise<boolean> {
  try {
    const response = await fetch(site.formEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        _captcha: "false",
        ...(replyTo ? { _replyto: replyTo } : {}),
        ...fields,
      }),
    });
    if (!response.ok) return false;
    const data: { success?: string | boolean } | null = await response
      .json()
      .catch(() => null);
    return data?.success === true || data?.success === "true";
  } catch {
    return false;
  }
}
