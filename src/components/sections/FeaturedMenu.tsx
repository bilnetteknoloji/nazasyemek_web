import { Img as Image } from "@/components/ui/Img";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { featuredDishes } from "@/data/home";
import { getHome } from "@/lib/content/home";

/** Stitch: "Usta Ellerden Günlük Menü Çeşitliliği" — dört yemek kartı. */
export async function FeaturedMenu() {
  const { menu } = await getHome();
  return (
    <Section className="bg-cream-deep">
      <SectionHeading
        eyebrow={menu.eyebrow}
        title={menu.title}
        description={menu.description}
      />

      <ul className="mobile-rail mt-12 md:grid gap-6 [--rail-item:66%] sm:grid-cols-2 lg:grid-cols-4">
        {featuredDishes.map((base, index) => {
          const dish = { ...base, ...menu.dishes[index] };
          return (
            <Reveal
              as="li"
              key={index}
              delay={(index % 4) * 0.06}
              className="group shadow-soft hover:shadow-lift flex flex-col overflow-hidden rounded-3xl bg-white transition-all duration-300"
            >
              <div className="bg-container relative aspect-[3/4] overflow-hidden">
                <Image
                  src={dish.photo}
                  alt={dish.title}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="text-brand-800 shadow-soft absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  {dish.badge}
                </span>
                <span className="bg-inverse/75 text-inverse-on absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs">
                  {dish.calories}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="text-sage-600 block text-xs font-semibold tracking-wider uppercase">
                    {dish.category}
                  </span>
                  <h3 className="text-ink mt-1 text-base font-bold">
                    {dish.title}
                  </h3>
                  <p className="text-muted mt-1 text-sm leading-relaxed">
                    {dish.text}
                  </p>
                </div>

                <div className="border-line text-muted mt-4 flex items-center justify-between border-t pt-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <dish.tagIcon
                      className="text-sage-600 size-3.5"
                      aria-hidden
                    />
                    {dish.tag}
                  </span>
                  <span>{dish.note}</span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>

      <Reveal className="mt-12 text-center">
        <ButtonLink href="/menu" variant="outline" size="lg">
          Dört haftalık menüyü görün
        </ButtonLink>
      </Reveal>
    </Section>
  );
}
