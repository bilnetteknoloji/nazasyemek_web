import type { LucideIcon } from "lucide-react";
import { Box, CookingPot, PackageCheck } from "lucide-react";
import { photos } from "./media";

const photo = (name: string) =>
  photos.find((item) => item.src.endsWith(name)) ?? photos[0];

/**
 * Menü / katalog sayfası — yapı ve metinler Stitch tasarımından
 * ("Ürün & Menü Kataloğu | NAZ-AŞ").
 *
 * ⚠️ TODO: Reçete sayısı ve günlük kapasite doğrulanmadı.
 * Tasarımdaki "Kataloğu PDF indir (18 MB)" bağlantısı kaldırıldı —
 * ortada böyle bir katalog dosyası yok. PDF hazırlanınca eklenecek.
 */

export const catalogHero = {
  badge: "Kurumsal Menü Koleksiyonu",
  title: "Kurumsal Ürün & Menü Kataloğumuz",
  description:
    "Fabrikalar, plazalar, hastaneler ve şantiyeler için kalori değerleri hesaplanmış, dört mevsim dönüşümlü yemek çeşitlerimizi inceleyin.",
  /** ⚠️ TODO: rakamlar doğrulanmadı. */
  figures: [
    { value: "4", label: "Haftalık Dönüşüm" },
    { value: "%100", label: "Diyetisyen Onaylı" },
    { value: "25K+", label: "Günlük Kapasite" },
  ],
  photo: photo("nazas11.webp"),
  captionTitle: "Her Tabakta Aynı Standart & Hijyen",
  captionText: "Gıda mühendisleri denetiminde günlük taze hammadde tedariği.",
};

export const packagingStandards: {
  icon: LucideIcon;
  title: string;
  text: string;
  points: string[];
}[] = [
  {
    icon: Box,
    title: "Isı Yalıtımlı Termobox",
    text: "Yüksek yoğunluklu yalıtım gövdesiyle yemekleri dış hava şartlarından izole eder, servis sıcaklığında sabit tutar.",
    points: [
      "Sıcak ve soğuk zincir güvencesi",
      "Titreşime ve çarpmaya dayanıklı",
      "Gıdaya temas onaylı malzeme",
    ],
  },
  {
    icon: CookingPot,
    title: "Paslanmaz Gastronorm Küvetler",
    text: "Paslanmaz çelikten üretilen GN standartlarındaki küvetler, benmari hatları ve yerinde sıcak büfe servisleri için uygundur.",
    points: [
      "Paslanmaz çelik hijyen standardı",
      "Koku ve tat geçişini engeller",
      "Benmari ve fırın uyumlu",
    ],
  },
  {
    icon: PackageCheck,
    title: "Mühürlü Hijyenik Kaplar",
    text: "Şantiye, vardiyalı çalışma merkezleri ve saha personeli için sızdırmaz film kaplamalı, mikrodalga uyumlu tek kullanımlık kaplar.",
    points: [
      "Kabı ilk kez son kullanıcı açar",
      "Geri dönüştürülebilir malzeme",
      "Sıvı dökülmesine karşı emniyet",
    ],
  },
];

export const dietitianSupport = {
  eyebrow: "Kurumsal Diyetisyen Desteği",
  title: "Menüler Çalışma Ortamınıza Göre Şekillenir",
  text: "Masa başı çalışanlar için düşük kalorili ve konsantrasyonu destekleyen öğünler; ağır sanayi ve fabrika personeli için yüksek protein ve enerji dengeli zengin tabaklar hazırlıyoruz.",
  badges: ["ISO 22000 & HACCP", "Helal Gıda Belgeli"],
};
