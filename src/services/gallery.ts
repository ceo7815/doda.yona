import { cache } from "react";
import { MENU_ITEMS } from "@/data/catalog";
import { logServerError } from "@/lib/errors";
import { createPublicClient, resolveMediaUrl } from "@/lib/supabase/public";
import type { GalleryImageRow } from "@/types/database";

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string | null;
};

/** ברירת מחדל: תמונות המנות שסופקו ע״י העסק */
function staticGallery(): GalleryImage[] {
  return MENU_ITEMS.filter((item) => item.imagePath).map((item) => ({
    id: item.id,
    src: item.imagePath!,
    alt: item.name,
    title: item.name,
  }));
}

export const getGalleryImages = cache(async (): Promise<GalleryImage[]> => {
  const supabase = createPublicClient();
  if (!supabase) return staticGallery();

  try {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .is("deleted_at", null)
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      logServerError("getGalleryImages", error);
      return staticGallery();
    }

    const rows = (data as GalleryImageRow[])
      .map((row) => {
        const src = resolveMediaUrl(row.image_path);
        return src
          ? { id: row.id, src, alt: row.alt_text, title: row.title }
          : null;
      })
      .filter((row): row is GalleryImage => row !== null);

    return rows.length > 0 ? rows : staticGallery();
  } catch (error) {
    logServerError("getGalleryImages", error);
    return staticGallery();
  }
});
