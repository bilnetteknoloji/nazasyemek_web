"use client";

import { useActionState } from "react";
import { changePassword } from "@/features/admin/auth/actions";
import { Field, inputClass } from "@/features/admin/ui/field";
import { FormMessage, type ActionState } from "@/features/admin/ui/form-message";
import { SubmitButton } from "@/features/admin/ui/submit-button";
import type { SeoSettings } from "@/lib/content/seo-types";
import type { StatsSettings } from "@/lib/content/stats-types";
import type { ContactSettings } from "@/lib/site-contact";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

function Footer({ state, label = "Kaydet" }: { state: ActionState; label?: string }) {
  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4">
      <FormMessage state={state} />
      <div className="flex justify-end">
        <SubmitButton>{label}</SubmitButton>
      </div>
    </div>
  );
}

const contactFields: { name: keyof ContactSettings; label: string; type?: string; hint?: string }[] = [
  { name: "phone", label: "Sabit hat", type: "tel" },
  { name: "mobile", label: "Mobil hat", type: "tel" },
  { name: "whatsapp", label: "WhatsApp", type: "tel", hint: "Sağ alttaki WhatsApp düğmesi bu numaraya açılır." },
  { name: "email", label: "E-posta", type: "email" },
  { name: "workingHours", label: "Çalışma saatleri" },
  { name: "instagram", label: "Instagram adresi", type: "url" },
  { name: "tiktok", label: "TikTok adresi", type: "url" },
  { name: "facebook", label: "Facebook adresi", type: "url", hint: "Boş bırakılırsa sitede Facebook araması gösterilir." },
];

export function ContactSettingsForm({ action, values }: { action: Action; values: ContactSettings }) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {contactFields.map((field) => (
          <Field key={field.name} id={`s-${field.name}`} label={field.label} hint={field.hint}>
            <input
              id={`s-${field.name}`}
              name={field.name}
              type={field.type ?? "text"}
              defaultValue={values[field.name]}
              className={inputClass}
            />
          </Field>
        ))}
      </div>
      <Footer state={state} />
    </form>
  );
}

export function StatsSettingsForm({ action, values }: { action: Action; values: StatsSettings }) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form action={formAction} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-[13px] font-medium text-neutral-500">Hero altındaki şerit</legend>
        {values.quick.map((item, index) => (
          <div key={index} className="grid grid-cols-[110px_1fr] gap-2">
            <input aria-label={`${index + 1}. değer`} name={`quick.${index}.value`} defaultValue={item.value} className={inputClass} />
            <input aria-label={`${index + 1}. açıklama`} name={`quick.${index}.label`} defaultValue={item.label} className={inputClass} />
          </div>
        ))}
      </fieldset>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-[13px] font-medium text-neutral-500">Kapasite paneli</legend>
        {values.capacity.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_100px_56px] gap-2 rounded-lg border border-neutral-200 p-3 sm:grid-cols-[160px_110px_56px_1fr]">
            <input aria-label={`${index + 1}. başlık`} name={`capacity.${index}.label`} defaultValue={item.label} className={inputClass} />
            <input aria-label={`${index + 1}. değer`} name={`capacity.${index}.value`} defaultValue={item.value} className={inputClass} />
            <input aria-label={`${index + 1}. ek (+)`} name={`capacity.${index}.plus`} defaultValue={item.plus} className={inputClass} />
            <input
              aria-label={`${index + 1}. açıklama`}
              name={`capacity.${index}.note`}
              defaultValue={item.note}
              className={`${inputClass} col-span-3 sm:col-span-1`}
            />
          </div>
        ))}
      </fieldset>
      <Footer state={state} />
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePassword, null);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="pw-new" label="Yeni şifre" hint="En az 10 karakter.">
          <input id="pw-new" name="password" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
        </Field>
        <Field id="pw-confirm" label="Yeni şifre (tekrar)">
          <input id="pw-confirm" name="confirm" type="password" autoComplete="new-password" required className={inputClass} />
        </Field>
      </div>
      <Footer state={state} label="Şifreyi değiştir" />
    </form>
  );
}

const seoFields: { name: "google" | "yandex" | "bing"; label: string; console: string; consoleLabel: string; meta: string }[] = [
  {
    name: "google",
    label: "Google",
    console: "https://search.google.com/search-console",
    consoleLabel: "Google Search Console",
    meta: "google-site-verification",
  },
  {
    name: "yandex",
    label: "Yandex",
    console: "https://webmaster.yandex.com.tr/",
    consoleLabel: "Yandex Webmaster",
    meta: "yandex-verification",
  },
  {
    name: "bing",
    label: "Bing",
    console: "https://www.bing.com/webmasters",
    consoleLabel: "Bing Webmaster Tools",
    meta: "msvalidate.01",
  },
];

/**
 * Arama motoru doğrulama kodları. Her motorun panelinde "HTML etiketi /
 * meta etiketi" yöntemi seçilir, verilen etiket buraya yapıştırılır.
 */
export function SeoSettingsForm({
  action,
  notify,
  values,
  siteUrl,
}: {
  action: Action;
  notify: () => Promise<ActionState>;
  values: SeoSettings;
  siteUrl: string;
}) {
  const [state, formAction] = useActionState(action, null);
  const [notifyState, notifyAction] = useActionState(notify, null);
  return (
    <div className="flex flex-col gap-5">
      <ol className="flex list-decimal flex-col gap-1 rounded-lg bg-neutral-50 py-3 pr-3 pl-8 text-[13px] text-neutral-600">
        <li>Aşağıdaki bağlantıdan arama motorunun paneline girin ve sitenizi ekleyin ({siteUrl}).</li>
        <li>Doğrulama yöntemi olarak <strong>HTML etiketi (meta etiketi)</strong> seçin.</li>
        <li>Verilen etiketin tamamını ilgili kutuya yapıştırıp kaydedin, sonra o panelde &quot;Doğrula&quot;ya basın.</li>
        <li>
          Doğrulandıktan sonra panelde <strong>Site haritası</strong> bölümüne şu adresi ekleyin:{" "}
          <code className="rounded bg-white px-1 py-0.5 text-[12px] text-neutral-900">{siteUrl}/sitemap.xml</code>
        </li>
      </ol>
      <form action={formAction} className="flex flex-col gap-4">
        {seoFields.map((field) => (
          <Field
            key={field.name}
            id={`seo-${field.name}`}
            label={field.label}
            hint={values[field.name] ? "Kayıtlı ✓" : `Örnek: <meta name="${field.meta}" content="…" />`}
          >
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
              <input
                id={`seo-${field.name}`}
                name={field.name}
                defaultValue={values[field.name]}
                placeholder="Kodu ya da meta etiketini yapıştırın"
                className={inputClass}
              />
              <a
                href={field.console}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[13px] font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
              >
                {field.consoleLabel} ↗
              </a>
            </div>
          </Field>
        ))}
        <Footer state={state} />
      </form>
      <form action={notifyAction} className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-medium text-neutral-900">Bing ve Yandex&apos;e anında bildir (IndexNow)</span>
          <span className="text-[12.5px] text-neutral-500">
            Tüm sayfaları arama motorlarına bildirir; yeni yazılar ve ana sayfa değişiklikleri zaten otomatik bildirilir.
            Google bu yöntemi kullanmaz, site haritasını kendisi okur.
          </span>
        </div>
        <FormMessage state={notifyState} />
        <div className="flex justify-end">
          <SubmitButton variant="secondary" pendingLabel="Bildiriliyor…">
            Tüm sayfaları bildir
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
