"use client";

import { MotionConfig } from "motion/react";

/**
 * motion'ın hareket tercihini kendisinin yönetmesini sağlar.
 * Böylece bileşenler render sırasında dallanmaz ve SSR çıktısı istemciyle eşleşir.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
