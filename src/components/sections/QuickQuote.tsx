"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { portionRanges, quickQuotePoints, serviceModes } from "@/data/home";
import { site } from "@/data/site";
import { submitForm } from "@/lib/submit-form";

const inputClass =
  "text-ink focus:ring-brand-800/20 w-full rounded-xl bg-white px-4 py-2.5 text-sm outline-none focus:ring-2";

const contactFields = [
  {
    name: "fullName",
    label: "Ad Soyad",
    type: "text",
    autoComplete: "name",
    placeholder: "Adınız ve soyadınız",
  },
  {
    name: "company",
    label: "Firma İsmi",
    type: "text",
    autoComplete: "organization",
    placeholder: "Örn: ABC Sanayi A.Ş.",
  },
  {
    name: "phone",
    label: "Telefon No",
    type: "tel",
    autoComplete: "tel",
    placeholder: "05XX XXX XX XX",
  },
  {
    name: "email",
    label: "Mail",
    type: "email",
    autoComplete: "email",
    placeholder: "ornek@firma.com",
  },
  {
    name: "address",
    label: "Adres",
    type: "text",
    autoComplete: "street-address",
    placeholder: "Firma adresi (ilçe / il)",
    wide: true,
  },
] as const;

type ContactValues = Record<(typeof contactFields)[number]["name"], string>;

const emptyContact: ContactValues = {
  fullName: "",
  company: "",
  phone: "",
  email: "",
  address: "",
};

/** Stitch: "Kurumunuz İçin İdeal Yemek Modelini Belirleyin" — hızlı ön hesaplama. */
export function QuickQuote() {
  const [portion, setPortion] = useState(0);
  const [mode, setMode] = useState(0);
  const [contact, setContact] = useState<ContactValues>(emptyContact);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    const ok = await submitForm({
      subject: `Hızlı ön hesaplama — ${contact.company}`,
      replyTo: contact.email,
      fields: {
        Form: "Hızlı Ön Hesaplama",
        "Ad Soyad": contact.fullName,
        "Firma İsmi": contact.company,
        Adres: contact.address,
        "Telefon No": contact.phone,
        Mail: contact.email,
        "Günlük kişi sayısı": portionRanges[portion],
        "Hizmet türü": serviceModes[mode].label,
      },
    });
    setStatus(ok ? "done" : "error");
  };

  return (
    <Section className="bg-cream">
      <Reveal className="shadow-lift rounded-[2.5rem] bg-white p-8 lg:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-4">
            <p className="bg-brand-800/10 text-brand-800 inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-wider uppercase">
              Hızlı Ön Hesaplama
            </p>
            <h2 className="font-display text-ink text-3xl leading-tight font-bold sm:text-4xl">
              Kurumunuz İçin İdeal Yemek Modelini Belirleyin
            </h2>
            <p className="text-subtle leading-relaxed">
              Kişi sayısı ve servis modelinizi seçin; beslenme uzmanlarımız ve
              operasyon ekibimiz kurumunuza en verimli planı hazırlasın.
            </p>

            <ul className="space-y-3 pt-2">
              {quickQuotePoints.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <CheckCircle2
                    className="text-sage-600 size-5 shrink-0"
                    aria-hidden
                  />
                  <span className="text-ink text-sm sm:text-base">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-container rounded-3xl p-6 sm:p-8">
            {status === "done" ? (
              <div className="py-10 text-center">
                <CheckCircle2
                  className="text-sage-600 mx-auto size-10"
                  aria-hidden
                />
                <p className="text-ink mt-4 font-semibold">
                  Talebiniz bize ulaştı
                </p>
                <p className="text-subtle mt-2 text-sm">
                  En kısa sürede sizi arayıp örnek menü ve fiyat paylaşacağız.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <fieldset>
                  <legend className="text-ink mb-2 block text-sm font-semibold">
                    Günlük Kişi Sayısı (Porsiyon)
                  </legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {portionRanges.map((range, index) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setPortion(index)}
                        aria-pressed={portion === index}
                        className={cn(
                          "rounded-xl px-2 py-2.5 text-xs font-bold transition-colors",
                          portion === index
                            ? "bg-brand-800 shadow-soft text-white"
                            : "text-ink hover:bg-cream bg-white",
                        )}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-ink mb-2 block text-sm font-semibold">
                    Hizmet Türü
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceModes.map((item, index) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setMode(index)}
                        aria-pressed={mode === index}
                        className={cn(
                          "shadow-soft flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
                          mode === index
                            ? "bg-brand-800 text-white"
                            : "text-ink hover:bg-cream bg-white",
                        )}
                      >
                        <item.icon className="size-4 shrink-0" aria-hidden />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-3 sm:grid-cols-2">
                  {contactFields.map((field) => (
                    <label
                      key={field.name}
                      className={cn(
                        "block",
                        "wide" in field && "sm:col-span-2",
                      )}
                    >
                      <span className="text-subtle mb-1 block text-xs font-medium">
                        {field.label}
                      </span>
                      <input
                        name={field.name}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        value={contact[field.name]}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            [field.name]: event.target.value,
                          }))
                        }
                        required
                        placeholder={field.placeholder}
                        className={inputClass}
                      />
                    </label>
                  ))}
                </div>

                {status === "error" ? (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 p-3 text-xs text-red-700"
                  >
                    Gönderilemedi. Lütfen tekrar deneyin veya{" "}
                    <a
                      href={site.phoneHref}
                      className="font-semibold underline"
                    >
                      {site.phone}
                    </a>{" "}
                    numarasından ulaşın.
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-brand-600 shadow-glow hover:bg-accent-500 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Send className="size-4" aria-hidden />
                  )}
                  Hemen Fiyat &amp; Örnek Menü İste
                </button>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
