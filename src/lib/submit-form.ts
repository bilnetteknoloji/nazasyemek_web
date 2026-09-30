import { site } from "@/data/site";

/**
 * Formları FormSubmit üzerinden site.email adresine mail olarak gönderir.
 * Site statik yayınlandığı için (Node yok) tarayıcı doğrudan servise POST eder.
 *
 * ⚠️ FormSubmit, bir adrese gelen ilk gönderimde o adrese bir onay maili yollar;
 * bağlantıya bir kez tıklanana kadar gönderimler iletilmez ve yanıt
 * `success: "false"` döner.
 *
 * `fields` anahtarları maildeki tablo başlıkları olur — Türkçe etiket kullanın.
 */
export async function submitForm({
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
