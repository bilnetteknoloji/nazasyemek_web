import type { GalleryGroup } from "@/data/media";

/** Sitedeki GalleryGrid ile aynı adlar. */
export const galleryGroups: { id: GalleryGroup; label: string }[] = [
  { id: "tesis", label: "Üretim Tesisi" },
  { id: "mutfak", label: "Mutfak & Hazırlık" },
  { id: "kumanya", label: "Kumanya & Paket Öğün" },
  { id: "servis", label: "Servis & Sunum" },
  { id: "organizasyon", label: "Organizasyon" },
  { id: "video", label: "Videolar" },
];

export const galleryGroupIds = galleryGroups.map((group) => group.id) as [GalleryGroup, ...GalleryGroup[]];
