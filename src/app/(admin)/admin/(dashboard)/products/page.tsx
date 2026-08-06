import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { Button } from "@/components/ui/button";
import { formatAdminPrice, isMissingTableError } from "@/lib/admin/format";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { deleteProduct, toggleProductAvailability } from "./actions";
import { ProductForm, type ProductFormValues } from "./product-form";

export const metadata: Metadata = {
  title: "מנות",
  robots: { index: false, follow: false },
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_agorot: number;
  sort_order: number;
  is_available: boolean;
  is_featured: boolean;
  badges: string[];
  category_id: string;
  categories: { name: string } | { name: string }[] | null;
};

function categoryName(categories: ProductRow["categories"]): string {
  if (!categories) return "—";
  if (Array.isArray(categories)) return categories[0]?.name ?? "—";
  return categories.name;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const configured = isSupabaseConfigured();

  let products: ProductRow[] = [];
  let categories: { id: string; name: string }[] = [];
  let dbError: string | null = null;
  let editing: ProductFormValues | undefined;

  if (configured) {
    const supabase = await createClient();

    const [productsResult, categoriesResult] = await Promise.all([
      supabase
        .from("products")
        .select(
          "id, name, slug, description, price_agorot, sort_order, is_available, is_featured, badges, category_id, categories(name)",
        )
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("categories")
        .select("id, name")
        .is("deleted_at", null)
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (productsResult.error) {
      dbError = isMissingTableError(productsResult.error)
        ? "טבלת המנות עדיין לא קיימת. הריצו את המיגרציות."
        : "לא ניתן לטעון מנות.";
    } else {
      products = productsResult.data ?? [];
      categories = categoriesResult.data ?? [];

      if (edit) {
        const row = products.find((p) => p.id === edit);
        if (row) {
          editing = {
            id: row.id,
            categoryId: row.category_id,
            name: row.name,
            slug: row.slug,
            description: row.description ?? "",
            priceAgorot: row.price_agorot,
            sortOrder: row.sort_order,
            isAvailable: row.is_available,
            isFeatured: row.is_featured,
            badges: row.badges ?? [],
          };
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="מנות"
        description="ניהול מנות התפריט — מחירים, זמינות ותגיות."
      />

      {!configured ? <SupabaseNotice /> : null}
      {dbError ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          {dbError}
        </div>
      ) : null}

      {configured && !dbError ? (
        <>
          <ProductForm
            key={editing?.id ?? "new"}
            categories={categories}
            initial={editing}
          />

          <section className="rounded-md border border-border">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-bold text-ink">
                {products.length === 0 ? "אין מנות עדיין" : `${products.length} מנות`}
              </h2>
            </div>

            {products.length === 0 ? (
              <p className="px-4 py-6 text-sm text-ink-muted">
                הוסיפו מנות לאחר יצירת קטגוריות. מחיר 0 יוצג באתר כ&quot;לבירור&quot;.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-brand-50 text-start">
                      <th className="px-4 py-2 font-medium">שם</th>
                      <th className="px-4 py-2 font-medium">קטגוריה</th>
                      <th className="px-4 py-2 font-medium">מחיר</th>
                      <th className="px-4 py-2 font-medium">זמינות</th>
                      <th className="px-4 py-2 font-medium">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-medium text-ink">
                            {product.name}
                            {product.is_featured ? (
                              <span className="ms-2 text-xs text-gold-600">★ מומלצת</span>
                            ) : null}
                          </p>
                          {product.badges?.length ? (
                            <p className="text-xs text-ink-muted">
                              {product.badges.join(" · ")}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          {categoryName(product.categories)}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {formatAdminPrice(product.price_agorot)}
                        </td>
                        <td className="px-4 py-3">
                          <form action={toggleProductAvailability}>
                            <input type="hidden" name="id" value={product.id} />
                            <input
                              type="hidden"
                              name="isAvailable"
                              value={String(!product.is_available)}
                            />
                            <Button
                              type="submit"
                              size="sm"
                              variant={product.is_available ? "secondary" : "outline"}
                            >
                              {product.is_available ? "זמינה" : "לא זמינה"}
                            </Button>
                          </form>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/admin/products?edit=${product.id}`}
                              className="text-sm text-brand-700 underline"
                            >
                              עריכה
                            </Link>
                            <form action={deleteProduct}>
                              <input type="hidden" name="id" value={product.id} />
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
