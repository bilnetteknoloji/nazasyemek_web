import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Koşullu sınıfları birleştirir ve çakışan Tailwind sınıflarını sadeleştirir. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
