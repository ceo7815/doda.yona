import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { logoutAdmin } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/admin";
import { getRestaurantName } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { AdminNav } from "@/components/admin/admin-nav";

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
    <div className="min-h-dvh bg-[#f6f1e8] lg:flex">
      {/* סרגל צד — דסקטופ */}
      <aside className="no-print sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-brand-900 px-4 py-6 text-brand-50 lg:flex">
        <Link href="/admin" className="px-2">
          <span className="block text-2xl font-black text-gold-gradient">{name}</span>
          <span className="mt-0.5 block text-xs font-medium tracking-[0.18em] text-brand-300">ניהול האתר</span>
        </Link>
        <div className="mt-8 flex-1">
          <AdminNav variant="sidebar" />
        </div>
        <div className="space-y-1 border-t border-white/10 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm text-brand-200 hover:bg-white/5 hover:text-gold-300"
          >
            <ExternalLink className="size-4" aria-hidden />
            צפייה באתר
          </Link>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-sm text-brand-200 hover:bg-white/5 hover:text-gold-300"
            >
              <LogOut className="size-4" aria-hidden />
              התנתקות
            </button>
          </form>
          <p className="truncate px-3 pt-2 text-xs text-brand-400" dir="ltr">
            {admin.email}
          </p>
        </div>
      </aside>

      {/* סרגל עליון — מובייל */}
      <header className="no-print sticky top-0 z-30 bg-brand-900 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] text-brand-50 shadow-md lg:hidden">
        <div className="flex items-center justify-between pb-3">
          <Link href="/admin" className="text-xl font-black text-gold-gradient">
            {name} · ניהול
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/" target="_blank" className="inline-flex size-10 items-center justify-center rounded-xl text-brand-200 hover:bg-white/10" aria-label="צפייה באתר">
              <ExternalLink className="size-[1.1rem]" aria-hidden />
            </Link>
            <form action={logoutAdmin}>
              <button type="submit" className="inline-flex size-10 items-center justify-center rounded-xl text-brand-200 hover:bg-white/10" aria-label="התנתקות">
                <LogOut className="size-[1.1rem]" aria-hidden />
              </button>
            </form>
          </div>
        </div>
        <AdminNav variant="bar" />
      </header>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-5xl space-y-6">{children}</div>
      </main>
    </div>
  );
}
