"use client";

import { useActionState, useEffect } from "react";
import { saveProduct, type ProductActionState } from "./actions";
import { agorotToShekels } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CategoryOption = {
  id: string;
  name: string;
};

export type ProductFormValues = {
  id?: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  priceAgorot: number;
  sortOrder: number;
  isAvailable: boolean;
  isFeatured: boolean;
  badges: string[];
};

const initialState: ProductActionState = { ok: false };

type ProductFormProps = {
  categories: CategoryOption[];
  initial?: ProductFormValues;
  onSuccess?: () => void;
};

export function ProductForm({ categories, initial, onSuccess }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(saveProduct, initialState);

  useEffect(() => {
    if (state.ok && onSuccess) {
      onSuccess();
    }
  }, [state.ok, onSuccess]);

  const priceShekels =
    initial && initial.priceAgorot > 0 ? agorotToShekels(initial.priceAgorot) : "";

  return (
    <form action={formAction} className="space-y-4 rounded-md border border-border p-4">
      <h2 className="text-lg font-bold text-ink">
        {initial?.id ? "עריכת מנה" : "מנה חדשה"}
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

      {categories.length === 0 ? (
        <p className="rounded-md bg-warning/10 px-3 py-2 text-sm text-ink">
          יש ליצור קטגוריה לפני הוספת מנות.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="name"
          label="שם המנה"
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
        <label htmlFor="categoryId" className="text-sm font-medium text-ink">
          קטגוריה <span className="text-danger">*</span>
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={initial?.categoryId ?? ""}
          className="mt-1.5 min-h-11 w-full rounded-md border border-border bg-surface-elevated px-3 text-base text-ink"
        >
          <option value="" disabled>
            בחרו קטגוריה
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {state.fieldErrors?.categoryId?.[0] ? (
          <p className="mt-1 text-sm text-danger">{state.fieldErrors.categoryId[0]}</p>
        ) : null}
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
          name="priceShekels"
          label="מחיר (₪)"
          type="number"
          min={0}
          step={0.01}
          defaultValue={priceShekels}
          hint="השאירו ריק או 0 לתצוגת «לבירור»"
          error={state.fieldErrors?.priceShekels?.[0]}
          dir="ltr"
        />
        <Input
          name="sortOrder"
          label="סדר תצוגה"
          type="number"
          min={0}
          defaultValue={initial?.sortOrder ?? 0}
          error={state.fieldErrors?.sortOrder?.[0]}
        />
      </div>

      <Input
        name="badges"
        label="תגיות"
        defaultValue={initial?.badges?.join(", ") ?? ""}
        hint="מופרדות בפסיק, למשל: פרווה, הזמנה מראש"
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isAvailable"
            defaultChecked={initial?.isAvailable ?? true}
            className="size-4 rounded border-border"
          />
          זמינה להזמנה
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={initial?.isFeatured ?? false}
            className="size-4 rounded border-border"
          />
          מומלצת בדף הבית
        </label>
      </div>

      <Button type="submit" loading={pending} disabled={categories.length === 0}>
        {initial?.id ? "שמירה" : "הוספה"}
      </Button>
    </form>
  );
}
