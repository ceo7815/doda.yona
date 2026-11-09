import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <div className="grid min-h-dvh bg-[#f6f1e8] lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <p className="text-xs font-bold tracking-[0.2em] text-gold-700">אזור ניהול</p>
          <h1 className="mt-2 text-3xl font-black text-brand-950">{name}</h1>
          <p className="mt-2 text-sm text-ink-muted">כניסה לניהול האתר — מנות, גלריה, טקסטים ושעות.</p>

          <div className="mt-8 rounded-2xl border border-border/80 bg-white p-6 shadow-[0_1px_2px_rgb(31_20_12/0.04),0_12px_32px_rgb(31_20_12/0.06)]">
            <AdminLoginForm
              nextPath={params.next}
              configError={params.error === "config" || !isSupabaseConfigured()}
            />
          </div>

          <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800 hover:text-gold-700">
            <ArrowRight className="size-4" aria-hidden />
            חזרה לאתר
          </Link>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-brand-950 lg:block">
        <Image src="/menu/jachnun-parve.webp" alt="" fill priority sizes="55vw" className="object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent" />
        <p className="absolute right-10 bottom-10 left-10 text-2xl font-extrabold leading-snug text-white">
          הכל באתר — <span className="text-gold-400">בלי שורת קוד אחת.</span>
        </p>
      </div>
    </div>
  );
}
