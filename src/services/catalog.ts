import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  type MenuCategory,
  type MenuItem,
} from "@/data/catalog";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types/database";

export type Catalog = {
  categories: MenuCategory[];
  items: MenuItem[];
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
    priceAgorot: row.price_agorot === 0 ? null : row.price_agorot,
    isAvailable: row.is_available,
    isFeatured: row.is_featured,
    badges: row.badges.length > 0 ? row.badges : undefined,
    sortOrder: row.sort_order,
    imagePath: row.image_path,
  };
}

function staticCatalog(): Catalog {
  return {
    categories: MENU_CATEGORIES,
    items: MENU_ITEMS,
  };
}

/**
 * מחזיר קטגוריות ומוצרים מ-Supabase אם מוגדר, אחרת מהקטalog הסטטי.
 */
export async function getCatalog(): Promise<Catalog> {
  if (!isSupabaseConfigured()) {
    return staticCatalog();
  }

  const supabase = await createClient();

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
      .order("sort_order"),
  ]);

  if (categoriesResult.error || productsResult.error) {
    return staticCatalog();
  }

  const categories = (categoriesResult.data as Category[]).map(mapCategory);
  const items = (productsResult.data as Product[]).map(mapProduct);

  if (categories.length === 0 && items.length === 0) {
    return staticCatalog();
  }

  return { categories, items };
}

export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  const catalog = await getCatalog();
  return catalog.items.find((item) => item.slug === slug) ?? null;
}
