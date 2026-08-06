import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/admin";
import { getRestaurantName } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { AppError } from "@/lib/errors";

const ADMIN_NAV = [
  { href: "/admin", label: "דשבורד" },
  { href: "/admin/categories", label: "קטגוריות" },
  { href: "/admin/products", label: "מנות" },
  { href: "/admin/orders", label: "הזמנות" },
  { href: "/admin/delivery-zones", label: "אזורי משלוח" },
  { href: "/admin/customers", label: "לקוחות" },
] as const;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const name = getRestaurantName();

  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (error instanceof AppError) {
      if (error.code === "UNAUTHORIZED" || error.code === "FORBIDDEN") {
        redirect("/admin/login");
      }
      if (error.code === "SERVICE_UNAVAILABLE") {
        redirect("/admin/login?error=config");
      }
    }
    throw error;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-brand-50 md:flex-row">
      <aside className="no-print border-b border-border bg-brand-900 text-brand-50 md:w-60 md:border-b-0 md:border-e">
        <div className="px-4 py-5">
          <p className="text-xs text-brand-300">ניהול</p>
          <p className="font-[family-name:var(--font-rubik)] text-lg font-bold">
            {name}
          </p>
          <p className="mt-1 truncate text-xs text-brand-200" dir="ltr">
            {admin.email}
          </p>
        </div>
        <nav aria-label="תפריט ניהול" className="flex flex-col gap-0.5 px-2 pb-4">
          {ADMIN_NAV.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              href={item.href}
              className="rounded-md px-3 py-2.5 text-sm hover:bg-brand-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAdmin} className="border-t border-brand-800 p-3">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-brand-100 hover:bg-brand-800 hover:text-white"
          >
            התנתקות
          </Button>
        </form>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print flex min-h-14 items-center border-b border-border bg-surface-elevated px-4">
          <Link href="/" className="text-sm text-brand-700 underline">
            חזרה לאתר
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
