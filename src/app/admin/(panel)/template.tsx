"use client";

import { motion } from "motion/react";

/** Sayfa geçişi: içerik hafifçe yükselerek belirir; kabuk sabit kalır. */
export default function PanelTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
