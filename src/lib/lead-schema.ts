import { z } from "zod";

/**
 * Formlardan panele giden talep kaydı (`/api/talep` → `submit_lead`).
 * `fields` e-postadaki tabloyla aynıdır (Türkçe etiketler); eşleştirme için
 * kimlik alanları ayrıca gönderilir.
 */
export const leadSchema = z
  .object({
    kind: z.enum(["teklif", "on-hesaplama"]),
    name: z.string().trim().max(200).optional().default(""),
    company: z.string().trim().max(200).optional().default(""),
    email: z.string().trim().max(200).optional().default(""),
    phone: z.string().trim().max(40).optional().default(""),
    address: z.string().trim().max(400).optional().default(""),
    meals: z.string().trim().max(60).optional().default(""),
    service: z.string().trim().max(120).optional().default(""),
    fields: z.record(z.string().max(80), z.string().max(4000)),
    // Bal küpü: insanlar görmez, botlar doldurur.
    website: z.string().max(0).optional(),
  })
  .refine((lead) => lead.email || lead.phone, "E-posta ya da telefon gerekli.");

export type Lead = z.input<typeof leadSchema>;
