"use client";

import { useActionState, useEffect } from "react";
import { saveCategory, type CategoryActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CategoryFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

const initialState: CategoryActionState = { ok: false };

type CategoryFormProps = {
  initial?: CategoryFormValues;
  onSuccess?: () => void;
};

export function CategoryForm({ initial, onSuccess }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(saveCategory, initialState);

  useEffect(() => {
    if (state.ok && onSuccess) {
      onSuccess();
    }
  }, [state.ok, onSuccess]);

  return (
    <form action={formAction} className="space-y-4 rounded-md border border-border p-4">
      <h2 className="text-lg font-bold text-ink">
        {initial?.id ? "עריכת קטגוריה" : "קטגוריה חדשה"}
      </h2>

      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      {state.message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${state.ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
          role={state.ok ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="name"
          label="שם הקטגוריה"
          defaultValue={initial?.name ?? ""}
          required
          error={state.fieldErrors?.name?.[0]}
        />
        <Input
          name="slug"
          label="כתובת (slug)"
          defaultValue={initial?.slug ?? ""}
          hint="אם ריק — ייווצר אוטומטית מהשם"
          error={state.fieldErrors?.slug?.[0]}
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-ink">
          תיאור
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className="mt-1.5 w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-base text-ink"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="sortOrder"
          label="סדר תצוגה"
          type="number"
          min={0}
          defaultValue={initial?.sortOrder ?? 0}
          error={state.fieldErrors?.sortOrder?.[0]}
        />
        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initial?.isActive ?? true}
              className="size-4 rounded border-border"
            />
            פעילה באתר
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" loading={pending}>
          {initial?.id ? "שמירה" : "הוספה"}
        </Button>
      </div>
    </form>
  );
}
