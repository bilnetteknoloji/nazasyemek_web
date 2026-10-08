import "server-only";

import { requireAdmin } from "@/features/admin/auth/session";
import type { ContactStatus, SubmissionStatus } from "./labels";

export const PAGE_SIZE = 30;

export type ContactRow = {
  id: string;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  meals: string | null;
  service: string | null;
  status: ContactStatus;
  source: string | null;
  last_seen_at: string;
  created_at: string;
};

export type SubmissionRow = {
  id: string;
  kind: string;
  status: SubmissionStatus;
  created_at: string;
  data: { fields?: Record<string, string> } & Record<string, unknown>;
  contact: Pick<ContactRow, "id" | "name" | "company" | "email" | "phone"> | null;
};

const CONTACT_COLUMNS =
  "id, name, company, email, phone, address, meals, service, status, source, last_seen_at, created_at";

/** PostgREST `or` filtresinde özel karakterler kaçırılır. */
const escapeLike = (value: string) => value.replace(/[%_,()\\]/g, (char) => `\\${char}`);

export async function listContacts({
  q,
  status,
  page,
}: {
  q?: string;
  status?: ContactStatus;
  page: number;
}) {
  const { supabase } = await requireAdmin();
  let query = supabase
    .from("contacts")
    .select(CONTACT_COLUMNS, { count: "exact" })
    .is("deleted_at", null)
    .order("last_seen_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (status) query = query.eq("status", status);
  if (q) {
    const term = `%${escapeLike(q)}%`;
    query = query.or(
      `company.ilike.${term},name.ilike.${term},email.ilike.${term},phone.ilike.${term}`,
    );
  }
  const { data, count } = await query;
  return { contacts: (data ?? []) as ContactRow[], total: count ?? 0 };
}

export async function contactCounts() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("contacts").select("status").is("deleted_at", null);
  const counts: Record<string, number> = { all: data?.length ?? 0 };
  for (const row of data ?? []) counts[row.status] = (counts[row.status] ?? 0) + 1;
  return counts;
}

export async function getContact(id: string) {
  const { supabase } = await requireAdmin();
  const [contact, notes, submissions] = await Promise.all([
    supabase.from("contacts").select(CONTACT_COLUMNS).eq("id", id).is("deleted_at", null).maybeSingle(),
    supabase
      .from("notes")
      .select("id, body, created_at")
      .eq("contact_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("submissions")
      .select("id, kind, status, created_at, data")
      .eq("contact_id", id)
      .order("created_at", { ascending: false }),
  ]);
  if (!contact.data) return null;
  return {
    contact: contact.data as ContactRow,
    notes: (notes.data ?? []) as { id: string; body: string; created_at: string }[],
    submissions: (submissions.data ?? []) as Omit<SubmissionRow, "contact">[],
  };
}

export async function listSubmissions({ status, page }: { status?: SubmissionStatus; page: number }) {
  const { supabase } = await requireAdmin();
  let query = supabase
    .from("submissions")
    .select("id, kind, status, created_at, data, contact:contacts(id, name, company, email, phone)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (status) query = query.eq("status", status);
  const { data, count } = await query;
  return { submissions: (data ?? []) as unknown as SubmissionRow[], total: count ?? 0 };
}

export async function submissionCounts() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("submissions").select("status");
  const counts: Record<string, number> = { all: data?.length ?? 0 };
  for (const row of data ?? []) counts[row.status] = (counts[row.status] ?? 0) + 1;
  return counts;
}
