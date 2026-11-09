import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
  Images,
  Layers,
  Settings,
  UtensilsCrossed,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminCard } from "@/components/admin/ui";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { readSiteSettingsForAdmin } from "@/lib/admin/site-settings-store";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "לוח בקרה",
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  { href: "/admin/products", label: "מנות", hint: "שם, תיאור, תמונה והצגה באתר", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "קטגוריות", hint: "סדר והסתרה של קטגוריות", icon: Layers },
  { href: "/admin/gallery", label: "גלריה", hint: "העלאה, סידור ומחיקה של תמונות", icon: Images },
  { href: "/admin/content", label: "טקסטים באתר", hint: "דף הבית ו«הסיפור שלנו»", icon: FileText },
  { href: "/admin/business", label: "פרטי העסק ושעות", hint: "טלפון, כתובת, שעות ורשתות", icon: Building2 },
  { href: "/admin/settings", label: "הזמנות והגדרות", hint: "קישור לקופה ותיאור לגוגל", icon: Settings },
] as const;

async function loadCounts() {
  const supabase = await createClient();
  const [visible, hidden, categories, gallery] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).is("deleted_at", null).eq("is_available", true),
    supabase.from("products").select("id", { count: "exact", head: true }).is("deleted_at", null).eq("is_available", false),
    supabase.from("categories").select("id", { count: "exact", head: true }).is("deleted_at", null).eq("is_active", true),
    supabase.from("gallery_images").select("id", { count: "exact", head: true }).is("deleted_at", null),
  ]);
  return {
    visible: visible.count ?? 0,
    hidden: hidden.count ?? 0,
    categories: categories.count ?? 0,
    gallery: gallery.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();
  const [counts, site] = configured
    ? await Promise.all([loadCounts(), readSiteSettingsForAdmin()])
    : [null, null];

  const checklist = site
    ? [
        {
          done: Boolean(site.settings.ordering.orderUrl),
          label: "קישור לדף ההזמנות של הקופה",
          todo: "עד שיוזן — כפתורי ההזמנה מחייגים למסעדה",
          href: "/admin/settings",
        },
        {
          done: site.settings.hours.length > 0,
          label: "שעות פעילות",
          todo: "האתר מפנה כרגע לטלפון לבירור שעות",
          href: "/admin/business",
        },
        {
          done: Object.values(site.settings.social).some(Boolean),
          label: "רשתות חברתיות",
          todo: "לא חובה — אייקונים יופיעו רק אחרי הזנה",
          href: "/admin/business",
        },
        {
          done: (counts?.gallery ?? 0) > 0,
          label: "תמונות בגלריה",
          todo: "כרגע מוצגות תמונות המנות",
          href: "/admin/gallery",
        },
      ]
    : [];

  const stats = counts
    ? [
        { label: "מנות מוצגות באתר", value: counts.visible },
        { label: "מנות מוסתרות", value: counts.hidden },
        { label: "קטגוריות פעילות", value: counts.categories },
        { label: "תמונות בגלריה", value: counts.gallery },
      ]
    : [];

  return (
    <>
      <AdminPageHeader title="שלום 👋" description="מכאן מנהלים את כל האתר — בלי קוד. כל שמירה מתעדכנת באתר מיד." />
      {!configured ? <SupabaseNotice /> : null}

      {stats.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="rounded-2xl border border-border/80 bg-surface-elevated px-5 py-4 shadow-[0_1px_2px_rgb(31_20_12/0.04)]">
              <p className="text-3xl font-black text-brand-900">{s.value}</p>
              <p className="mt-1 text-sm text-ink-muted">{s.label}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {checklist.length > 0 ? (
        <AdminCard title="מה עוד חסר באתר" description="פריטים שכדאי להשלים כדי שהאתר יהיה מלא">
          <ul className="divide-y divide-border/70">
            {checklist.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="flex items-center gap-3 py-3 hover:bg-brand-50/50">
                  {item.done ? (
                    <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden />
                  ) : (
                    <AlertCircle className="size-5 shrink-0 text-warning" aria-hidden />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-brand-900">{item.label}</span>
                    {!item.done ? <span className="block text-xs text-ink-muted">{item.todo}</span> : null}
                  </span>
                  <span className="text-xs font-bold text-gold-700">{item.done ? "הושלם" : "להשלמה"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex h-full items-start gap-4 rounded-2xl border border-border/80 bg-surface-elevated p-5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-gold-500/50 hover:shadow-[var(--shadow-md)]"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-gold-400">
                <link.icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold text-brand-900">{link.label}</span>
                <span className="mt-0.5 block text-sm text-ink-muted">{link.hint}</span>
              </span>
              <ArrowLeft className="mt-1 size-4 text-gold-700 transition-transform group-hover:-translate-x-1" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
