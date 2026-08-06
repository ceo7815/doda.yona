"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatMenuPrice } from "@/data/catalog";
import { formatIls } from "@/lib/money";
import { useCart } from "@/stores/cart";
import { placeOrder, type PlaceOrderState } from "./actions";
import type { DeliveryZoneOption } from "@/types/domain";

type CheckoutFormProps = {
  zones: DeliveryZoneOption[];
};

const initialState: PlaceOrderState = { ok: false };

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      className="w-full"
      loading={pending}
      disabled={disabled || pending}
    >
      {pending ? "שולח הזמנה…" : "שליחת הזמנה"}
    </Button>
  );
}

export function CheckoutForm({ zones }: CheckoutFormProps) {
  const { getLineItems, totalItems, clear } = useCart();
  const lines = getLineItems();
  const [state, formAction] = useActionState(placeOrder, initialState);
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const itemsPayload = useMemo(
    () =>
      lines.map(({ item, quantity }) => ({
        slug: item.slug,
        quantity,
      })),
    [lines],
  );

  const subtotalAgorot = useMemo(
    () =>
      lines.reduce((sum, { item, quantity }) => {
        const price = item.priceAgorot ?? 0;
        return sum + price * quantity;
      }, 0),
    [lines],
  );

  if (lines.length === 0) {
    return null;
  }

  return (
    <form action={formAction} className="mt-6 space-y-5 border-t border-brand-700 pt-5 sm:mt-8 sm:space-y-6 sm:pt-6">
      <input type="hidden" name="items" value={JSON.stringify(itemsPayload)} />
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

      {state.message && !state.ok ? (
        <div
          className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {state.message}
        </div>
      ) : null}

      <fieldset className="space-y-2.5">
        <legend className="text-sm font-bold text-gold-400">סוג הזמנה</legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { value: "delivery", label: "משלוח" },
              { value: "pickup", label: "איסוף עצמי" },
            ] as const
          ).map((option) => {
            const selected = fulfillmentType === option.value;
            return (
              <label
                key={option.value}
                className={
                  selected
                    ? "flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-gold-500/50 bg-gold-500/15 px-3 text-sm font-bold text-gold-400"
                    : "flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-brand-700 bg-brand-800/60 px-3 text-sm font-semibold text-brand-100"
                }
              >
                <input
                  type="radio"
                  name="fulfillmentType"
                  value={option.value}
                  checked={selected}
                  onChange={() => setFulfillmentType(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-2.5">
        <legend className="text-sm font-bold text-gold-400">אמצעי תשלום</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(
            [
              { value: "cash", label: "מזומן", defaultChecked: true },
              {
                value: "card_on_delivery",
                label: "אשראי בקבלה",
                defaultChecked: false,
              },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-700 bg-brand-800/60 px-3 text-sm font-semibold text-brand-100 has-[:checked]:border-gold-500/50 has-[:checked]:bg-gold-500/15 has-[:checked]:text-gold-400"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.value}
                defaultChecked={option.defaultChecked}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-4 [&_label]:text-brand-100 [&_input]:border-brand-700 [&_input]:bg-brand-800 [&_input]:text-brand-50">
        <Input
          name="customerName"
          label="שם מלא"
          required
          autoComplete="name"
          error={state.fieldErrors?.customerName?.[0]}
        />
        <Input
          name="customerPhone"
          label="טלפון נייד"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="05X-XXXXXXX"
          dir="ltr"
          className="text-start"
          error={state.fieldErrors?.customerPhone?.[0]}
        />
      </div>

      {fulfillmentType === "delivery" ? (
        <DeliveryFields zones={zones} fieldErrors={state.fieldErrors} />
      ) : null}

      <div className="[&_label]:text-brand-100 [&_textarea]:border-brand-700 [&_textarea]:bg-brand-800 [&_textarea]:text-brand-50">
        <label htmlFor="notes" className="text-sm font-medium text-brand-100">
          הערות להזמנה
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={500}
          className="mt-1.5 min-h-20 w-full rounded-md border border-brand-700 bg-brand-800 px-3 py-2 text-base text-brand-50 placeholder:text-brand-300"
          placeholder="הערות למטבח, אלרגיות, הוראות הגעה…"
        />
      </div>

      <div className="space-y-2 text-sm">
        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            name="acceptedPrivacy"
            value="true"
            required
            className="mt-1 size-4 accent-gold-500"
          />
          <span>
            קראתי ואני מאשר/ת את{" "}
            <Link href="/privacy" className="text-gold-400 underline">
              מדיניות הפרטיות
            </Link>
          </span>
        </label>
        {state.fieldErrors?.acceptedPrivacy?.[0] ? (
          <p className="text-danger" role="alert">
            {state.fieldErrors.acceptedPrivacy[0]}
          </p>
        ) : null}

        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            name="acceptedTerms"
            value="true"
            required
            className="mt-1 size-4 accent-gold-500"
          />
          <span>
            קראתי ואני מאשר/ת את{" "}
            <Link href="/terms" className="text-gold-400 underline">
              תנאי השימוש
            </Link>
          </span>
        </label>
        {state.fieldErrors?.acceptedTerms?.[0] ? (
          <p className="text-danger" role="alert">
            {state.fieldErrors.acceptedTerms[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2 border-t border-brand-700 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-200">{totalItems} פריטים</span>
          <span className="font-bold text-gold-400">
            {formatMenuPrice(subtotalAgorot)}
          </span>
        </div>
        <p className="text-xs text-brand-300">
          אזור המשלוחים: כל אזור נתניה. דמי משלוח ומחירים סופיים יאושרו על ידי
          המסעדה.
        </p>
      </div>

      <div className="sticky bottom-0 z-10 -mx-1 bg-gradient-to-t from-brand-900 via-brand-900 to-transparent pt-3 sm:static sm:mx-0 sm:bg-none sm:pt-0">
        <SubmitButton disabled={lines.length === 0} />
      </div>

      <button
        type="button"
        onClick={clear}
        className="w-full min-h-11 py-2 text-sm text-brand-300 underline hover:text-gold-400"
      >
        ריקון הסל
      </button>
    </form>
  );
}

function DeliveryFields({
  zones,
  fieldErrors,
}: {
  zones: DeliveryZoneOption[];
  fieldErrors?: Record<string, string[]>;
}) {
  const [address, setAddress] = useState({
    city: "נתניה",
    street: "",
    houseNumber: "",
    apartment: "",
    floor: "",
    entrance: "",
    addressNotes: "",
  });

  const defaultZoneId = zones[0]?.id ?? "";
  const singleZone = zones.length === 1;

  return (
    <div className="space-y-4 rounded-xl border border-brand-700 bg-brand-800/50 p-4">
      <p className="text-xs font-semibold leading-relaxed text-gold-300">
        אזור המשלוחים: כל אזור נתניה — ניתן למלא כל כתובת בנתניה
      </p>
      <div>
        {singleZone ? (
          <>
            <input type="hidden" name="deliveryZoneId" value={defaultZoneId} />
            <p className="text-sm font-medium text-brand-100">אזור משלוח</p>
            <p className="mt-1.5 rounded-md border border-brand-700 bg-brand-800 px-3 py-2.5 text-base font-semibold text-gold-400">
              {zones[0]?.name ?? "כל אזור נתניה"}
            </p>
          </>
        ) : (
          <>
            <label htmlFor="deliveryZoneId" className="text-sm font-medium text-brand-100">
              אזור משלוח <span className="text-danger">*</span>
            </label>
            <select
              id="deliveryZoneId"
              name="deliveryZoneId"
              required
              defaultValue={defaultZoneId}
              className="mt-1.5 min-h-11 w-full rounded-md border border-brand-700 bg-brand-800 px-3 text-base text-brand-50"
            >
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                  {zone.deliveryFeeAgorot > 0
                    ? ` — ${formatIls(zone.deliveryFeeAgorot)}`
                    : ""}
                  {zone.estimatedMinutes
                    ? ` (~${zone.estimatedMinutes} דק׳)`
                    : ""}
                </option>
              ))}
            </select>
          </>
        )}
        {fieldErrors?.deliveryZoneId?.[0] ? (
          <p className="mt-1 text-sm text-danger" role="alert">
            {fieldErrors.deliveryZoneId[0]}
          </p>
        ) : null}
      </div>

      <input type="hidden" name="address" value={JSON.stringify(address)} />

      <div className="grid gap-4 sm:grid-cols-2 [&_label]:text-brand-100 [&_input]:border-brand-700 [&_input]:bg-brand-800 [&_input]:text-brand-50">
        <Input
          label="עיר"
          required
          value={address.city}
          onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
          error={fieldErrors?.address?.[0]}
        />
        <Input
          label="רחוב"
          required
          value={address.street}
          onChange={(e) =>
            setAddress((a) => ({ ...a, street: e.target.value }))
          }
        />
        <Input
          label="מספר בית"
          required
          value={address.houseNumber}
          onChange={(e) =>
            setAddress((a) => ({ ...a, houseNumber: e.target.value }))
          }
        />
        <Input
          label="דירה"
          value={address.apartment}
          onChange={(e) =>
            setAddress((a) => ({ ...a, apartment: e.target.value }))
          }
        />
        <Input
          label="קומה"
          value={address.floor}
          onChange={(e) => setAddress((a) => ({ ...a, floor: e.target.value }))}
        />
        <Input
          label="כניסה"
          value={address.entrance}
          onChange={(e) =>
            setAddress((a) => ({ ...a, entrance: e.target.value }))
          }
        />
      </div>
      <div>
        <label htmlFor="addressNotes" className="text-sm font-medium text-brand-100">
          הערות לכתובת
        </label>
        <input
          id="addressNotes"
          value={address.addressNotes}
          onChange={(e) =>
            setAddress((a) => ({ ...a, addressNotes: e.target.value }))
          }
          className="mt-1.5 min-h-11 w-full rounded-md border border-brand-700 bg-brand-800 px-3 text-base text-brand-50"
        />
      </div>
    </div>
  );
}
