"use client";

import { useActionState } from "react";
import { adminButton } from "@/features/admin/ui/button";
import { Field, inputClass } from "@/features/admin/ui/field";
import { signIn, type SignInState } from "./actions";

export function SignInForm({ initialError }: { initialError: string | null }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, {
    error: initialError,
  });

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field id="email" label="E-posta">
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </Field>
      <Field id="password" label="Şifre">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={adminButton({ className: "mt-2 w-full" })}>
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
