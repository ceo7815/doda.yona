import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/errors";
import { isSupabaseConfigured } from "@/lib/env";

export type AdminProfile = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
};

/**
 * מחזיר את המשתמש המחובר או null.
 * דורש Supabase מוגדר.
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * בודק שהמשתמש הוא מנהל פעיל לפי טבלת admin_users.
 * בשלב 1: אם הטבלה עדיין לא קיימת — נופלים ל-app_metadata.role === 'admin'
 * כהגנה זמנית עד מיגרציה (שלב 2).
 */
export async function requireAdmin(): Promise<AdminProfile> {
  if (!isSupabaseConfigured()) {
    throw new AppError("SERVICE_UNAVAILABLE", {
      userMessage: "מערכת ההתחברות עדיין לא הוגדרה. פנו למפתח המערכת.",
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AppError("UNAUTHORIZED");
  }

  const { data: adminRow, error } = await supabase
    .from("admin_users")
    .select("id, email, full_name, role, is_active, deleted_at")
    .eq("id", user.id)
    .maybeSingle();

  // טבלה עדיין לא קיימת / RLS — fallback זמני לשלב 1
  if (error && isMissingRelationError(error)) {
    const role = user.app_metadata?.role;
    if (role === "admin" || role === "owner") {
      return {
        id: user.id,
        email: user.email ?? "",
        fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
        role: String(role),
        isActive: true,
      };
    }
    throw new AppError("FORBIDDEN", {
      userMessage: "אין הרשאת מנהל. יש להגדיר משתמש בטבלת admin_users.",
    });
  }

  if (error) {
    throw new AppError("INTERNAL", {
      message: error.message,
      userMessage: "לא ניתן לאמת הרשאות מנהל כרגע.",
    });
  }

  if (!adminRow || adminRow.deleted_at || !adminRow.is_active) {
    throw new AppError("FORBIDDEN");
  }

  return {
    id: adminRow.id,
    email: adminRow.email,
    fullName: adminRow.full_name,
    role: adminRow.role,
    isActive: adminRow.is_active,
  };
}

function isMissingRelationError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    Boolean(error.message?.includes("does not exist")) ||
    Boolean(error.message?.includes("Could not find the table"))
  );
}
