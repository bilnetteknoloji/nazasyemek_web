import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/data/site";
import { getSeo } from "@/lib/content/site";
import "./globals.css";

// Stitch tasarımının tipografisi: başlıklar Playfair Display, gövde Plus Jakarta Sans.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

const defaultTitle = `${site.name} Yemek | İstanbul Toplu Yemek ve Catering Firması`;

/**
 * Site geneli meta etiketleri. Arama motoru doğrulama kodları panelden
 * (Ayarlar → Arama motorları) gelir; kayıtta önbellek tazelenir.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: defaultTitle,
      template: `%s | ${site.name} Yemek`,
    },
    description: site.description,
    applicationName: `${site.name} Yemek`,
    keywords: [
      "toplu yemek",
      "toplu yemek firması",
      "catering",
      "tabldot",
      "kumanya",
      "fabrika yemeği",
      "işyeri yemeği",
      "okul yemeği",
      "İstanbul toplu yemek",
      "Bağcılar catering",
      "Mahmutbey yemek firması",
    ],
    authors: [{ name: site.legalName, url: site.url }],
    creator: site.legalName,
    publisher: site.legalName,
    category: "food",
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: `${site.name} Yemek`,
      title: defaultTitle,
      description: site.description,
    },
    twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
    // Google: büyük görsel önizlemesi ve sınırsız özet (Discover ve görsel arama için).
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    verification: {
      google: seo.google || undefined,
      yandex: seo.yandex || undefined,
      other: seo.bing ? { "msvalidate.01": seo.bing } : undefined,
    },
    // Yerel arama sinyali (Bing ve Yandex okur).
    other: {
      "geo.region": "TR-34",
      "geo.placename": `${site.address.district}, ${site.address.city}`,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${jakarta.variable} ${playfair.variable} h-full antialiased`}
    >
      {/* Site kabuğu (header/footer) `(site)/layout.tsx` içinde; panel kendi kabuğunu kullanır. */}
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
