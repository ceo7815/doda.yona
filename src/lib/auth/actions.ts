"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { AppError, toUserMessage } from "@/lib/errors";
import { isSupabaseConfigured } from "@/lib/env";

const loginSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים"),
  next: z.string().optional(),
});

export type LoginState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message:
        "מערכת ההתחברות עדיין לא הוגדרה. יש למלא את פרטי Supabase ב-.env.local",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "נא לתקן את השדות המסומנים.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return {
        ok: false,
        message: "אימייל או סיסמה שגויים.",
      };
    }
  } catch (error) {
    return {
      ok: false,
      message: toUserMessage(
        error instanceof AppError
          ? error
          : new AppError("INTERNAL", { cause: error }),
      ),
    };
  }

  const nextPath =
    parsed.data.next && parsed.data.next.startsWith("/admin")
      ? parsed.data.next
      : "/admin";

  redirect(nextPath);
}

export async function logoutAdmin(): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
