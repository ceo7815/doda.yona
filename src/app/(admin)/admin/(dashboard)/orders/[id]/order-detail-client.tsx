"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateOrderStatusAction,
  type UpdateOrderStatusState,
} from "../actions";
import {
  FULFILLMENT_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
} from "@/types/domain";

type OrderDetailClientProps = {
  order: {
    id: string;
    public_id: string;
    status: OrderStatus;
    fulfillment_type: "delivery" | "pickup";
    payment_method: "cash" | "card_on_delivery" | "online" | "other";
    payment_status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
    customer_name: string;
    customer_phone: string;
    notes: string | null;
    subtotal_agorot: number;
    delivery_fee_agorot: number;
    total_agorot: number;
    created_at: string;
    delivery_address_snapshot: Record<string, string | undefined> | null;
    delivery_zones: { name: string } | null;
    order_items: Array<{
      id: string;
      product_name: string;
      quantity: number;
      unit_price_agorot: number;
      line_total_agorot: number;
      notes: string | null;
    }>;
  };
};

const STATUS_OPTIONS: OrderStatus[] = [
  "received",
  "preparing",
  "ready_for_pickup",
  "out_for_delivery",
  "completed",
  "cancelled",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} size="sm">
      עדכון סטטוס
    </Button>
  );
}

function formatIlsLocal(agorot: number): string {
  if (agorot === 0) return "לבירור";
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
  }).format(agorot / 100);
}

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const [state, formAction] = useActionState(updateOrderStatusAction, {
    ok: false,
  } satisfies UpdateOrderStatusState);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-rubik)] text-2xl font-bold text-ink">
            {order.public_id}
          </h1>
          <p className="mt-1 text-ink-muted">
            {new Date(order.created_at).toLocaleString("he-IL")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/orders/${order.id}/print`}
            className="inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-bold hover:bg-brand-50"
            target="_blank"
          >
            הדפסה למטבח
          </Link>
          <Link
            href={`/order/${order.public_id}`}
            className="inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-bold hover:bg-brand-50"
            target="_blank"
          >
            צפייה ללקוח
          </Link>
        </div>
      </div>

      {state.message ? (
        <div
          className={`rounded-md px-4 py-3 text-sm ${
            state.ok
              ? "border border-success/40 bg-success/10"
              : "border border-danger/40 bg-danger/10 text-danger"
          }`}
          role="status"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface-elevated p-4">
          <h2 className="font-bold">פרטי לקוח</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">שם</dt>
              <dd className="font-medium">{order.customer_name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">טלפון</dt>
              <dd className="font-medium" dir="ltr">
                {order.customer_phone}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">סוג</dt>
              <dd>{FULFILLMENT_LABELS[order.fulfillment_type]}</dd>
            </div>
            {order.delivery_zones ? (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">אזור</dt>
                <dd>{order.delivery_zones.name}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">תשלום</dt>
              <dd>
                {PAYMENT_METHOD_LABELS[order.payment_method]} ·{" "}
                {PAYMENT_STATUS_LABELS[order.payment_status]}
              </dd>
            </div>
          </dl>
          {order.notes ? (
            <p className="mt-4 rounded-md bg-brand-50 p-3 text-sm">
              <span className="font-medium">הערות: </span>
              {order.notes}
            </p>
          ) : null}
        </section>

        <section className="rounded-lg border border-border bg-surface-elevated p-4">
          <h2 className="font-bold">עדכון סטטוס</h2>
          <p className="mt-1 text-sm text-ink-muted">
            נוכחי: {ORDER_STATUS_LABELS[order.status]}
          </p>
          <form action={formAction} className="mt-4 space-y-4">
            <input type="hidden" name="orderId" value={order.id} />
            <div>
              <label htmlFor="status" className="text-sm font-medium">
                סטטוס חדש
              </label>
              <select
                id="status"
                name="status"
                defaultValue={order.status}
                className="mt-1.5 min-h-11 w-full rounded-md border border-border bg-surface-elevated px-3"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <Input
              name="cancelledReason"
              label="סיבת ביטול (אם רלוונטי)"
              hint="מלאו רק בעת ביטול ההזמנה"
            />
            <SubmitButton />
          </form>
        </section>
      </div>

      <section className="rounded-lg border border-border bg-surface-elevated p-4">
        <h2 className="font-bold">פריטים</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-ink-muted">
              <th className="py-2 text-start">מנה</th>
              <th className="py-2 text-start">כמות</th>
              <th className="py-2 text-start">מחיר</th>
              <th className="py-2 text-start">סה״כ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {order.order_items.map((item) => (
              <tr key={item.id}>
                <td className="py-2">
                  {item.product_name}
                  {item.notes ? (
                    <span className="block text-xs text-ink-muted">
                      {item.notes}
                    </span>
                  ) : null}
                </td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">
                  {formatIlsLocal(item.unit_price_agorot)}
                </td>
                <td className="py-2 font-medium">
                  {formatIlsLocal(item.line_total_agorot)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt>סיכום ביניים</dt>
            <dd>{formatIlsLocal(order.subtotal_agorot)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>משלוח</dt>
            <dd>{formatIlsLocal(order.delivery_fee_agorot)}</dd>
          </div>
          <div className="flex justify-between text-base font-bold">
            <dt>סה״כ</dt>
            <dd>{formatIlsLocal(order.total_agorot)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
