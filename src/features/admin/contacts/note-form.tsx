"use client";

import { useActionState, useEffect, useRef } from "react";
import { inputClass } from "@/features/admin/ui/field";
import { FormMessage, type ActionState } from "@/features/admin/ui/form-message";
import { SubmitButton } from "@/features/admin/ui/submit-button";

/** Görüşme notu ekleme; başarılı olunca kutu temizlenir. */
export function NoteForm({ action }: { action: (state: ActionState, formData: FormData) => Promise<ActionState> }) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="flex flex-col gap-3">
      <label htmlFor="note-body" className="sr-only">
        Not
      </label>
      <textarea
        id="note-body"
        name="body"
        rows={3}
        required
        placeholder="Görüşme notu, fiyat, sonraki adım…"
        className={inputClass}
      />
      {state && !state.ok ? <FormMessage state={state} /> : null}
      <div className="flex justify-end">
        <SubmitButton size="sm" pendingLabel="Ekleniyor…">
          Not ekle
        </SubmitButton>
      </div>
    </form>
  );
}
