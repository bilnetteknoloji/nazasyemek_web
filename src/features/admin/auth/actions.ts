"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ActionState } from "@/features/admin/ui/form-message";
import { createRateLimiter } from "@/lib/server/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./session";
import { passwordSchema, signInSchema } from "./schema";

export type SignInState = { error: string | null };

/** Kaba kuvvete karşı: IP başına 10 dakikada 10 deneme. */
const allow = createRateLimiter({ limit: 10, windowMs: 10 * 60 * 1000 });

export async function signIn(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allow(ip)) return { error: "Çok fazla deneme. Birkaç dakika sonra tekrar deneyin." };

  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "E-posta veya şifre hatalı." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    // Hangi alanın yanlış olduğunu söylemeyiz (hesap keşfini zorlaştırır).
    return {
      error:
        error.status === 400
          ? "E-posta veya şifre hatalı."
          : "Giriş şu an yapılamıyor. Biraz sonra tekrar deneyin.",
    };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/giris");
}

export async function changePassword(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz şifre." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, message: "Şifre değiştirilemedi. Daha güçlü bir şifre deneyin." };
  return { ok: true, message: "Şifreniz değiştirildi." };
}
