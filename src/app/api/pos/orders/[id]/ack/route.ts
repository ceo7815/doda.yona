import { NextResponse } from "next/server";
import { logServerError } from "@/lib/errors";
import { isSupabaseConfigured } from "@/lib/env";
import { ackPosOrder } from "@/services/orders";

function verifyPosApiKey(request: Request): boolean {
  const expected = process.env.POS_API_KEY;
  if (!expected) {
    return false;
  }
  const provided = request.headers.get("x-pos-api-key");
  return provided === expected;
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
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

  const { id } = await context.params;

  try {
    const ok = await ackPosOrder(id);
    if (!ok) {
      return NextResponse.json(
        { error: "לא ניתן לאשר את ההזמנה." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, orderId: id });
  } catch (error) {
    logServerError("POST /api/pos/orders/[id]/ack", error);
    return NextResponse.json(
      { error: "שגיאה פנימית." },
      { status: 500 },
    );
  }
}
