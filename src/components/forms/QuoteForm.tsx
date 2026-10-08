"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { submitForm } from "@/lib/submit-form";
import { quoteSchema, type QuoteInput } from "@/lib/quote-schema";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";
import { legalNav } from "@/data/site";
import { useSite } from "@/components/SiteProvider";
import Link from "next/link";

const steps = [
  { title: "Kurum bilgileri", fields: ["company", "contact"] },
  { title: "İletişim", fields: ["phone", "email"] },
  { title: "İhtiyacınız", fields: ["service", "meals", "startDate", "message", "consent"] },
] as const;


const fieldClass =
  "border-line focus:border-brand-300 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition-colors";

export function QuoteForm() {
  const site = useSite();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const reduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: { message: "" },
  });

  const next = async () => {
    const valid = await trigger([...steps[step].fields] as (keyof QuoteInput)[]);
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const onSubmit = handleSubmit(async (values) => {
    setStatus("sending");

    const service = services.find((item) => item.slug === values.service);

    const ok = await submitForm({
      subject: `Teklif talebi — ${values.company}`,
      replyTo: values.email,
      lead: {
        kind: "teklif",
        name: values.contact,
        company: values.company,
        email: values.email,
        phone: values.phone,
        meals: String(values.meals),
        service: service?.title ?? values.service,
      },
      fields: {
        Form: "Teklif Formu (/teklif-al)",
        Firma: values.company,
        Yetkili: values.contact,
        Telefon: values.phone,
        "E-posta": values.email,
        Hizmet: service?.title ?? values.service,
        "Günlük öğün": String(values.meals),
        "Başlangıç tarihi": values.startDate,
        Mesaj: values.message || "—",
      },
    });
    setStatus(ok ? "done" : "error");
  });

  if (status === "done") {
    return (
      <div className="border-line shadow-soft rounded-3xl border bg-white p-10 text-center">
        <CheckCircle2 className="text-accent-500 mx-auto size-12" aria-hidden />
        <h2 className="font-display text-brand-900 mt-6 text-2xl">
          Talebiniz bize ulaştı
        </h2>
        <p className="text-muted mx-auto mt-4 max-w-md leading-relaxed">
          En kısa sürede, genellikle bir iş günü içinde size dönüş yapacağız.
          Acil bir talebiniz varsa telefonla da ulaşabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border-line shadow-soft rounded-3xl border bg-white p-7 sm:p-10"
    >
      <ol className="flex items-center gap-3" aria-label="Form adımları">
        {steps.map((item, index) => (
          <li key={item.title} className="flex flex-1 items-center gap-3">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300",
                index <= step
                  ? "bg-brand-800 text-cream"
                  : "bg-brand-50 text-muted",
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs font-medium sm:block",
                index <= step ? "text-brand-800" : "text-muted",
              )}
            >
              {item.title}
            </span>
            {index < steps.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "h-px flex-1 transition-colors duration-500",
                  index < step ? "bg-brand-300" : "bg-line",
                )}
              />
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-9">
        {/* initial={false}: ilk adım animasyonsuz/görünür; geçiş yalnızca adım değişiminde. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {step === 0 ? (
              <>
                <Field label="Firma / kurum adı" error={errors.company?.message}>
                  <input
                    {...register("company")}
                    className={fieldClass}
                    autoComplete="organization"
                    placeholder="Örn. Nazlı Tekstil A.Ş."
                  />
                </Field>
                <Field label="Yetkili kişi" error={errors.contact?.message}>
                  <input
                    {...register("contact")}
                    className={fieldClass}
                    autoComplete="name"
                    placeholder="Ad Soyad"
                  />
                </Field>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Field label="Telefon" error={errors.phone?.message}>
                  <input
                    {...register("phone")}
                    className={fieldClass}
                    type="tel"
                    autoComplete="tel"
                    placeholder="0555 000 00 00"
                  />
                </Field>
                <Field label="E-posta" error={errors.email?.message}>
                  <input
                    {...register("email")}
                    className={fieldClass}
                    type="email"
                    autoComplete="email"
                    placeholder="ad@firma.com"
                  />
                </Field>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Field label="Hizmet türü" error={errors.service?.message}>
                  <select {...register("service")} className={fieldClass} defaultValue="">
                    <option value="" disabled>
                      Seçiniz
                    </option>
                    {services.map((service) => (
                      <option key={service.slug} value={service.slug}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Günlük öğün sayısı" error={errors.meals?.message}>
                    <input
                      {...register("meals")}
                      className={fieldClass}
                      type="number"
                      min={1}
                      inputMode="numeric"
                      placeholder="250"
                    />
                  </Field>
                  <Field label="Başlangıç tarihi" error={errors.startDate?.message}>
                    <input
                      {...register("startDate")}
                      className={fieldClass}
                      type="date"
                    />
                  </Field>
                </div>

                <Field label="Eklemek istedikleriniz" error={errors.message?.message}>
                  <textarea
                    {...register("message")}
                    className={cn(fieldClass, "min-h-28 resize-y")}
                    placeholder="Vardiya düzeni, özel talepler, mekân bilgisi…"
                  />
                </Field>

                <div>
                  <label className="flex items-start gap-3 text-sm">
                    <input
                      {...register("consent")}
                      type="checkbox"
                      className="accent-brand-800 mt-1 size-4"
                    />
                    <span className="text-muted leading-relaxed">
                      İletişim bilgilerimin teklif hazırlanması amacıyla işlenmesini
                      kabul ediyorum.{" "}
                      <Link
                        href={legalNav[0].href}
                        className="text-brand-800 underline underline-offset-4"
                      >
                        {legalNav[0].label}
                      </Link>
                    </span>
                  </label>
                  {errors.consent?.message ? (
                    <p className="mt-2 text-xs text-red-700">{errors.consent.message}</p>
                  ) : null}
                </div>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          Form gönderilemedi. Lütfen tekrar deneyin veya{" "}
          <a href={site.phoneHref} className="font-semibold underline">
            {site.phone}
          </a>{" "}
          numarasından ya da{" "}
          <a href={`mailto:${site.email}`} className="font-semibold underline">
            {site.email}
          </a>{" "}
          adresinden ulaşın.
        </p>
      ) : null}

      <div className="mt-9 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
          disabled={step === 0}
          className={cn(step === 0 && "invisible")}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Geri
        </Button>

        {step < steps.length - 1 ? (
          <Button type="button" onClick={next} size="lg">
            Devam
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={status === "sending"}>
            {status === "sending" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
            )}
            {status === "sending" ? "Gönderiliyor" : "Teklif talebini gönder"}
          </Button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-brand-800 mb-2 block text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs text-red-700">{error}</span> : null}
    </label>
  );
}
