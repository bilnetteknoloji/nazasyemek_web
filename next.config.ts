import type { NextConfig } from "next";

/**
 * İki yayın biçimi:
 * - `npm run build` + `npm start` → Node.js sunucusu (GoDaddy, main dalından derler).
 *   Turbopack PostCSS için yerel port açıyor, GoDaddy buna izin vermiyor
 *   ("binding to a port … Permission denied") → bu derleme `--webpack` ile yapılır.
 * - `npm run build:root` / `build:subdir` → STATIC_EXPORT=1 ile statik `out/` klasörü
 *   (Node.js'siz paylaşımlı hosting).
 *
 * Statik export'un bedeli:
 * - Sunucu tarafı rota (route handler) çalışmaz — teklif formu harici bir
 *   servise gönderir (NEXT_PUBLIC_FORM_ENDPOINT).
 * - next/image optimizasyonu devre dışıdır (`unoptimized`), görseller
 *   olduğu boyutta sunulur. Varlık boru hattı zaten webp üretiyor.
 * - Güvenlik başlıkları Next tarafından eklenemez; `public/.htaccess`
 *   içinde Apache/LiteSpeed için tanımlıdır.
 *
 * Formlar her iki biçimde de FormSubmit'e gider; Node derlemesi de aynı ayarları kullanır.
 */
/**
 * Site alt klasöre yüklenecekse (ör. https://alanadi/out/) derlerken
 * NEXT_BASE_PATH=/out verilmelidir — varlık yolları buna göre gömülür.
 * Kök dizine yükleniyorsa boş bırakılır.
 */
const basePath = process.env.NEXT_BASE_PATH || "";

const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // İstemcide de gerekli: src/lib/asset.ts public varlık yollarını buna göre üretir.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Her sayfa kendi klasöründe index.html olur → Apache /menu/ adresini sorunsuz açar.
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
