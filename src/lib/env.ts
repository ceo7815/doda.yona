import { z } from "zod";

/**
 * משתני סביבה — ולידציה בצד שרת.
 * משתנים ציבוריים (NEXT_PUBLIC_*) זמינים גם בדפדפן.
 * מחרוזות ריקות מ-Docker/.env מטופלות כ-undefined.
 */

function emptyToUndefined(value: unknown): unknown {
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

const optionalUrl = z.preprocess(
  emptyToUndefined,
  z.string().url().optional(),
);

const optionalNonEmpty = z.preprocess(
  emptyToUndefined,
  z.string().min(1).optional(),
);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: optionalUrl,
  NEXT_PUBLIC_RESTAURANT_NAME: z.preprocess(
    emptyToUndefined,
    z.string().min(1).default("דודה יונה"),
  ),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalNonEmpty,
  /** קישור לדף ההזמנות של הקופה — ברירת מחדל אם לא הוגדר באדמין */
  NEXT_PUBLIC_ORDER_URL: optionalUrl,
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: optionalNonEmpty,
  ADMIN_BOOTSTRAP_EMAIL: z.preprocess(
    emptyToUndefined,
    z.string().email().optional(),
  ),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

function readPublicEnv(): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_RESTAURANT_NAME: process.env.NEXT_PUBLIC_RESTAURANT_NAME,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_ORDER_URL: process.env.NEXT_PUBLIC_ORDER_URL,
  });
}

let cachedPublic: PublicEnv | null = null;

export function getPublicEnv(): PublicEnv {
  if (!cachedPublic) {
    cachedPublic = readPublicEnv();
  }
  return cachedPublic;
}

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    ...readPublicEnv(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_BOOTSTRAP_EMAIL: process.env.ADMIN_BOOTSTRAP_EMAIL,
  });
}

/** האם Supabase מוגדר לפעולה אמיתית */
export function isSupabaseConfigured(): boolean {
  const env = getPublicEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getRestaurantName(): string {
  return getPublicEnv().NEXT_PUBLIC_RESTAURANT_NAME ?? "דודה יונה";
}
