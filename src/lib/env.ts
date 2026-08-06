import { z } from "zod";

/**
 * משתני סביבה — ולידציה בצד שרת.
 * משתנים ציבוריים (NEXT_PUBLIC_*) זמינים גם בדפדפן.
 */

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_RESTAURANT_NAME: z.string().min(1).default("דודה יונה"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().optional().or(z.literal("")),
  WHATSAPP_PROVIDER: z.enum(["demo"]).default("demo"),
  PAYMENT_PROVIDER: z.enum(["demo"]).default("demo"),
  POS_PROVIDER: z.enum(["demo"]).default("demo"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

function readPublicEnv(): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_RESTAURANT_NAME: process.env.NEXT_PUBLIC_RESTAURANT_NAME,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
    WHATSAPP_PROVIDER: process.env.WHATSAPP_PROVIDER ?? "demo",
    PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER ?? "demo",
    POS_PROVIDER: process.env.POS_PROVIDER ?? "demo",
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
