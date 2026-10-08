import "server-only";

import { cache } from "react";
import {
  advantages,
  featuredDishes,
  heroBadge,
  heroSlides,
  productionChain,
  sectors,
} from "@/data/home";
import { photos } from "@/data/media";
import { createPublicClient } from "@/lib/supabase/public";
import {
  homeSections,
  mergeSection,
  settingKey,
  type SectionItem,
  type SectionValue,
} from "./home-sections";
import { TAGS } from "./tags";

const photo = (name: string) => (photos.find((item) => item.src.endsWith(name)) ?? photos[0]).src;

/** Panelde kayıt yokken sitede görünen içerik (tasarımdaki metinler). */
export const homeDefaults: Record<string, SectionValue> = {
  hero: {
    badge: heroBadge,
    title: "Aş'a *Lezzet* Katıyoruz.",
    lead: "Modern endüstriyel mutfaklarımız, usta aşçılarımız ve hijyen sertifikalı süreçlerimizle kurumlara sıcak, sağlıklı ve dengeli yemek üretiyoruz.",
    slides: heroSlides.map((slide) => ({
      src: slide.src,
      caption: slide.caption,
      ...(slide.video ? { video: slide.video } : {}),
    })),
  },
  sectors: {
    eyebrow: "Güvenilir Çözüm Ortağı",
    title: "Organize Sanayi & Kurumsal Hizmet Alanlarımız",
    items: sectors.map((sector) => ({ label: sector.label })),
  },
  why: {
    eyebrow: "Kurumsal Avantajlarımız",
    title: "Neden NAZ-AŞ Toplu Yemek Hizmetleri?",
    description:
      "Yüksek kapasiteli endüstriyel üretimimizi zanaatkâr mutfak özeni ve sıkı denetim süreçleriyle buluşturuyoruz.",
    background: "/gorseller/bg/servicebg.webp",
    cards: advantages.map(({ title, text, linkLabel }) => ({ title, text, linkLabel })),
  },
  chain: {
    eyebrow: "Mükemmeliyet Zinciri",
    title: "Tarladan Sofraya 3 Aşamalı Üretim Süreci",
    description:
      "Her porsiyon yemeğin ardında tavizsiz soğuk zincir koruması ve sıcaklık takip kayıtları bulunur.",
    steps: productionChain.map(({ tag, title, text, footnote, photo }) => ({
      photo: photo.src,
      tag,
      title,
      text,
      footnote,
    })),
  },
  menu: {
    eyebrow: "Sofralardan Kareler",
    title: "Usta Ellerden Günlük Menü Çeşitliliği",
    description:
      "Her tabakta taze sebzeler, dengeli protein kaynakları ve Türk mutfağının lezzet mirasından izler taşıyoruz.",
    dishes: featuredDishes.map(({ photo, title, text, category, badge, calories, tag, note }) => ({
      photo: photo.src,
      title,
      text,
      category,
      badge,
      calories,
      tag,
      note,
    })),
  },
  about: {
    eyebrow: "Hakkımızda",
    title: "Mutfağımızda hazırlanan her öğün, belgeli bir sürecin sonucu",
    text: "Bağcılar'daki endüstriyel mutfağımızda, gıda güvenliği yönetim sistemimize uygun olarak günlük üretim yapıyoruz. Hammadde kabulünden servise kadar her aşama kayıt altında tutulur; sıcaklık, hijyen ve porsiyon kontrolleri düzenli olarak yapılır.",
    photo: photo("nazas3.webp"),
    photoSmall: photo("nazas9.webp"),
    highlights: [
      "ISO 22000 ve HACCP kurallarına göre üretim",
      "Her öğünden 72 saat şahit numune",
      "Diyetisyen desteğiyle hazırlanan aylık menüler",
      "Sıcaklık takipli, planlı teslimat",
    ].map((text) => ({ text })),
  },
  cta: {
    title: "Kurumunuz için örnek menü ve fiyat teklifi hazırlayalım",
    text: "Öğün sayınızı ve vardiya düzeninizi paylaşın; bir iş günü içinde dönüş yapalım, dilerseniz deneme servisi planlayalım.",
  },
};

/** Kayıtlı `home.*` satırları (anahtar → değer). Supabase yoksa boş. */
export async function readHomeRows(): Promise<Map<string, unknown>> {
  const supabase = createPublicClient([TAGS.settings]);
  if (!supabase) return new Map();
  const { data, error } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", homeSections.map((section) => settingKey(section.key)));
  if (error) {
    console.error("[ana sayfa] okunamadı", error.message);
    return new Map();
  }
  return new Map((data ?? []).map((row) => [String(row.key), row.value]));
}

export function mergeHome(rows: Map<string, unknown>) {
  return Object.fromEntries(
    homeSections.map((def) => [
      def.key,
      mergeSection(def, homeDefaults[def.key], rows.get(settingKey(def.key))),
    ]),
  ) as Record<string, SectionValue>;
}

const text = (value: SectionValue, name: string) => String(value[name] ?? "");
const items = (value: SectionValue, name: string) => (value[name] as SectionItem[] | undefined) ?? [];

/** Sitedeki ana sayfa içeriği: panelde kayıt varsa o, yoksa varsayılan. */
export const getHome = cache(async () => {
  const home = mergeHome(await readHomeRows());
  const section = (key: string) => home[key];
  return {
    hero: {
      badge: text(section("hero"), "badge"),
      title: text(section("hero"), "title"),
      lead: text(section("hero"), "lead"),
      slides: items(section("hero"), "slides").map((slide) => ({
        src: slide.src,
        caption: slide.caption ?? "",
        ...(slide.video ? { video: slide.video } : {}),
      })),
    },
    sectors: {
      eyebrow: text(section("sectors"), "eyebrow"),
      title: text(section("sectors"), "title"),
      items: items(section("sectors"), "items").map((item) => item.label),
    },
    why: {
      eyebrow: text(section("why"), "eyebrow"),
      title: text(section("why"), "title"),
      description: text(section("why"), "description"),
      background: text(section("why"), "background"),
      cards: items(section("why"), "cards"),
    },
    chain: {
      eyebrow: text(section("chain"), "eyebrow"),
      title: text(section("chain"), "title"),
      description: text(section("chain"), "description"),
      steps: items(section("chain"), "steps"),
    },
    menu: {
      eyebrow: text(section("menu"), "eyebrow"),
      title: text(section("menu"), "title"),
      description: text(section("menu"), "description"),
      dishes: items(section("menu"), "dishes"),
    },
    about: {
      eyebrow: text(section("about"), "eyebrow"),
      title: text(section("about"), "title"),
      text: text(section("about"), "text"),
      photo: text(section("about"), "photo"),
      photoSmall: text(section("about"), "photoSmall"),
      highlights: items(section("about"), "highlights").map((item) => item.text),
    },
    cta: {
      title: text(section("cta"), "title"),
      text: text(section("cta"), "text"),
    },
  };
});
