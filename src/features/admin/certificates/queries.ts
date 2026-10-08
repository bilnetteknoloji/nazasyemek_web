import "server-only";

import { requireAdmin } from "@/features/admin/auth/session";

export type CertificateRow = {
  id: string;
  title: string;
  subtitle: string;
  pdf_url: string;
  thumb_url: string | null;
  thumb_width: number | null;
  thumb_height: number | null;
  visible: boolean;
  sort: number;
};

const COLUMNS = "id, title, subtitle, pdf_url, thumb_url, thumb_width, thumb_height, visible, sort";

export async function listCertificates() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("certificates").select(COLUMNS).order("sort").order("created_at");
  return (data ?? []) as CertificateRow[];
}

export async function getCertificate(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("certificates").select(COLUMNS).eq("id", id).maybeSingle();
  return (data as CertificateRow | null) ?? null;
}
