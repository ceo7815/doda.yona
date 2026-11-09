import type { Metadata } from "next";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { StatusPill } from "@/components/admin/ui";
import { isMissingTableError } from "@/lib/admin/format";
import { resolveMediaUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { deleteProduct, toggleProductFlag } from "./actions";
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
  image_path: string | null;
  sort_order: number;
  is_available: boolean;
  is_featured: boolean;
  badges: string[] | null;
  category_id: string;
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const { edit, new: isNew } = await searchParams;
  const configured = isSupabaseConfigured();

  let products: ProductRow[] = [];
  let categories: { id: string; name: string }[] = [];
  let dbError: string | null = null;

  if (configured) {
    const supabase = await createClient();
    const [productsResult, categoriesResult] = await Promise.all([
      supabase
        .from("products")
        .select("id, name, slug, description, image_path, sort_order, is_available, is_featured, badges, category_id")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase.from("categories").select("id, name").is("deleted_at", null).order("sort_order", { ascending: true }),
    ]);
    if (productsResult.error) {
      dbError = isMissingTableError(productsResult.error) ? "טבלת המנות עדיין לא קיימת." : "לא ניתן לטעון מנות.";
    } else {
      products = productsResult.data ?? [];
      categories = categoriesResult.data ?? [];
    }
  }

  const row = edit ? products.find((p) => p.id === edit) : undefined;
  const editing: ProductFormValues | undefined = row
    ? {
        id: row.id,
        categoryId: row.category_id,
        name: row.name,
        slug: row.slug,
        description: row.description ?? "",
        imagePath: row.image_path,
        sortOrder: row.sort_order,
        isAvailable: row.is_available,
        isFeatured: row.is_featured,
        badges: row.badges ?? [],
      }
    : undefined;
  const showForm = Boolean(editing) || isNew === "1";

  const groups = categories
    .map((c) => ({ ...c, items: products.filter((p) => p.category_id === c.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <AdminPageHeader
        title="מנות"
        description={`${products.length} מנות · ${products.filter((p) => p.is_available).length} מוצגות באתר`}
        actions={
          configured && !showForm ? (
            <Link
              href="/admin/products?new=1"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-brand-900 px-5 font-bold text-gold-400 shadow-md hover:bg-brand-800"
            >
              <Plus className="size-4" aria-hidden />
              מנה חדשה
            </Link>
          ) : null
        }
      />

      {!configured ? <SupabaseNotice /> : null}
      {dbError ? <p className="rounded-xl bg-warning/10 px-4 py-3 text-sm">{dbError}</p> : null}

      {showForm ? <ProductForm key={editing?.id ?? "new"} categories={categories} initial={editing} /> : null}

      {groups.map((group) => (
        <section key={group.id} className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-extrabold tracking-wide text-gold-700">
            {group.name}
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-ink-muted">{group.items.length}</span>
          </h2>
          <ul className="overflow-hidden rounded-2xl border border-border/80 bg-surface-elevated">
            {group.items.map((p) => {
              const img = resolveMediaUrl(p.image_path);
              return (
                <li key={p.id} className="flex items-center gap-3 border-b border-border/60 px-3 py-3 last:border-0 sm:gap-4 sm:px-4">
                  <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-brand-50 sm:size-16">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element -- תמונה קטנה באדמין
                      <img src={img} alt="" loading="lazy" className={`size-full object-cover ${p.is_available ? "" : "opacity-40 grayscale"}`} />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate font-bold text-brand-900">
                      {p.name}
                      {p.is_featured ? <Star className="size-3.5 shrink-0 fill-gold-500 text-gold-500" aria-label="מומלצת" /> : null}
                    </p>
                    <div className="mt-1">
                      <StatusPill on={p.is_available} onLabel="מוצגת" offLabel="מוסתרת" />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <form action={toggleProductFlag}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="flag" value="is_available" />
                      <input type="hidden" name="value" value={String(!p.is_available)} />
                      <button type="submit" className="admin-icon-btn" aria-label={p.is_available ? "הסתרה מהאתר" : "הצגה באתר"} title={p.is_available ? "הסתרה מהאתר" : "הצגה באתר"}>
                        {p.is_available ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                      </button>
                    </form>
                    <form action={toggleProductFlag} className="hidden sm:block">
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="flag" value="is_featured" />
                      <input type="hidden" name="value" value={String(!p.is_featured)} />
                      <button type="submit" className="admin-icon-btn" aria-label={p.is_featured ? "הסרה מהמומלצות" : "סימון כמומלצת"} title={p.is_featured ? "הסרה מהמומלצות" : "סימון כמומלצת"}>
                        <Star className={`size-4 ${p.is_featured ? "fill-gold-500 text-gold-500" : ""}`} aria-hidden />
                      </button>
                    </form>
                    <Link href={`/admin/products?edit=${p.id}`} className="admin-icon-btn" aria-label={`עריכת ${p.name}`} title="עריכה">
                      <Pencil className="size-4" aria-hidden />
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmSubmit className="admin-icon-btn text-danger" label={`מחיקת ${p.name}`} message={`למחוק את «${p.name}»? המנה תוסר מהאתר.`}>
                        <Trash2 className="size-4" aria-hidden />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
