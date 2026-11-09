import { z } from "zod";
import { ABOUT_PAGE, BRAND_STORY, RESTAURANT } from "@/data/catalog";

/**
 * הגדרות ותוכן האתר — נשמרים כמסמך אחד ב-site_content (key = "site").
 * כל שדה שלא נשמר עדיין נופל לברירת המחדל מחומרי הלקוח שבקוד.
 * אין כאן ערכים מומצאים: שעות, רשתות וקישור הזמנה ריקים עד שהבעלים ממלא.
 */

const text = (max = 2000) => z.string().trim().max(max);
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), {
    message: "כתובת לא תקינה — יש להתחיל ב-https://",
  });

export const hoursLineSchema = z.object({
  label: text(60),
  value: text(120),
});

export const siteSettingsSchema = z.object({
  business: z.object({
    phoneDisplay: text(30),
    whatsapp: text(30),
    street: text(120),
    city: text(60),
    neighborhood: text(60),
    kashrut: text(120),
    email: z.union([z.literal(""), z.string().trim().email("כתובת מייל לא תקינה")]),
    dineInNote: text(200),
  }),
  hours: z.array(hoursLineSchema).max(14),
  hoursNote: text(200),
  social: z.object({
    instagram: optionalUrl,
    facebook: optionalUrl,
    tiktok: optionalUrl,
  }),
  ordering: z.object({
    orderUrl: optionalUrl,
    orderLabel: text(40),
  }),
  home: z.object({
    featuredTitle: text(80),
    featuredSubtitle: text(300),
    storyTitle: text(80),
    storyHighlight: text(80),
    storyTeaser: text(800),
    orderTitle: text(80),
    orderSubtitle: text(300),
  }),
  about: z.object({
    heroTitle: text(120),
    subtitle: text(120),
    tagline: text(160),
    intro: text(2000),
    soupsTitle: text(80),
    soupsItems: z.array(text(160)).max(40),
    soupsNote: text(400),
    pastriesTitle: text(80),
    pastriesItems: z.array(text(200)).max(40),
    cateringTitle: text(80),
    cateringBody: text(1000),
    closingTitle: text(80),
    closingBody: text(400),
  }),
  seo: z.object({
    description: text(300),
  }),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type HoursLine = z.infer<typeof hoursLineSchema>;

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  business: {
    phoneDisplay: RESTAURANT.phoneDisplay,
    whatsapp: "",
    street: RESTAURANT.street,
    city: RESTAURANT.city,
    neighborhood: RESTAURANT.neighborhood,
    kashrut: RESTAURANT.kashrut,
    email: "",
    dineInNote: RESTAURANT.dineInNote,
  },
  hours: [],
  hoursNote: "",
  social: { instagram: "", facebook: "", tiktok: "" },
  ordering: { orderUrl: "", orderLabel: "להזמנה" },
  home: {
    featuredTitle: "חלק מהתפריט המושלם שלנו",
    featuredSubtitle:
      "המנות שהאורחים חוזרים בשבילן — מרקים עשירים, לחוח טרי ומאפים תימניים.",
    storyTitle: RESTAURANT.name,
    storyHighlight: "ואהבה שנולדה במטבח",
    storyTeaser: BRAND_STORY.homeTeaser,
    orderTitle: "משלוח · איסוף · שולחן",
    orderSubtitle: "מזמינים בקליק דרך מערכת ההזמנות של המסעדה, או בטלפון.",
  },
  about: {
    heroTitle: ABOUT_PAGE.heroTitle,
    subtitle: ABOUT_PAGE.heroSubtitle,
    tagline: ABOUT_PAGE.tagline,
    intro: ABOUT_PAGE.intro,
    soupsTitle: ABOUT_PAGE.soups.title,
    soupsItems: [...ABOUT_PAGE.soups.items],
    soupsNote: ABOUT_PAGE.soups.note,
    pastriesTitle: ABOUT_PAGE.pastries.title,
    pastriesItems: [...ABOUT_PAGE.pastries.items],
    cateringTitle: ABOUT_PAGE.catering.title,
    cateringBody: ABOUT_PAGE.catering.body,
    closingTitle: ABOUT_PAGE.closingTitle,
    closingBody: ABOUT_PAGE.closingBody,
  },
  seo: {
    description: `${RESTAURANT.tagline} ב${RESTAURANT.locationLabel}. ${RESTAURANT.kashrut}. משלוחים, איסוף עצמי וישיבה במקום.`,
  },
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** ממזג נתונים שמורים מעל ברירות המחדל, ומתעלם משדות לא תקינים */
export function mergeSiteSettings(stored: unknown): SiteSettings {
  if (!isPlainObject(stored)) return DEFAULT_SITE_SETTINGS;
  const merged: Record<string, unknown> = {};
  for (const [key, def] of Object.entries(DEFAULT_SITE_SETTINGS)) {
    const value = stored[key];
    if (isPlainObject(def) && isPlainObject(value)) {
      merged[key] = { ...def, ...value };
    } else {
      merged[key] = value ?? def;
    }
  }
  const parsed = siteSettingsSchema.safeParse(merged);
  return parsed.success ? parsed.data : DEFAULT_SITE_SETTINGS;
}

/** מספר טלפון ל-tel: — ספרות בלבד */
export function toTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

/** מספר וואטסאפ בפורמט בינלאומי ל-wa.me (972…) */
export function toWhatsAppHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9) return null;
  const intl = digits.startsWith("972")
    ? digits
    : digits.startsWith("0")
      ? `972${digits.slice(1)}`
      : digits;
  return `https://wa.me/${intl}`;
}

export type OrderLink = {
  href: string;
  /** true כשאין עדיין קישור למערכת ההזמנות והכפתור מחייג */
  isPhoneFallback: boolean;
  external: boolean;
  label: string;
};

export function getOrderLink(settings: SiteSettings): OrderLink {
  const url = settings.ordering.orderUrl.trim();
  if (url) {
    return {
      href: url,
      isPhoneFallback: false,
      external: true,
      label: settings.ordering.orderLabel || "להזמנה",
    };
  }
  return {
    href: toTelHref(settings.business.phoneDisplay),
    isPhoneFallback: true,
    external: false,
    label: "להזמנה בטלפון",
  };
}

export function getAddressFull(settings: SiteSettings): string {
  return [settings.business.street, settings.business.city]
    .filter(Boolean)
    .join(", ");
}

export function getLocationLabel(settings: SiteSettings): string {
  return [settings.business.neighborhood, settings.business.city]
    .filter(Boolean)
    .join(", ");
}
