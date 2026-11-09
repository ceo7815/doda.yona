import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { SettingsForm } from "@/components/admin/forms/settings-form";
import { readSiteSettingsForAdmin } from "@/lib/admin/site-settings-store";
import { isSupabaseConfigured } from "@/lib/env";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export const metadata: Metadata = { title: "הזמנות והגדרות", robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  const configured = isSupabaseConfigured();
  const { settings, error } = configured
    ? await readSiteSettingsForAdmin()
    : { settings: DEFAULT_SITE_SETTINGS, error: null };
  return (
    <>
      <AdminPageHeader title="הזמנות והגדרות" description="לאן מובילים כפתורי ההזמנה, ואיך האתר מופיע בגוגל." />
      {!configured ? <SupabaseNotice /> : null}
      {error ? <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <SettingsForm settings={settings} disabled={!configured} />
    </>
  );
}
