"use client";

import { MotionConfig } from "motion/react";

/** Paneldeki tüm Motion animasyonları sistemdeki "hareketi azalt"a uyar. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
