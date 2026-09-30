import { z } from "zod";
import { services } from "@/data/services";

const serviceSlugs = services.map((service) => service.slug) as [string, ...string[]];

/** Teklif formu doğrulama şeması (istemci ve sunucuda ortak kullanılır). */
export const quoteSchema = z.object({
  company: z.string("Firma adını yazın.").trim().min(2, "Firma adını yazın."),
  contact: z.string("Yetkili adını yazın.").trim().min(2, "Yetkili adını yazın."),
  phone: z
    .string("Geçerli bir telefon numarası yazın.")
    .trim()
    .regex(/^[0-9 ()+-]{10,20}$/, "Geçerli bir telefon numarası yazın."),
  email: z.email("Geçerli bir e-posta adresi yazın."),
  service: z.enum(serviceSlugs, "Hizmet türü seçin."),
  meals: z.coerce
    .number("Günlük öğün sayısını yazın.")
    .int("Tam sayı yazın.")
    .min(1, "En az 1 öğün girin.")
    .max(100000, "Bu sayı çok yüksek görünüyor."),
  startDate: z.string("Başlangıç tarihi seçin.").trim().min(1, "Başlangıç tarihi seçin."),
  message: z.string("Mesaj geçersiz.").trim().max(2000, "Mesaj çok uzun.").optional(),
  consent: z.literal(true, "Devam etmek için onay verin."),
});

export type QuoteInput = z.input<typeof quoteSchema>;
export type QuoteData = z.output<typeof quoteSchema>;
