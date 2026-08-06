import { getEmailProvider } from "@/integrations/email";
import { getRestaurantName, isSupabaseConfigured } from "@/lib/env";
import { AppError, logServerError } from "@/lib/errors";
import { formatIls } from "@/lib/money";
import { normalizeIsraeliPhone } from "@/lib/phone";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  createOrderInputSchema,
  type CheckoutFormValues,
} from "@/lib/validations/checkout";
import {
  NETANYA_DELIVERY_ZONE,
  type DeliveryZoneOption,
} from "@/types/domain";
import type {
  DeliveryAddressSnapshot,
  DeliveryZone,
  AdminOrderDetail,
  Order,
  OrderItem,
  Product,
} from "@/types/database";

export type CreateOrderResult = {
  publicId: string;
  orderId: string;
};

export type { DeliveryZoneOption };
export { NETANYA_DELIVERY_ZONE };

function mapZone(row: DeliveryZone): DeliveryZoneOption {
  return {
    id: row.id,
    name: row.name,
    deliveryFeeAgorot: row.delivery_fee_agorot,
    minOrderAgorot: row.min_order_agorot,
    estimatedMinutes: row.estimated_minutes,
  };
}

export async function getActiveDeliveryZones(): Promise<DeliveryZoneOption[]> {
  if (!isSupabaseConfigured()) {
    return [NETANYA_DELIVERY_ZONE];
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("delivery_zones")
      .select("*")
      .is("deleted_at", null)
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      logServerError("getActiveDeliveryZones", error);
      return [NETANYA_DELIVERY_ZONE];
    }

    const zones = (data as DeliveryZone[]).map(mapZone);
    return zones.length > 0 ? zones : [NETANYA_DELIVERY_ZONE];
  } catch {
    return [NETANYA_DELIVERY_ZONE];
  }
}

function generatePublicId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DY-${date}-${suffix}`;
}

function buildAddressSnapshot(
  address: CheckoutFormValues["address"],
): DeliveryAddressSnapshot | null {
  if (!address) return null;
  return {
    city: address.city,
    street: address.street,
    house_number: address.houseNumber,
    apartment: address.apartment,
    floor: address.floor,
    entrance: address.entrance,
    notes: address.addressNotes,
  };
}

function formatAddressForEmail(snapshot: DeliveryAddressSnapshot | null): string {
  if (!snapshot) return "—";
  const parts = [
    snapshot.street,
    snapshot.house_number,
    snapshot.city,
    snapshot.apartment ? `דירה ${snapshot.apartment}` : null,
    snapshot.floor ? `קומה ${snapshot.floor}` : null,
    snapshot.entrance ? `כניסה ${snapshot.entrance}` : null,
  ].filter(Boolean);
  return parts.join(", ") || "—";
}

export async function createOrder(
  input: CheckoutFormValues,
): Promise<CreateOrderResult> {
  if (!isSupabaseConfigured()) {
    throw new AppError("SERVICE_UNAVAILABLE", {
      userMessage: "מערכת ההזמנות אינה זמינה כרגע. אנא נסו שוב מאוחר יותר.",
    });
  }

  const parsed = createOrderInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new AppError("VALIDATION", {
      userMessage: "חלק מהפרטים אינם תקינים. אנא בדקו ונסו שוב.",
      details: parsed.error.flatten(),
    });
  }

  const data = parsed.data;
  const phone = normalizeIsraeliPhone(data.customerPhone);
  if (!phone) {
    throw new AppError("VALIDATION", {
      userMessage: "מספר הטלפון אינו תקין. יש להזין מספר נייד ישראלי (05X).",
    });
  }

  const supabase = createServiceRoleClient();

  const existing = await supabase
    .from("orders")
    .select("id, public_id")
    .eq("idempotency_key", data.idempotencyKey)
    .maybeSingle();

  if (existing.error) {
    logServerError("createOrder.idempotency", existing.error);
    throw new AppError("INTERNAL", {
      userMessage: "לא ניתן ליצור הזמנה כרגע. אנא נסו שוב.",
    });
  }

  if (existing.data) {
    return {
      publicId: existing.data.public_id,
      orderId: existing.data.id,
    };
  }

  const slugs = [...new Set(data.items.map((item) => item.slug))];
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .in("slug", slugs)
    .is("deleted_at", null);

  if (productsError) {
    logServerError("createOrder.products", productsError);
    throw new AppError("INTERNAL", {
      userMessage: "לא ניתן לטעון את המוצרים. אנא נסו שוב.",
    });
  }

  const productMap = new Map(
    (products as Product[]).map((product) => [product.slug, product]),
  );

  for (const line of data.items) {
    const product = productMap.get(line.slug);
    if (!product) {
      throw new AppError("VALIDATION", {
        userMessage: `המנה "${line.slug}" אינה קיימת בתפריט.`,
      });
    }
    if (!product.is_available) {
      throw new AppError("VALIDATION", {
        userMessage: `המנה "${product.name}" אינה זמינה כרגע.`,
      });
    }
  }

  let deliveryFeeAgorot = 0;
  let deliveryZoneId: string | null = null;

  if (data.fulfillmentType === "delivery") {
    let zone: DeliveryZone | null = null;
    const { data: existingZone, error: zoneError } = await supabase
      .from("delivery_zones")
      .select("*")
      .eq("id", data.deliveryZoneId!)
      .is("deleted_at", null)
      .eq("is_active", true)
      .maybeSingle();

    if (!zoneError && existingZone) {
      zone = existingZone as DeliveryZone;
    } else if (data.deliveryZoneId === NETANYA_DELIVERY_ZONE.id) {
      const { data: upserted, error: upsertError } = await supabase
        .from("delivery_zones")
        .upsert(
          {
            id: NETANYA_DELIVERY_ZONE.id,
            name: NETANYA_DELIVERY_ZONE.name,
            delivery_fee_agorot: NETANYA_DELIVERY_ZONE.deliveryFeeAgorot,
            min_order_agorot: NETANYA_DELIVERY_ZONE.minOrderAgorot,
            estimated_minutes: NETANYA_DELIVERY_ZONE.estimatedMinutes,
            is_active: true,
            sort_order: 1,
            deleted_at: null,
          },
          { onConflict: "id" },
        )
        .select("*")
        .single();

      if (upsertError || !upserted) {
        logServerError("createOrder.ensureNetanyaZone", upsertError);
        throw new AppError("VALIDATION", {
          userMessage: "לא ניתן לאשר אזור משלוח כרגע. נסו שוב.",
        });
      }
      zone = upserted as DeliveryZone;
    }

    if (!zone) {
      throw new AppError("VALIDATION", {
        userMessage: "אזור המשלוח שנבחר אינו פעיל או לא קיים.",
      });
    }

    deliveryZoneId = zone.id;
    deliveryFeeAgorot = zone.delivery_fee_agorot;
  }

  const orderItems = data.items.map((line) => {
    const product = productMap.get(line.slug)!;
    const unitPrice = product.price_agorot;
    return {
      product_id: product.id,
      product_name: product.name,
      unit_price_agorot: unitPrice,
      quantity: line.quantity,
      notes: line.notes ?? null,
      line_total_agorot: unitPrice * line.quantity,
    };
  });

  const subtotalAgorot = orderItems.reduce(
    (sum, item) => sum + item.line_total_agorot,
    0,
  );
  const totalAgorot = subtotalAgorot + deliveryFeeAgorot;

  if (data.fulfillmentType === "delivery" && deliveryZoneId) {
    const { data: zoneRow } = await supabase
      .from("delivery_zones")
      .select("min_order_agorot")
      .eq("id", deliveryZoneId)
      .maybeSingle();

    const minOrder = zoneRow?.min_order_agorot;
    if (minOrder != null && subtotalAgorot > 0 && subtotalAgorot < minOrder) {
      throw new AppError("VALIDATION", {
        userMessage: `סכום ההזמנה המינימלי לאזור זה הוא ${formatIls(minOrder)}.`,
      });
    }
  }

  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id, orders_count, total_spent_agorot, first_order_at")
    .eq("phone", phone)
    .is("deleted_at", null)
    .maybeSingle();

  let customerId: string;

  if (existingCustomer) {
    customerId = existingCustomer.id;
    await supabase
      .from("customers")
      .update({
        full_name: data.customerName,
        last_order_at: new Date().toISOString(),
        orders_count: existingCustomer.orders_count + 1,
        total_spent_agorot: existingCustomer.total_spent_agorot + totalAgorot,
      })
      .eq("id", customerId);
  } else {
    const now = new Date().toISOString();
    const { data: newCustomer, error: customerError } = await supabase
      .from("customers")
      .insert({
        phone,
        full_name: data.customerName,
        first_order_at: now,
        last_order_at: now,
        orders_count: 1,
        total_spent_agorot: totalAgorot,
      })
      .select("id")
      .single();

    if (customerError || !newCustomer) {
      logServerError("createOrder.customer", customerError);
      throw new AppError("INTERNAL", {
        userMessage: "לא ניתן לשמור את פרטי הלקוח. אנא נסו שוב.",
      });
    }

    customerId = newCustomer.id;
  }

  const addressSnapshot = buildAddressSnapshot(data.address);
  const publicId = generatePublicId();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      public_id: publicId,
      customer_id: customerId,
      fulfillment_type: data.fulfillmentType,
      payment_method: data.paymentMethod,
      delivery_zone_id: deliveryZoneId,
      customer_name: data.customerName,
      customer_phone: phone,
      delivery_address_snapshot: addressSnapshot,
      notes: data.notes ?? null,
      subtotal_agorot: subtotalAgorot,
      delivery_fee_agorot: deliveryFeeAgorot,
      total_agorot: totalAgorot,
      idempotency_key: data.idempotencyKey,
      accepted_privacy: data.acceptedPrivacy,
      accepted_terms: data.acceptedTerms,
    })
    .select("id, public_id")
    .single();

  if (orderError || !order) {
    if (orderError?.code === "23505") {
      const retry = await supabase
        .from("orders")
        .select("id, public_id")
        .eq("idempotency_key", data.idempotencyKey)
        .maybeSingle();
      if (retry.data) {
        return {
          publicId: retry.data.public_id,
          orderId: retry.data.id,
        };
      }
    }
    logServerError("createOrder.insert", orderError);
    throw new AppError("INTERNAL", {
      userMessage: "לא ניתן ליצור את ההזמנה. אנא נסו שוב.",
    });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    })),
  );

  if (itemsError) {
    logServerError("createOrder.items", itemsError);
    throw new AppError("INTERNAL", {
      userMessage: "ההזמנה נוצרה חלקית — אנא פנו אלינו.",
    });
  }

  await sendOrderConfirmationEmail({
    orderId: order.id,
    publicId: order.public_id,
    customerName: data.customerName,
    fulfillmentType: data.fulfillmentType,
    subtotalAgorot,
    deliveryFeeAgorot,
    totalAgorot,
    items: orderItems,
    addressSnapshot,
  });

  return {
    publicId: order.public_id,
    orderId: order.id,
  };
}

async function sendOrderConfirmationEmail(params: {
  orderId: string;
  publicId: string;
  customerName: string;
  fulfillmentType: "delivery" | "pickup";
  subtotalAgorot: number;
  deliveryFeeAgorot: number;
  totalAgorot: number;
  items: Array<{
    product_name: string;
    quantity: number;
    unit_price_agorot: number;
    line_total_agorot: number;
  }>;
  addressSnapshot: DeliveryAddressSnapshot | null;
}): Promise<void> {
  const supabase = createServiceRoleClient();
  const restaurant = getRestaurantName();
  const fulfillmentLabel =
    params.fulfillmentType === "delivery" ? "משלוח" : "איסוף עצמי";

  const itemsHtml = params.items
    .map(
      (item) =>
        `<li>${item.product_name} × ${item.quantity} — ${
          item.unit_price_agorot === 0
            ? "לבירור"
            : formatIls(item.line_total_agorot)
        }</li>`,
    )
    .join("");

  const totalLabel =
    params.totalAgorot === 0 ? "לבירור" : formatIls(params.totalAgorot);

  const subject = `${restaurant} — אישור הזמנה ${params.publicId}`;
  const html = `
    <div dir="rtl" style="font-family: sans-serif;">
      <h1>תודה על ההזמנה, ${params.customerName}!</h1>
      <p>מספר הזמנה: <strong>${params.publicId}</strong></p>
      <p>סוג: ${fulfillmentLabel}</p>
      ${
        params.fulfillmentType === "delivery"
          ? `<p>כתובת: ${formatAddressForEmail(params.addressSnapshot)}</p>`
          : ""
      }
      <ul>${itemsHtml}</ul>
      <p>סה״כ: ${totalLabel}</p>
    </div>
  `;

  const emailProvider = getEmailProvider();
  let notificationStatus: "sent" | "failed" | "demo_logged" = "demo_logged";
  let errorMessage: string | null = null;

  try {
    const result = await emailProvider.send({
      to: "orders@demo.local",
      subject,
      html,
      orderId: params.orderId,
    });
    notificationStatus = result.loggedOnly ? "demo_logged" : result.ok ? "sent" : "failed";
    if (!result.ok) {
      errorMessage = result.message;
    }
  } catch (error) {
    notificationStatus = "failed";
    errorMessage = error instanceof Error ? error.message : "unknown";
    logServerError("createOrder.email", error);
  }

  await supabase.from("notification_logs").insert({
    order_id: params.orderId,
    channel: "email",
    recipient: "orders@demo.local",
    subject,
    body: html,
    status: notificationStatus,
    provider: emailProvider.name,
    error_message: errorMessage,
  });
}

export async function getOrderByPublicId(
  publicId: string,
): Promise<(Order & { order_items: OrderItem[] }) | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("public_id", publicId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Order & { order_items: OrderItem[] };
}

export async function listRecentOrders(limit = 50): Promise<
  Array<{
    id: string;
    public_id: string;
    customer_name: string;
    customer_phone: string;
    status: Order["status"];
    fulfillment_type: Order["fulfillment_type"];
    total_agorot: number;
    created_at: string;
  }>
> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, public_id, customer_name, customer_phone, status, fulfillment_type, total_agorot, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    logServerError("listRecentOrders", error);
    return [];
  }

  return data ?? [];
}

export async function getOrderById(
  orderId: string,
): Promise<AdminOrderDetail | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), delivery_zones(name)")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as AdminOrderDetail;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  cancelledReason?: string,
): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new AppError("SERVICE_UNAVAILABLE");
  }

  const supabase = createServiceRoleClient();
  const update: Record<string, unknown> = { status };

  if (status === "cancelled") {
    update.cancelled_at = new Date().toISOString();
    update.cancelled_reason = cancelledReason ?? null;
  }

  const { error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId);

  if (error) {
    logServerError("updateOrderStatus", error);
    throw new AppError("INTERNAL", {
      userMessage: "לא ניתן לעדכן את סטטוס ההזמנה.",
    });
  }
}

export async function getPendingPosOrders(): Promise<
  Array<AdminOrderDetail>
> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .is("pos_synced_at", null)
    .neq("status", "cancelled")
    .order("created_at", { ascending: true });

  if (error) {
    logServerError("getPendingPosOrders", error);
    return [];
  }

  return (data ?? []) as AdminOrderDetail[];
}

export async function ackPosOrder(orderId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("orders")
    .update({ pos_synced_at: new Date().toISOString() })
    .eq("id", orderId)
    .is("pos_synced_at", null);

  return !error;
}
