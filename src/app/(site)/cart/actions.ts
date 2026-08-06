"use server";

import { redirect } from "next/navigation";
import { AppError, toUserMessage } from "@/lib/errors";
import { checkoutFormSchema } from "@/lib/validations/checkout";
import { createOrder } from "@/services/orders";

export type PlaceOrderState = {
  ok: boolean;
  message?: string;
  publicId?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function placeOrder(
  _prev: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  let itemsRaw: unknown;
  try {
    itemsRaw = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return {
      ok: false,
      message: "נתוני הסל אינם תקינים. רעננו את העמוד ונסו שוב.",
    };
  }

  let addressRaw: unknown;
  const addressField = formData.get("address");
  if (addressField && String(addressField).trim()) {
    try {
      addressRaw = JSON.parse(String(addressField));
    } catch {
      return {
        ok: false,
        message: "כתובת המשלוח אינה תקינה.",
      };
    }
  }

  const parsed = checkoutFormSchema.safeParse({
    fulfillmentType: formData.get("fulfillmentType"),
    paymentMethod: formData.get("paymentMethod"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    deliveryZoneId: formData.get("deliveryZoneId") || undefined,
    address: addressRaw,
    notes: formData.get("notes") || undefined,
    acceptedPrivacy: formData.get("acceptedPrivacy") === "true",
    acceptedTerms: formData.get("acceptedTerms") === "true",
    items: itemsRaw,
    idempotencyKey: formData.get("idempotencyKey"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "חלק מהפרטים אינם תקינים. אנא בדקו ונסו שוב.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  try {
    const result = await createOrder(parsed.data);
    redirect(`/order/${result.publicId}?new=1`);
  } catch (error) {
    if (error instanceof AppError) {
      return {
        ok: false,
        message: toUserMessage(error),
        fieldErrors:
          error.code === "VALIDATION" && error.details
            ? ((error.details as { fieldErrors?: Record<string, string[]> })
                .fieldErrors ?? undefined)
            : undefined,
      };
    }

    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      ok: false,
      message: toUserMessage(error),
    };
  }
}
