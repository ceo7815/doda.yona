import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { formatAdminPrice, isMissingTableError } from "@/lib/admin/format";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "לקוחות",
  robots: { index: false, follow: false },
};

type CustomerRow = {
  id: string;
  phone: string;
  full_name: string;
  orders_count: number;
  total_spent_agorot: number;
  last_order_at: string | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminCustomersPage() {
  const configured = isSupabaseConfigured();

  let customers: CustomerRow[] = [];
  let dbError: string | null = null;

  if (configured) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("customers")
      .select("id, phone, full_name, orders_count, total_spent_agorot, last_order_at")
      .is("deleted_at", null)
      .order("last_order_at", { ascending: false, nullsFirst: false })
      .order("full_name", { ascending: true });

    if (error) {
      dbError = isMissingTableError(error)
        ? "טבלת הלקוחות עדיין לא קיימת. הריצו את המיגרציות."
        : "לא ניתן לטעון לקוחות.";
    } else {
      customers = data ?? [];
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="לקוחות"
        description="רשימת לקוחות והיסטוריית הזמנות."
      />

      {!configured ? <SupabaseNotice /> : null}
      {dbError ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          {dbError}
        </div>
      ) : null}

      {configured && !dbError ? (
        <section className="rounded-md border border-border">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-bold text-ink">
              {customers.length === 0 ? "אין לקוחות עדיין" : `${customers.length} לקוחות`}
            </h2>
          </div>

          {customers.length === 0 ? (
            <p className="px-4 py-6 text-sm text-ink-muted">
              לקוחות יופיעו כאן לאחר קבלת הזמנות ראשונות באתר.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-brand-50 text-start">
                    <th className="px-4 py-2 font-medium">שם</th>
                    <th className="px-4 py-2 font-medium">טלפון</th>
                    <th className="px-4 py-2 font-medium">הזמנות</th>
                    <th className="px-4 py-2 font-medium">סה״כ</th>
                    <th className="px-4 py-2 font-medium">הזמנה אחרונה</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="font-medium text-brand-700 underline"
                        >
                          {customer.full_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3" dir="ltr">
                        {customer.phone}
                      </td>
                      <td className="px-4 py-3">{customer.orders_count}</td>
                      <td className="px-4 py-3">
                        {customer.total_spent_agorot > 0
                          ? formatAdminPrice(Number(customer.total_spent_agorot))
                          : "—"}
                      </td>
                      <td className="px-4 py-3">{formatDate(customer.last_order_at)}</td>
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
