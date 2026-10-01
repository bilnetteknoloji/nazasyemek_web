/**
 * Kaynak varlıkları (logo, fotoğraflar, videolar, sertifika PDF'leri)
 * public/ altına web'e uygun biçimde hazırlar ve src/data/media.ts manifestosunu üretir.
 *
 * Çalıştırma: npm run assets
 */
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";
import potrace from "potrace";

const run = promisify(execFile);

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_ROOT = path.resolve(ROOT, "..");
const SRC_PHOTOS = path.join(SRC_ROOT, "görseller");
const SRC_DOCS = path.join(SRC_ROOT, "belgeler");
// Müşteriden gelen yeni varlıklar (2026-10-01): yazısız logo ve üç fotoğraf.
const SRC_NEW = path.join(SRC_PHOTOS, "yeni");
const SRC_LOGO = path.join(SRC_NEW, "naz-as_logo_yazisiz.png");

const PUB = path.join(ROOT, "public");
const OUT_BRAND = path.join(PUB, "brand");
const OUT_PHOTOS = path.join(PUB, "gorseller");
const OUT_VIDEO = path.join(PUB, "video");
const OUT_DOCS = path.join(PUB, "belgeler");

// Logonun kendi kahvesi (kaynak görselden ölçüldü).
const BRAND_BROWN = { r: 0x5f, g: 0x41, b: 0x32 };
const CREAM = { r: 0xfb, g: 0xf7, b: 0xf1 };

const ensure = (dir) => fs.mkdir(dir, { recursive: true });

/* ------------------------------------------------------------------ logo */

/**
 * Kaynak görselin kenarında ince koyu bir çerçeve ve beyaz boşluk var.
 * Önce çerçeve+boşluk kırpılır, sonra parlaklıktan bir alfa maskesi çıkarılır;
 * böylece logo istenen renge boyanabilir (koyu zemin için beyaz varyant).
 */
async function buildLogo() {
  await ensure(OUT_BRAND);

  const { data, info } = await sharp(SRC_LOGO)
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: W, height: H, channels: C } = info;
  const lum = new Uint8Array(W * H);
  for (let i = 0, p = 0; p < W * H; p++, i += C) {
    lum[p] = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
  }

  // 1) Kenarlardan içeri doğru, satır/sütunun büyük kısmı koyu olduğu sürece çerçeve say.
  const frameLimit = Math.round(Math.min(W, H) * 0.05);
  const darkRatioRow = (y) => {
    let n = 0;
    for (let x = 0; x < W; x++) if (lum[y * W + x] < 120) n++;
    return n / W;
  };
  const darkRatioCol = (x) => {
    let n = 0;
    for (let y = 0; y < H; y++) if (lum[y * W + x] < 120) n++;
    return n / H;
  };
  let top = 0,
    bottom = H - 1,
    left = 0,
    right = W - 1;
  while (top < frameLimit && darkRatioRow(top) > 0.9) top++;
  while (bottom > H - 1 - frameLimit && darkRatioRow(bottom) > 0.9) bottom--;
  while (left < frameLimit && darkRatioCol(left) > 0.9) left++;
  while (right > W - 1 - frameLimit && darkRatioCol(right) > 0.9) right--;

  // 2) Kalan alanda mürekkebin (beyaz olmayan piksellerin) sıkı sınırlarını bul.
  const INK = 235;
  let bx0 = right,
    bx1 = left,
    by0 = bottom,
    by1 = top;
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (lum[y * W + x] < INK) {
        if (x < bx0) bx0 = x;
        if (x > bx1) bx1 = x;
        if (y < by0) by0 = y;
        if (y > by1) by1 = y;
      }
    }
  }

  const pad = Math.round(Math.max(bx1 - bx0, by1 - by0) * 0.02);
  const x0 = Math.max(left, bx0 - pad);
  const y0 = Math.max(top, by0 - pad);
  const cw = Math.min(right, bx1 + pad) - x0 + 1;
  const ch = Math.min(bottom, by1 + pad) - y0 + 1;

  // 3) Parlaklıktan alfa maskesi: beyaz → şeffaf, koyu → opak (kenar yumuşatma korunur).
  const alpha = Buffer.alloc(cw * ch);
  const LO = 60; // bu parlaklığın altı tamamen opak
  const HI = 246; // bunun üstü tamamen şeffaf
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const l = lum[(y0 + y) * W + (x0 + x)];
      const a = l <= LO ? 255 : l >= HI ? 0 : Math.round(((HI - l) / (HI - LO)) * 255);
      alpha[y * cw + x] = a;
    }
  }
  // Maske doğrudan RGBA ham veri olarak kurulur: renk sabit, alfa maskeden gelir.
  const tinted = async (color, size) => {
    const rgba = Buffer.alloc(cw * ch * 4);
    for (let p = 0; p < cw * ch; p++) {
      rgba[p * 4] = color.r;
      rgba[p * 4 + 1] = color.g;
      rgba[p * 4 + 2] = color.b;
      rgba[p * 4 + 3] = alpha[p];
    }
    return sharp(rgba, { raw: { width: cw, height: ch, channels: 4 } })
      .resize({ width: size, fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  const width = Math.min(cw, 1024);
  await fs.writeFile(path.join(OUT_BRAND, "logo.png"), await tinted(BRAND_BROWN, width));
  await fs.writeFile(path.join(OUT_BRAND, "logo-light.png"), await tinted(CREAM, width));

  // Vektör sürüm: alfa maskesi potrace ile izlenir (header bunu kullanır).
  const maskPng = await sharp(alpha, { raw: { width: cw, height: ch, channels: 1 } })
    .negate()
    .png()
    .toBuffer();
  const trace = (color) =>
    new Promise((resolve, reject) =>
      potrace.trace(
        maskPng,
        { color, background: "transparent", threshold: 128, turdSize: 4, optTolerance: 0.3 },
        (err, svg) => (err ? reject(err) : resolve(svg)),
      ),
    );
  const hex = ({ r, g, b }) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  await fs.writeFile(path.join(OUT_BRAND, "logo.svg"), await trace(hex(BRAND_BROWN)));
  await fs.writeFile(path.join(OUT_BRAND, "logo-light.svg"), await trace(hex(CREAM)));

  // Favicon / uygulama ikonları: markanın kahve zemini üzerine krem logo.
  const iconMark = await tinted(CREAM, 400);
  for (const [file, size, dir] of [
    ["icon.png", 512, path.join(ROOT, "src", "app")],
    ["apple-icon.png", 180, path.join(ROOT, "src", "app")],
    ["og-logo.png", 600, OUT_BRAND],
  ]) {
    const inner = Math.round(size * 0.76);
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { ...BRAND_BROWN, alpha: 1 },
      },
    })
      .composite([
        {
          input: await sharp(iconMark)
            .resize({ width: inner, height: inner, fit: "inside" })
            .toBuffer(),
          gravity: "center",
        },
      ])
      .png()
      .toFile(path.join(dir, file));
  }

  console.log(`✓ logo: ${cw}×${ch} kırpıldı (çerçeve ${left}/${top}), PNG + SVG varyantları üretildi`);
  return { width: cw, height: ch };
}

/* ---------------------------------------------------- geliştirici logosu */

// Footer'daki "tasarım & geliştirme" logosu. Kenar boşluğu kırpılır; footer'da
// 28px yükseklikte gösterildiği için 4× (112px) üretilir — retina'da da net.
const SRC_DEV_LOGO = "/Users/edmr/Desktop/Bilnet_Yazilim_Logo 2.png";

async function buildDevLogo() {
  const info = await sharp(SRC_DEV_LOGO)
    .trim()
    .resize({ height: 112 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_BRAND, "bilnet-yazilim.png"));
  console.log(`✓ geliştirici logosu: ${info.width}×${info.height}`);
}

/* ---------------------------------------------------------------- photos */

const PHOTO_META = {
  "1": { alt: "Açık büfe servisinde tabaklar hazırlanıyor", tag: "organizasyon" },
  nazas2: { alt: "Sıcak yemek servisi", tag: "servis" },
  nazas3: { alt: "Endüstriyel mutfakta hazırlık", tag: "mutfak" },
  nazas4: { alt: "Günlük menü sunumu", tag: "servis" },
  nazas5: { alt: "Bölmeli kaplarda hazırlanmış kumanya öğünleri", tag: "kumanya" },
  nazas6: { alt: "Paket öğün hazırlığı", tag: "kumanya" },
  nazas7: { alt: "Yemekhane servisi", tag: "servis" },
  nazas8: { alt: "Ana yemek sunumu", tag: "servis" },
  nazas9: { alt: "Mutfak ekibi çalışırken", tag: "mutfak" },
  nazas10: { alt: "Toplu yemek üretimi", tag: "mutfak" },
  nazas11: { alt: "Menü çeşitleri", tag: "servis" },
  nazas12: { alt: "Porsiyonlama hattı", tag: "mutfak" },
  nazas13: { alt: "Organizasyon masası düzeni", tag: "organizasyon" },
  nazas14: { alt: "Tabldot servis hattı", tag: "servis" },
  nazas15: { alt: "Sıcak yemek kapları", tag: "kumanya" },
  nazas16: { alt: "Salata ve mezeler", tag: "servis" },
  nazas17: { alt: "Günün yemekleri", tag: "servis" },
  nazas18: { alt: "Paketlenmiş öğünler", tag: "kumanya" },
  nazas19: { alt: "Tatlı sunumu", tag: "servis" },
  nazas20: { alt: "Davet ve organizasyon servisi", tag: "organizasyon" },
};

// `yeni/` klasöründeki fotoğraflar; sayfalarda `photo("naz-as_foto1.webp")` ile kullanılır.
const NEW_PHOTO_META = {
  "naz-as_foto1": { alt: "Servis hattında günün yemekleri", tag: "mutfak" },
  "naz-as_foto2": { alt: "Üretim mutfağında sıcak yemek hazırlığı", tag: "mutfak" },
  "naz-as_foto3": { alt: "Kazanda çorba hazırlığı", tag: "mutfak" },
};

async function buildPhotos() {
  await ensure(OUT_PHOTOS);
  const files = (await fs.readdir(SRC_PHOTOS))
    .filter((f) => /\.jpe?g$/i.test(f))
    .sort((a, b) => a.localeCompare(b, "tr", { numeric: true }));

  const out = [];
  for (const file of files) {
    const key = path.basename(file, path.extname(file));
    const slug = key === "1" ? "nazas1" : key;
    const target = path.join(OUT_PHOTOS, `${slug}.webp`);
    const info = await sharp(path.join(SRC_PHOTOS, file))
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(target);
    const meta = PHOTO_META[key] ?? { alt: "NAZ-AŞ toplu yemek hizmetleri", tag: "servis" };
    out.push({ src: `/gorseller/${slug}.webp`, width: info.width, height: info.height, ...meta });
  }
  for (const [slug, meta] of Object.entries(NEW_PHOTO_META)) {
    const info = await sharp(path.join(SRC_NEW, `${slug}.jpg`))
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(OUT_PHOTOS, `${slug}.webp`));
    out.push({ src: `/gorseller/${slug}.webp`, width: info.width, height: info.height, ...meta });
  }
  console.log(`✓ fotoğraf: ${out.length} görsel webp'e dönüştürüldü`);
  return out;
}

/* ----------------------------------------------------------- arka planlar */

// Bölüm arka planları: galeriye girmez, bileşenler doğrudan yol ile kullanır.
const SRC_BACKGROUNDS = path.join(SRC_PHOTOS, "Son Fotolar");
const BACKGROUNDS = ["servicebg.png", "menubg.png"];

async function buildBackgrounds() {
  const outDir = path.join(OUT_PHOTOS, "bg");
  await ensure(outDir);
  for (const file of BACKGROUNDS) {
    const slug = path.basename(file, path.extname(file));
    await sharp(path.join(SRC_BACKGROUNDS, file))
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(outDir, `${slug}.webp`));
  }
  console.log(`✓ arka plan: ${BACKGROUNDS.length} görsel hazırlandı`);
}

/* ------------------------------------------------------------ hero medyası */

// Ana sayfa slider'ı. HEIC'i sharp okuyamadığı için macOS `sips` ile, MOV'u
// (HEVC) tarayıcıların oynatabileceği H.264 MP4'e macOS `avconvert` ile çevirir.
const HERO_PHOTOS = ["IMG_7785.HEIC", "IMG_7786.HEIC"];
const HERO_VIDEO = { file: "IMG_7745 2.mov", slug: "hero-7745" };

async function buildHeroMedia() {
  const outDir = path.join(OUT_PHOTOS, "hero");
  await ensure(outDir);
  await ensure(OUT_VIDEO);
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "nazas-hero-"));
  try {
    for (const file of HERO_PHOTOS) {
      const slug = path.basename(file, path.extname(file));
      const jpeg = path.join(tmp, `${slug}.jpg`);
      await run("sips", ["-s", "format", "jpeg", path.join(SRC_BACKGROUNDS, file), "--out", jpeg]);
      // Slider görseli kırpılmadan tam gösterildiği için retina genişliği ve yüksek kalite.
      await sharp(jpeg)
        .rotate()
        .resize({ width: 2048, withoutEnlargement: true })
        .webp({ quality: 86 })
        .toFile(path.join(outDir, `${slug}.webp`));
    }

    const video = path.join(OUT_VIDEO, `${HERO_VIDEO.slug}.mp4`);
    await run("avconvert", [
      "--preset", "Preset1920x1080",
      "--source", path.join(SRC_BACKGROUNDS, HERO_VIDEO.file),
      "--output", video,
      "--replace",
    ]);
    // Poster: videonun Quick Look küçük resmi (ilk kareye yakın).
    await run("qlmanage", ["-t", "-s", "1920", "-o", tmp, video]);
    await sharp(path.join(tmp, `${HERO_VIDEO.slug}.mp4.png`))
      .webp({ quality: 80 })
      .toFile(path.join(outDir, `${HERO_VIDEO.slug}-poster.webp`));
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
  console.log(`✓ hero: ${HERO_PHOTOS.length} fotoğraf + 1 video hazırlandı`);
}

/* ---------------------------------------------------------------- videos */

async function buildVideos() {
  await ensure(OUT_VIDEO);
  const files = (await fs.readdir(SRC_PHOTOS)).filter((f) => /\.mp4$/i.test(f)).sort();
  const out = [];
  for (const file of files) {
    await fs.copyFile(path.join(SRC_PHOTOS, file), path.join(OUT_VIDEO, file));
    out.push({ src: `/video/${file}` });
  }
  console.log(`✓ video: ${out.length} dosya kopyalandı`);
  return out;
}

/* ------------------------------------------------------------ sertifikalar */

// Başlıklar sertifikaların kendisinden okundu (BELCERT Uluslararası Belgelendirme).
const CERT_META = {
  IMG_20260909_0003: { title: "ISO 9001:2015", subtitle: "Kalite Yönetim Sistemi", order: 1 },
  IMG_20260909_0010: { title: "ISO 22000:2018", subtitle: "Gıda Güvenliği Yönetim Sistemi", order: 2 },
  IMG_20260909_0012: { title: "Helal Belgesi", subtitle: "TS OIC/SMIIC 1 — Helal Gıda", order: 3 },
  IMG_20260909_0007: { title: "GHP", subtitle: "İyi Hijyen Uygulamaları", order: 4 },
  IMG_20260909_0005: { title: "GMP 22716:2007", subtitle: "İyi Üretim Uygulamaları", order: 5 },
  IMG_20260909_0001: { title: "ISO 45001:2018", subtitle: "İş Sağlığı ve Güvenliği Yönetim Sistemi", order: 6 },
  IMG_20260909_0002: { title: "ISO 14001:2026", subtitle: "Çevre Yönetim Sistemi", order: 7 },
  IMG_20260909_0009: { title: "ISO 26000:2021", subtitle: "Sosyal Sorumluluk Yönetim Sistemi", order: 8 },
  IMG_20260909_0011: { title: "EN ISO 15593", subtitle: "Gıda Ambalajı Üretiminde Hijyen Yönetimi", order: 9 },
  IMG_20260909_0006: { title: "Gıda Uygunluk Belgesi", subtitle: "EC 1935/2004 — Gıda ile Temas Eden Maddeler", order: 10 },
  IMG_20260909_0008: { title: "CE Uygunluk Beyanı", subtitle: "GPSR 2023/988 Genel Ürün Güvenliği", order: 11 },
};

async function buildCertificates() {
  await ensure(OUT_DOCS);
  const files = (await fs.readdir(SRC_DOCS)).filter((f) => /\.pdf$/i.test(f)).sort();
  const out = [];
  for (const file of files) {
    const key = path.basename(file, ".pdf");
    await fs.copyFile(path.join(SRC_DOCS, file), path.join(OUT_DOCS, file));

    let thumb = null;
    try {
      const stem = path.join(OUT_DOCS, key);
      await run("pdftoppm", ["-jpeg", "-r", "90", "-f", "1", "-l", "1", "-singlefile", path.join(SRC_DOCS, file), stem]);
      const info = await sharp(`${stem}.jpg`)
        .resize({ width: 900, fit: "inside" })
        .webp({ quality: 80 })
        .toFile(`${stem}.webp`);
      await fs.rm(`${stem}.jpg`, { force: true });
      thumb = { src: `/belgeler/${key}.webp`, width: info.width, height: info.height };
    } catch (err) {
      console.warn(`  ! ${file} önizlemesi üretilemedi: ${err.message}`);
    }

    const { order = 99, ...meta } = CERT_META[key] ?? { title: "Belge", subtitle: "" };
    out.push({ id: key, pdf: `/belgeler/${file}`, thumb, ...meta, order });
  }
  out.sort((a, b) => a.order - b.order);
  console.log(`✓ belge: ${out.length} sertifika hazırlandı`);
  for (const cert of out) delete cert.order;
  return out;
}

/* ---------------------------------------------------------------- galeri */

// Galeri grupları. `photos` içindeki eski etiketler (servis/mutfak/kumanya/
// organizasyon) aynı adlı gruplara düşer; yeni fotoğraflar elle atanır.
const GALLERY_GROUPS = ["tesis", "mutfak", "kumanya", "servis", "organizasyon", "video"];

// Son Fotolar → galeri. "IMG_7640 2.HEIC" IMG_7640 ile birebir aynı, bir kez alınır.
const GALLERY_PHOTOS = [
  { file: "IMG_7785.HEIC", group: "tesis", alt: "Endüstriyel üretim mutfağımız" },
  { file: "IMG_7778.HEIC", group: "tesis", alt: "Pişirme hattı ve kazan istasyonları" },
  { file: "IMG_7782.HEIC", group: "tesis", alt: "Büyük kapasiteli pişirme kazanları" },
  { file: "IMG_7708.HEIC", group: "mutfak", alt: "Konveksiyonel fırında pişen tepsiler" },
  { file: "IMG_7727 2.HEIC", group: "mutfak", alt: "Gastronom küvette döner ve patates" },
  { file: "IMG_7756.HEIC", group: "mutfak", alt: "Fırına hazırlanan sebzeli kebap" },
  { file: "gallery6.png", group: "kumanya", alt: "Kapak kapatma makinesinde hijyenik paketleme" },
  { file: "IMG_7640.HEIC", group: "kumanya", alt: "Bölmeli kaplarda porsiyonlanmış öğünler" },
  { file: "IMG_7689.HEIC", group: "kumanya", alt: "Paketlenmeye hazır çorba ve makarna porsiyonları" },
  { file: "IMG_7715.HEIC", group: "kumanya", alt: "Sarma, mantı ve çorba porsiyonları" },
  { file: "IMG_7720.HEIC", group: "kumanya", alt: "Dörtlü bölmeli kumanya öğünü" },
  { file: "IMG_7732.HEIC", group: "kumanya", alt: "Et, pilav ve çorbadan oluşan paket öğünler" },
  { file: "IMG_7738.HEIC", group: "kumanya", alt: "Döner, pilav ve çorbalı paket öğün" },
  { file: "IMG_7699 2.HEIC", group: "servis", alt: "NAZ-AŞ logolu masada öğle yemeği tepsisi" },
  { file: "IMG_7705.HEIC", group: "servis", alt: "Tabldot servis tepsisi" },
];

const GALLERY_VIDEOS = [
  { file: "IMG_7680.MOV", slug: "galeri-7680", alt: "Üretim mutfağından görüntüler" },
  { file: "IMG_7745 2.mov", slug: "hero-7745", alt: "Porsiyonlanmış öğün kapları" },
];

/**
 * Hafif iyileştirme: EXIF'e göre döndürme, hafif parlaklık/canlılık/kontrast
 * ve keskinlik. Doğal görünüm korunur.
 */
const enhance = (image) =>
  image
    .rotate()
    .modulate({ brightness: 1.03, saturation: 1.08 })
    .linear(1.05, -6)
    .sharpen({ sigma: 0.6 });

/** Sağ alt köşeye yarı saydam NAZ-AŞ logosu (krem logo + yumuşak koyu gölge). */
async function watermark(buffer, width, height) {
  const logoWidth = Math.round(width * 0.1);
  const margin = Math.round(width * 0.03);
  const logo = await sharp(path.join(OUT_BRAND, "logo-light.png"))
    .resize({ width: logoWidth })
    .ensureAlpha()
    .linear([1, 1, 1, 0.72], [0, 0, 0, 0])
    .png()
    .toBuffer();
  const { height: logoHeight } = await sharp(logo).metadata();
  const shadow = await sharp(path.join(OUT_BRAND, "logo-light.png"))
    .resize({ width: logoWidth })
    .ensureAlpha()
    .linear([0, 0, 0, 0.5], [0, 0, 0, 0])
    .blur(Math.max(2, logoWidth / 40))
    .png()
    .toBuffer();
  const left = width - logoWidth - margin;
  const top = height - logoHeight - margin;
  return sharp(buffer)
    .composite([
      { input: shadow, left: left + 2, top: top + 3 },
      { input: logo, left, top },
    ])
    .toBuffer();
}

/** Tek görseli iyileştirip filigranlı tam boy + küçük resim olarak yazar. */
async function writeGalleryPhoto(source, slug) {
  const outDir = path.join(OUT_PHOTOS, "galeri");
  const full = await enhance(sharp(source))
    .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const marked = await watermark(full.data, full.info.width, full.info.height);
  await sharp(marked).webp({ quality: 84 }).toFile(path.join(outDir, `${slug}.webp`));

  const thumb = await enhance(sharp(source))
    .resize({ width: 720, height: 720, fit: "inside", withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const markedThumb = await watermark(thumb.data, thumb.info.width, thumb.info.height);
  await sharp(markedThumb)
    .webp({ quality: 80 })
    .toFile(path.join(outDir, "thumb", `${slug}.webp`));

  return {
    src: `/gorseller/galeri/${slug}.webp`,
    thumb: `/gorseller/galeri/thumb/${slug}.webp`,
    width: full.info.width,
    height: full.info.height,
  };
}

async function buildGallery(videos) {
  const outDir = path.join(OUT_PHOTOS, "galeri");
  await fs.rm(outDir, { recursive: true, force: true });
  await ensure(path.join(outDir, "thumb"));
  await ensure(path.join(outDir, "poster"));
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "nazas-galeri-"));
  const items = [];

  try {
    // 1) Son Fotolar
    for (const { file, group, alt } of GALLERY_PHOTOS) {
      const slug = path.basename(file, path.extname(file)).replace(/ 2$/, "").toLowerCase();
      let source = path.join(SRC_BACKGROUNDS, file);
      if (/\.heic$/i.test(file)) {
        const jpeg = path.join(tmp, `${slug}.jpg`);
        await run("sips", ["-s", "format", "jpeg", source, "--out", jpeg]);
        source = jpeg;
      }
      items.push({ type: "photo", group, alt, ...(await writeGalleryPhoto(source, slug)) });
    }

    // 2) Mevcut nazas* fotoğrafları (orijinal JPEG'lerden; public/gorseller/*.webp filigransız kalır).
    //    Bazıları galeriden çıkarıldı, "Toplu yemek üretimi" yeni fotoğrafla değiştirildi.
    const GALLERY_SKIP = new Set(["nazas9", "nazas12"]);
    const GALLERY_SOURCE_OVERRIDE = { nazas10: "naz-as_foto1" };
    const files = (await fs.readdir(SRC_PHOTOS))
      .filter((f) => /\.jpe?g$/i.test(f))
      .sort((a, b) => a.localeCompare(b, "tr", { numeric: true }));
    for (const file of files) {
      const key = path.basename(file, path.extname(file));
      if (GALLERY_SKIP.has(key)) continue;
      const override = GALLERY_SOURCE_OVERRIDE[key];
      const slug = override ?? (key === "1" ? "nazas1" : key);
      const source = override ? path.join(SRC_NEW, `${override}.jpg`) : path.join(SRC_PHOTOS, file);
      const meta = PHOTO_META[key] ?? { alt: "NAZ-AŞ toplu yemek hizmetleri", tag: "servis" };
      items.push({
        type: "photo",
        group: meta.tag,
        alt: meta.alt,
        ...(await writeGalleryPhoto(source, slug)),
      });
    }

    // 3) Videolar: yeni MOV'lar H.264'e çevrilir, mevcut mp4'ler kullanılır.
    //    Filigran dosyaya işlenemez (ffmpeg yok) — arayüz CSS ile gösterir.
    const videoSources = [];
    for (const { file, slug, alt } of GALLERY_VIDEOS) {
      const target = path.join(OUT_VIDEO, `${slug}.mp4`);
      const exists = await fs.stat(target).then(() => true, () => false);
      if (!exists) {
        await run("avconvert", [
          "--preset", "Preset1920x1080",
          "--source", path.join(SRC_BACKGROUNDS, file),
          "--output", target,
          "--replace",
        ]);
      }
      videoSources.push({ slug, alt, src: `/video/${slug}.mp4` });
    }
    videos.forEach((video, index) =>
      videoSources.push({
        slug: path.basename(video.src, ".mp4"),
        alt: `Mutfağımızdan video ${index + 1}`,
        src: video.src,
      }),
    );
    for (const { slug, alt, src } of videoSources) {
      const file = path.join(PUB, src);
      await run("qlmanage", ["-t", "-s", "1280", "-o", tmp, file]);
      const info = await sharp(path.join(tmp, `${path.basename(file)}.png`))
        .webp({ quality: 80 })
        .toFile(path.join(outDir, "poster", `${slug}.webp`));
      items.push({
        type: "video",
        group: "video",
        alt,
        src,
        thumb: `/gorseller/galeri/poster/${slug}.webp`,
        width: info.width,
        height: info.height,
      });
    }
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }

  items.sort((a, b) => GALLERY_GROUPS.indexOf(a.group) - GALLERY_GROUPS.indexOf(b.group));
  console.log(
    `✓ galeri: ${items.filter((i) => i.type === "photo").length} fotoğraf (filigranlı), ` +
      `${items.filter((i) => i.type === "video").length} video`,
  );
  return items;
}

/* -------------------------------------------------------------- manifest */

async function main() {
  await buildLogo();
  await buildDevLogo();
  const photos = await buildPhotos();
  await buildBackgrounds();
  await buildHeroMedia();
  const videos = await buildVideos();
  const certificates = await buildCertificates();
  const gallery = await buildGallery(videos);

  const banner = `// Bu dosya scripts/prepare-assets.mjs tarafından üretilir. Elle düzenlemeyin.\n`;
  const body = `${banner}
export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  tag: "servis" | "mutfak" | "kumanya" | "organizasyon";
};

export type GalleryGroup = ${GALLERY_GROUPS.map((g) => JSON.stringify(g)).join(" | ")};

/** Galeri öğesi. Fotoğraflarda \`src\`/\`thumb\` filigranlıdır; videoda \`thumb\` poster. */
export type GalleryItem = {
  type: "photo" | "video";
  group: GalleryGroup;
  alt: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
};

export type Certificate = {
  id: string;
  title: string;
  subtitle: string;
  pdf: string;
  thumb: { src: string; width: number; height: number } | null;
};

export const photos: Photo[] = ${JSON.stringify(photos, null, 2)};

export const videos: { src: string }[] = ${JSON.stringify(videos, null, 2)};

export const certificates: Certificate[] = ${JSON.stringify(certificates, null, 2)};

export const gallery: GalleryItem[] = ${JSON.stringify(gallery, null, 2)};
`;
  const target = path.join(ROOT, "src", "data", "media.ts");
  await ensure(path.dirname(target));
  await fs.writeFile(target, body);
  console.log(`✓ manifest: src/data/media.ts yazıldı`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
