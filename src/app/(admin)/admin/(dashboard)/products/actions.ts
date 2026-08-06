"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { slugify, isMissingTableError } from "@/lib/admin/format";
import { AppError, toUserMessage } from "@/lib/errors";
import { shekelsToAgorot } from "@/lib/money";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export type ProductActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const productSchema = z.object({
  id: z.string().uuid().optional(),
  categoryId: z.string().uuid("יש לבחור קטגוריה"),
  name: z.string().min(1, "שם המנה חובה"),
  slug: z.string().min(1, "כתובת (slug) חובה"),
  description: z.string().optional(),
  priceShekels: z.coerce.number().min(0, "מחיר לא יכול להיות שלילי").optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isAvailable: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  badges: z.string().optional(),
});

function parseBadges(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);
}

function parseProductForm(formData: FormData) {
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("priceShekels") ?? "").trim();

  return {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    categoryId: String(formData.get("categoryId") ?? ""),
    name,
    slug: rawSlug || slugify(name),
    description: String(formData.get("description") ?? "").trim() || undefined,
    priceShekels: priceRaw === "" ? 0 : priceRaw,
    sortOrder: formData.get("sortOrder"),
    isAvailable:
      formData.get("isAvailable") === "on" || formData.get("isAvailable") === "true",
    isFeatured:
      formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
    badges: String(formData.get("badges") ?? ""),
  };
}

export async function saveProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "מסד הנתונים לא מחובר." };
  }

  try {
    await requireAdmin();
  } catch (error) {
    return { ok: false, message: toUserMessage(error) };
  }

  const parsed = productSchema.safeParse(parseProductForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "נא לתקן את השדות המסומנים.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createClient();
  const payload = {
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description ?? null,
    price_agorot: shekelsToAgorot(parsed.data.priceShekels ?? 0),
    sort_order: parsed.data.sortOrder,
    is_available: parsed.data.isAvailable,
    is_featured: parsed.data.isFeatured,
    badges: parseBadges(parsed.data.badges),
  };

  if (parsed.data.id) {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", parsed.data.id)
      .is("deleted_at", null);

    if (error) {
      if (isMissingTableError(error)) {
        return { ok: false, message: "טבלת המנות עדיין לא קיימת. הריצו את המיגרציות." };
      }
      return { ok: false, message: "לא ניתן לעדכן את המנה." };
    }
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) {
      if (isMissingTableError(error)) {
        return { ok: false, message: "טבלת המנות עדיין לא קיימת. הריצו את המיגרציות." };
      }
      if (error.code === "23505") {
        return { ok: false, message: "כתובת (slug) זו כבר בשימוש." };
      }
      return { ok: false, message: "לא ניתן ליצור את המנה." };
    }
  }

  revalidatePath("/admin/products");
  return { ok: true, message: parsed.data.id ? "המנה עודכנה." : "המנה נוספה." };
}

export async function toggleProductAvailability(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;

  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const isAvailable = formData.get("isAvailable") === "true";

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_available: isAvailable })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw new AppError("INTERNAL", { message: error.message });
  }

  revalidatePath("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;

  await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString(), is_available: false })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw new AppError("INTERNAL", { message: error.message });
  }

  revalidatePath("/admin/products");
}
