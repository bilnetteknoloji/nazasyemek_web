/**
 * Ana sayfanın panelden düzenlenen bölümleri. Her bölüm `settings` tablosunda
 * `home.<anahtar>` satırıdır. Panel formu ve kayıt doğrulaması bu tanımlardan
 * üretilir; varsayılan içerik `lib/content/home.ts` içindedir.
 *
 * Kural: boş bırakılan metin/görsel alanı sitedeki ilk hâline döner.
 * İkonlar ve renkler sabittir (sıraya göre), panelden değişmez.
 */

export type FieldKind = "text" | "textarea" | "image";

export type FieldDef = {
  name: string;
  label: string;
  kind?: FieldKind;
  max: number;
  hint?: string;
};

export type ListDef = {
  name: string;
  label: string;
  itemLabel: string;
  fields: FieldDef[];
  /** Sabit sayıda kart (ör. 3 avantaj). Değilse eklenip silinebilir, sırası değişir. */
  fixed?: boolean;
  min: number;
  max: number;
  /** Panelde gösterilmeyen ama korunan alanlar (ör. slaytın videosu). */
  keep?: string[];
};

export type SectionDef = {
  key: string;
  title: string;
  hint?: string;
  fields: FieldDef[];
  list?: ListDef;
};

export type SectionItem = Record<string, string>;
export type SectionValue = Record<string, string | SectionItem[]>;

const eyebrow: FieldDef = { name: "eyebrow", label: "Küçük üst başlık", max: 60 };
const title: FieldDef = { name: "title", label: "Başlık", max: 120 };
const description: FieldDef = { name: "description", label: "Açıklama", kind: "textarea", max: 400 };

export const homeSections: SectionDef[] = [
  {
    key: "hero",
    title: "Üst bölüm (slider)",
    hint: "Masaüstünde slider'ın solunda yazılar görünür; telefonda yalnızca görseller görünür.",
    fields: [
      { name: "badge", label: "Üstteki küçük rozet yazısı", max: 120 },
      {
        name: "title",
        label: "Büyük başlık",
        max: 80,
        hint: "İtalik yazılacak kelimeyi yıldız içine alın: Aş'a *Lezzet* Katıyoruz.",
      },
      { name: "lead", label: "Başlığın altındaki yazı", kind: "textarea", max: 300 },
    ],
    list: {
      name: "slides",
      label: "Slider görselleri",
      itemLabel: "Slayt",
      min: 1,
      max: 10,
      keep: ["video"],
      fields: [
        { name: "src", label: "Görsel", kind: "image", max: 500 },
        { name: "caption", label: "Görselin kısa tarifi", max: 100, hint: "Ekranda görünmez; görme engelliler ve Google için." },
      ],
    },
  },
  {
    key: "sectors",
    title: "Sektör şeridi",
    hint: "Slider'ın hemen altındaki beyaz şerit.",
    fields: [eyebrow, { ...title, label: "Başlık", max: 80 }],
    list: {
      name: "items",
      label: "Sektörler",
      itemLabel: "Sektör",
      fixed: true,
      min: 5,
      max: 5,
      fields: [{ name: "label", label: "Sektör adı", max: 40 }],
    },
  },
  {
    key: "why",
    title: "Neden NAZ-AŞ (avantaj kartları)",
    fields: [
      eyebrow,
      title,
      description,
      { name: "background", label: "Arka plan görseli", kind: "image", max: 500, hint: "Görselin üzerine koyu perde uygulanır." },
    ],
    list: {
      name: "cards",
      label: "Kartlar",
      itemLabel: "Kart",
      fixed: true,
      min: 3,
      max: 3,
      fields: [
        { name: "title", label: "Kart başlığı", max: 80 },
        { name: "text", label: "Kart yazısı", kind: "textarea", max: 300 },
        { name: "linkLabel", label: "Bağlantı yazısı", max: 40 },
      ],
    },
  },
  {
    key: "chain",
    title: "Üretim süreci (3 adım)",
    fields: [eyebrow, title, description],
    list: {
      name: "steps",
      label: "Adımlar",
      itemLabel: "Adım",
      fixed: true,
      min: 3,
      max: 3,
      fields: [
        { name: "photo", label: "Görsel", kind: "image", max: 500 },
        { name: "tag", label: "Etiket", max: 40 },
        { name: "title", label: "Başlık", max: 100 },
        { name: "text", label: "Yazı", kind: "textarea", max: 300 },
        { name: "footnote", label: "Alt not", max: 80 },
      ],
    },
  },
  {
    key: "menu",
    title: "Günün menüsü kartları",
    hint: "Bu kartlar Menü sayfasında da görünür.",
    fields: [eyebrow, title, description],
    list: {
      name: "dishes",
      label: "Yemekler",
      itemLabel: "Yemek",
      fixed: true,
      min: 4,
      max: 4,
      fields: [
        { name: "photo", label: "Görsel", kind: "image", max: 500 },
        { name: "title", label: "Yemek adı", max: 80 },
        { name: "text", label: "Kısa tarif", max: 160 },
        { name: "category", label: "Kategori", max: 40 },
        { name: "badge", label: "Görsel üstü rozet", max: 30 },
        { name: "calories", label: "Kalori", max: 20 },
        { name: "tag", label: "Alt etiket", max: 30 },
        { name: "note", label: "Alt not", max: 30 },
      ],
    },
  },
  {
    key: "about",
    title: "Hakkımızda tanıtımı",
    fields: [
      eyebrow,
      title,
      { name: "text", label: "Yazı", kind: "textarea", max: 600 },
      { name: "photo", label: "Büyük görsel", kind: "image", max: 500 },
      { name: "photoSmall", label: "Küçük görsel", kind: "image", max: 500, hint: "Yalnızca masaüstünde görünür." },
    ],
    list: {
      name: "highlights",
      label: "Madde işaretli satırlar",
      itemLabel: "Madde",
      fixed: true,
      min: 4,
      max: 4,
      fields: [{ name: "text", label: "Yazı", max: 100 }],
    },
  },
  {
    key: "cta",
    title: "Kapanış bandı (Teklif alın)",
    hint: "Bu bant ana sayfanın sonunda ve diğer birçok sayfada görünür.",
    fields: [
      { ...title, max: 120 },
      { name: "text", label: "Yazı", kind: "textarea", max: 300 },
    ],
  },
];

export const settingKey = (sectionKey: string) => `home.${sectionKey}`;

/**
 * Kaydedilmiş değeri varsayılanın üzerine yazar: dolu metinler geçer, boşlar
 * varsayılanda kalır. Sabit listeler sıra sırasına, serbest liste (slaytlar)
 * kayıtlı ve boş değilse bütünüyle kullanılır.
 */
export function mergeSection(def: SectionDef, fallback: SectionValue, saved: unknown): SectionValue {
  const source = (saved && typeof saved === "object" ? saved : {}) as Record<string, unknown>;
  const out: SectionValue = { ...fallback };
  for (const field of def.fields) {
    const value = source[field.name];
    if (typeof value === "string" && value.trim()) out[field.name] = value.trim();
  }
  if (def.list) {
    const list = def.list;
    const base = (fallback[list.name] as SectionItem[] | undefined) ?? [];
    const raw = Array.isArray(source[list.name]) ? (source[list.name] as unknown[]) : null;
    if (list.fixed) {
      out[list.name] = base.map((item, index) => mergeItem(list, item, raw?.[index]));
    } else if (raw && raw.length) {
      out[list.name] = raw
        .map((item) => mergeItem(list, {}, item))
        .filter((item) => list.fields.every((field) => field.kind !== "image" || item[field.name]));
      if (!(out[list.name] as SectionItem[]).length) out[list.name] = base;
    }
  }
  return out;
}

function mergeItem(list: ListDef, base: SectionItem, saved: unknown): SectionItem {
  const source = (saved && typeof saved === "object" ? saved : {}) as Record<string, unknown>;
  const out: SectionItem = { ...base };
  for (const name of [...list.fields.map((field) => field.name), ...(list.keep ?? [])]) {
    const value = source[name];
    if (typeof value === "string" && value.trim()) out[name] = value.trim();
  }
  return out;
}
