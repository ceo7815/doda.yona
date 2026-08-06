export type OrderStatus =
  | "received"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type FulfillmentType = "delivery" | "pickup";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: "התקבלה",
  preparing: "בהכנה",
  ready_for_pickup: "מוכנה לאיסוף",
  out_for_delivery: "יצאה למשלוח",
  completed: "הושלמה",
  cancelled: "בוטלה",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "ממתין לתשלום",
  paid: "שולם",
  failed: "נכשל",
  cancelled: "בוטל",
  refunded: "הוחזר",
};

export const FULFILLMENT_LABELS: Record<FulfillmentType, string> = {
  delivery: "משלוח",
  pickup: "איסוף עצמי",
};

export type DeliveryZoneOption = {
  id: string;
  name: string;
  deliveryFeeAgorot: number;
  minOrderAgorot: number | null;
  estimatedMinutes: number | null;
};

/** אזור משלוח ברירת מחדל — כל נתניה (גם בלי Supabase) */
export const NETANYA_DELIVERY_ZONE: DeliveryZoneOption = {
  id: "22222222-2222-2222-2222-222222222001",
  name: "כל אזור נתניה",
  deliveryFeeAgorot: 0,
  minOrderAgorot: null,
  estimatedMinutes: 45,
};

export const PAYMENT_METHOD_LABELS: Record<
  "cash" | "card_on_delivery" | "online" | "other",
  string
> = {
  cash: "מזומן",
  card_on_delivery: "כרטיס אשראי בקבלה",
  online: "תשלום אונליין",
  other: "אחר",
};
