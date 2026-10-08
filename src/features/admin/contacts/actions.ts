"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/admin/auth/session";
import type { ActionState } from "@/features/admin/ui/form-message";
import { submissionStatuses, type SubmissionStatus } from "./labels";
import { normalizePhone } from "./phone";
import { contactSchema, noteSchema } from "./schema";

function toRow(data: ReturnType<typeof contactSchema.parse>) {
  return {
    company: data.company || null,
    name: data.name || null,
    email: data.email ? data.email.toLowerCase() : null,
    phone: data.phone ? normalizePhone(data.phone) : null,
    address: data.address || null,
    meals: data.meals || null,
    service: data.service || null,
    status: data.status,
  };
}

const duplicateMessage = "Bu e-posta ya da telefon başka bir müşteri kartında kayıtlı.";

export async function createContact(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Form geçersiz." };

  const { data, error } = await supabase
    .from("contacts")
    .insert({ ...toRow(parsed.data), source: "panel" })
    .select("id")
    .single();
  if (error) return { ok: false, message: error.code === "23505" ? duplicateMessage : "Kaydedilemedi." };

  revalidatePath("/admin/musteriler");
  redirect(`/admin/musteriler/${data.id}`);
}

export async function updateContact(
  id: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Form geçersiz." };

  const { error } = await supabase.from("contacts").update(toRow(parsed.data)).eq("id", id);
  if (error) return { ok: false, message: error.code === "23505" ? duplicateMessage : "Kaydedilemedi." };

  revalidatePath("/admin", "layout");
  return { ok: true, message: "Müşteri kartı kaydedildi." };
}

/** Yumuşak silme: kayıt listelerden kalkar, talepleri korunur. */
export async function deleteContact(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("contacts").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin", "layout");
  redirect("/admin/musteriler");
}

export async function addNote(contactId: string, _previous: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = noteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Not geçersiz." };
  const { error } = await supabase.from("notes").insert({ contact_id: contactId, body: parsed.data.body });
  if (error) return { ok: false, message: "Not eklenemedi." };
  revalidatePath(`/admin/musteriler/${contactId}`);
  return { ok: true, message: "Not eklendi." };
}

export async function deleteNote(contactId: string, noteId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("notes").delete().eq("id", noteId);
  revalidatePath(`/admin/musteriler/${contactId}`);
}

export async function setSubmissionStatus(id: string, status: SubmissionStatus) {
  if (!submissionStatuses.includes(status)) return;
  const { supabase } = await requireAdmin();
  await supabase.from("submissions").update({ status }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteSubmission(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("submissions").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}
