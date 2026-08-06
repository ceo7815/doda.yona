import type { Metadata } from "next";
import { RESTAURANT } from "@/data/catalog";
import { getCatalog } from "@/services/catalog";
import MenuPageClient from "./menu-page-client";

export const metadata: Metadata = {
  title: "תפריט והזמנות",
  description: `תפריט והזמנות — ${RESTAURANT.tagline}. ${RESTAURANT.locationLabel}.`,
};

export default async function MenuPage() {
  const catalog = await getCatalog();
  return (
    <MenuPageClient categories={catalog.categories} items={catalog.items} />
  );
}
