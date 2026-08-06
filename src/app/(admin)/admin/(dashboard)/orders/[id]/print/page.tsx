import type { Metadata } from "next";
import { PrintButton } from "./print-button";
import { notFound } from "next/navigation";
import { getOrderById } from "@/services/orders";
import {
  FULFILLMENT_LABELS,
  ORDER_STATUS_LABELS,
} from "@/types/domain";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "הדפסת הזמנה",
  robots: { index: false, follow: false },
};

function formatIls(agorot: number): string {
  if (agorot === 0) return "לבירור";
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
  }).format(agorot / 100);
}

function formatAddress(snapshot: Record<string, string | undefined> | null): string {
  if (!snapshot) return "—";
  const parts = [
    snapshot.street,
    snapshot.house_number,
    snapshot.city,
    snapshot.apartment ? `דירה ${snapshot.apartment}` : null,
    snapshot.floor ? `קומה ${snapshot.floor}` : null,
    snapshot.entrance ? `כניסה ${snapshot.entrance}` : null,
  ].filter(Boolean);
  return parts.join(", ") || "—";
}

export default async function OrderPrintPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg p-6 font-mono text-sm print:p-0">
      <style>{`
        @media print {
          body { background: white; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print mb-6 flex gap-3">
        <PrintButton />
      </div>

      <header className="border-b-2 border-black pb-4 text-center">
        <h1 className="text-xl font-bold">דודה יונה — הזמנה</h1>
        <p className="mt-2 text-lg font-bold">{order.public_id}</p>
        <p>{new Date(order.created_at).toLocaleString("he-IL")}</p>
        <p className="mt-1">{ORDER_STATUS_LABELS[order.status]}</p>
      </header>

      <section className="mt-4 space-y-1">
        <p>
          <strong>לקוח:</strong> {order.customer_name}
        </p>
        <p dir="ltr">
          <strong>טלפון:</strong> {order.customer_phone}
        </p>
        <p>
          <strong>סוג:</strong> {FULFILLMENT_LABELS[order.fulfillment_type]}
        </p>
        {order.fulfillment_type === "delivery" ? (
          <>
            {order.delivery_zones ? (
              <p>
                <strong>אזור:</strong> {order.delivery_zones.name}
              </p>
            ) : null}
            <p>
              <strong>כתובת:</strong>{" "}
              {formatAddress(order.delivery_address_snapshot)}
            </p>
          </>
        ) : null}
        {order.notes ? (
          <p>
            <strong>הערות:</strong> {order.notes}
          </p>
        ) : null}
      </section>

      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="border-b border-black">
            <th className="py-2 text-start">מנה</th>
            <th className="py-2 text-start">×</th>
            <th className="py-2 text-start">מחיר</th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item) => (
            <tr key={item.id} className="border-b border-dashed border-gray-400">
              <td className="py-2">
                {item.product_name}
                {item.notes ? (
                  <span className="block text-xs">({item.notes})</span>
                ) : null}
              </td>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2">{formatIls(item.line_total_agorot)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="mt-6 border-t-2 border-black pt-4">
        <p className="flex justify-between font-bold">
          <span>סה״כ</span>
          <span>{formatIls(order.total_agorot)}</span>
        </p>
      </footer>
    </div>
  );
}
