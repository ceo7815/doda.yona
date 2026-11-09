"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveProduct, type ProductActionState } from "./actions";
import { AdminCard, Field, FormMessage, TextArea, Toggle } from "@/components/admin/ui";
import { ImagePicker } from "@/components/admin/image-picker";

export type ProductFormValues = {
  id?: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  imagePath: string | null;
  sortOrder: number;
  isAvailable: boolean;
  isFeatured: boolean;
  badges: string[];
};

const initialState: ProductActionState = { ok: false };

export function ProductForm({
  categories,
  initial,
}: {
  categories: { id: string; name: string }[];
  initial?: ProductFormValues;
}) {
  const [state, formAction, pending] = useActionState(saveProduct, initialState);
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const err = (k: string) => state.fieldErrors?.[k]?.[0];

  useEffect(() => {
    if (state.ok && !isEdit) router.replace("/admin/products");
  }, [state.ok, isEdit, router]);

  return (
    <AdminCard
      title={isEdit ? `עריכת מנה: ${initial!.name}` : "מנה חדשה"}
      description="המחירים וההזמנות מנוהלים בקופה — כאן מנהלים את התצוגה באתר."
    >
      <form action={formAction} className="space-y-5">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

        <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
          <ImagePicker name="imagePath" defaultPath={initial?.imagePath} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="שם המנה" name="name" defaultValue={initial?.name ?? ""} required error={err("name")} />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-categoryId" className="text-sm font-bold text-brand-900">
                קטגוריה
              </label>
              <select
                id="f-categoryId"
                name="categoryId"
                defaultValue={initial?.categoryId ?? categories[0]?.id ?? ""}
                required
                className="min-h-11 w-full rounded-xl border border-border bg-white px-3 text-[0.95rem] focus:border-gold-500 focus:shadow-[var(--focus-ring)] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {err("categoryId") ? <p className="text-xs font-semibold text-danger">{err("categoryId")}</p> : null}
            </div>
            <Field
              label="תגיות (מופרדות בפסיק)"
              name="badges"
              defaultValue={initial?.badges.join(", ") ?? ""}
              placeholder="למשל: הכי נמכר, טבעוני"
              error={err("badges")}
            />
            <Field label="סדר תצוגה" name="sortOrder" type="number" min={0} defaultValue={initial?.sortOrder ?? 0} error={err("sortOrder")} hint="מספר קטן מופיע קודם" />
          </div>
        </div>

        <TextArea label="תיאור" name="description" defaultValue={initial?.description ?? ""} rows={3} error={err("description")} />

        <details className="rounded-xl border border-border/70 bg-white/60 px-4 py-2 text-sm">
          <summary className="cursor-pointer py-1 font-bold text-brand-900">הגדרות מתקדמות</summary>
          <Field
            className="mt-3"
            label="כתובת העמוד (slug)"
            name="slug"
            defaultValue={initial?.slug ?? ""}
            hint="אם ריק — נוצרת אוטומטית מהשם"
            dir="ltr"
            error={err("slug")}
          />
        </details>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle name="isAvailable" label="מוצגת באתר" description="כבוי — המנה מוסתרת מהתפריט" defaultChecked={initial?.isAvailable ?? true} />
          <Toggle name="isFeatured" label="מומלצת בדף הבית" description="מופיעה במנות המומלצות" defaultChecked={initial?.isFeatured ?? false} />
        </div>

        <FormMessage ok={state.ok} message={state.message} />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-900 px-7 font-bold text-gold-400 shadow-md hover:bg-brand-800 disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {isEdit ? "שמירת שינויים" : "הוספת מנה"}
          </button>
          {isEdit ? (
            <button type="button" onClick={() => router.push("/admin/products")} className="min-h-12 px-4 text-sm font-semibold text-ink-muted hover:text-brand-900">
              ביטול
            </button>
          ) : null}
        </div>
      </form>
    </AdminCard>
  );
}
