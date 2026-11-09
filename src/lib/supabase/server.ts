import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicEnv, isSupabaseConfigured } from "@/lib/env";

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
