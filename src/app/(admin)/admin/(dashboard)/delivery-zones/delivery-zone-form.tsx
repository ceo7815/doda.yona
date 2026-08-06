"use client";

import { useActionState, useEffect } from "react";
import { saveDeliveryZone, type DeliveryZoneActionState } from "./actions";
import { agorotToShekels } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type DeliveryZoneFormValues = {
  id?: string;
  name: string;
  deliveryFeeAgorot: number;
  minOrderAgorot: number | null;
  estimatedMinutes: number | null;
  sortOrder: number;
  isActive: boolean;
};

const initialState: DeliveryZoneActionState = { ok: false };

type DeliveryZoneFormProps = {
  initial?: DeliveryZoneFormValues;
};

export function DeliveryZoneForm({ initial }: DeliveryZoneFormProps) {
  const [state, formAction, pending] = useActionState(saveDeliveryZone, initialState);

  useEffect(() => {
    if (state.ok && !initial?.id) {
      const form = document.getElementById("delivery-zone-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state.ok, initial?.id]);

  return (
    <form
      id="delivery-zone-form"
      action={formAction}
      className="space-y-4 rounded-md border border-border p-4"
    >
      <h2 className="text-lg font-bold text-ink">
        {initial?.id ? "עריכת אזור משלוח" : "אזור משלוח חדש"}
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

      <Input
        name="name"
        label="שם האזור"
        defaultValue={initial?.name ?? ""}
        required
        hint="למשל: כרם התימנים, מרכז העיר"
        error={state.fieldErrors?.name?.[0]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="deliveryFeeShekels"
          label="דמי משלוח (₪)"
          type="number"
          min={0}
          step={0.01}
          defaultValue={
            initial && initial.deliveryFeeAgorot > 0
              ? agorotToShekels(initial.deliveryFeeAgorot)
              : 0
          }
          error={state.fieldErrors?.deliveryFeeShekels?.[0]}
          dir="ltr"
        />
        <Input
          name="minOrderShekels"
          label="מינימום הזמנה (₪)"
          type="number"
          min={0}
          step={0.01}
          defaultValue={
            initial?.minOrderAgorot != null && initial.minOrderAgorot > 0
              ? agorotToShekels(initial.minOrderAgorot)
              : ""
          }
          hint="אופציונלי"
          dir="ltr"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="estimatedMinutes"
          label="זמן משלוח משוער (דקות)"
          type="number"
          min={0}
          defaultValue={initial?.estimatedMinutes ?? ""}
          hint="אופציונלי"
        />
        <Input
          name="sortOrder"
          label="סדר תצוגה"
          type="number"
          min={0}
          defaultValue={initial?.sortOrder ?? 0}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={initial?.isActive ?? true}
          className="size-4 rounded border-border"
        />
        פעיל
      </label>

      <Button type="submit" loading={pending}>
        {initial?.id ? "שמירה" : "הוספה"}
      </Button>
    </form>
  );
}
