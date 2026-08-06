import { NextResponse } from "next/server";
import { logServerError } from "@/lib/errors";
import { isSupabaseConfigured } from "@/lib/env";
import { getPendingPosOrders } from "@/services/orders";
import type { OrderItem } from "@/types/database";

function verifyPosApiKey(request: Request): boolean {
  const expected = process.env.POS_API_KEY;
  if (!expected) {
    return false;
  }
  const provided = request.headers.get("x-pos-api-key");
  return provided === expected;
}

export async function GET(request: Request) {
  if (!verifyPosApiKey(request)) {
    return NextResponse.json(
      { error: "מפתח API לא תקין או חסר." },
      { status: 401 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "השירות אינו זמין." },
      { status: 503 },
    );
  }

  try {
    const orders = await getPendingPosOrders();
    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        publicId: order.public_id,
        status: order.status,
        fulfillmentType: order.fulfillment_type,
        paymentMethod: order.payment_method,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        deliveryAddress: order.delivery_address_snapshot,
        notes: order.notes,
        subtotalAgorot: order.subtotal_agorot,
        deliveryFeeAgorot: order.delivery_fee_agorot,
        totalAgorot: order.total_agorot,
        createdAt: order.created_at,
        items: (order.order_items ?? []).map((item: OrderItem) => ({
          productName: item.product_name,
          quantity: item.quantity,
          unitPriceAgorot: item.unit_price_agorot,
          lineTotalAgorot: item.line_total_agorot,
          notes: item.notes,
        })),
      })),
    });
  } catch (error) {
    logServerError("GET /api/pos/orders", error);
    return NextResponse.json(
      { error: "שגיאה פנימית." },
      { status: 500 },
    );
  }
}
