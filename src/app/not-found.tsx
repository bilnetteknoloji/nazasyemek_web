import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { flatNav } from "@/data/site";
import { SiteChrome } from "@/components/layout/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
    <section className="flex min-h-[70vh] items-center py-32">
      <Container className="text-center">
        <p className="text-accent-600 text-xs font-semibold tracking-[0.28em] uppercase">
          404
        </p>
        <h1 className="font-display text-brand-900 mt-4 text-4xl sm:text-5xl">
          Aradığınız sayfayı bulamadık
        </h1>
        <p className="text-muted mx-auto mt-5 max-w-md leading-relaxed">
          Bağlantı değişmiş veya sayfa kaldırılmış olabilir. Aşağıdaki
          bölümlerden devam edebilirsiniz.
        </p>

        <div className="mt-9">
          <ButtonLink href="/" size="lg">
            <ArrowLeft className="size-4" aria-hidden />
            Ana sayfaya dön
          </ButtonLink>
        </div>

        <ul className="text-muted mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
          {flatNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-brand-800 transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
    </SiteChrome>
  );
}
