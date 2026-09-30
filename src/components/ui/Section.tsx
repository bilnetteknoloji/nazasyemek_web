import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
};

/** Bölüm ritmi: dikey boşluk + container. */
export function Section({ id, className, containerClassName, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
