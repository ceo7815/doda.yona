"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { refreshPublicSite } from "@/lib/admin/revalidate";
import { isSupabaseConfigured } from "@/lib/env";
import { MEDIA_BUCKET, isStoragePath } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import { MENU_ITEMS } from "@/data/catalog";

async function guard(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

async function nextSortOrder() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .is("deleted_at", null)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? 0) + 10;
}

const uploadedSchema = z
  .array(z.object({ path: z.string().regex(/^gallery\/[\w.-]+$/), alt: z.string().max(200) }))
  .min(1)
  .max(30);

/** נקרא מהדפדפן אחרי העלאה ל-Storage */
export async function addGalleryImages(
  items: { path: string; alt: string }[],
): Promise<{ ok: boolean; message: string }> {
  if (!(await guard())) return { ok: false, message: "אין הרשאה." };
  const parsed = uploadedSchema.safeParse(items);
  if (!parsed.success) return { ok: false, message: "קבצים לא תקינים." };

  let order = await nextSortOrder();
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_images").insert(
    parsed.data.map((item) => ({
      image_path: item.path,
      alt_text: item.alt || "תמונה מדודה יונה",
      sort_order: (order += 10),
    })),
  );
  if (error) return { ok: false, message: "השמירה נכשלה." };
  refreshPublicSite();
  return { ok: true, message: `נוספו ${parsed.data.length} תמונות.` };
}

/** התחלה מהירה: ייבוא תמונות המנות הקיימות לגלריה */
export async function importMenuPhotos(): Promise<void> {
  if (!(await guard())) return;
  let order = await nextSortOrder();
  const supabase = await createClient();
  await supabase.from("gallery_images").insert(
    MENU_ITEMS.filter((item) => item.imagePath).map((item) => ({
      image_path: item.imagePath!,
      alt_text: item.name,
      title: item.name,
      sort_order: (order += 10),
    })),
  );
  refreshPublicSite();
}

export async function updateGalleryImage(formData: FormData): Promise<void> {
  if (!(await guard())) return;
  const id = String(formData.get("id") ?? "");
  const alt = String(formData.get("alt") ?? "").trim().slice(0, 200);
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const supabase = await createClient();
  await supabase
    .from("gallery_images")
    .update({ alt_text: alt || "תמונה מדודה יונה", title: title || null })
    .eq("id", id);
  refreshPublicSite();
}

export async function toggleGalleryImage(formData: FormData): Promise<void> {
  if (!(await guard())) return;
  const supabase = await createClient();
  await supabase
    .from("gallery_images")
    .update({ is_active: formData.get("value") === "true" })
    .eq("id", String(formData.get("id") ?? ""));
  refreshPublicSite();
}

/** הזזה למעלה/למטה — החלפת סדר עם השכן */
export async function moveGalleryImage(formData: FormData): Promise<void> {
  if (!(await guard())) return;
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("id, sort_order")
    .is("deleted_at", null)
    .order("sort_order")
    .order("created_at");
  if (!data) return;
  // נרמול סדר כדי שהחלפה תמיד תעבוד
  const list = data.map((row, i) => ({ id: row.id, sort_order: (i + 1) * 10 }));
  const index = list.findIndex((row) => row.id === id);
  const swap = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swap < 0 || swap >= list.length) return;
  [list[index].sort_order, list[swap].sort_order] = [list[swap].sort_order, list[index].sort_order];
  const changed = list.filter((row, i) => row.sort_order !== data[i].sort_order);
  await Promise.all(
    changed.map((row) => supabase.from("gallery_images").update({ sort_order: row.sort_order }).eq("id", row.id)),
  );
  refreshPublicSite();
}

export async function deleteGalleryImage(formData: FormData): Promise<void> {
  if (!(await guard())) return;
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id)
    .select("image_path")
    .maybeSingle();
  if (data && isStoragePath(data.image_path)) {
    await supabase.storage.from(MEDIA_BUCKET).remove([data.image_path]);
  }
  refreshPublicSite();
}
