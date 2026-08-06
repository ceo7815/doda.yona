"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { isMissingTableError } from "@/lib/admin/format";
import { AppError, toUserMessage } from "@/lib/errors";
import { shekelsToAgorot } from "@/lib/money";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export type DeliveryZoneActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const zoneSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "שם האזור חובה"),
  deliveryFeeShekels: z.coerce.number().min(0).default(0),
  minOrderShekels: z.coerce.number().min(0).optional().nullable(),
  estimatedMinutes: z.coerce.number().int().min(0).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});

function parseZoneForm(formData: FormData) {
  const minRaw = String(formData.get("minOrderShekels") ?? "").trim();
  const estRaw = String(formData.get("estimatedMinutes") ?? "").trim();

  return {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    name: String(formData.get("name") ?? "").trim(),
    deliveryFeeShekels: formData.get("deliveryFeeShekels"),
    minOrderShekels: minRaw === "" ? null : minRaw,
    estimatedMinutes: estRaw === "" ? null : estRaw,
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  };
}

export async function saveDeliveryZone(
  _prev: DeliveryZoneActionState,
  formData: FormData,
): Promise<DeliveryZoneActionState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "מסד הנתונים לא מחובר." };
  }

  try {
    await requireAdmin();
  } catch (error) {
    return { ok: false, message: toUserMessage(error) };
  }

  const parsed = zoneSchema.safeParse(parseZoneForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "נא לתקן את השדות המסומנים.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createClient();
  const payload = {
    name: parsed.data.name,
    delivery_fee_agorot: shekelsToAgorot(parsed.data.deliveryFeeShekels),
    min_order_agorot:
      parsed.data.minOrderShekels != null
        ? shekelsToAgorot(parsed.data.minOrderShekels)
        : null,
    estimated_minutes: parsed.data.estimatedMinutes ?? null,
    sort_order: parsed.data.sortOrder,
    is_active: parsed.data.isActive,
  };

  if (parsed.data.id) {
    const { error } = await supabase
      .from("delivery_zones")
      .update(payload)
      .eq("id", parsed.data.id)
      .is("deleted_at", null);

    if (error) {
      if (isMissingTableError(error)) {
        return { ok: false, message: "טבלת אזורי המשלוח עדיין לא קיימת." };
      }
      return { ok: false, message: "לא ניתן לעדכן את האזור." };
    }
  } else {
    const { error } = await supabase.from("delivery_zones").insert(payload);
    if (error) {
      if (isMissingTableError(error)) {
        return { ok: false, message: "טבלת אזורי המשלוח עדיין לא קיימת." };
      }
      return { ok: false, message: "לא ניתן ליצור את האזור." };
    }
  }

  revalidatePath("/admin/delivery-zones");
  return { ok: true, message: parsed.data.id ? "האזור עודכן." : "האזור נוסף." };
}

export async function toggleDeliveryZoneActive(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;

  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "true";

  const supabase = await createClient();
  const { error } = await supabase
    .from("delivery_zones")
    .update({ is_active: isActive })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw new AppError("INTERNAL", { message: error.message });
  }

  revalidatePath("/admin/delivery-zones");
}

export async function deleteDeliveryZone(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;

  await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const supabase = await createClient();
  const { error } = await supabase
    .from("delivery_zones")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw new AppError("INTERNAL", { message: error.message });
  }

  revalidatePath("/admin/delivery-zones");
}
