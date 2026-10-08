import { z } from "zod";

/** Panelde düzenlenebilen günler; ana yemeği boş bırakılan gün yayınlanmaz. */
export const menuDays = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"] as const;

const text = z.string().trim().max(120, "En fazla 120 karakter.");

export const mealSchema = z.object({
  day: z.enum(menuDays),
  soup: text,
  main: text,
  side: text,
  extra: text,
  calories: z.coerce.number().int().min(0).max(5000).catch(0),
});

export const weekSchema = z.object({
  label: z.string().trim().min(1, "Hafta adı gerekli.").max(60),
  days: z.array(mealSchema),
});

/** FormData (`days.0.soup` …) → hafta nesnesi. */
export function parseWeekForm(formData: FormData) {
  const days = menuDays.map((day, index) => ({
    day,
    soup: formData.get(`days.${index}.soup`) ?? "",
    main: formData.get(`days.${index}.main`) ?? "",
    side: formData.get(`days.${index}.side`) ?? "",
    extra: formData.get(`days.${index}.extra`) ?? "",
    calories: formData.get(`days.${index}.calories`) ?? 0,
  }));
  return weekSchema.safeParse({ label: formData.get("label") ?? "", days });
}
