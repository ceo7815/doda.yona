"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: LoginState = { ok: false };

type AdminLoginFormProps = {
  nextPath?: string;
  configError?: boolean;
};

export function AdminLoginForm({
  nextPath,
  configError,
}: AdminLoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {configError ? (
        <div
          className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-ink"
          role="alert"
        >
          מערכת ההתחברות עדיין לא חוברה למסד הנתונים. פנו לצוות הפיתוח.
        </div>
      ) : null}

      {state.message ? (
        <div
          className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {state.message}
        </div>
      ) : null}

      <input type="hidden" name="next" value={nextPath ?? "/admin"} />

      <Input
        label="אימייל"
        name="email"
        type="email"
        autoComplete="username"
        required
        error={state.fieldErrors?.email?.[0]}
        dir="ltr"
      />

      <Input
        label="סיסמה"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password?.[0]}
        dir="ltr"
      />

      <Button type="submit" loading={pending} className="w-full" size="lg">
        {pending ? "מתחברים…" : "כניסה"}
      </Button>
    </form>
  );
}
