import type { BadgeTone } from "@/features/admin/ui/badge";

export const contactStatuses = ["yeni", "teklif", "musteri", "pasif"] as const;
export type ContactStatus = (typeof contactStatuses)[number];

export const contactStatusLabel: Record<ContactStatus, string> = {
  yeni: "Yeni",
  teklif: "Teklif verildi",
  musteri: "Müşteri",
  pasif: "Pasif",
};

export const contactStatusTone: Record<ContactStatus, BadgeTone> = {
  yeni: "brand",
  teklif: "amber",
  musteri: "green",
  pasif: "muted",
};

export const submissionStatuses = ["yeni", "ilgilenildi", "kapandi"] as const;
export type SubmissionStatus = (typeof submissionStatuses)[number];

export const submissionStatusLabel: Record<SubmissionStatus, string> = {
  yeni: "Yeni",
  ilgilenildi: "İlgilenildi",
  kapandi: "Kapandı",
};

export const submissionStatusTone: Record<SubmissionStatus, BadgeTone> = {
  yeni: "brand",
  ilgilenildi: "blue",
  kapandi: "muted",
};

export const kindLabel: Record<string, string> = {
  teklif: "Teklif formu",
  "on-hesaplama": "Ön hesaplama",
};
