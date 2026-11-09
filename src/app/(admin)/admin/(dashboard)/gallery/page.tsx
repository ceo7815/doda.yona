import type { Metadata } from "next";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { AdminCard } from "@/components/admin/ui";
import { resolveMediaUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { GalleryImageRow } from "@/types/database";
import {
  deleteGalleryImage,
  importMenuPhotos,
  moveGalleryImage,
  toggleGalleryImage,
  updateGalleryImage,
} from "./actions";
import { GalleryUploader } from "./gallery-uploader";

export const metadata: Metadata = { title: "גלריה", robots: { index: false, follow: false } };

export default async function AdminGalleryPage() {
  const configured = isSupabaseConfigured();
  let images: GalleryImageRow[] = [];
  let loadError = false;

  if (configured) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order")
      .order("created_at");
    if (error) loadError = true;
    images = (data as GalleryImageRow[] | null) ?? [];
  }

  return (
    <>
      <AdminPageHeader title="גלריה" description="התמונות שמופיעות בעמוד הגלריה באתר, לפי הסדר כאן." />
      {!configured ? <SupabaseNotice /> : null}
      {loadError ? <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">לא ניתן לטעון את הגלריה.</p> : null}

      {configured ? <GalleryUploader /> : null}

      {configured && images.length === 0 && !loadError ? (
        <AdminCard title="הגלריה עדיין ריקה" description="כל עוד אין תמונות כאן, האתר מציג את תמונות המנות.">
          <form action={importMenuPhotos}>
            <button type="submit" className="inline-flex min-h-11 items-center rounded-xl border border-border-strong bg-white px-5 text-sm font-bold text-brand-900 hover:border-gold-500">
              להתחיל מתמונות המנות הקיימות
            </button>
          </form>
        </AdminCard>
      ) : null}

      {images.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, index) => {
            const src = resolveMediaUrl(img.image_path);
            return (
              <li key={img.id} className="overflow-hidden rounded-2xl border border-border/80 bg-surface-elevated shadow-[0_1px_2px_rgb(31_20_12/0.04)]">
                <div className="relative aspect-[4/3] bg-brand-50">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element -- תצוגה באדמין
                    <img src={src} alt={img.alt_text} loading="lazy" className={`size-full object-cover ${img.is_active ? "" : "opacity-40 grayscale"}`} />
                  ) : null}
                  <span className="absolute top-2 right-2 rounded-full bg-brand-950/75 px-2.5 py-1 text-xs font-bold text-white">{index + 1}</span>
                  {!img.is_active ? (
                    <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-ink-muted">מוסתרת</span>
                  ) : null}
                </div>
                <form action={updateGalleryImage} className="space-y-2 p-3">
                  <input type="hidden" name="id" value={img.id} />
                  <input
                    name="title"
                    defaultValue={img.title ?? ""}
                    placeholder="כותרת (לא חובה)"
                    aria-label="כותרת"
                    className="min-h-10 w-full rounded-lg border border-border bg-white px-3 text-sm focus:border-gold-500 focus:outline-none"
                  />
                  <input
                    name="alt"
                    defaultValue={img.alt_text}
                    placeholder="תיאור התמונה (לנגישות)"
                    aria-label="תיאור התמונה"
                    className="min-h-10 w-full rounded-lg border border-border bg-white px-3 text-sm focus:border-gold-500 focus:outline-none"
                  />
                  <button type="submit" className="text-xs font-bold text-gold-700 hover:underline">
                    שמירת טקסט
                  </button>
                </form>
                <div className="flex items-center justify-between border-t border-border/60 px-2 py-1.5">
                  <div className="flex">
                    <form action={moveGalleryImage}>
                      <input type="hidden" name="id" value={img.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" disabled={index === 0} className="admin-icon-btn disabled:opacity-30" aria-label="הזזה אחורה בסדר" title="הזזה אחורה">
                        <ArrowUp className="size-4" aria-hidden />
                      </button>
                    </form>
                    <form action={moveGalleryImage}>
                      <input type="hidden" name="id" value={img.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button type="submit" disabled={index === images.length - 1} className="admin-icon-btn disabled:opacity-30" aria-label="הזזה קדימה בסדר" title="הזזה קדימה">
                        <ArrowDown className="size-4" aria-hidden />
                      </button>
                    </form>
                  </div>
                  <div className="flex">
                    <form action={toggleGalleryImage}>
                      <input type="hidden" name="id" value={img.id} />
                      <input type="hidden" name="value" value={String(!img.is_active)} />
                      <button type="submit" className="admin-icon-btn" aria-label={img.is_active ? "הסתרה" : "הצגה"} title={img.is_active ? "הסתרה" : "הצגה"}>
                        {img.is_active ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                      </button>
                    </form>
                    <form action={deleteGalleryImage}>
                      <input type="hidden" name="id" value={img.id} />
                      <ConfirmSubmit className="admin-icon-btn text-danger" label="מחיקה" message="למחוק את התמונה מהגלריה?">
                        <Trash2 className="size-4" aria-hidden />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}
