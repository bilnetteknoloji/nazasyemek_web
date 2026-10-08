import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { WelcomeVideo } from "@/components/layout/WelcomeVideo";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteProvider } from "@/components/SiteProvider";
import { PageViewBeacon } from "@/components/PageViewBeacon";
import { getSite } from "@/lib/content/site";
import { organizationJsonLd } from "@/lib/jsonld";

/** Sitenin kabuğu: header, footer, alt sekme çubuğu, WhatsApp, tanıtım videosu. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const site = await getSite();

  return (
    <SiteProvider value={site}>
      <a
        href="#icerik"
        className="bg-brand-900 text-cream sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:px-5 focus:py-3 focus:text-sm"
      >
        İçeriğe geç
      </a>
      <MotionProvider>
        <Header />
        <main id="icerik" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
        <MobileTabBar />
        <WelcomeVideo />
      </MotionProvider>
      <PageViewBeacon />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(await organizationJsonLd()) }}
      />
    </SiteProvider>
  );
}
