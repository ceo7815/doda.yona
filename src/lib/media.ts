import { getPublicEnv, isSupabaseConfigured } from "@/lib/env";

export const MEDIA_BUCKET = "media";

/** נתיב תמונה → כתובת ציבורית (קובץ מקומי, כתובת מלאה, או אובייקט ב-Storage) */
export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/") || /^https?:\/\//.test(path)) return path;
  if (!isSupabaseConfigured()) return null;
  const base = getPublicEnv().NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

/** האם הנתיב שייך ל-Storage (ולא קובץ מקומי באתר) */
export function isStoragePath(path: string | null | undefined): path is string {
  return Boolean(path) && !path!.startsWith("/") && !/^https?:\/\//.test(path!);
}
