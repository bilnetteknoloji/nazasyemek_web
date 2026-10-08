"use client";

import { useActionState } from "react";
import type { Meal } from "@/data/menu";
import { Field, inputClass } from "@/features/admin/ui/field";
import { FormMessage, type ActionState } from "@/features/admin/ui/form-message";
import { SubmitButton } from "@/features/admin/ui/submit-button";
import { menuDays } from "./schema";

const columns = [
  { key: "soup", label: "Çorba" },
  { key: "main", label: "Ana yemek" },
  { key: "side", label: "Yan yemek" },
  { key: "extra", label: "Tamamlayıcı" },
] as const;

/**
 * Hafta düzenleyici: her gün bir kart (telefonda alt alta, genişte ızgara).
 * Ana yemeği boş bırakılan gün sitede gösterilmez.
 */
export function WeekForm({
  action,
  label,
  days,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  label: string;
  days: Meal[];
}) {
  const [state, formAction] = useActionState(action, null);
  const byDay = new Map(days.map((meal) => [meal.day, meal]));

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field id="week-label" label="Hafta adı" className="max-w-xs">
        <input id="week-label" name="label" defaultValue={label} required maxLength={60} className={inputClass} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {menuDays.map((day, index) => {
          const meal = byDay.get(day);
          return (
            <fieldset key={day} className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
              <legend className="sr-only">{day}</legend>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-neutral-900">{day}</span>
                {day === "Cumartesi" ? <span className="text-[12px] text-neutral-400">İsteğe bağlı</span> : null}
              </div>
              {columns.map((column) => (
                <Field key={column.key} id={`d${index}-${column.key}`} label={column.label}>
                  <input
                    id={`d${index}-${column.key}`}
                    name={`days.${index}.${column.key}`}
                    defaultValue={meal?.[column.key] ?? ""}
                    maxLength={120}
                    className={inputClass}
                  />
                </Field>
              ))}
              <Field id={`d${index}-cal`} label="Kalori (kcal)">
                <input
                  id={`d${index}-cal`}
                  name={`days.${index}.calories`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={5000}
                  defaultValue={meal?.calories || ""}
                  className={inputClass}
                />
              </Field>
            </fieldset>
          );
        })}
      </div>

      <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-10 flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white/90 p-3 backdrop-blur-xl lg:bottom-4">
        <FormMessage state={state} />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-neutral-500">Kaydedince /menu sayfası hemen güncellenir.</p>
          <SubmitButton>Haftayı kaydet</SubmitButton>
        </div>
      </div>
    </form>
  );
}
