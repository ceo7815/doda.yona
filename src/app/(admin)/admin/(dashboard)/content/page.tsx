import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SupabaseNotice } from "@/components/admin/supabase-notice";
import { ContentForm } from "@/components/admin/forms/content-form";
import { readSiteSettingsForAdmin } from "@/lib/admin/site-settings-store";
import { isSupabaseConfigured } from "@/lib/env";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export const metadata: Metadata = { title: "טקסטים באתר", robots: { index: false, follow: false } };

export default async function AdminContentPage() {
  const configured = isSupabaseConfigured();
  const { settings, error } = configured
    ? await readSiteSettingsForAdmin()
    : { settings: DEFAULT_SITE_SETTINGS, error: null };
  return (
    <>
      <AdminPageHeader title="טקסטים באתר" description="עריכת הטקסטים של דף הבית ושל עמוד «הסיפור שלנו». השינויים מופיעים באתר מיד אחרי השמירה." />
      {!configured ? <SupabaseNotice /> : null}
      {error ? <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <ContentForm settings={settings} disabled={!configured} />
    </>
  );
}
