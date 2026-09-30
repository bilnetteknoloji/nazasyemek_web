import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialSlider } from "./Testimonials";

export function TestimonialsSection() {
  return (
    <Section className="bg-cream-deep/60 overflow-hidden">
      <SectionHeading
        eyebrow="Referanslar"
        title="Birlikte çalıştığımız kurumlar ne diyor?"
        align="center"
      />
      <div className="mt-12">
        <TestimonialSlider />
      </div>
    </Section>
  );
}
