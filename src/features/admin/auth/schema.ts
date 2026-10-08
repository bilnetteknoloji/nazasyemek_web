import { z } from "zod";

/** Giriş formu — istemci ve `signIn` action'ı aynı şemayı çalıştırır. */
export const signInSchema = z.object({
  email: z.string().trim().min(1, "Bu alan zorunlu.").pipe(z.email("Geçerli bir e-posta yazın.")),
  password: z.string().min(1, "Bu alan zorunlu.").max(200),
});

export const passwordSchema = z
  .object({
    password: z.string().min(10, "Şifre en az 10 karakter olmalı.").max(200),
    confirm: z.string(),
  })
  .refine((value) => value.password === value.confirm, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirm"],
  });
