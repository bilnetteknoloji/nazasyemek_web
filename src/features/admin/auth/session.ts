import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Asıl yetki kontrolü. Proxy yalnızca iyimser yönlendirme yapar; her panel
 * sayfası ve server action bunu çağırır. `getClaims()` JWT imzasını doğrular.
 * Veritabanında ayrıca RLS (`private.is_admin()`) aynı kuralı uygular.
 */
export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (!userId) redirect("/admin/giris");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/giris?hata=yetki");
  }

  return { supabase, userId, email: (data?.claims.email as string | undefined) ?? null };
});
