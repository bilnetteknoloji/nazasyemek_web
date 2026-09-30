"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export type AccordionItem = { question: string; answer: string };

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();
  const uid = useId();

  return (
    <div className="divide-line border-line divide-y overflow-hidden rounded-3xl border bg-white/70">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${uid}-panel-${index}`;
        const buttonId = `${uid}-button-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="hover:text-brand-900 flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors sm:px-8"
              >
                <span className="text-brand-800 text-base font-semibold sm:text-lg">
                  {item.question}
                </span>
                <Plus
                  aria-hidden
                  className={cn(
                    "text-accent-600 size-5 shrink-0 transition-transform duration-300 ease-[var(--ease-out-expo)]",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="text-muted px-6 pb-6 text-sm leading-relaxed sm:px-8 sm:text-base">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
