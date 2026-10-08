import { CheckCircle2, CircleAlert } from "lucide-react";

export type ActionState = { ok: boolean; message: string } | null;

/** Server action sonucu: yeşil onay ya da kırmızı hata satırı. */
export function FormMessage({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={
        state.ok
          ? "flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-700"
          : "flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700"
      }
    >
      {state.ok ? <CheckCircle2 className="size-4 shrink-0" aria-hidden /> : <CircleAlert className="size-4 shrink-0" aria-hidden />}
      {state.message}
    </p>
  );
}
