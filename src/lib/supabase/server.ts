import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicEnv, getServerEnv, isSupabaseConfigured } from "@/lib/env";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * לקוח Supabase לשרת (Server Components / Server Actions) עם cookies.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase אינו מוגדר. מלאו NEXT_PUBLIC_SUPABASE_URL ו-NEXT_PUBLIC_SUPABASE_ANON_KEY ב-.env.local",
    );
  }

  const cookieStore = await cookies();
  const env = getPublicEnv();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // set מתוך Server Component — מותר להתעלם; middleware ירענן session
          }
        },
      },
    },
  );
}

/**
 * Service role — שרת בלבד, לפעולות מערכת מבוקרות.
 * אין לייבא מודול זה ל-Client Components.
 */
export function createServiceRoleClient() {
  const env = getServerEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Service Role אינו מוגדר. הוסיפו SUPABASE_SERVICE_ROLE_KEY ל-.env.local (שרת בלבד).",
    );
  }

  return createServiceClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
