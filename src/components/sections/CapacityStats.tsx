import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { getStats } from "@/lib/content/site";

const valueTone = {
  brand: "text-brand-800",
  sage: "text-sage-600",
  container: "text-brand-600",
  ink: "text-ink",
} as const;

const plusTone = {
  brand: "text-accent-500",
  sage: "text-sage-500",
  container: "text-accent-500",
  ink: "text-accent-500",
} as const;

/** Stitch: dört sütunlu, ayraçlı kapasite paneli. */
export async function CapacityStats() {
  const { capacity } = await getStats();
  return (
    <Section className="bg-cream">
      <Reveal className="bg-container shadow-soft rounded-[2rem] p-6 sm:rounded-[2.5rem] sm:p-8 lg:p-12">
        <dl className="divide-line-strong/40 grid grid-cols-2 gap-x-5 gap-y-8 md:gap-8 lg:grid-cols-4 lg:divide-x">
          {capacity.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "flex flex-col gap-2",
                index > 0 && "lg:pl-8",
              )}
            >
              <dt className="text-muted text-xs font-semibold tracking-wider uppercase">
                {item.label}
              </dt>
              <dd>
                <span
                  className={cn(
                    "font-display text-3xl leading-none font-bold sm:text-5xl",
                    valueTone[item.tone],
                  )}
                >
                  {item.value}
                  {item.plus ? (
                    <span className={plusTone[item.tone]}>{item.plus}</span>
                  ) : null}
                </span>
                <span className="text-subtle mt-3 block text-sm">{item.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
