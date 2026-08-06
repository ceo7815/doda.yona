import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { isMissingTableError } from "@/lib/admin/format";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "דשבורד",
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  { href: "/admin/categories", label: "קטגוריות", hint: "ארגון התפריט" },
  { href: "/admin/products", label: "מנות", hint: "מחירים וזמינות" },
  { href: "/admin/delivery-zones", label: "אזורי משלוח", hint: "דמי משלוח ואזורים" },
  { href: "/admin/orders", label: "הזמנות", hint: "קבלה, סטטוס והדפסה" },
  { href: "/admin/customers", label: "לקוחות", hint: "היסטוריה ופרטים" },
] as const;

type DashboardStats = {
  categories: number | null;
  products: number | null;
  unavailableProducts: number | null;
  customers: number | null;
  ordersToday: number | null;
  newOrders: number | null;
};

async function loadStats(): Promise<{ stats: DashboardStats; dbError: string | null }> {
  const stats: DashboardStats = {
    categories: null,
    products: null,
    unavailableProducts: null,
    customers: null,
    ordersToday: null,
    newOrders: null,
  };

  try {
    const supabase = await createClient();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      categories,
      products,
      unavailable,
      customers,
      ordersToday,
      newOrders,
    ] = await Promise.all([
      supabase
        .from("categories")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("is_available", false),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString()),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "received"),
    ]);

    const firstError =
      categories.error ??
      products.error ??
      unavailable.error ??
      customers.error ??
      ordersToday.error ??
      newOrders.error;

    if (firstError && isMissingTableError(firstError)) {
      return { stats, dbError: "מסד הנתונים ריק או המיגרציות טרם הורצו." };
    }

    stats.categories = categories.count ?? 0;
    stats.products = products.count ?? 0;
    stats.unavailableProducts = unavailable.count ?? 0;
    stats.customers = customers.count ?? 0;
    stats.ordersToday = ordersToday.count ?? 0;
    stats.newOrders = newOrders.count ?? 0;

    return { stats, dbError: null };
  } catch {
    return { stats, dbError: "לא ניתן לטעון נתונים מהמסד." };
  }
}

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();
  const { stats, dbError } = configured
    ? await loadStats()
    : {
        stats: {
          categories: null,
          products: null,
          unavailableProducts: null,
          customers: null,
          ordersToday: null,
          newOrders: null,
        } as DashboardStats,
        dbError: null,
      };

  const isEmpty =
    configured &&
    !dbError &&
    stats.categories === 0 &&
    stats.products === 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="דשבורד"
        description="סקירה מהירה וקיצורי דרך לניהול העסק."
      />

      {!configured ? <SupabaseNotice /> : null}
      {dbError ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          {dbError}
        </div>
      ) : null}

      {configured && isEmpty ? (
        <section className="rounded-md border border-gold-400/40 bg-gold-50 px-4 py-4 text-sm">
          <h2 className="font-bold text-brand-900">התחלה מהירה</h2>
          <p className="mt-2 text-ink-muted">
            מסד הנתונים מחובר אך עדיין ריק. מומלץ לפעול לפי הסדר:
          </p>
          <ol className="mt-3 list-inside list-decimal space-y-1 text-ink">
            <li>
              <Link href="/admin/categories" className="text-brand-700 underline">
                צרו קטגוריות
              </Link>{" "}
              — מרקים, מאפים תימניים, תוספות
            </li>
            <li>
              <Link href="/admin/products" className="text-brand-700 underline">
                הוסיפו מנות
              </Link>{" "}
              — מחיר בשקלים (0 = לבירור)
            </li>
            <li>
              <Link href="/admin/delivery-zones" className="text-brand-700 underline">
                הגדירו אזורי משלוח
              </Link>
            </li>
            <li>לאחר הפעלת ההזמנות — הזמנות ולקוחות יופיעו כאן אוטומטית</li>
          </ol>
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            label: "הזמנות חדשות",
            value: stats.newOrders ?? "—",
          },
          {
            label: "הושלמו היום",
            value: stats.ordersToday ?? "—",
          },
          {
            label: "קטגוריות",
            value: stats.categories ?? "—",
          },
          {
            label: "מנות",
            value: stats.products ?? "—",
          },
          {
            label: "מנות לא זמינות",
            value: stats.unavailableProducts ?? "—",
          },
          {
            label: "לקוחות",
            value: stats.customers ?? "—",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-md border border-border bg-surface-elevated p-4"
          >
            <p className="text-sm text-ink-muted">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-brand-800">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-md border border-border p-4">
        <h2 className="text-lg font-bold text-ink">ניהול מהיר</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 text-sm hover:bg-brand-50"
              >
                <span className="font-medium text-brand-900">{link.label}</span>
                <span className="text-ink-muted">{link.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
