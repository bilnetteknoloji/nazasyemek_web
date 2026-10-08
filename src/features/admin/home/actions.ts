"use server";

import { requireAdmin } from "@/features/admin/auth/session";
import { refreshSite } from "@/features/admin/revalidate";
import { notifyLater } from "@/features/admin/seo/notify";
import type { ActionState } from "@/features/admin/ui/form-message";
import { requireSupabaseEnv } from "@/lib/env";
import {
  homeSections,
  settingKey,
  type FieldDef,
  type SectionItem,
  type SectionValue,
} from "@/lib/content/home-sections";
import { MEDIA_BUCKET } from "@/lib/supabase/storage";
import { TAGS } from "@/lib/content/tags";

const LOCAL_FILE = /^\/[A-Za-z0-9/_.-]+$/;
const VIDEO_FILE = /^\/video\/[A-Za-z0-9_.-]+\.mp4$/;

/** Görsel yalnızca sitenin kendi dosyası ya da projenin `media` bucket'ı olabilir. */
function isImage(value: string) {
  if (LOCAL_FILE.test(value) && !value.includes("..")) return true;
  const storage = `${requireSupabaseEnv().url}/storage/v1/object/public/${MEDIA_BUCKET}/`;
  return value.startsWith(storage) && LOCAL_FILE.test(`/${value.slice(storage.length)}`);
}

function cleanField(field: FieldDef, raw: unknown): string | { error: string } {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (value.length > field.max) return { error: `"${field.label}" en fazla ${field.max} karakter olabilir.` };
  if (field.kind === "image" && value && !isImage(value)) return { error: `"${field.label}" geçersiz.` };
  return value;
}

/**
 * Ana sayfa bölümünü kaydeder. Değer bölüm tanımına göre süzülür: tanımda
 * olmayan alan kaydedilmez, uzunluk ve görsel adresi denetlenir.
 */
export async function saveHomeSection(key: string, input: SectionValue): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const def = homeSections.find((section) => section.key === key);
  if (!def) return { ok: false, message: "Bilinmeyen bölüm." };

  const value: SectionValue = {};
  for (const field of def.fields) {
    const cleaned = cleanField(field, input[field.name]);
    if (typeof cleaned !== "string") return { ok: false, message: cleaned.error };
    value[field.name] = cleaned;
  }

  if (def.list) {
    const list = def.list;
    const raw = Array.isArray(input[list.name]) ? (input[list.name] as SectionItem[]) : [];
    if (raw.length < list.min || raw.length > list.max) {
      return { ok: false, message: `${list.label}: ${list.min}–${list.max} arası olmalı.` };
    }
    const items: SectionItem[] = [];
    for (const [index, source] of raw.entries()) {
      const item: SectionItem = {};
      for (const field of list.fields) {
        const cleaned = cleanField(field, source?.[field.name]);
        if (typeof cleaned !== "string") {
          return { ok: false, message: `${list.itemLabel} ${index + 1}: ${cleaned.error}` };
        }
        if (!list.fixed && field.kind === "image" && !cleaned) {
          return { ok: false, message: `${list.itemLabel} ${index + 1}: görsel seçin.` };
        }
        item[field.name] = cleaned;
      }
      const video = source?.video;
      if (list.keep?.includes("video") && typeof video === "string" && VIDEO_FILE.test(video)) {
        item.video = video;
      }
      items.push(item);
    }
    value[list.name] = items;
  }

  const { error } = await supabase.from("settings").upsert({ key: settingKey(key), value });
  if (error) return { ok: false, message: "Kaydedilemedi." };
  // Kapanış bandı ve menü kartları başka sayfalarda da var; etiket hepsini tazeler.
  refreshSite(TAGS.settings, ["/", "/menu"]);
  await notifyLater(["/"]);
  return { ok: true, message: "Kaydedildi. Değişiklik sitede birkaç saniye içinde görünür." };
}
