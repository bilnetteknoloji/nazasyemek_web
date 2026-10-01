import type { LucideIcon } from "lucide-react";
import { Factory, GraduationCap, PackageCheck, PartyPopper, Soup, Truck } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  image: string;
  features: string[];
};

/**
 * Hizmet kapsamı, belgelerdeki faaliyet tanımıyla uyumludur:
 * "dışarıya yemek sunan diğer işletmelerin faaliyetleri (spor, fabrika, işyeri,
 * üniversite vb. mensupları için tabldot servisi dâhil)".
 */
export const services: Service[] = [
  {
    slug: "fabrika-ve-isyeri-yemegi",
    title: "Fabrika ve İşyeri Yemeği",
    short: "Vardiyalı üretim tesisleri ve ofisler için günlük tabldot servisi.",
    description:
      "Vardiya düzeninize göre planlanan, sıcaklık zinciri korunarak taşınan günlük tabldot hizmeti. Dört kap menü, diyet alternatifi ve vardiya saatlerine göre esnek teslim planı sunuyoruz.",
    icon: Factory,
    image: "/gorseller/nazas14.webp",
    features: [
      "Vardiya saatlerine göre teslim planı",
      "Dört kap ana menü + diyet alternatifi",
      "Sıcaklık takipli termobox ile taşıma",
      "Yerinde servis ekibi seçeneği",
    ],
  },
  {
    slug: "okul-ve-universite",
    title: "Okul ve Üniversite",
    short: "Yaş grubuna uygun, dengeli ve diyetisyen onaylı menüler.",
    description:
      "Öğrenci ve akademik personel için yaş grubuna uygun kalori ve besin dengesi gözetilerek hazırlanan menüler. Alerjen bilgilendirmesi ve veli paylaşımına uygun aylık menü listesi.",
    icon: GraduationCap,
    image: "/gorseller/nazas11.webp",
    features: [
      "Diyetisyen onaylı aylık menü",
      "Alerjen bilgilendirmesi",
      "Yaş grubuna göre porsiyonlama",
      "Kantin ve yemekhane işletmeciliği",
    ],
  },
  {
    slug: "kumanya-ve-paket-ogun",
    title: "Kumanya ve Paket Öğün",
    short: "Sahada çalışan ekipler için bölmeli kaplarda hijyenik paket öğün.",
    description:
      "Şantiye, saha ve gece vardiyası ekipleri için tek kullanımlık bölmeli kaplarda hazırlanan, kapatma tarihi ve içerik etiketi bulunan paket öğünler.",
    icon: PackageCheck,
    image: "/gorseller/nazas5.webp",
    features: [
      "Bölmeli, ısıya dayanıklı kaplar",
      "İçerik ve tarih etiketi",
      "Soğuk ve sıcak kumanya seçenekleri",
      "Sabah / öğle / gece vardiyası dağıtımı",
    ],
  },
  {
    slug: "davet-ve-organizasyon",
    title: "Davet ve Organizasyon",
    short: "Kurumsal davet, açılış ve toplantılar için açık büfe servisi.",
    description:
      "Kurumsal davetler, açılışlar, toplantı ve eğitim programları için açık büfe, kokteyl ve coffee break düzeni. Ekipman, servis personeli ve sunum kurgusu dâhil.",
    icon: PartyPopper,
    image: "/gorseller/nazas1.webp",
    features: [
      "Açık büfe ve kokteyl düzeni",
      "Servis personeli ve ekipman",
      "Coffee break ve ikramlık menüler",
      "Mekân keşfi ve kurulum",
    ],
  },
  {
    slug: "yerinde-mutfak-isletmeciligi",
    title: "Yerinde Mutfak İşletmeciliği",
    short: "Kurumunuzun mutfağını ekibimizle birlikte işletiyoruz.",
    description:
      "Mutfağı bulunan kurumlarda üretim, personel, satın alma ve hijyen yönetimini üstlenerek anahtar teslim işletme hizmeti veriyoruz.",
    icon: Soup,
    image: "/gorseller/nazas3.webp",
    features: [
      "Personel ve vardiya yönetimi",
      "Satın alma ve stok kontrolü",
      "HACCP uyumlu hijyen planı",
      "Aylık raporlama",
    ],
  },
  {
    slug: "tasima-ve-lojistik",
    title: "Taşıma ve Lojistik",
    short: "Soğuk/sıcak zincir korunarak zamanında teslimat.",
    description:
      "Gıdaya uygun araç filosu ve sıcaklık takipli ekipmanlarla, üretimden servise kadar zinciri kırmadan teslimat yapıyoruz.",
    icon: Truck,
    image: "/gorseller/naz-as_foto3.webp",
    features: [
      "Gıda taşımaya uygun araçlar",
      "Sıcaklık kayıt formları",
      "Planlı teslim saatleri",
      "İstanbul geneli servis",
    ],
  },
];

export const processSteps = [
  {
    title: "Keşif ve ihtiyaç analizi",
    text: "Öğün sayısı, vardiya düzeni, mekân ve bütçe birlikte değerlendirilir.",
  },
  {
    title: "Menü ve teklif",
    text: "Diyetisyen desteğiyle hazırlanan örnek menü ve şeffaf fiyat teklifi sunulur.",
  },
  {
    title: "Deneme servisi",
    text: "Sözleşme öncesi tadım ve deneme servisi ile beklentiler netleştirilir.",
  },
  {
    title: "Üretim ve teslimat",
    text: "ISO 22000 ve HACCP kurallarına uygun üretim, planlı saatlerde teslimat.",
  },
  {
    title: "Takip ve raporlama",
    text: "Memnuniyet ölçümü, numune saklama ve aylık raporlarla süreç izlenir.",
  },
];
