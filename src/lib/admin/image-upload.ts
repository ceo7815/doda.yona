"use client";

import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/media";

const MAX_SIDE = 1600;
const QUALITY = 0.82;

/** דחיסה בדפדפן ל-WebP (עד 1600px בצלע הארוכה) לפני העלאה */
export async function compressToWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
  if (!blob) throw new Error("encode");
  return blob;
}

/** העלאת תמונה לתיקייה ב-Storage, מחזיר את הנתיב שנשמר */
export async function uploadImage(file: File, folder: "dishes" | "gallery"): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("יש לבחור קובץ תמונה.");
  }
  const blob = await compressToWebp(file);
  const path = `${folder}/${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.webp`;
  const supabase = createClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error("ההעלאה נכשלה. ודאו שאתם מחוברים ונסו שוב.");
  return path;
}
