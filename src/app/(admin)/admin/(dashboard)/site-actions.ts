"use server";

import { requireAdmin } from "@/lib/auth/admin";
import { refreshPublicSite } from "@/lib/admin/revalidate";
import { readSiteSettingsForAdmin } from "@/lib/admin/site-settings-store";
import { toUserMessage } from "@/lib/errors";
import { isSupabaseConfigured } from "@/lib/env";
import { siteSettingsSchema, type SiteSettings } from "@/lib/site-settings";
import { createClient } from "@/lib/supabase/server";
import { SITE_SETTINGS_KEY } from "@/services/content";

export type SiteActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function applySection(current: SiteSettings, section: string, fd: FormData): SiteSettings {
  switch (section) {
    case "business": {
      const labels = fd.getAll("hoursLabel").map((v) => String(v).trim());
      const values = fd.getAll("hoursValue").map((v) => String(v).trim());
      const hours = labels
        .map((label, i) => ({ label, value: values[i] ?? "" }))
        .filter((h) => h.label || h.value);
      return {
        ...current,
        business: {
          phoneDisplay: str(fd, "phoneDisplay"),
          whatsapp: str(fd, "whatsapp"),
          street: str(fd, "street"),
          city: str(fd, "city"),
          neighborhood: str(fd, "neighborhood"),
          kashrut: str(fd, "kashrut"),
          email: str(fd, "email"),
          dineInNote: str(fd, "dineInNote"),
        },
        hours,
        hoursNote: str(fd, "hoursNote"),
        social: {
          instagram: str(fd, "instagram"),
          facebook: str(fd, "facebook"),
          tiktok: str(fd, "tiktok"),
        },
      };
    }
    case "content":
      return {
        ...current,
        home: {
          featuredTitle: str(fd, "featuredTitle"),
          featuredSubtitle: str(fd, "featuredSubtitle"),
          storyTitle: str(fd, "storyTitle"),
          storyHighlight: str(fd, "storyHighlight"),
          storyTeaser: str(fd, "storyTeaser"),
          orderTitle: str(fd, "orderTitle"),
          orderSubtitle: str(fd, "orderSubtitle"),
        },
        about: {
          heroTitle: str(fd, "aboutHeroTitle"),
          subtitle: str(fd, "aboutSubtitle"),
          tagline: str(fd, "aboutTagline"),
          intro: str(fd, "aboutIntro"),
          soupsTitle: str(fd, "soupsTitle"),
          soupsItems: lines(fd, "soupsItems"),
          soupsNote: str(fd, "soupsNote"),
          pastriesTitle: str(fd, "pastriesTitle"),
          pastriesItems: lines(fd, "pastriesItems"),
          cateringTitle: str(fd, "cateringTitle"),
          cateringBody: str(fd, "cateringBody"),
          closingTitle: str(fd, "closingTitle"),
          closingBody: str(fd, "closingBody"),
        },
      };
    case "settings":
      return {
        ...current,
        ordering: {
          orderUrl: str(fd, "orderUrl"),
          orderLabel: str(fd, "orderLabel") || "להזמנה",
        },
        seo: { description: str(fd, "seoDescription") },
      };
    default:
      return current;
  }
}

const REQUIRED: Record<string, [string, (s: SiteSettings) => string][]> = {
  business: [
    ["phoneDisplay", (s) => s.business.phoneDisplay],
    ["street", (s) => s.business.street],
    ["city", (s) => s.business.city],
  ],
  content: [
    ["featuredTitle", (s) => s.home.featuredTitle],
    ["aboutTagline", (s) => s.about.tagline],
  ],
  settings: [],
};

export async function saveSiteSection(
  _prev: SiteActionState,
  formData: FormData,
): Promise<SiteActionState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "מסד הנתונים לא מחובר." };
  }
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    return { ok: false, message: toUserMessage(error) };
  }

  const section = str(formData, "section");
  const { settings: current, error: readError } = await readSiteSettingsForAdmin();
  if (readError) return { ok: false, message: readError };

  const next = applySection(current, section, formData);

  const fieldErrors: Record<string, string> = {};
  for (const [field, get] of REQUIRED[section] ?? []) {
    if (!get(next)) fieldErrors[field] = "שדה חובה";
  }

  const parsed = siteSettingsSchema.safeParse(next);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[issue.path.length - 1] ?? "");
      const formKey =
        issue.path[0] === "seo" ? "seoDescription" : issue.path[0] === "ordering" ? key : key;
      fieldErrors[formKey] = issue.message;
    }
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "יש לתקן את השדות המסומנים.", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("site_content").upsert(
    {
      key: SITE_SETTINGS_KEY,
      title: "תוכן והגדרות האתר",
      metadata: parsed.data!,
      updated_by: admin.id,
    },
    { onConflict: "key" },
  );

  if (error) {
    return { ok: false, message: "השמירה נכשלה. נסו שוב בעוד רגע." };
  }

  refreshPublicSite();
  return { ok: true, message: "נשמר. האתר עודכן." };
}
