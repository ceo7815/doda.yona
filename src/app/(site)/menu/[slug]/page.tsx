import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuItemDetailClient } from "@/components/menu/menu-item-detail-client";
import { MENU_CATEGORIES } from "@/data/catalog";
import { getCatalog, getMenuItemBySlug } from "@/services/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMenuItemBySlug(slug);
  if (!item) {
    return { title: "מנה לא נמצאה" };
  }
  return {
    title: item.name,
    description: item.description,
  };
}

export default async function MenuItemPage({ params }: PageProps) {
  const { slug } = await params;
  const [catalog, item] = await Promise.all([
    getCatalog(),
    getMenuItemBySlug(slug),
  ]);

  if (!item) {
    notFound();
  }

  const category =
    catalog.categories.find((c) => c.id === item.categoryId) ??
    MENU_CATEGORIES.find((c) => c.id === item.categoryId) ??
    null;

  return (
    <MenuItemDetailClient
      item={item}
      category={category}
      categories={catalog.categories}
    />
  );
}
