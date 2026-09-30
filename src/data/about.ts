import type { LucideIcon } from "lucide-react";
import {
  Beaker,
  Building2,
  ClipboardCheck,
  CookingPot,
  Factory,
  Handshake,
  HeartPulse,
  Leaf,
  Recycle,
  Salad,
  ShieldCheck,
  Sparkles,
  Target,
  Thermometer,
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { photos } from "./media";

const photo = (name: string) =>
  photos.find((item) => item.src.endsWith(name)) ?? photos[0];

/**
 * Hakkımızda sayfası — yapı ve metinler Stitch tasarımından
 * ("Hakkımızda | NAZ-AŞ Toplu Yemek Hizmetleri").
 *
 * ⚠️ TODO: Kuruluş yılı, personel sayısı, tesis alanı, araç sayısı ve müşteri
 * sayısı Stitch'in ürettiği yer tutuculardır — doğrulanmadı.
 * Tasarımdaki kişi isimleri (uydurma) yayınlanmadı; rol kartlarına çevrildi.
 */

export const aboutHero = {
  badge: "Kurumsal Güven", // TODO: "1998'den günümüze" gibi bir ifade ancak gerçek kuruluş yılıyla
  titleLead: "Kurumsal Mutfak Kültürü,",
  titleAccent: "Yenilikçi Kurumsal",
  titleTail: "Çözümler.",
  description:
    "Temel ilkemiz; kaliteli malzemeleri hijyen ve özenle harmanlayarak çalışanlarınıza her öğünde sıcacık ev yemeği lezzetini sunmaktır.",
  chips: [
    { icon: UtensilsCrossed, label: "Yüksek kapasiteli günlük üretim" },
    { icon: ShieldCheck, label: "ISO 22000 & Helal Belgeli" },
    { icon: Truck, label: "Termobox frigo lojistik" },
  ] as { icon: LucideIcon; label: string }[],
  photo: photo("nazas9.webp"),
  captionTitle: "Kazanlarda Kaynayan Ustalık",
  captionEyebrow: "Endüstriyel Hijyen Standartları",
  captionText:
    "Gıda mühendisleri ve baş aşçılarımızın kontrolünde her reçete gramaj ve lezzet dengesiyle hazırlanır.",
};

/** ⚠️ TODO: rakamlar doğrulanmadı. */
export const aboutFigures: {
  icon: LucideIcon;
  value: string;
  unit?: string;
  label: string;
  note: string;
}[] = [
  {
    icon: Users,
    value: "120",
    unit: "+",
    label: "Uzman Personel",
    note: "Aşçılar, gıda mühendisleri ve diyetisyenler",
  },
  {
    icon: Factory,
    value: "3.500",
    unit: "m²",
    label: "Kapalı Üretim Alanı",
    note: "Hijyenik zeminli yüksek kapasiteli entegre tesis",
  },
  {
    icon: Truck,
    value: "40",
    unit: "+",
    label: "Frigorifik Dağıtım Aracı",
    note: "Sıcak ve soğuk zinciri koruyan filo",
  },
  {
    icon: Building2,
    value: "180",
    unit: "+",
    label: "Kurumsal Müşteri",
    note: "Sanayi tesisi, teknopark ve eğitim kampüsü",
  },
];

export const philosophy: {
  icon: LucideIcon;
  step: string;
  title: string;
  text: string;
  tagIcon: LucideIcon;
  tag: string;
  list?: { label: string; text: string }[];
}[] = [
  {
    icon: Target,
    step: "01 / Misyonumuz",
    title: "Güven ve Denge Sofrada Başlar",
    text: "Sağlıklı, lezzetli ve dengeli yemek üretiminde sektörün en güvenilen kurumsal çözüm ortağı olmak; her gün binlerce çalışanın damak tadına ve beden sağlığına katkı sağlamak.",
    tagIcon: Salad,
    tag: "Kişiye ve işe uygun kalori planı",
  },
  {
    icon: Leaf,
    step: "02 / Vizyonumuz",
    title: "Sürdürülebilir Gastronomi Modeli",
    text: "Teknoloji ve gastronomi uzmanlığını birleştirerek sıfır atık, dijital izlenebilirlik ve sürdürülebilir ekolojik catering standartlarını inşa etmek.",
    tagIcon: Recycle,
    tag: "Sıfır atık yaklaşımı",
  },
  {
    icon: Handshake,
    step: "03 / Değerlerimiz",
    title: "Ödünsüz Dört Temel Kural",
    text: "",
    tagIcon: ShieldCheck,
    tag: "Memnuniyet ilkesi",
    list: [
      { label: "Şeffaflık", text: "Denetlenebilir mutfak ve laboratuvar analizleri." },
      { label: "Koşulsuz Hijyen", text: "Kritik kontrol noktalarında kesintisiz HACCP takibi." },
      { label: "Yerel Üretici", text: "Mevsiminde, taze ve yerli üreticiden doğrudan tedarik." },
      { label: "Müşteri Odaklılık", text: "Kurum kültürüne özel esnek reçete ve menüler." },
    ],
  },
];

/**
 * ⚠️ Stitch tasarımında uydurma kişi adları vardı (Nazmiye Aşkan, Uzm. Dyt.
 * Selin Erdem, Kemal Yılmaz, Ahmet Usta). Var olmayan kişileri ekip olarak
 * yayınlamak yanıltıcı olacağından rol kartlarına çevrildi.
 * TODO: Gerçek ekip bilgisi gelince ad, unvan ve fotoğraf eklenecek.
 */
export const teamRoles: {
  icon: LucideIcon;
  credential: string;
  role: string;
  text: string;
  tagIcon: LucideIcon;
  tag: string;
}[] = [
  {
    icon: Building2,
    credential: "Kurumsal Yönetim",
    role: "Genel Müdürlük",
    text: "Geleneksel Türk aile mutfağı ruhunu modern kurumsal gıda yönetimine entegre ederek şirket vizyonunu yönetir.",
    tagIcon: Building2,
    tag: "Kurumsal strateji",
  },
  {
    icon: HeartPulse,
    credential: "Beslenme & Diyetetik",
    role: "Baş Diyetisyen & Menü Direktörü",
    text: "Mavi yaka ve beyaz yaka çalışanların günlük efor ve kalori gereksinimlerine göre makro-mikro dengeli aylık menüler tasarlar.",
    tagIcon: Salad,
    tag: "Özel diyet planları",
  },
  {
    icon: Beaker,
    credential: "HACCP & ISO Denetimi",
    role: "Kalite ve Gıda Güvencesi Direktörü",
    text: "Hammadde kabulünden tüketim noktasına kadar mikrobiyolojik ve duyusal test kontrollerini koordine eder.",
    tagIcon: ClipboardCheck,
    tag: "72 saat şahit numune takibi",
  },
  {
    icon: CookingPot,
    credential: "Mutfak Ekolü",
    role: "Baş Aşçı",
    text: "Geleneksel tencere yemeklerini endüstriyel boyutta tazeliğini ve lezzetini kaybetmeden sunar.",
    tagIcon: CookingPot,
    tag: "Tencere ve fırın ustalığı",
  },
];

export const kitchenDiscipline = {
  eyebrow: "Gerçek Mutfak Dinamiği",
  title: "Her Porsiyonun Arkasındaki Titiz İşçilik",
  text: "Tesislerimizde şeffaflık bir pazarlama sloganı değil, günlük iş disiplinidir. Sebzelerimiz ozonlu suyla yıkanır, etlerimiz soğuk zincir bozulmadan işlenir, fırınlarımız konveksiyonel buhar dengesiyle pişirir.",
  points: [
    { icon: Thermometer, text: "Termometrik kayıt cihazlarıyla anlık ısı kontrolü" },
    { icon: Sparkles, text: "Hijyen bariyerinden geçişli steril üretim sahaları" },
    { icon: Beaker, text: "Akredite laboratuvar onaylı periyodik mikrobiyoloji testleri" },
  ] as { icon: LucideIcon; text: string }[],
  photo: photo("nazas3.webp"),
};

export const tastingCta = {
  eyebrow: "Ücretsiz Tadım Menüsü",
  title: "Şirketiniz İçin Özel Aş'ımızı Tatmaya Davetlisiniz.",
  text: "Mevcut yemek hizmetinizden memnun değil misiniz? Kurumunuza özel hazırlayacağımız dört kap sıcak numune menümüzü ücretsiz test edin; lezzet ve hijyen farkını yerinde görün.",
};
