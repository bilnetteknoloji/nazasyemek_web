/**
 * Alt klasör derlemesinden sonra out/.htaccess içindeki kök yollarını düzeltir.
 * public/.htaccess kök yayına göre yazılı (ErrorDocument /404.html); site /out
 * altında yayınlanınca 404 sayfası /out/404.html olmalı.
 *
 * Kullanım: node scripts/subdir-htaccess.mjs /out
 */
import fs from "node:fs/promises";
import path from "node:path";

const base = process.argv[2];
if (!base?.startsWith("/")) {
  console.error("Alt klasör yolu gerekli, ör. /out");
  process.exit(1);
}

const file = path.resolve(import.meta.dirname, "..", "out", ".htaccess");
const source = await fs.readFile(file, "utf8");
const fixed = source.replace(/^ErrorDocument 404 \/404\.html$/m, `ErrorDocument 404 ${base}/404.html`);
if (fixed === source) {
  console.error("out/.htaccess içinde beklenen ErrorDocument satırı bulunamadı");
  process.exit(1);
}
await fs.writeFile(file, fixed);
console.log(`✓ out/.htaccess: ErrorDocument ${base}/404.html`);
