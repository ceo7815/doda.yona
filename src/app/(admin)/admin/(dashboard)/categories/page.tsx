import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { StatusPill } from "@/components/admin/ui";
import { isMissingTableError } from "@/lib/admin/format";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { deleteCategory, toggleCategoryActive } from "./actions";
import { CategoryForm, type CategoryFormValues } from "./category-form";

export const metadata: Metadata = {
  title: "קטגוריות",
  robots: { index: false, follow: false },
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const { edit, new: isNew } = await searchParams;
  const configured = isSupabaseConfigured();

  let categories: CategoryRow[] = [];
  let dbError: string | null = null;
  let editing: CategoryFormValues | undefined;

  if (configured) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, sort_order, is_active")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      dbError = isMissingTableError(error)
        ? "טבלת הקטגוריות עדיין לא קיימת."
        : "לא ניתן לטעון קטגוריות.";
    } else {
      categories = data ?? [];
      if (edit) {
        const row = categories.find((c) => c.id === edit);
        if (row) {
          editing = {
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description ?? "",
            sortOrder: row.sort_order,
            isActive: row.is_active,
          };
        }
      }
    }
  }

  const showForm = Boolean(editing) || isNew === "1";

  return (
    <>
      <AdminPageHeader
        title="קטגוריות"
        description="סדר הקטגוריות בתפריט, והסתרה של קטגוריה שלמה."
        actions={
          configured && !showForm ? (
            <Link href="/admin/categories?new=1" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-brand-900 px-5 font-bold text-gold-400 shadow-md hover:bg-brand-800">
              <Plus className="size-4" aria-hidden />
              קטגוריה חדשה
            </Link>
          ) : null
        }
      />
      {!configured ? <SupabaseNotice /> : null}
      {dbError ? <p className="rounded-xl bg-warning/10 px-4 py-3 text-sm">{dbError}</p> : null}
      {showForm ? <CategoryForm key={editing?.id ?? "new"} initial={editing} /> : null}

      {categories.length > 0 ? (
        <ul className="overflow-hidden rounded-2xl border border-border/80 bg-surface-elevated">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5 last:border-0">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-ink-muted">{cat.sort_order}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-brand-900">{cat.name}</p>
                {cat.description ? <p className="truncate text-xs text-ink-muted">{cat.description}</p> : null}
              </div>
              <StatusPill on={cat.is_active} onLabel="מוצגת" offLabel="מוסתרת" />
              <div className="flex shrink-0 items-center">
                <form action={toggleCategoryActive}>
                  <input type="hidden" name="id" value={cat.id} />
                  <input type="hidden" name="isActive" value={String(!cat.is_active)} />
                  <button type="submit" className="admin-icon-btn" aria-label={cat.is_active ? "הסתרה" : "הצגה"} title={cat.is_active ? "הסתרה" : "הצגה"}>
                    {cat.is_active ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                  </button>
                </form>
                <Link href={`/admin/categories?edit=${cat.id}`} className="admin-icon-btn" aria-label={`עריכת ${cat.name}`} title="עריכה">
                  <Pencil className="size-4" aria-hidden />
                </Link>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <ConfirmSubmit className="admin-icon-btn text-danger" label={`מחיקת ${cat.name}`} message={`למחוק את הקטגוריה «${cat.name}»? היא תוסר מהתפריט באתר.`}>
                    <Trash2 className="size-4" aria-hidden />
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
