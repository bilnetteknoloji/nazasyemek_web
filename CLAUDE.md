# NAZ-AŞ Yemek — Kurumsal Site

Toplu yemek / catering firması NAZ-AŞ YEMEK (Mahmutbey Mah. Kültür Cad. No: 25/A, Bağcılar / İstanbul) için kurumsal web sitesi. İçerik dili **Türkçe**.

Yığın: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · lucide-react · motion (Framer Motion) · embla-carousel · react-hook-form + zod.

## Durum (2026-09-10)

Tamamlanan:

- Proje iskeleti, bağımlılıklar, ESLint/TS temiz, `npm run build` geçiyor.
- `src/app/globals.css` — Tailwind v4 `@theme` tasarım token'ları (marka kahve paleti, altın vurgu, serif/sans tipografi, yumuşak gölgeler, easing). **Bu blok geçicidir**, aşağıya bakın.
- `src/app/layout.tsx` — `lang="tr"`, Fraunces + Manrope, tam `metadata`, favicon/apple-icon, Header/Footer/WhatsApp FAB, LocalBusiness JSON-LD, "İçeriğe geç" bağlantısı.
- Varlık boru hattı: `npm run assets` (`scripts/prepare-assets.mjs`) → `src/data/media.ts` üretir.
- İçerik veri katmanı: `src/data/site.ts`, `services.ts`, `menu.ts`, `faq.ts`, `legal.ts`.
- Ortak bileşenler: `src/components/ui/` (Container, Section, SectionHeading, Reveal, Button, StatCounter, Accordion, Lightbox, WhatsAppFab), `src/components/layout/` (Header, MobileNav, Footer, PageHero, LegalPage), `src/components/sections/` (Hero, Stats, ServicesGrid, AboutTeaser, MenuWeeks/MenuTeaser, GalleryGrid/GalleryPreview, CertificateStrip, Process, Testimonials, FaqSection, CtaBand).
- Sayfalar: `/` (tam akış), `/hakkimizda`, `/hizmetlerimiz` + `/hizmetlerimiz/[slug]`, `/menu`, `/galeri`, `/belgelerimiz`, `/iletisim`, `/teklif-al`, `/kvkk`, `/gizlilik-politikasi`, `/cerez-politikasi`, `not-found.tsx`, `template.tsx` (route geçişi).
- Teklif formu: 3 adımlı `react-hook-form` + `zod` (`src/lib/quote-schema.ts`) → `POST /api/teklif`. Şu an payload doğrulanıp loglanıyor.
- SEO: `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, tüm sayfalarda `metadata` + canonical, breadcrumb/FAQ JSON-LD (`src/lib/jsonld.ts`).
- **Yayın biçimi: statik export.** Hosting (nazasyemek.bilnetyazilim.com) Node.js desteklemiyor; `next.config.ts` içinde `output: "export"` + `trailingSlash` + `images.unoptimized`. `npm run build` → `out/` klasörü web köküne yüklenir.
- `src/app/api/teklif/route.ts` **kaldırıldı** (statik export'ta çalışmaz, git geçmişinde duruyor). Formlar (Teklif + Hızlı Ön Hesaplama) `lib/submit-form.ts` → **FormSubmit** (`site.formEndpoint`, varsayılan `https://formsubmit.co/ajax/info@nazasyemek.com`) ile info@nazasyemek.com'a mail olarak düşer. ⚠️ İlk gerçek gönderimde FormSubmit o adrese onay maili yollar; bağlantıya tıklanana kadar mail iletilmez (yanıt `success: "false"` → formda hata mesajı).
- `public/.htaccess` — 404, güvenlik başlıkları, HTTPS yönlendirme, önbellek, `Options -Indexes`, opengraph-image MIME düzeltmesi.
- `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` → `export const dynamic = "force-static"` (export için zorunlu).

Yapılacak:

- Stitch tasarımı çekilip `@theme` token'ları değiştirilecek (aşağı bakın).
- `src/data/site.ts` kalan TODO alanları (alan adı, Facebook sayfa linki) ve `faq.ts` içindeki referanslar gerçeğiyle değiştirilecek. Telefon/WhatsApp/Instagram/TikTok artık gerçek.
- `menu.ts` gerçek menüyle değiştirilecek.
- FormSubmit aktivasyonu: info@nazasyemek.com'a gelen onay mailine tıklanmalı; sonra adresi gizleyen FormSubmit takma adına geçilebilir (`.env.example`).
- Yasal metinler (`src/data/legal.ts`) hukuk danışmanı kontrolünden geçecek.
- Gerçek tarayıcıda görsel kontrol — Chrome eklentisi bağlı değil. Headless ile doğrulandı (headless macOS'ta 500px'ten dar pencere açmıyor, 390px çıktı alınamadı); yatay taşma yok, `scrollWidth == viewport`.

Ayrıntılı plan: `~/.claude/plans/claude-mcp-add-stitch-humble-ripple.md`

## Stitch tasarımı (çekildi)

Kaynak: Google Stitch → proje **"Kurumsal Yemek Hizmetleri Web Sitesi"** (`5156037269331682468`),
ekran **"NAZ-AŞ | Ana Sayfa"** (`ba900ac2f52349f3b12504ae626b8c95`).
Doğru proje bu: logo "NAZ-AŞ KURUMSAL YEMEK / Aş'a Lezzet Katar" ve İstanbul referanslarıyla
gerçek markayla birebir. Karıştırmayın — `3552616974497213426` ("Kurumsal Catering Web Sitesi")
NAZAŞ/**Temas Catering** adıyla Bursa adresli farklı bir varyanttır, kullanılmadı.

`globals.css` içindeki `@theme` bloğu artık Stitch'in `tailwind.config`'inden alınan
değerleri taşır (tahmin değil):

- Tipografi: **Playfair Display** (başlık) + **Plus Jakarta Sans** (gövde)
- Marka: primary `#6d2417`, primary-container `#8b3a2b`, terracotta-rich `#9e2a2b`
- Yeşil vurgu: secondary `#3b6934`, sage-fresh `#4e7c48`
- Yüzeyler: **Stitch'ten sapıldı (kullanıcı kararı)** — pembemsi tonlar yerine beyaz / kirli beyaz:
  `cream #f9f8f5` (sayfa zemini), `cream-deep #f3f1ec`, `container #efece6`, `container-high #ebe8e2` (footer)
- Metin: on-surface `#1e1b18`, text-muted `#706963`, warm-border `#e6e2db`
- Gölgeler Stitch'in kullandığı `rgba(44,40,37,…)` değerleri; ana CTA `rgba(139,58,43,0.22)`
- Biçim dili: eyebrow'lar `primary/10` dolgulu pill, CTA bandı `from-primary via-primary-container
  to-terracotta-rich` gradyanı, belgeler bandı `inverse-surface #34302c`, **footer açık renk**

MCP: `stitch` bu projeye `local` scope'ta kayıtlı — HTTP transport **çalışmaz** (Stitch'in
`tools/list` yanıtındaki tanımsız `$ref` tüm araçları düşürür), bu yüzden
`~/.claude/mcp-proxies/stitch_proxy.py` üzerinden stdio olarak bağlanır.

Tasarımın 8 bölümünün tamamı uygulandı (`src/components/sections/`):
`Hero` + `HeroSlider` + `QuickStats` (koyu banner, slider, ikonlu şerit) · `SectorStrip` ·
`WhyUs` · `ProductionChain` · `CapacityStats` · `FeaturedMenu` · `QuickQuote` · `CtaBand`.
Bölüm sırası `src/app/page.tsx` içinde tasarımdaki akışı izler; tasarımda olmayan
hizmetler/galeri/belgeler/referans/SSS bölümleri alt sayfalara köprü olarak korundu.

Bölüm içerikleri `src/data/home.ts` dosyasında. **⚠️ Oradaki sayısal iddialar
(25K+, 180+, %99.8, 25+ yıl, kapasite paneli) Stitch'in ürettiği yer tutuculardır,
doğrulanmamıştır.** Tasarımdaki uydurma firma adları (TEKNO-SAN, AVRASYA SAĞLIK vb.)
yayınlanmadı; yerine sektör etiketleri kullanıldı — gerçek referanslar gelince değişecek.

Kaldırılan bileşenler: `Stats`, `StatCounter`, `MenuTeaser` (yerlerini `CapacityStats`
ve `FeaturedMenu` aldı); `site.ts` içindeki `stats` alanı `home.ts` → `capacity` oldu.

### Alt sayfalar

Stitch'in diğer ekranları da uygulandı. Menü yapısı korundu (kullanıcı kararı);
tasarımın sayfaları mevcut rotalara eşlendi:

| Stitch ekranı | Rota | Bileşenler |
|---|---|---|
| Hakkımızda | `/hakkimizda` | `sections/about/` — AboutHero, AboutFigures, Philosophy, TeamSection, CertificateHighlights, TastingCta |
| Üretim Tesisimiz & Süreçler | `/uretim` (**yeni**) | `sections/production/` — ProductionHero, Methodology, ServiceModels, HygieneStandards + galeri + QuickQuote |
| Ürün & Menü Kataloğu | `/menu` | `sections/catalog/` — CatalogHero, PackagingStandards, DietitianSupport + MenuWeeks + FeaturedMenu |
| Blog & Bülten | — | Gerçek yazı olmadığı için yapılmadı (kullanıcı kararı) |
| İletişim | `/iletisim` | `sections/contact/` — ContactHero, ContactCards, VisitGuide + QuoteForm + SSS. Tasarım `3552616974497213426` projesinden alındı (B projesinde İletişim ekranı yok); içindeki Bursa adresleri ve `@nazascatering.com.tr` e-postaları **kullanılmadı**, gerçek adres ve `site.ts` kanalları kullanıldı. |

Veri dosyaları: `src/data/about.ts`, `production.ts`, `catalog.ts`.
**⚠️ Hepsinde doğrulanmamış rakamlar TODO ile işaretli** (kuruluş yılı, personel/araç
sayısı, tesis m², kapasite). Tasarımdaki uydurma kişi adları (Nazmiye Aşkan, Selin
Erdem, Kemal Yılmaz, Ahmet Usta) ve üretim izni numarası (TR-34-K-109281)
**yayınlanmadı** — rol kartlarına ve numarasız izin ifadesine çevrildi.

### Menü yapısı

Düz liste sekiz başlığa çıkınca header sıkıştığı için yakın konulu sayfalar
açılır gruplara alındı (`src/data/site.ts` → `mainNav: NavEntry[]`):

- **Çözümlerimiz** → Hizmetlerimiz · Üretim Tesisimiz · Menü & Katalog
- **Kurumsal Güvence** → Belgelerimiz · Galeri

`NavEntry = NavItem | NavGroup`; `isNavGroup()` ayrıştırır, `flatNav` düzleştirilmiş
listeyi verir (footer, 404 ve sitemap onu kullanır).

**Mobil çekmece `createPortal` ile `document.body`'ye render edilir.** Sebep: `<header>`
üzerindeki `backdrop-blur`, CSS'te içindeki `position: fixed` öğeler için yeni bir
konumlama bağlamı yaratıyor; çekmece bu yüzden tüm ekran yerine header'ın 80px'ine
sıkışıyordu. Header'a filtre/transform eklerken bunu unutmayın.

Çekmecede `justify-center` kullanılmaz — uzun listede üst öğeler kaydırılamaz hâle
geliyordu; `flex-1 overflow-y-auto` ile normal kaydırma kullanılır.

Bileşenler: `layout/NavDropdown.tsx` (hover + tıklama + Escape + dışarı tıklama,
`aria-haspopup`/`aria-expanded`), `layout/ContactMenu.tsx` (telefon pill'i +
WhatsApp/e-posta/adres/çalışma saatleri açılır alanı — Stitch'in sağ üstteki
segmented pill grubunun biçim dilinde). Mobil çekmece grupları alt başlıkla gösterir
ve uzun listede kaydırılabilir.

## Varlıklar

`npm run assets` üst klasörden (`../görseller`, `../belgeler`) ve logo ekran görüntüsünden üretir — çıktıların hiçbirini elle düzenlemeyin:

- `public/brand/logo.png` (kahve), `logo-light.png` (krem, koyu zemin için), `og-logo.png`; `src/app/icon.png`, `apple-icon.png`. Logo, ekran görüntüsündeki çerçeve+beyaz boşluk kırpılarak parlaklıktan alfa maskesi çıkarılıp tek renge boyanır.
- `public/gorseller/*.webp` — 20 fotoğraf; `public/video/*.mp4` — 3 video.
- `public/belgeler/*.pdf` + `.webp` önizleme — 11 sertifika.
- `src/data/media.ts` — `photos`, `videos`, `certificates` manifestosu (üretilen dosya).

Sertifika başlıkları PDF'lerin kendisinden okundu (BELCERT): ISO 9001:2015, ISO 22000:2018, Helal (TS OIC/SMIIC 1), GHP, GMP 22716:2007, ISO 45001:2018, ISO 14001:2026, ISO 26000:2021, EN ISO 15593, Gıda Uygunluk (EC 1935/2004), CE Uygunluk Beyanı (GPSR 2023/988). Bunları uydurmayın.

## Yayın hedefi

Alan adı: `biqrmenu.tr.ht` (Node.js desteği yok → statik export).
`nazasyemek.biqrmenu.tr.ht` alt alan adı public DNS'te **yok** (NXDOMAIN);
o adres denendiğinde ZTE modem kendi arayüzünü gösteriyor.

İki derleme hedefi var — `npm run build:root` (kök) ve `npm run build:subdir` (**canlı site bu: https://biqrmenu.tr.ht/out/**, 2026-09-30 — kök derlemesi /out'a yüklenince CSS 404 verdi)
(`/out` alt klasörü, `NEXT_BASE_PATH` ile). Varlık yolları derleme anında gömülür,
yanlış hedefle derlenen paket alt klasörde stilsiz açılır.

**Dikkat:** `images.unoptimized` açıkken Next.js `next/image` src'lerine basePath
uygulamıyor; video/poster/PDF yolları da öyle. Bu yüzden public varlıklarına
`src/lib/asset.ts` → `asset()` üzerinden erişilir ve bileşenler `next/image` yerine
`components/ui/Img.tsx` sarmalayıcısını kullanır.

`build:subdir` site adresini `…/out` yapar (canonical, sitemap, OG doğru) ve derleme sonrası
`scripts/subdir-htaccess.mjs` `out/.htaccess` içindeki `ErrorDocument`'ı `/out/404.html` yapar.
HTTPS yönlendirmesi `%{REQUEST_URI}` kullanır — iki hedefte de doğru.

Sunucu yapılandırması iki formatta üretilir: `public/.htaccess` (Apache/LiteSpeed)
ve `public/_headers` + `public/_redirects` (Cloudflare Pages / Netlify). Hosting
hangisini destekliyorsa onu okur, diğeri görmezden gelinir.

## Ana sayfa katman efekti

Ana sayfadaki her bölüm `ui/StackLayer.tsx` ile sarılır: z-index aşağı doğru azalır,
bölüm görünüme girerken bir üsttekinin yuvarlatılmış alt kenarının altından
`STACK_SHIFT` (180px) kayarak çıkar. Açık bölümler `tone` ile beyaz / kirli beyaz
dönüşümlü (`white`/`off` bölümün kendi zeminini ezer), koyu bölümler `own`. Sektör
şeridi hero ile aynı katmanda — ayrı katmanken yüklemede hero'nun altında gizleniyordu. Aşağıdaki bölümler hep daha çok kaydığı için
aralarda boşluk açılmaz; son bölümle footer arasını `StackFooterFill` doldurur.
Katmanlarda transform olduğundan içerideki `position: fixed` öğeler portal ile
`body`'ye taşınmalı (`Lightbox` öyle). Yeni bölüm eklerken `page.tsx`'teki
`sections` dizisine ekleyin.

WhyUs arka planı `../görseller/Son Fotolar/servicebg.png` → `public/gorseller/bg/servicebg.webp`
(`npm run assets` içindeki `buildBackgrounds`). `/hizmetlerimiz` başlığı `menubg.png` →
`bg/menubg.webp` ile `PageHero tone="dark"` kullanır (hafif bulanık görsel + siyah perde,
yuvarlatılmış alt kenar ve gölge); diğer sayfalar varsayılan `light` tonda.

## Hero slider

`src/data/home.ts` → `heroSlides: HeroSlide[]` (`src`, `caption`, isteğe bağlı `video`).
Sıra: `IMG_7785`, `IMG_7786` (HEIC), `IMG_7745` videosu, `nazas1`, `nazas2`.
`npm run assets` → `buildHeroMedia`: HEIC `sips` ile, MOV (HEVC) macOS `avconvert` ile
H.264 MP4'e çevrilir (ffmpeg yok), poster `qlmanage` küçük resminden. Video slaytı
yalnızca aktifken yüklenip oynar (`HeroSlider.tsx` → `VideoSlide`). Video ~13 MB.
Slogan (H1): "Aş'a Lezzet Katıyoruz." — `site.tagline` ("Aş'a Lezzet Katar") logonun kendi yazısı, ayrı.

Slayt düzeni: masaüstünde görsel hero'nun sağ %68'ini kaplar (`object-cover`, üst/alt/sağ
kenara tam oturur), sol kenarı `mask-image` ile koyu zemine erir; mobilde tüm kutu.
`1.jpeg` (1147px) ve `nazas2.jpeg` (602px) düşük çözünürlüklü — bu boyutta yumuşak görünür.

## Footer geliştirici logosu

Footer alt satırında yalnızca Bilnet Yazılım logosu (metin yok — kullanıcı kararı):
`public/brand/bilnet-yazilim.png`, `npm run assets` → `buildDevLogo` (kaynak
`~/Desktop/Bilnet_Yazilim_Logo 2.png`, kırpılıp 112px = 28px gösterimin 4×'ü).

## Galeri

`npm run assets` → `buildGallery()` → `media.ts` içinde `gallery: GalleryItem[]`
(`type` photo/video, `group`, `src`, `thumb`, boyutlar). Kaynaklar: `Son Fotolar` listesi
(`GALLERY_PHOTOS`, grup ve alt metni elle) + tüm `nazas*` (grubu `PHOTO_META.tag`) + videolar
(`GALLERY_VIDEOS` MOV → `avconvert`, mevcut mp4'ler; poster `qlmanage`).
- Hafif iyileştirme (`enhance`) ve **sağ altta filigran** (`watermark`: `logo-light.png`,
  %10 genişlik, %72 opaklık + gölge) dosyaya işlenir → `public/gorseller/galeri/{,thumb/}`.
  Slider/kartların kullandığı `public/gorseller/*.webp` **filigransız** kalır.
- Videolara filigran işlenemez (ffmpeg yok): kutucukta ve lightbox'ta CSS ile logo gösterilir.
- Gruplar: tesis · mutfak · kumanya · servis · organizasyon · video (`GalleryGrid` → `groupLabels`).
  `GalleryGrid groups={[…]}` önizlemelerde grubu sınırlar (ana sayfa, /uretim).
- `ui/Lightbox.tsx`: fotoğraf + video, sayaç, oklar/klavye/swipe, komşu ön yükleme. Görsel
  kutusu oran ve ekran yüksekliğinden hesaplanır — `w-auto` yüklenmemiş görselde 0 genişlik
  verip ortalamayı bozuyordu, geri getirmeyin.

## Header

Ortada yüzen cam kapsül (`max-w-6xl rounded-full`, `h-[76px]` → kaydırınca `h-16`), logo
`h-16` / `h-12`. Menü öğelerinin ikonları `site.ts` → `NavItem.icon` / `NavGroup.icon`
(lucide); header, açılır menü ve mobil çekmecede gösterilir. Telefon ve CTA
`whitespace-nowrap` — 1024px'te tek satır sığıyor, genişlik değiştirirken ölçün.

## Alt sayfa başlıkları

Tüm alt sayfa başlıkları `lib/hero-shell.ts` → `heroShell` kabuğunu kullanır (beyaz blok,
yuvarlak alt kenar, alttaki bölüme düşen gölge): `PageHero` (light ve dark), `AboutHero`,
`CatalogHero`, `ProductionHero`, `ContactHero`. Başlığın altındaki ilk bölümde `pt-0`
kullanmayın, içerik gölgeye yapışır.

## Kullanım talimatı notları

`sections/UsageNote.tsx` (not kartı + özet) → `ui/Modal.tsx` (ortada pop-up, body'ye portal,
Escape/dışarı tıklama, kaydırma kilidi, odak iadesi). Metinler `data/notes.ts`:
`/menu` → `mealUsageNote`, `/uretim` → `facilityVisitNote`. Genel kurallardır; firmaya özel
rakam eklemeyin.

WhatsApp FAB ve tüm WhatsApp satırları resmi logoyu kullanır (`WhatsAppIcon`, `#25D366`).

## Kaydırma ve sayfa başlıkları

`html { scroll-behavior: smooth }` **bilerek kullanılmıyor**: App Router sayfa
değişiminde yukarı kaydırırken tarayıcı bunu animasyonlu yapıyordu ve yeni sayfa
aşağı kaymış hâlde açılıyordu. Sayfa başına dönüşü `components/ScrollToTop.tsx`
anında yapar (`template.tsx` içinde); adresde hash varsa karışmaz.

Ana sayfa dışındaki tüm sayfaların üst bölümünde `layout/HeroBackdrop.tsx` var:
düşük opaklıkta bir fotoğraf, alta doğru sayfa zeminine eriyen gradyanla. `PageHero`
varsayılan bir görsel kullanır, sayfalar `photo` ile kendi görselini verir.

## Responsive denetimi

Headless Chrome macOS'ta 500px'ten dar pencere açmıyor. Gerçek 390px ölçümü için
sayfayı aynı origin'den bir `<iframe width="390">` içinde açıp
`contentDocument.documentElement.scrollWidth` ölçülür (`out/` altına geçici bir
harness HTML yazıp `--dump-dom` ile okumak yeterli). Son denetim: 10 sayfa ×
390/768/1024 → hepsinde `scrollWidth == viewport`, taşan öğe yok.

Kaydırmalı ekran görüntüsü alırken `--force-prefers-reduced-motion` kullanın:
`Reveal` bileşeni IntersectionObserver'a bağlı ve headless'ta tetiklenmiyor.

## Kurallar

- `src/data/site.ts` içindeki `// TODO` alanları (alan adı, Facebook linki) **gerçek değil**; yenilerini uydurmayın. Gerçek olanlar (2026-09-30, müşteriden): sabit hat 0212 470 16 29, WhatsApp 0543 205 86 86, mobil 0545 470 16 29 (2026-10-01 yer değiştirdi), Instagram/TikTok `nazasyemek`, e-posta info@nazasyemek.com (formlar da buraya gider). Facebook "Naz-Aş Yemek" linki gelene kadar arama URL'si kullanılıyor ve `verified: false` olduğu için JSON-LD `sameAs`'e girmiyor.
- Menü verisi (`src/data/menu.ts`) örnek dört haftalık menüdür; yapı korunarak gerçeğiyle değiştirilecek.
- Animasyonlar `prefers-reduced-motion` altında kapanmalı (globals.css'te tanımlı).
- Tüm ikonlar `lucide-react`. **Tek istisna** sosyal medya marka logoları: `ui/SocialIcons.tsx` (Simple Icons 16.33.0, CC0, resmi renkler) — lucide'de TikTok yok, marka ikonları kaldırıldı.

## Komutlar

```
npm run dev      # geliştirme sunucusu
npm run build    # üretim derlemesi
npm run lint
npm run assets   # varlıkları yeniden üret
```

## Mobil uygulama düzeni + yeni logo (2026-10-01, dal `logo-whatsapp-mobil`)

Masaüstü tasarıma dokunulmadı; yalnızca lg altı değişti. (Tam yeniden tasarım `tasarim-yenileme` dalında, kullanıcı reddetti.)
- Logo: `../görseller/yeni/naz-as_logo_yazisiz.png` → `buildLogo` (+ potrace ile `logo.svg`). Header'da SVG + altında `site.slogan`.
- `layout/MobileTabBar.tsx`: Ana Sayfa · Hizmetler · Teklif Al · WhatsApp · Menü. "Menü" `OPEN_MOBILE_NAV` olayıyla mevcut `MobileNav` çekmecesini açar (header'daki hamburger kaldırıldı). WhatsApp FAB yalnız lg+.
- `mobile-rail` utility (globals.css): md altında kartlar yan yana kayar. Öğede `grid` yerine `md:grid` kullanın, yoksa `grid` ezer. Kart genişliği `[--rail-item:70%]`, üst boşluk `[--rail-pt:1.25rem]`.
- `sections/QuickActions.tsx`: hero altında mobil Ara/WhatsApp/Konum/E-posta.
