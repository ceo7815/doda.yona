import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/brand/page-hero";
import { Container } from "@/components/ui/container";
import { formatIls } from "@/lib/money";
import { formatIsraeliPhoneDisplay } from "@/lib/phone";
import { getOrderByPublicId } from "@/services/orders";
import {
  FULFILLMENT_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/types/domain";
import type { DeliveryAddressSnapshot } from "@/types/database";
import { ClearCartOnSuccess } from "../clear-cart-on-success";

type PageProps = {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ new?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params;
  return {
    title: `מעקב הזמנה ${publicId}`,
    robots: { index: false, follow: false },
  };
}

function formatAddress(snapshot: DeliveryAddressSnapshot | null): string {
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

export default async function OrderTrackingPage({
  params,
  searchParams,
}: PageProps) {
  const { publicId } = await params;
  const { new: isNew } = await searchParams;
  const order = await getOrderByPublicId(publicId);

  if (!order) {
    notFound();
  }

  const totalLabel =
    order.total_agorot === 0 ? "לבירור" : formatIls(order.total_agorot);

  return (
    <div className="pb-20">
      <PageHero
        title={`הזמנה ${order.public_id}`}
        subtitle={
          isNew === "1"
            ? "תודה! ההזמנה התקבלה ונשלחה למטבח."
            : "מעקב אחר סטטוס ההזמנה"
        }
      />

      <Container className="surface-paper py-12">
        {isNew === "1" ? <ClearCartOnSuccess /> : null}
        <div className="mx-auto max-w-2xl space-y-8">
          {isNew === "1" ? (
            <div
              className="rounded-md border border-success/40 bg-success/10 px-4 py-3 text-sm"
              role="status"
            >
              ההזמנה נקלטה בהצלחה. ניצור קשר במידת הצורך.
            </div>
          ) : null}

          <section className="border border-border bg-surface-elevated p-6">
            <h2 className="text-lg font-extrabold text-brand-900">סטטוס</h2>
            <p className="mt-3 text-2xl font-bold text-gold-700">
              {ORDER_STATUS_LABELS[order.status]}
            </p>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-ink-muted">סוג הזמנה</dt>
                <dd className="font-semibold">
                  {FULFILLMENT_LABELS[order.fulfillment_type]}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">תשלום</dt>
                <dd className="font-semibold">
                  {PAYMENT_METHOD_LABELS[order.payment_method]} ·{" "}
                  {PAYMENT_STATUS_LABELS[order.payment_status]}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">שם</dt>
                <dd className="font-semibold">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">טלפון</dt>
                <dd className="font-semibold" dir="ltr">
                  {formatIsraeliPhoneDisplay(order.customer_phone)}
                </dd>
              </div>
              {order.fulfillment_type === "delivery" ? (
                <div className="sm:col-span-2">
                  <dt className="text-ink-muted">כתובת משלוח</dt>
                  <dd className="font-semibold">
                    {formatAddress(order.delivery_address_snapshot)}
                  </dd>
                </div>
              ) : null}
              {order.notes ? (
                <div className="sm:col-span-2">
                  <dt className="text-ink-muted">הערות</dt>
                  <dd className="font-semibold">{order.notes}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="border border-border bg-surface-elevated p-6">
            <h2 className="text-lg font-extrabold text-brand-900">פריטים</h2>
            <ul className="mt-4 divide-y divide-border">
              {order.order_items.map((item, index) => (
                <li
                  key={`${item.product_name}-${index}`}
                  className="flex justify-between gap-4 py-3 text-sm"
                >
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="font-bold text-gold-700">
                    {item.unit_price_agorot === 0
                      ? "לבירור"
                      : formatIls(item.line_total_agorot)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-bold">
              <span>סה״כ</span>
              <span className="text-gold-700">{totalLabel}</span>
            </div>
          </section>

          <p className="text-center text-sm text-ink-muted">
            שמרו את מספר ההזמנה למעקב.{" "}
            <Link href="/menu" className="text-brand-700 underline">
              חזרה לתפריט
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
