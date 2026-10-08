/** 0532… / 532… / 90532… / +… → +90532… (veritabanındaki normalize_phone ile aynı). */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (raw.trim().startsWith("+")) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+9${digits}`;
  if (digits.length === 10) return `+90${digits}`;
  if (digits.length === 12 && digits.startsWith("90")) return `+${digits}`;
  return `+${digits}`;
}
