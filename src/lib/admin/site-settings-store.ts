import { createClient } from "@/lib/supabase/server";
import { mergeSiteSettings, type SiteSettings } from "@/lib/site-settings";
import { SITE_SETTINGS_KEY } from "@/services/content";

/** קריאת ההגדרות לאדמין — תמיד טרי, דרך session המנהל */
export async function readSiteSettingsForAdmin(): Promise<{
  settings: SiteSettings;
  updatedAt: string | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("metadata, updated_at")
    .eq("key", SITE_SETTINGS_KEY)
    .maybeSingle();
  if (error) {
    return { settings: mergeSiteSettings(null), updatedAt: null, error: "לא ניתן לטעון את ההגדרות." };
  }
  return {
    settings: mergeSiteSettings(data?.metadata),
    updatedAt: data?.updated_at ?? null,
    error: null,
  };
}
