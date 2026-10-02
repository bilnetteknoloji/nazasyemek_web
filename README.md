# NAZ-AŞ Yemek — Kurumsal Web Sitesi

Toplu yemek / catering firması **NAZ-AŞ YEMEK** (Mahmutbey Mah. Kültür Cad. No: 25/A, Bağcılar / İstanbul) için kurumsal web sitesi. İçerik dili Türkçe.

**Yığın:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · lucide-react · motion · embla-carousel · react-hook-form + zod

## Komutlar

```bash
npm install
npm run dev      # geliştirme sunucusu → http://localhost:3000
npm run build    # üretim derlemesi
npm run start    # derlenmiş sürümü çalıştırır
npm run lint
npm run assets   # görsel/belge varlıklarını yeniden üretir
```

## Ortam değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyalayın. Hepsi **derleme anında** gömülür —
değiştirdikten sonra yeniden derlemek gerekir.

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Evet | Sitenin tam adresi (sonda `/` yok). canonical, `sitemap.xml`, `robots.txt` ve Open Graph adresleri buradan üretilir. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Form çalışsın diye evet | Teklif formunun POST edeceği harici servis adresi. Boşsa form gönderim yapmaz, ziyaretçiye telefon ve e-posta gösterir. |
| `NEXT_PUBLIC_FORM_KEY` | Servise göre | Web3Forms `access_key`. Formspree'de gerekmez. |

## Yayınlama — nazasyemek.com (Node.js)

Canlı site **https://nazasyemek.com**. Hosting GitHub'daki `main` dalını çeker ve
şunları çalıştırır:

```bash
npm install
npm run build   # next build --webpack (Turbopack hosting'de port açamıyor)
npm start
```

## Yayınlama — statik hosting (isteğe bağlı)

Node.js çalıştırmayan paylaşımlı hosting için statik çıktı (`STATIC_EXPORT=1`,
`output: "export"`) da üretilebilir:

```bash
npm run build:root      # site kökte açılacaksa:       https://biqrmenu.tr.ht/
npm run build:subdir    # site alt klasörde açılacaksa: https://biqrmenu.tr.ht/out/
```

`out/` klasörü oluşur (~24 MB) ve **yüklenecek olan bu klasörün içeriğidir.**

**Kök mü, alt klasör mü?** Varlık yolları (`/_next/...`, görseller, PDF'ler)
derleme anında gömülür. Kök için derlenen paketi alt klasöre koyarsanız CSS, JS ve
görseller 404 verir; sayfa stilsiz açılır. Alt klasör kullanacaksanız mutlaka
`build:subdir` ile derleyin — klasör adı `/out` değilse `NEXT_BASE_PATH=/klasoradi`
verin. Kök tercih edilir: adresler temiz olur, bu sorun hiç çıkmaz.

Gizli `.htaccess` dosyasının da kopyalandığından emin olun (FTP istemcilerinde
"gizli dosyaları göster" seçeneği açık olmalı).

Sunucu yapılandırması iki formatta birlikte üretilir, hosting hangisini
destekliyorsa onu kullanır:

- **`.htaccess`** — Apache / LiteSpeed (cPanel, Plesk, klasik paylaşımlı hosting):
  404 sayfası, güvenlik başlıkları, HTTPS yönlendirmesi, önbellek ve sıkıştırma,
  klasör listelemenin kapatılması, Open Graph görselinin MIME tipi.
- **`_headers` + `_redirects`** — Cloudflare Pages / Netlify: aynı güvenlik
  başlıkları, `_next/static` için kalıcı önbellek, Open Graph MIME düzeltmesi.
  (404 için `404.html` otomatik kullanılır.)

`.htaccess` gizli dosyadır; FTP istemcisinde "gizli dosyaları göster" açık olmalı.

### Statik yayının sınırları

- **Sunucu tarafı rota yok.** Teklif formu `NEXT_PUBLIC_FORM_ENDPOINT` ile harici
  bir servise gönderir. Ayarlanmazsa form veri göndermez.
- **`next/image` optimizasyonu kapalı** (`unoptimized`). Görseller varlık boru
  hattında zaten webp'ye çevrildiği için sorun değil.

### Node.js'li ortama geçilirse

`next.config.ts` içinde `output` değerini `"standalone"` yapın, `trailingSlash` ve
`images.unoptimized` satırlarını kaldırın, `src/app/api/teklif/route.ts` dosyasını
git geçmişinden geri alın. O zaman form kendi sunucunuza gönderim yapabilir.

## Varlıklar

`npm run assets` üst klasörden (`../görseller`, `../belgeler`) ve logo ekran görüntüsünden üretir. **Üretilen çıktılar elle düzenlenmez:** `public/brand/`, `public/gorseller/`, `public/video/`, `public/belgeler/`, `src/data/media.ts`.
