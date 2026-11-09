import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // רק אזור הניהול — העמודים הציבוריים לא מחכים לבדיקת התחברות
  matcher: ["/admin/:path*"],
};
