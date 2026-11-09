import { cache } from "react";
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  type MenuCategory,
  type MenuItem,
} from "@/data/catalog";
import { logServerError } from "@/lib/errors";
import { createPublicClient, resolveMediaUrl } from "@/lib/supabase/public";
import type { Category, Product } from "@/types/database";

export type Catalog = {
  categories: MenuCategory[];
  items: MenuItem[];
  /** true כשהנתונים מגיעים מהקוד ולא ממסד הנתונים */
  isFallback: boolean;
};

function mapCategory(row: Category): MenuCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sortOrder: row.sort_order,
  };
}

function mapProduct(row: Product): MenuItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    categoryId: row.category_id,
    isAvailable: row.is_available,
    isFeatured: row.is_featured,
    badges: row.badges.length > 0 ? row.badges : undefined,
    sortOrder: row.sort_order,
    imagePath: resolveMediaUrl(row.image_path),
  };
}

function staticCatalog(): Catalog {
  return {
    categories: MENU_CATEGORIES,
    items: MENU_ITEMS.filter((item) => item.isAvailable),
    isFallback: true,
  };
}

/**
 * קטגוריות ומנות מוצגות. קורא מ-Supabase (במטמון, מוגבל בזמן) ונופל לקטלוג
 * הסטטי אם אין חיבור. `cache` מונע קריאה כפולה באותו רינדור.
 */
export const getCatalog = cache(async (): Promise<Catalog> => {
  const supabase = createPublicClient();
  if (!supabase) return staticCatalog();

  try {
    const [categoriesResult, productsResult] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .is("deleted_at", null)
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("products")
        .select("*")
        .is("deleted_at", null)
        .eq("is_available", true)
        .order("sort_order"),
    ]);

    if (categoriesResult.error || productsResult.error) {
      logServerError(
        "getCatalog",
        categoriesResult.error ?? productsResult.error,
      );
      return staticCatalog();
    }

    const categories = (categoriesResult.data as Category[]).map(mapCategory);
    const activeIds = new Set(categories.map((c) => c.id));
    const items = (productsResult.data as Product[])
      .filter((row) => activeIds.has(row.category_id))
      .map(mapProduct);

    if (categories.length === 0 && items.length === 0) {
      return staticCatalog();
    }

    return { categories, items, isFallback: false };
  } catch (error) {
    logServerError("getCatalog", error);
    return staticCatalog();
  }
});

export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  const catalog = await getCatalog();
  const decoded = decodeURIComponent(slug);
  return catalog.items.find((item) => item.slug === decoded) ?? null;
}

/** מנות מומלצות לדף הבית */
export async function getFeaturedMenuItems(limit = 4): Promise<MenuItem[]> {
  const { items } = await getCatalog();
  const featured = items
    .filter((item) => item.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const rest = items.filter((item) => !item.isFeatured);
  return [...featured, ...rest].slice(0, limit);
}
