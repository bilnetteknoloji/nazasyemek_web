/** Herkese açık `media` bucket'ındaki dosyanın adresi. */
export function mediaUrl(supabaseUrl: string, path: string) {
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
}

export const MEDIA_BUCKET = "media";
