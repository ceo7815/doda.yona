import { z } from "zod";

const phoneField = z
  .string()
  .min(1, "יש להזין מספר טלפון")
  .max(20, "מספר טלפון ארוך מדי");

const addressSchema = z.object({
  city: z.string().min(1, "יש להזין עיר").max(100),
  street: z.string().min(1, "יש להזין רחוב").max(120),
  houseNumber: z.string().min(1, "יש להזין מספר בית").max(20),
  apartment: z.string().max(20).optional(),
  floor: z.string().max(20).optional(),
  entrance: z.string().max(20).optional(),
  addressNotes: z.string().max(300).optional(),
});

export const cartLineSchema = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  notes: z.string().max(200).optional(),
});

export const checkoutFormSchema = z
  .object({
    fulfillmentType: z.enum(["delivery", "pickup"], {
      message: "יש לבחור סוג הזמנה",
    }),
    paymentMethod: z.enum(["cash", "card_on_delivery"], {
      message: "יש לבחור אמצעי תשלום",
    }),
    customerName: z
      .string()
      .min(2, "יש להזין שם מלא (לפחות 2 תווים)")
      .max(120, "השם ארוך מדי"),
    customerPhone: phoneField,
    deliveryZoneId: z.string().uuid("יש לבחור אזור משלוח").optional(),
    address: addressSchema.optional(),
    notes: z.string().max(500, "הערות ארוכות מדי").optional(),
    acceptedPrivacy: z.literal(true, {
      message: "יש לאשר את מדיניות הפרטיות",
    }),
    acceptedTerms: z.literal(true, {
      message: "יש לאשר את תנאי השימוש",
    }),
    items: z.array(cartLineSchema).min(1, "הסל ריק"),
    idempotencyKey: z.string().uuid("מפתח idempotency לא תקין"),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillmentType === "delivery") {
      if (!data.deliveryZoneId) {
        ctx.addIssue({
          code: "custom",
          message: "יש לבחור אזור משלוח",
          path: ["deliveryZoneId"],
        });
      }
      if (!data.address) {
        ctx.addIssue({
          code: "custom",
          message: "יש להזין כתובת למשלוח",
          path: ["address"],
        });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
export type CheckoutCartLine = z.infer<typeof cartLineSchema>;

export const createOrderInputSchema = checkoutFormSchema;
