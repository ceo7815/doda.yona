import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { formatAdminPrice } from "@/lib/admin/format";
import { isSupabaseConfigured } from "@/lib/env";
import { listRecentOrders } from "@/services/orders";
import {
  FULFILLMENT_LABELS,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/types/domain";

export const metadata: Metadata = {
  title: "הזמנות",
  robots: { index: false, follow: false },
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminOrdersPage() {
  const configured = isSupabaseConfigured();
  const orders = configured ? await listRecentOrders(100) : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="הזמנות"
        description="הזמנות נכנסות — קבלה, עדכון סטטוס והדפסה למטבח."
      />

      {!configured ? <SupabaseNotice /> : null}

      {configured ? (
        <section className="rounded-md border border-border">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-bold text-ink">
              {orders.length === 0
                ? "אין הזמנות עדיין"
                : `${orders.length} הזמנות אחרונות`}
            </h2>
          </div>

          {orders.length === 0 ? (
            <p className="px-4 py-6 text-sm text-ink-muted">
              הזמנות יופיעו כאן אחרי שהלקוחות ישלחו הזמנה מהאתר.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-brand-50 text-start">
                    <th className="px-4 py-2 font-medium">מספר</th>
                    <th className="px-4 py-2 font-medium">לקוח</th>
                    <th className="px-4 py-2 font-medium">סוג</th>
                    <th className="px-4 py-2 font-medium">סטטוס</th>
                    <th className="px-4 py-2 font-medium">סה״כ</th>
                    <th className="px-4 py-2 font-medium">תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-brand-700 underline"
                        >
                          {order.public_id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-ink-muted" dir="ltr">
                          {order.customer_phone}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {FULFILLMENT_LABELS[order.fulfillment_type]}
                      </td>
                      <td className="px-4 py-3">
                        {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                      </td>
                      <td className="px-4 py-3">
                        {formatAdminPrice(order.total_agorot)}
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
