import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv, isSupabaseConfigured } from "@/lib/env";

/** תגית מטמון לכל התוכן הציבורי — מתעדכנת מיד אחרי שמירה באדמין */
export const PUBLIC_CONTENT_TAG = "public-content";

/** זמן מקסימלי לבקשה למסד הנתונים לפני נפילה לתוכן הסטטי */
export const PUBLIC_FETCH_TIMEOUT_MS = 4000;

/** רענון רקע של התוכן הציבורי (שניות) */
export const PUBLIC_REVALIDATE_SECONDS = 300;

type NextFetchInit = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

const cachedFetch: typeof fetch = (input, init) => {
  const nextInit: NextFetchInit = {
    ...init,
    signal: AbortSignal.timeout(PUBLIC_FETCH_TIMEOUT_MS),
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [PUBLIC_CONTENT_TAG] },
  };
  return fetch(input, nextInit);
};

/**
 * לקוח קריאה בלבד לתוכן ציבורי — בלי cookies, כך שהעמודים נשארים סטטיים (ISR)
 * ונשמרים במטמון. כל בקשה מוגבלת בזמן.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;
  const env = getPublicEnv();
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: cachedFetch },
    },
  );
}

/** כתובת ציבורית לקובץ ב-Storage, או הנתיב כמו שהוא אם הוא מקומי (/menu/...) */
export { resolveMediaUrl, MEDIA_BUCKET } from "@/lib/media";
