import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { formatAdminPrice, isMissingTableError } from "@/lib/admin/format";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  FULFILLMENT_LABELS,
  type OrderStatus,
  type PaymentStatus,
  type FulfillmentType,
} from "@/types/domain";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "פרטי לקוח",
  robots: { index: false, follow: false },
};

type OrderRow = {
  id: string;
  public_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  fulfillment_type: FulfillmentType;
  total_agorot: number;
  created_at: string;
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const configured = isSupabaseConfigured();

  if (!configured) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="פרטי לקוח" />
        <SupabaseNotice />
      </div>
    );
  }

  const supabase = await createClient();

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select(
      "id, phone, full_name, orders_count, total_spent_agorot, first_order_at, last_order_at, internal_notes, created_at",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (customerError) {
    const message = isMissingTableError(customerError)
      ? "טבלת הלקוחות עדיין לא קיימת."
      : "לא ניתן לטעון את פרטי הלקוח.";
    return (
      <div className="space-y-6">
        <AdminPageHeader title="פרטי לקוח" />
        <div className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          {message}
        </div>
      </div>
    );
  }

  if (!customer) {
    notFound();
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, public_id, status, payment_status, fulfillment_type, total_agorot, created_at")
    .eq("customer_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const orderList = (orders ?? []) as OrderRow[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AdminPageHeader title={customer.full_name} description="כרטיס לקוח והיסטוריית הזמנות" />
        <Link href="/admin/customers" className="text-sm text-brand-700 underline">
          ← חזרה לרשימה
        </Link>
      </div>

      <section className="rounded-md border border-border p-4">
        <h2 className="font-bold text-ink">פרטים</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-ink-muted">טלפון</dt>
            <dd className="font-medium" dir="ltr">
              {customer.phone}
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted">מספר הזמנות</dt>
            <dd className="font-medium">{customer.orders_count}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">סה״כ הוצאות</dt>
            <dd className="font-medium">
              {customer.total_spent_agorot > 0
                ? formatAdminPrice(Number(customer.total_spent_agorot))
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted">הזמנה ראשונה</dt>
            <dd>{formatDate(customer.first_order_at)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">הזמנה אחרונה</dt>
            <dd>{formatDate(customer.last_order_at)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">נרשם</dt>
            <dd>{formatDate(customer.created_at)}</dd>
          </div>
        </dl>

        {customer.internal_notes ? (
          <div className="mt-4 rounded-md bg-brand-50 px-3 py-2 text-sm">
            <p className="font-medium text-ink">הערות פנימיות</p>
            <p className="mt-1 text-ink-muted">{customer.internal_notes}</p>
          </div>
        ) : null}
      </section>

      <section className="rounded-md border border-border">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-bold text-ink">
            {orderList.length === 0 ? "אין הזמנות" : `היסטוריית הזמנות (${orderList.length})`}
          </h2>
        </div>

        {orderList.length === 0 ? (
          <p className="px-4 py-6 text-sm text-ink-muted">הלקוח עדיין לא ביצע הזמנות.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-brand-50 text-start">
                  <th className="px-4 py-2 font-medium">מס׳ הזמנה</th>
                  <th className="px-4 py-2 font-medium">תאריך</th>
                  <th className="px-4 py-2 font-medium">סוג</th>
                  <th className="px-4 py-2 font-medium">סטטוס</th>
                  <th className="px-4 py-2 font-medium">תשלום</th>
                  <th className="px-4 py-2 font-medium">סכום</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium" dir="ltr">
                      {order.public_id}
                    </td>
                    <td className="px-4 py-3">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3">
                      {FULFILLMENT_LABELS[order.fulfillment_type]}
                    </td>
                    <td className="px-4 py-3">{ORDER_STATUS_LABELS[order.status]}</td>
                    <td className="px-4 py-3">
                      {PAYMENT_STATUS_LABELS[order.payment_status]}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatAdminPrice(order.total_agorot)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
