import { z } from "zod";
import { contactStatuses } from "./labels";

const optional = (max: number) => z.string().trim().max(max).optional().default("");

/** Müşteri kartı formu (panelde elle ekleme / düzenleme). */
export const contactSchema = z
  .object({
    company: optional(200),
    name: optional(200),
    email: z
      .string()
      .trim()
      .max(200)
      .optional()
      .default("")
      .refine((value) => !value || z.email().safeParse(value).success, "Geçerli bir e-posta yazın."),
    phone: optional(40),
    address: optional(400),
    meals: optional(60),
    service: optional(120),
    status: z.enum(contactStatuses).default("yeni"),
  })
  .refine((value) => value.company || value.name, {
    message: "Firma ya da yetkili adı gerekli.",
    path: ["company"],
  });

export const noteSchema = z.object({
  body: z.string().trim().min(1, "Not boş olamaz.").max(5000, "Not çok uzun."),
});
