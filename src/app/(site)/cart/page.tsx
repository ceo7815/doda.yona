import type { Metadata } from "next";
import { getActiveDeliveryZones } from "@/services/orders";
import CartPageClient from "./cart-page-client";

export const metadata: Metadata = {
  title: "סל מוצרים",
  description: "סל מוצרים — משלוח או איסוף עצמי.",
};

export default async function CartPage() {
  const zones = await getActiveDeliveryZones();
  return <CartPageClient zones={zones} />;
}
