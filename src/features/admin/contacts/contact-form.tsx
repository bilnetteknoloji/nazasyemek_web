"use client";

import { useActionState } from "react";
import { Field, inputClass } from "@/features/admin/ui/field";
import { FormMessage, type ActionState } from "@/features/admin/ui/form-message";
import { SubmitButton } from "@/features/admin/ui/submit-button";
import { contactStatuses, contactStatusLabel } from "./labels";
import type { ContactRow } from "./queries";

/** Müşteri kartı: yeni kayıt ve düzenleme aynı formu kullanır. */
export function ContactForm({
  action,
  contact,
  submitLabel = "Kaydet",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  contact?: ContactRow;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, null);

  const text = (name: keyof ContactRow, label: string, props: React.ComponentProps<"input"> = {}) => (
    <Field id={`c-${name}`} label={label}>
      <input
        id={`c-${name}`}
        name={name}
        defaultValue={(contact?.[name] as string | null) ?? ""}
        className={inputClass}
        {...props}
      />
    </Field>
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {text("company", "Firma", { autoComplete: "organization" })}
        {text("name", "Yetkili", { autoComplete: "name" })}
        {text("phone", "Telefon", { type: "tel", autoComplete: "tel", placeholder: "05XX XXX XX XX" })}
        {text("email", "E-posta", { type: "email", autoComplete: "email" })}
        {text("meals", "Günlük öğün", { placeholder: "Örn. 250 ya da 100-300" })}
        {text("service", "Hizmet türü", { placeholder: "Örn. Tabldot" })}
        <div className="sm:col-span-2">{text("address", "Adres")}</div>
        <Field id="c-status" label="Durum">
          <select id="c-status" name="status" defaultValue={contact?.status ?? "yeni"} className={inputClass}>
            {contactStatuses.map((status) => (
              <option key={status} value={status}>
                {contactStatusLabel[status]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <FormMessage state={state} />
      <div className="flex justify-end">
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
