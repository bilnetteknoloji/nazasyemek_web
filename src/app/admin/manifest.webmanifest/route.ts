import { asset } from "@/lib/asset";

export const dynamic = "force-static";

/** Panel PWA manifestosu: ana ekrandan tam ekran açılır. */
export function GET() {
  return Response.json(
    {
      name: "NAZ-AŞ Yönetim Paneli",
      short_name: "NAZ-AŞ Panel",
      start_url: asset("/admin/"),
      scope: asset("/admin/"),
      display: "standalone",
      background_color: "#fafafa",
      theme_color: "#ffffff",
      icons: [
        { src: asset("/apple-icon.png"), sizes: "180x180", type: "image/png" },
        { src: asset("/icon.png"), sizes: "512x512", type: "image/png" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
