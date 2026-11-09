import { cache } from "react";
import { getPublicEnv } from "@/lib/env";
import { logServerError } from "@/lib/errors";
import {
  DEFAULT_SITE_SETTINGS,
  mergeSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";
import { createPublicClient } from "@/lib/supabase/public";

export const SITE_SETTINGS_KEY = "site";

function withEnvFallbacks(settings: SiteSettings): SiteSettings {
  const envOrderUrl = getPublicEnv().NEXT_PUBLIC_ORDER_URL;
  if (!settings.ordering.orderUrl && envOrderUrl) {
    return {
      ...settings,
      ordering: { ...settings.ordering, orderUrl: envOrderUrl },
    };
  }
  return settings;
}

/** תוכן והגדרות האתר — מהמסד (במטמון) או מברירות המחדל */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createPublicClient();
  if (!supabase) return withEnvFallbacks(DEFAULT_SITE_SETTINGS);

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("metadata")
      .eq("key", SITE_SETTINGS_KEY)
      .maybeSingle();

    if (error) {
      logServerError("getSiteSettings", error);
      return withEnvFallbacks(DEFAULT_SITE_SETTINGS);
    }

    return withEnvFallbacks(mergeSiteSettings(data?.metadata));
  } catch (error) {
    logServerError("getSiteSettings", error);
    return withEnvFallbacks(DEFAULT_SITE_SETTINGS);
  }
});
