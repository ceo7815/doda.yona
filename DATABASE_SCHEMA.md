# דודה יונה — סכמת מסד נתונים

מסד: **PostgreSQL** דרך **Supabase**  
עקרונות: UUID כמזהים, `created_at` / `updated_at`, Soft Delete (`deleted_at`) במקומות מתאימים, RLS בכל טבלה חשופה.

---

## ER Overview

```
admin_users ──(auth.users)
categories ──< products
customers ──< customer_addresses
customers ──< orders
delivery_zones ──< orders
orders ──< order_items >── products
orders ──< payment_transactions
orders / system ──< notification_logs
system ──< integration_logs
site_content (key-value / typed sections)
gallery_images
system_settings
```

---

## Enums

```sql
create type order_fulfillment_type as enum ('delivery', 'pickup');
create type order_status as enum (
  'received',
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'completed',
  'cancelled'
);
create type payment_status as enum (
  'pending',
  'paid',
  'failed',
  'cancelled',
  'refunded'
);
create type payment_method as enum (
  'cash',
  'card_on_delivery',
  'online', -- future gateway
  'other'
);
create type notification_channel as enum ('email', 'whatsapp', 'sms', 'internal');
create type notification_status as enum ('pending', 'sent', 'failed', 'demo_logged');
create type integration_provider as enum ('payment', 'whatsapp', 'pos', 'email');
```

---

## Tables

### admin_users
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | = auth.users.id |
| email | text unique not null | |
| full_name | text | |
| role | text not null default 'admin' | `admin` / `owner` |
| is_active | boolean default true | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz nullable | soft delete |

### categories
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| name | text not null | |
| slug | text unique not null | |
| description | text | |
| sort_order | int default 0 | |
| is_active | boolean default true | |
| created_at / updated_at / deleted_at | | |

### products
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| category_id | uuid FK → categories | |
| name | text not null | |
| slug | text unique not null | |
| description | text | |
| price_agorot | int not null | מחיר באגורות (דיוק כספי) |
| image_path | text | Supabase Storage path |
| is_available | boolean default true | |
| is_featured | boolean default false | מומלצת |
| sort_order | int default 0 | |
| created_at / updated_at / deleted_at | | |

### customers
זיהוי לפי טלפון מנורמל (E.164 / ספרות בלבד ישראל).

| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| phone | text unique not null | מנורמל |
| full_name | text not null | |
| first_order_at | timestamptz | |
| last_order_at | timestamptz | |
| orders_count | int default 0 | |
| total_spent_agorot | bigint default 0 | |
| internal_notes | text | לא ללקוח |
| created_at / updated_at / deleted_at | | |

### customer_addresses
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| customer_id | uuid FK → customers | |
| label | text | בית / עבודה |
| city | text | |
| street | text | |
| house_number | text | |
| apartment | text | |
| floor | text | |
| entrance | text | |
| notes | text | |
| delivery_zone_id | uuid FK nullable | |
| is_default | boolean default false | |
| created_at / updated_at / deleted_at | | |

### delivery_zones
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| name | text not null | |
| delivery_fee_agorot | int not null | |
| min_order_agorot | int nullable | |
| estimated_minutes | int nullable | |
| is_active | boolean default true | |
| sort_order | int default 0 | |
| created_at / updated_at / deleted_at | | |

### orders
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | פנימי |
| public_id | text unique not null | מספר הזמנה לתצוגה (למשל DY-20260716-0042) |
| customer_id | uuid FK → customers | |
| fulfillment_type | order_fulfillment_type | |
| status | order_status default 'received' | |
| payment_status | payment_status default 'pending' | |
| payment_method | payment_method | |
| delivery_zone_id | uuid FK nullable | |
| customer_name | text not null | snapshot |
| customer_phone | text not null | snapshot |
| delivery_address_snapshot | jsonb nullable | |
| notes | text | הערת לקוח |
| subtotal_agorot | int not null | |
| delivery_fee_agorot | int not null default 0 | |
| total_agorot | int not null | |
| idempotency_key | text unique | הגנה מהזמנה כפולה |
| accepted_privacy | boolean not null | |
| accepted_terms | boolean not null | |
| cancelled_at / cancelled_reason | | |
| created_at / updated_at | | אין soft delete להזמנות — ביטול בסטטוס |

### order_items
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| order_id | uuid FK → orders | |
| product_id | uuid FK nullable | null אם נמחק |
| product_name | text not null | snapshot |
| unit_price_agorot | int not null | snapshot בעת ההזמנה |
| quantity | int not null check (>0) | |
| notes | text | הערה לפריט |
| line_total_agorot | int not null | |
| created_at | | |

### site_content
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| key | text unique not null | למשל `home.hero`, `about.body` |
| title | text | |
| body | text | markdown/plain |
| metadata | jsonb | שעות, קישורים וכו' |
| updated_at | | |
| updated_by | uuid FK → admin_users nullable | |

### gallery_images
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| title | text | |
| alt_text | text not null | נגישות |
| image_path | text not null | |
| sort_order | int default 0 | |
| is_active | boolean default true | |
| created_at / updated_at / deleted_at | | |

### notification_logs
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| order_id | uuid FK nullable | |
| channel | notification_channel | |
| recipient | text | |
| subject | text | |
| body | text | |
| status | notification_status | |
| provider | text | demo / resend / ... |
| error_message | text | |
| payload | jsonb | |
| created_at | | |

### payment_transactions
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| order_id | uuid FK → orders | |
| provider | text | cardcom / tranzila / demo |
| external_id | text | מזהה אצל הספק |
| status | payment_status | |
| amount_agorot | int not null | |
| currency | text default 'ILS' | |
| raw_response | jsonb | ללא נתוני כרטיס |
| idempotency_key | text unique | |
| created_at / updated_at | | |

### integration_logs
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| provider | integration_provider | |
| action | text | |
| order_id | uuid FK nullable | |
| status | text | success / failed / demo |
| request_payload | jsonb | sanitized |
| response_payload | jsonb | sanitized |
| error_message | text | |
| created_at | | |

### system_settings
| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| key | text unique not null | |
| value | jsonb not null | |
| description | text | |
| updated_at | | |
| updated_by | uuid FK nullable | |

דוגמאות מפתחות: `restaurant.phone`, `restaurant.address`, `restaurant.hours`, `restaurant.maps_url`, `restaurant.waze_url`, `seo.default_title`, `notifications.admin_email`.

---

## Indexes (עיקריים)

- `products(category_id, is_available, sort_order)` where `deleted_at is null`
- `orders(status, created_at desc)`
- `orders(customer_id, created_at desc)`
- `orders(public_id)` unique
- `orders(idempotency_key)` unique
- `customers(phone)` unique
- `notification_logs(order_id, channel, created_at)`

---

## RLS (עקרונות)

| טבלה | anon/public | authenticated admin |
|------|-------------|---------------------|
| categories / products (active) | SELECT | ALL |
| gallery / site_content (public keys) | SELECT | ALL |
| delivery_zones (active) | SELECT | ALL |
| orders | INSERT מבוקר + SELECT לפי `public_id` בלבד דרך RPC/Server | ALL |
| customers | אין גישה ישירה מהלקוח | ALL |
| admin_users | אין | SELECT עצמי / owner מנהל |
| logs / payments / settings | אין | ALL |

**חשוב:** פעולות הזמנה, מעקב וסליקה יעברו דרך Server Actions / Route Handlers עם service role רק בשרת, או RPC מאובטח — לא חשיפת service role לדפדפן.

---

## Storage Buckets

- `product-images` — ציבורי לקריאה, העלאה למנהלים
- `gallery` — ציבורי לקריאה, העלאה למנהלים

---

## כסף

כל הסכומים באגורות (`int` / `bigint`) כדי למנוע שגיאות נקודה צפה. תצוגה ב־₪ בצד הלקוח.
