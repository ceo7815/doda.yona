"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { refreshPublicSite } from "@/lib/admin/revalidate";
import { slugify, isMissingTableError } from "@/lib/admin/format";
import { toUserMessage } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export type ProductActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  savedId?: string;
};

const productSchema = z.object({
  id: z.guid().optional(),
  categoryId: z.guid("יש לבחור קטגוריה"),
  name: z.string().min(1, "שם המנה חובה").max(120),
  slug: z.string().min(1, "כתובת חובה").max(120),
  description: z.string().max(1000).optional(),
  imagePath: z.string().max(400).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  badges: z.array(z.string().max(40)).max(6),
});

const checked = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true";

function parseProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  return {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    categoryId: String(formData.get("categoryId") ?? ""),
    name,
    slug: slugify(rawSlug || name),
    description: String(formData.get("description") ?? "").trim() || undefined,
    imagePath: String(formData.get("imagePath") ?? "").trim() || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isAvailable: checked(formData, "isAvailable"),
    isFeatured: checked(formData, "isFeatured"),
    badges: String(formData.get("badges") ?? "")
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean),
  };
}

async function guard(): Promise<string | null> {
  if (!isSupabaseConfigured()) return "מסד הנתונים לא מחובר.";
  try {
    await requireAdmin();
    return null;
  } catch (error) {
    return toUserMessage(error);
  }
}

export async function saveProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const denied = await guard();
  if (denied) return { ok: false, message: denied };

  const parsed = productSchema.safeParse(parseProductForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "נא לתקן את השדות המסומנים.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  const payload = {
    category_id: d.categoryId,
    name: d.name,
    slug: d.slug,
    description: d.description ?? null,
    image_path: d.imagePath ?? null,
    sort_order: d.sortOrder,
    is_available: d.isAvailable,
    is_featured: d.isFeatured,
    badges: d.badges,
  };

  const supabase = await createClient();
  const result = d.id
    ? await supabase.from("products").update(payload).eq("id", d.id).is("deleted_at", null).select("id").single()
    : await supabase.from("products").insert(payload).select("id").single();

  if (result.error) {
    if (isMissingTableError(result.error)) {
      return { ok: false, message: "טבלת המנות עדיין לא קיימת." };
    }
    if (result.error.code === "23505") {
      return { ok: false, message: "כתובת זו כבר בשימוש במנה אחרת.", fieldErrors: { slug: ["כתובת תפוסה"] } };
    }
    return { ok: false, message: "השמירה נכשלה. נסו שוב." };
  }

  refreshPublicSite();
  return { ok: true, message: d.id ? "המנה עודכנה." : "המנה נוספה.", savedId: result.data.id };
}

export async function toggleProductFlag(formData: FormData): Promise<void> {
  if (await guard()) return;
  const id = String(formData.get("id") ?? "");
  const flag = String(formData.get("flag") ?? "");
  const value = formData.get("value") === "true";
  if (flag !== "is_available" && flag !== "is_featured") return;

  const supabase = await createClient();
  await supabase.from("products").update({ [flag]: value }).eq("id", id).is("deleted_at", null);
  refreshPublicSite();
}

export async function deleteProduct(formData: FormData): Promise<void> {
  if (await guard()) return;
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString(), is_available: false })
    .eq("id", id)
    .is("deleted_at", null);
  refreshPublicSite();
}
