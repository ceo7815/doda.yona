import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/login-form";
import { getRestaurantName, isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "כניסת מנהלים",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const name = getRestaurantName();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[linear-gradient(160deg,var(--color-brand-100),var(--color-surface)_50%,var(--color-brand-50))] px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface-elevated p-6 shadow-md sm:p-8">
        <p className="text-sm font-medium text-brand-700">אזור ניהול</p>
        <h1 className="mt-1 font-[family-name:var(--font-rubik)] text-2xl font-bold text-ink">
          {name}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          כניסה למנהלים בלבד. אין גישה למשתמשים שאינם מורשים.
        </p>

        <div className="mt-6">
          <AdminLoginForm
            nextPath={params.next}
            configError={params.error === "config" || !isSupabaseConfigured()}
          />
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          <Link href="/" className="text-brand-700 underline">
            חזרה לאתר
          </Link>
        </p>
      </div>
    </div>
  );
}
