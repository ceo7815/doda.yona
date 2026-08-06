import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/services/orders";
import { OrderDetailClient } from "./order-detail-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrderById(id);
  return {
    title: order ? `הזמנה ${order.public_id}` : "הזמנה",
    robots: { index: false, follow: false },
  };
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-block text-sm text-brand-700 underline"
      >
        ← חזרה לרשימת הזמנות
      </Link>
      <OrderDetailClient order={order} />
    </div>
  );
}
