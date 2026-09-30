import type { LucideIcon } from "lucide-react";
import {
  Beaker,
  ClipboardCheck,
  CookingPot,
  Microscope,
  Package,
  ShieldCheck,
  Snowflake,
  Truck,
  Wind,
} from "lucide-react";
import { photos } from "./media";

const photo = (name: string) =>
  photos.find((item) => item.src.endsWith(name)) ?? photos[0];

/**
 * Üretim sayfası — yapı ve metinler Stitch tasarımından
 * ("Üretim Tesisimiz & Süreçler | NAZ-AŞ").
 *
 * ⚠️ TODO: Tesis alanı, günlük kapasite ve kurum sayısı doğrulanmadı.
 * Tasarımdaki üretim izni numarası (TR-34-K-109281) uydurmadır — yayınlanmadı.
 */

export const productionHero = {
  badge: "Entegre Üretim Tesisi", // TODO: gerçek m² bilgisi gelince "… m² entegre üretim kampüsü"
  title: "Teknoloji, Ustalık ve Hijyenin Buluştuğu Entegre Tesisimiz",
  description:
    "Gıda mühendislerimizin denetiminde, güncel pişirme üniteleri ve steril ortamda günlük taze üretim gerçekleştiriyoruz.",
  /** ⚠️ TODO: rakamlar doğrulanmadı. */
  figures: [
    { value: "25.000+", label: "Günlük Kapasite" },
    { value: "65 °C+", label: "Termobox Dağıtım" },
    { value: "%100", label: "Laboratuvar Onayı" },
  ],
  photo: photo("nazas10.webp"),
  overlayTitle: "ISO 22000 & HACCP",
  overlayText: "Tam steril, kontrollü mutfak koridoru.",
};

export const methodology: {
  step: string;
  icon: LucideIcon;
  title: string;
  text: string;
  controlLabel: string;
  controlValue: string;
}[] = [
  {
    step: "1",
    icon: Microscope,
    title: "Hammadde Kabulü & Laboratuvar",
    text: "Taze sebze, sertifikalı et ve birinci sınıf bakliyatların mikrobiyolojik ve duyusal testleri kabul anında yapılır.",
    controlLabel: "Kontrol noktası",
    controlValue: "Tazelik & kalıntı analizi",
  },
  {
    step: "2",
    icon: Snowflake,
    title: "Soğuk Depolama & Ön Hazırlık",
    text: "Ozonlu yıkama havuzlarında sebze dezenfeksiyonu ve kontrollü dinlendirme odalarında marinasyon.",
    controlLabel: "Depo rejimi",
    controlValue: "0 °C – +4 °C soğuk zincir",
  },
  {
    step: "3",
    icon: CookingPot,
    title: "Buharlı & Endüstriyel Pişirme",
    text: "Isı ve pişme süresi dijital sensörlerle izlenen paslanmaz devirme kazanlarda, besin değeri korunarak pişirme.",
    controlLabel: "Isıl işlem",
    controlValue: "Çekirdek sıcaklık takibi",
  },
  {
    step: "4",
    icon: Package,
    title: "Porsiyonlama & Termobox",
    text: "El değmeden steril koşullarda gastronorm küvetlere aktarım ve ısı yalıtımlı termobox kaplara kilitli yerleşim.",
    controlLabel: "Paketleme",
    controlValue: "Sızdırmaz contalama",
  },
  {
    step: "5",
    icon: Truck,
    title: "Takipli Frigorifik Dağıtım",
    text: "Isı izolasyonlu araçlarımızla rotası planlanmış teslimat ve teslim anında sıcaklık ölçümü.",
    controlLabel: "Servis sıcaklığı",
    controlValue: "Min. 65 °C sabit sıcaklık",
  },
];

export const hygieneStandards: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Wind,
    title: "Kontrollü Havalandırma",
    text: "Üretim koridorlarımızda dışarıdan toz ve mikroorganizma girişini engelleyen filtreli havalandırma uygulanır.",
  },
  {
    icon: Beaker,
    title: "Günlük Şahit Numune Saklama",
    text: "Üretilen her partiden alınan yemek numuneleri, steril kaplarda 72 saat boyunca saklanır.",
  },
  {
    icon: ShieldCheck,
    title: "Personel Hijyen Bariyerleri",
    text: "Mutfak sahasına girişler el ve ayakkabı dezenfeksiyon istasyonları ile bone-maske bariyerlerinden geçer.",
  },
  {
    icon: ClipboardCheck,
    title: "Düzenli Mikrobiyolojik Testler",
    text: "Ekipman, tezgâh yüzeyleri ve personel ellerinden periyodik swab testleri alınarak akredite laboratuvarlarda taranır.",
  },
];

/** ⚠️ TODO: Gerçek üretim izni numarası müşteriden alınıp eklenecek. */
export const productionLicense = {
  authority: "T.C. Tarım ve Orman Bakanlığı",
  text: "Gıda üretim izni ve düzenli resmî gıda denetimi kapsamındayız.",
};
