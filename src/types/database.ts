import type {
  FulfillmentType,
  OrderStatus,
  PaymentStatus,
} from "@/types/domain";

export type PaymentMethod = "cash" | "card_on_delivery" | "online" | "other";

export type NotificationChannel = "email" | "whatsapp" | "sms" | "internal";

export type NotificationStatus =
  | "pending"
  | "sent"
  | "failed"
  | "demo_logged";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price_agorot: number;
  image_path: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  badges: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DeliveryZone = {
  id: string;
  name: string;
  delivery_fee_agorot: number;
  min_order_agorot: number | null;
  estimated_minutes: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Customer = {
  id: string;
  phone: string;
  full_name: string;
  first_order_at: string | null;
  last_order_at: string | null;
  orders_count: number;
  total_spent_agorot: number;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DeliveryAddressSnapshot = {
  city?: string;
  street?: string;
  house_number?: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  notes?: string;
};

export type Order = {
  id: string;
  public_id: string;
  customer_id: string;
  fulfillment_type: FulfillmentType;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  delivery_zone_id: string | null;
  customer_name: string;
  customer_phone: string;
  delivery_address_snapshot: DeliveryAddressSnapshot | null;
  notes: string | null;
  subtotal_agorot: number;
  delivery_fee_agorot: number;
  total_agorot: number;
  idempotency_key: string;
  accepted_privacy: boolean;
  accepted_terms: boolean;
  pos_synced_at: string | null;
  cancelled_at: string | null;
  cancelled_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price_agorot: number;
  quantity: number;
  notes: string | null;
  line_total_agorot: number;
  created_at: string;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

export type AdminOrderDetail = Order & {
  order_items: OrderItem[];
  delivery_zones: { name: string } | null;
};
