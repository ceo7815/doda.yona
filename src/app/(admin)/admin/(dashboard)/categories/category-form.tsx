"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveCategory, type CategoryActionState } from "./actions";
import { AdminCard, Field, FormMessage, TextArea, Toggle } from "@/components/admin/ui";

export type CategoryFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

const initialState: CategoryActionState = { ok: false };

export function CategoryForm({ initial }: { initial?: CategoryFormValues }) {
  const [state, formAction, pending] = useActionState(saveCategory, initialState);
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const err = (k: string) => state.fieldErrors?.[k]?.[0];

  useEffect(() => {
    if (state.ok) router.replace("/admin/categories");
  }, [state.ok, router]);

  return (
    <AdminCard title={isEdit ? `עריכת קטגוריה: ${initial!.name}` : "קטגוריה חדשה"}>
      <form action={formAction} className="space-y-4">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <Field label="שם הקטגוריה" name="name" defaultValue={initial?.name ?? ""} required error={err("name")} />
          <Field label="סדר תצוגה" name="sortOrder" type="number" min={0} defaultValue={initial?.sortOrder ?? 0} error={err("sortOrder")} hint="מספר קטן מופיע קודם" />
        </div>
        <TextArea label="תיאור (לא חובה)" name="description" defaultValue={initial?.description ?? ""} rows={2} />
        <details className="rounded-xl border border-border/70 bg-white/60 px-4 py-2 text-sm">
          <summary className="cursor-pointer py-1 font-bold text-brand-900">הגדרות מתקדמות</summary>
          <Field className="mt-3" label="כתובת (slug)" name="slug" defaultValue={initial?.slug ?? ""} hint="אם ריק — נוצרת אוטומטית מהשם" dir="ltr" error={err("slug")} />
        </details>
        <Toggle name="isActive" label="מוצגת באתר" defaultChecked={initial?.isActive ?? true} />
        <FormMessage ok={state.ok} message={state.message} />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-900 px-7 font-bold text-gold-400 shadow-md hover:bg-brand-800 disabled:opacity-50">
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {isEdit ? "שמירת שינויים" : "הוספה"}
          </button>
          <button type="button" onClick={() => router.push("/admin/categories")} className="min-h-12 px-4 text-sm font-semibold text-ink-muted hover:text-brand-900">
            ביטול
          </button>
        </div>
      </form>
    </AdminCard>
  );
}
