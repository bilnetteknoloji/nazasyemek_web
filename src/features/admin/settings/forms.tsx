"use client";

import { useActionState } from "react";
import { changePassword } from "@/features/admin/auth/actions";
import { Field, inputClass } from "@/features/admin/ui/field";
import { FormMessage, type ActionState } from "@/features/admin/ui/form-message";
import { SubmitButton } from "@/features/admin/ui/submit-button";
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
