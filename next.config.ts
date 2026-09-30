import type { NextConfig } from "next";

/**
 * Statik yayın (Node.js'siz paylaşımlı hosting) için yapılandırma.
 *
 * `output: "export"` tüm sayfaları önceden HTML olarak üretir; sonuç `out/`
 * klasörüne çıkar ve doğrudan web köküne yüklenir.
 *
 * Bunun bedeli:
 * - Sunucu tarafı rota (route handler) çalışmaz — teklif formu harici bir
 *   servise gönderir (NEXT_PUBLIC_FORM_ENDPOINT).
 * - next/image optimizasyonu devre dışıdır (`unoptimized`), görseller
 *   olduğu boyutta sunulur. Varlık boru hattı zaten webp üretiyor.
 * - Güvenlik başlıkları Next tarafından eklenemez; `public/.htaccess`
 *   içinde Apache/LiteSpeed için tanımlıdır.
 *
 * Hosting Node.js desteklemeye başlarsa: `output` satırını "standalone" yapın,
 * `trailingSlash`/`images.unoptimized` kaldırın ve `src/app/api/teklif/route.ts`
 * dosyasını geri ekleyin (git geçmişinde mevcut).
 */
/**
 * Site alt klasöre yüklenecekse (ör. https://alanadi/out/) derlerken
 * NEXT_BASE_PATH=/out verilmelidir — varlık yolları buna göre gömülür.
 * Kök dizine yükleniyorsa boş bırakılır.
 */
const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
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
