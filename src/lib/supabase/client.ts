import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv, isSupabaseConfigured } from "@/lib/env";

/**
 * לקוח Supabase לדפדפן — anon key בלבד.
 * לעולם לא להשתמש ב-service role כאן.
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase אינו מוגדר. מלאו NEXT_PUBLIC_SUPABASE_URL ו-NEXT_PUBLIC_SUPABASE_ANON_KEY ב-.env.local",
    );
  }

  const env = getPublicEnv();
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
