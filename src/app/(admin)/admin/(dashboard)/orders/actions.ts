"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { AppError, toUserMessage } from "@/lib/errors";
import { updateOrderStatus } from "@/services/orders";
import type { OrderStatus } from "@/types/domain";

const statusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum([
    "received",
    "preparing",
    "ready_for_pickup",
    "out_for_delivery",
    "completed",
    "cancelled",
  ]),
  cancelledReason: z.string().max(500).optional(),
});

export type UpdateOrderStatusState = {
  ok: boolean;
  message?: string;
};

export async function updateOrderStatusAction(
  _prev: UpdateOrderStatusState,
  formData: FormData,
): Promise<UpdateOrderStatusState> {
  try {
    await requireAdmin();
  } catch (error) {
    return { ok: false, message: toUserMessage(error) };
  }

  const parsed = statusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
    cancelledReason: formData.get("cancelledReason") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים." };
  }

  try {
    await updateOrderStatus(
      parsed.data.orderId,
      parsed.data.status as OrderStatus,
      parsed.data.cancelledReason,
    );
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${parsed.data.orderId}`);
    return { ok: true, message: "הסטטוס עודכן." };
  } catch (error) {
    return {
      ok: false,
      message: toUserMessage(
        error instanceof AppError
          ? error
          : new AppError("INTERNAL", { cause: error }),
      ),
    };
  }
}
