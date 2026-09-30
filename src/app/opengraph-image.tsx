import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/site";

// Statik yayında derleme anında tek bir PNG üretilir.
export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.legalName} — ${site.tagline}`;

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-light.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#241a14",
          backgroundImage:
            "radial-gradient(60% 70% at 50% 0%, rgba(200,148,42,0.35), transparent 70%)",
          color: "#fbf7f1",
          fontFamily: "sans-serif",
          padding: 72,
        }}
      >
        <img src={logoSrc} alt="" height={190} />
        <div style={{ fontSize: 34, marginTop: 34, color: "#d9ae4e", letterSpacing: 6 }}>
          {site.tagline.toLocaleUpperCase("tr-TR")}
        </div>
        <div style={{ fontSize: 46, marginTop: 22, textAlign: "center" }}>
          Toplu Yemek ve Catering Hizmetleri
        </div>
        <div style={{ fontSize: 26, marginTop: 26, color: "rgba(251,247,241,0.65)" }}>
          {`${site.address.district} / ${site.address.city}`}
        </div>
      </div>
    ),
    size,
  );
}
