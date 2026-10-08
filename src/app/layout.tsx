import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/data/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} Yemek — Toplu Yemek Hizmetleri`,
    template: `%s | ${site.name} Yemek`,
  },
  description: site.description,
  applicationName: `${site.name} Yemek`,
  keywords: [
    "toplu yemek",
    "catering",
    "tabldot",
    "kumanya",
    "fabrika yemeği",
    "İstanbul toplu yemek",
    "Bağcılar catering",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: `${site.name} Yemek`,
    title: `${site.name} Yemek — Toplu Yemek Hizmetleri`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

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
