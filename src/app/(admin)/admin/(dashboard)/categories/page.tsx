import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { Button } from "@/components/ui/button";
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
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
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
        ? "טבלת הקטגוריות עדיין לא קיימת. הריצו את המיגרציות."
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

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="קטגוריות"
        description="ניהול קטגוריות התפריט — סדר, הפעלה והסתרה."
      />

      {!configured ? <SupabaseNotice /> : null}
      {dbError ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          {dbError}
        </div>
      ) : null}

      {configured && !dbError ? (
        <>
          <CategoryForm key={editing?.id ?? "new"} initial={editing} />

          <section className="rounded-md border border-border">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-bold text-ink">
                {categories.length === 0 ? "אין קטגוריות עדיין" : `${categories.length} קטגוריות`}
              </h2>
            </div>

            {categories.length === 0 ? (
              <p className="px-4 py-6 text-sm text-ink-muted">
                הוסיפו קטגוריה ראשונה באמצעות הטופס למעלה — למשל &quot;מרקים&quot;, &quot;מאפים תימניים&quot;, &quot;תוספות&quot;.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-brand-50 text-start">
                      <th className="px-4 py-2 font-medium">שם</th>
                      <th className="px-4 py-2 font-medium">סדר</th>
                      <th className="px-4 py-2 font-medium">סטטוס</th>
                      <th className="px-4 py-2 font-medium">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-medium text-ink">{cat.name}</p>
                          <p className="text-xs text-ink-muted" dir="ltr">
                            {cat.slug}
                          </p>
                        </td>
                        <td className="px-4 py-3">{cat.sort_order}</td>
                        <td className="px-4 py-3">
                          <form action={toggleCategoryActive}>
                            <input type="hidden" name="id" value={cat.id} />
                            <input
                              type="hidden"
                              name="isActive"
                              value={String(!cat.is_active)}
                            />
                            <Button
                              type="submit"
                              size="sm"
                              variant={cat.is_active ? "secondary" : "outline"}
                            >
                              {cat.is_active ? "פעילה" : "מוסתרת"}
                            </Button>
                          </form>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/admin/categories?edit=${cat.id}`}
                              className="text-sm text-brand-700 underline"
                            >
                              עריכה
                            </Link>
                            <form action={deleteCategory}>
                              <input type="hidden" name="id" value={cat.id} />
                              <Button type="submit" size="sm" variant="ghost" className="text-danger">
                                הסרה
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
