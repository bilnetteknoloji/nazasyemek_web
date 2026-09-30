"use client";

import { useCallback, useState } from "react";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Reveal } from "@/components/ui/Reveal";
import type { UsageNoteContent } from "@/data/notes";

/**
 * Not kağıdı görünümlü talimat kartı: kısa özet görünür,
 * "Tamamını okuyun" tüm metni ekranın ortasında bir pop-up'ta açar.
 */
export function UsageNote({ note }: { note: UsageNoteContent }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <Reveal className="relative mx-auto max-w-3xl">
        {/* Kartın arkasındaki ikinci kağıt: not destesi hissi */}
        <div
          aria-hidden
          className="border-line/70 absolute inset-0 translate-x-2 translate-y-2 rotate-1 rounded-3xl border bg-[#fbf6ea]"
        />
        <div className="border-line/70 shadow-lift relative overflow-hidden rounded-3xl border bg-[#fffdf7] p-7 sm:p-9">
          <span
            aria-hidden
            className="bg-accent-500 absolute inset-y-0 left-0 w-1.5"
          />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="bg-brand-800/10 text-brand-800 flex size-14 shrink-0 items-center justify-center rounded-2xl">
              <ClipboardList className="size-6" aria-hidden />
            </span>
            <div className="flex-1">
              <p className="text-brand-800 text-xs font-semibold tracking-wider uppercase">
                Not · {note.eyebrow}
              </p>
              <h2 className="font-display text-brand-900 mt-2 text-2xl leading-tight sm:text-[28px]">
                {note.title}
              </h2>
              <p className="text-subtle mt-3 leading-relaxed">{note.summary}</p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                className="bg-brand-800 shadow-glow hover:bg-brand-900 group mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Tamamını okuyun
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      <Modal
        open={open}
        onClose={close}
        title={note.title}
        eyebrow={note.eyebrow}
      >
        <p className="text-subtle leading-relaxed">{note.summary}</p>
        <ol className="mt-6 space-y-5">
          {note.sections.map((section, index) => (
            <li key={section.heading} className="flex gap-4">
              <span className="bg-brand-800/10 text-brand-800 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                {index + 1}
              </span>
              <div>
                <h3 className="text-ink font-semibold">{section.heading}</h3>
                <p className="text-subtle mt-1 text-sm leading-relaxed">
                  {section.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="border-line text-muted mt-7 border-t pt-5 text-sm leading-relaxed">
          {note.footer}
        </p>
      </Modal>
    </>
  );
}
