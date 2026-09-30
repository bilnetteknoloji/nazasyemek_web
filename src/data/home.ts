import type { LucideIcon } from "lucide-react";
import {
  Award,
  Building2,
  ChefHat,
  CookingPot,
  Factory,
  GraduationCap,
  HeartPulse,
  Leaf,
  Salad,
  ShieldCheck,
  Snowflake,
  Thermometer,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { photos } from "./media";

const photo = (name: string) =>
  photos.find((item) => item.src.endsWith(name)) ?? photos[0];

/**
 * Ana sayfa bölümleri — yapı ve metinler Google Stitch tasarımından alındı
 * ("Kurumsal Yemek Hizmetleri Web Sitesi" → "NAZ-AŞ | Ana Sayfa").
 *
 * ⚠️ TODO: Aşağıdaki SAYISAL İDDİALAR ve REFERANS ADLARI Stitch'in ürettiği
 * yer tutuculardır, doğrulanmamıştır. Yayına almadan önce müşteriden gelen
 * gerçek değerlerle değiştirilmeli (aşağıdaki `capacity` ve `quickStats` alanları).
 */

/* --- Hero --- */

export type HeroSlide = {
  /** Görsel slaytta fotoğraf, video slaytında poster. */
  src: string;
  caption: string;
  video?: string;
};

/** Kullanıcının verdiği sıra: iki mutfak fotoğrafı, video, iki servis fotoğrafı. */
export const heroSlides: HeroSlide[] = [
  { src: "/gorseller/hero/IMG_7785.webp", caption: "Endüstriyel üretim mutfağımız" },
  { src: "/gorseller/hero/IMG_7786.webp", caption: "Pişirme hattımız" },
  {
    src: "/gorseller/hero/hero-7745-poster.webp",
    video: "/video/hero-7745.mp4",
    caption: "Porsiyonlanmış öğün kapları",
  },
  { src: photo("nazas1.webp").src, caption: "Kurumsal açık büfe ve toplu yemek servisi" },
  { src: photo("nazas2.webp").src, caption: "Sıcak yemek servisi" },
];

export const heroBadge = "ISO 22000 & Helal Sertifikalı • %100 Yerli ve Taze Hammadde";

/** ⚠️ TODO: rakamlar doğrulanmadı. */
export const quickStats: {
  icon: LucideIcon;
  value: string;
  label: string;
  tone: "brand" | "sage";
}[] = [
  { icon: UtensilsCrossed, value: "25K+", label: "Günlük Sıcak Menü", tone: "brand" },
  { icon: Building2, value: "180+", label: "Kurumsal İş Ortağı", tone: "sage" },
  { icon: ShieldCheck, value: "%99.8", label: "Memnuniyet Oranı", tone: "brand" },
  { icon: Award, value: "25+ Yıl", label: "Usta Mutfak Tecrübesi", tone: "sage" },
];

/* --- Sektör şeridi --- */

/**
 * ⚠️ TODO: Stitch tasarımında uydurma firma adları vardı (TEKNO-SAN, AVRASYA
 * SAĞLIK vb.). Var olmayan müşteri adı yayınlamak yanıltıcı olacağından
 * sektör etiketleriyle değiştirildi. Gerçek referanslar gelince buraya yazılır.
 */
export const sectors: { icon: LucideIcon; label: string }[] = [
  { icon: Factory, label: "SANAYİ & ÜRETİM" },
  { icon: HeartPulse, label: "SAĞLIK KURUMLARI" },
  { icon: GraduationCap, label: "EĞİTİM KAMPÜSLERİ" },
  { icon: Building2, label: "KURUMSAL OFİSLER" },
  { icon: Truck, label: "LOJİSTİK & DEPO" },
];

/* --- Neden NAZ-AŞ --- */

export const advantages: {
  icon: LucideIcon;
  title: string;
  text: string;
  linkLabel: string;
  href: string;
  tone: "brand" | "sage";
}[] = [
  {
    icon: ShieldCheck,
    title: "Üst Düzey Hijyen & Gıda Güvenliği",
    text: "ISO 22000 ve HACCP standartlarında paslanmaz çelik üretim hattı. Bağımsız akredite laboratuvarlarda periyodik numune analizleri ve mikrobiyolojik kontroller.",
    linkLabel: "Sertifikasyonları Gör",
    href: "/belgelerimiz",
    tone: "brand",
  },
  {
    icon: ChefHat,
    title: "Usta Şef Deneyimi",
    text: "Geleneksel Türk ve dünya mutfağının seçkin reçeteleri. Fabrikasyon lezzetlerden uzak, taze kemik suları ve doğal baharatlarla zenginleştirilmiş ev yemeği sıcaklığı.",
    linkLabel: "Mutfak Kadromuz",
    href: "/hakkimizda",
    tone: "sage",
  },
  {
    icon: Salad,
    title: "Diyetisyen Kontrollü Dengeli Kalori",
    text: "Çalışan profilinize, efor derecelerine ve mevsim döngülerine özel beslenme planları. Ağır sanayi, ofis ve vardiyalı ekiplere hassas kalori ve makro dağılımı.",
    linkLabel: "Örnek Menüleri İncele",
    href: "/menu",
    tone: "brand",
  },
];

/* --- Üretim zinciri --- */

export const productionChain: {
  step: string;
  tag: string;
  tagTone: "sage" | "brand";
  title: string;
  text: string;
  footnoteIcon: LucideIcon;
  footnote: string;
  photo: (typeof photos)[number];
}[] = [
  {
    step: "01",
    tag: "Tazelik Garantisi",
    tagTone: "sage",
    title: "Sözleşmeli Üreticilerden Taze Hammadde Kabulü",
    text: "Her sabah sertifikalı üreticilerden gelen sebze, et ve bakliyatlar gıda mühendislerimizce organoleptik ve laboratuvar testlerinden geçirilerek depolara alınır.",
    footnoteIcon: Leaf,
    footnote: "Sıfır donuk ürün, günlük tedarik",
    photo: photo("nazas16.webp"),
  },
  {
    step: "02",
    tag: "Otomasyon & Hijyen",
    tagTone: "brand",
    title: "El Değmeden Hijyenik Pişirme & Şoklama",
    text: "Kazanlarımızda buharlı ve konveksiyonel pişirme teknikleriyle besin değerleri korunur. Pişirme sonrası sıcaklık kritik noktalarda izlenir ve kayıt altına alınır.",
    footnoteIcon: Thermometer,
    footnote: "+65 °C ve üzeri porsiyonlama güvenliği",
    photo: photo("nazas10.webp"),
  },
  {
    step: "03",
    tag: "Dakik Lojistik",
    tagTone: "sage",
    title: "Isı Yalıtımlı Termobox Araçlarla Dakik Sevkiyat",
    text: "Özel yalıtımlı termobox kaplar ve sıcaklık takipli araçlarımızla yemekler kurumunuza tam vaktinde ve sofraya hazır sıcaklıkta teslim edilir.",
    footnoteIcon: Snowflake,
    footnote: "Kırılmayan soğuk/sıcak zincir",
    photo: photo("nazas12.webp"),
  },
];

/* --- Kapasite --- */

/** ⚠️ TODO: rakamlar doğrulanmadı. */
export const capacity: {
  label: string;
  value: string;
  plus?: string;
  note: string;
  tone: "brand" | "sage" | "container" | "ink";
}[] = [
  {
    label: "Kapasite",
    value: "25.000",
    plus: "+",
    note: "Günlük sıcak ve paketli tabak üretimi",
    tone: "brand",
  },
  {
    label: "Portföy",
    value: "180",
    plus: "+",
    note: "Fabrika, hastane ve eğitim kampüsü",
    tone: "sage",
  },
  {
    label: "Deneyim",
    value: "25",
    plus: "+",
    note: "Yıllık kurumsal catering sektör tecrübesi",
    tone: "container",
  },
  {
    label: "Güven Endeksi",
    value: "%99.8",
    note: "Düzenli müşteri memnuniyeti ve denetim skoru",
    tone: "ink",
  },
];

/* --- Günün menüsü kartları --- */

export const featuredDishes: {
  badge: string;
  calories: string;
  category: string;
  title: string;
  text: string;
  tagIcon: LucideIcon;
  tag: string;
  note: string;
  photo: (typeof photos)[number];
}[] = [
  {
    badge: "Şefin Tavsiyesi",
    calories: "620 kcal",
    category: "Geleneksel Tencere",
    title: "Hünkar Beğendi & Pilav",
    text: "Köz patlıcan yatağında lokum kıvamında dana eti.",
    tagIcon: ShieldCheck,
    tag: "Helal Et",
    note: "Günlük menüde",
    photo: photo("nazas8.webp"),
  },
  {
    badge: "Fit & Hafif",
    calories: "410 kcal",
    category: "Zeytinyağlılar",
    title: "Ege Usulü Taze Fasulye & Yoğurt",
    text: "Sızma zeytinyağı ile kısık ateşte demlenmiş lezzet.",
    tagIcon: Leaf,
    tag: "Vejetaryen",
    note: "Diyetisyen onaylı",
    photo: photo("nazas16.webp"),
  },
  {
    badge: "Yüksek Protein",
    calories: "690 kcal",
    category: "Izgara Grubu",
    title: "Kasap Köfte & Fırın Patates",
    text: "Özel baharat harmanlı köfte, közlenmiş biber eşliğinde.",
    tagIcon: CookingPot,
    tag: "Yerli besi",
    note: "Vardiya dostu",
    photo: photo("nazas17.webp"),
  },
  {
    badge: "Geleneksel Tat",
    calories: "280 kcal",
    category: "Tatlı & Kapanış",
    title: "Fırın Sütlaç & Fındık İçi",
    text: "Günlük doğal sütten fırınlanmış karamelize sütlü tatlı.",
    tagIcon: Salad,
    tag: "Doğal şeker",
    note: "Taze üretim",
    photo: photo("nazas19.webp"),
  },
];

/* --- Hızlı ön hesaplama --- */

export const portionRanges = ["10 – 20", "20 – 50", "50 – 100", "100 – 200"];

export const serviceModes: { icon: LucideIcon; label: string }[] = [
  { icon: Truck, label: "Taşımalı Yemek" },
  { icon: CookingPot, label: "Yerinde Mutfak" },
];

export const quickQuotePoints = [
  "Termobox taşımalı veya yerinde mutfak kurulum opsiyonu",
  "Vardiyalı ve gece mesaisi sıcak servis desteği",
  "Ücretsiz bir haftalık tadım ve deneme menüsü",
];
