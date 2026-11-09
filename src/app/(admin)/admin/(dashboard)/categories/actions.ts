"use server";

import { refreshPublicSite } from "@/lib/admin/revalidate";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { slugify, isMissingTableError } from "@/lib/admin/format";
import { AppError, toUserMessage } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export type CategoryActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const categorySchema = z.object({
  id: z.guid().optional(),
  name: z.string().min(1, "שם הקטגוריה חובה"),
  slug: z.string().min(1, "כתובת (slug) חובה"),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});

function parseCategoryForm(formData: FormData) {
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  return {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    name,
    slug: rawSlug || slugify(name),
    description: String(formData.get("description") ?? "").trim() || undefined,
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  };
}

export async function saveCategory(
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "מסד הנתונים לא מחובר." };
  }

  try {
    await requireAdmin();
  } catch (error) {
    return { ok: false, message: toUserMessage(error) };
  }

  const parsed = categorySchema.safeParse(parseCategoryForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "נא לתקן את השדות המסומנים.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createClient();
  const payload = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description ?? null,
    sort_order: parsed.data.sortOrder,
    is_active: parsed.data.isActive,
  };

  if (parsed.data.id) {
    const { error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", parsed.data.id)
      .is("deleted_at", null);

    if (error) {
      if (isMissingTableError(error)) {
        return { ok: false, message: "טבלת הקטגוריות עדיין לא קיימת. הריצו את המיגרציות." };
      }
      return { ok: false, message: "לא ניתן לעדכן את הקטגוריה." };
    }
  } else {
    const { error } = await supabase.from("categories").insert(payload);
    if (error) {
      if (isMissingTableError(error)) {
        return { ok: false, message: "טבלת הקטגוריות עדיין לא קיימת. הריצו את המיגרציות." };
      }
      if (error.code === "23505") {
        return { ok: false, message: "כתובת (slug) זו כבר בשימוש." };
      }
      return { ok: false, message: "לא ניתן ליצור את הקטגוריה." };
    }
  }

  refreshPublicSite();
  return { ok: true, message: parsed.data.id ? "הקטגוריה עודכנה." : "הקטגוריה נוספה." };
}

export async function toggleCategoryActive(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;

  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "true";

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ is_active: isActive })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw new AppError("INTERNAL", { message: error.message });
  }

  refreshPublicSite();
}

export async function deleteCategory(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;

  await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw new AppError("INTERNAL", { message: error.message });
  }

  refreshPublicSite();
}
