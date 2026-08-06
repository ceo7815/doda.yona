-- Full schema for Doda Yona
-- Run against Supabase SQL editor or: supabase db push

create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type order_fulfillment_type as enum ('delivery', 'pickup');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum (
    'received', 'preparing', 'ready_for_pickup',
    'out_for_delivery', 'completed', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum (
    'pending', 'paid', 'failed', 'cancelled', 'refunded'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum (
    'cash', 'card_on_delivery', 'online', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_channel as enum ('email', 'whatsapp', 'sms', 'internal');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_status as enum ('pending', 'sent', 'failed', 'demo_logged');
exception when duplicate_object then null; end $$;

do $$ begin
  create type integration_provider as enum ('payment', 'whatsapp', 'pos', 'email');
exception when duplicate_object then null; end $$;

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- admin_users
create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'owner')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- products (price 0 = לבירור עד שיסופק מחיר)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id),
  name text not null,
  slug text not null unique,
  description text,
  price_agorot int not null default 0 check (price_agorot >= 0),
  image_path text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  badges text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists products_category_active_idx
  on public.products (category_id, is_available, sort_order)
  where deleted_at is null;

-- customers
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  full_name text not null,
  first_order_at timestamptz,
  last_order_at timestamptz,
  orders_count int not null default 0,
  total_spent_agorot bigint not null default 0,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- customer_addresses
create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  label text,
  city text,
  street text,
  house_number text,
  apartment text,
  floor text,
  entrance text,
  notes text,
  delivery_zone_id uuid,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- delivery_zones
create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  delivery_fee_agorot int not null default 0 check (delivery_fee_agorot >= 0),
  min_order_agorot int,
  estimated_minutes int,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.customer_addresses
  drop constraint if exists customer_addresses_delivery_zone_id_fkey;
alter table public.customer_addresses
  add constraint customer_addresses_delivery_zone_id_fkey
  foreign key (delivery_zone_id) references public.delivery_zones (id);

-- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  customer_id uuid not null references public.customers (id),
  fulfillment_type order_fulfillment_type not null,
  status order_status not null default 'received',
  payment_status payment_status not null default 'pending',
  payment_method payment_method not null default 'cash',
  delivery_zone_id uuid references public.delivery_zones (id),
  customer_name text not null,
  customer_phone text not null,
  delivery_address_snapshot jsonb,
  notes text,
  subtotal_agorot int not null check (subtotal_agorot >= 0),
  delivery_fee_agorot int not null default 0 check (delivery_fee_agorot >= 0),
  total_agorot int not null check (total_agorot >= 0),
  idempotency_key text not null unique,
  accepted_privacy boolean not null default false,
  accepted_terms boolean not null default false,
  pos_synced_at timestamptz,
  cancelled_at timestamptz,
  cancelled_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_created_idx on public.orders (status, created_at desc);
create index if not exists orders_customer_created_idx on public.orders (customer_id, created_at desc);
create index if not exists orders_pos_pending_idx on public.orders (created_at)
  where pos_synced_at is null and status <> 'cancelled';

-- order_items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  product_name text not null,
  unit_price_agorot int not null,
  quantity int not null check (quantity > 0),
  notes text,
  line_total_agorot int not null,
  created_at timestamptz not null default now()
);

-- site_content
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text,
  body text,
  metadata jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid references public.admin_users (id)
);

-- gallery_images
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  alt_text text not null,
  image_path text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- notification_logs
create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id),
  channel notification_channel not null,
  recipient text,
  subject text,
  body text,
  status notification_status not null default 'pending',
  provider text,
  error_message text,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- payment_transactions
create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  provider text not null,
  external_id text,
  status payment_status not null default 'pending',
  amount_agorot int not null,
  currency text not null default 'ILS',
  raw_response jsonb,
  idempotency_key text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- integration_logs
create table if not exists public.integration_logs (
  id uuid primary key default gen_random_uuid(),
  provider integration_provider not null,
  action text not null,
  order_id uuid references public.orders (id),
  status text not null,
  request_payload jsonb,
  response_payload jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

-- system_settings
create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.admin_users (id)
);

-- triggers
drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at before update on public.admin_users
  for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at before update on public.customers
  for each row execute function public.set_updated_at();

drop trigger if exists delivery_zones_set_updated_at on public.delivery_zones;
create trigger delivery_zones_set_updated_at before update on public.delivery_zones
  for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- RLS
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.site_content enable row level security;
alter table public.gallery_images enable row level security;
alter table public.notification_logs enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.integration_logs enable row level security;
alter table public.system_settings enable row level security;

-- Public read: active catalog
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select to anon, authenticated
  using (deleted_at is null and is_active = true);

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select to anon, authenticated
  using (deleted_at is null);

drop policy if exists "zones_public_read" on public.delivery_zones;
create policy "zones_public_read" on public.delivery_zones
  for select to anon, authenticated
  using (deleted_at is null and is_active = true);

drop policy if exists "gallery_public_read" on public.gallery_images;
create policy "gallery_public_read" on public.gallery_images
  for select to anon, authenticated
  using (deleted_at is null and is_active = true);

drop policy if exists "content_public_read" on public.site_content;
create policy "content_public_read" on public.site_content
  for select to anon, authenticated
  using (true);

-- Admin helper
create or replace function public.is_active_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_users a
    where a.id = auth.uid() and a.is_active = true and a.deleted_at is null
  );
$$;

drop policy if exists "admin_users_select_own" on public.admin_users;
create policy "admin_users_select_own" on public.admin_users
  for select to authenticated
  using (id = auth.uid() and deleted_at is null);

-- Admin full access policies
drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all" on public.categories
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all" on public.products
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "zones_admin_all" on public.delivery_zones;
create policy "zones_admin_all" on public.delivery_zones
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "customers_admin_all" on public.customers;
create policy "customers_admin_all" on public.customers
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "addresses_admin_all" on public.customer_addresses;
create policy "addresses_admin_all" on public.customer_addresses
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "order_items_admin_all" on public.order_items;
create policy "order_items_admin_all" on public.order_items
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "content_admin_all" on public.site_content;
create policy "content_admin_all" on public.site_content
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "gallery_admin_all" on public.gallery_images;
create policy "gallery_admin_all" on public.gallery_images
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "notifications_admin_all" on public.notification_logs;
create policy "notifications_admin_all" on public.notification_logs
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "payments_admin_all" on public.payment_transactions;
create policy "payments_admin_all" on public.payment_transactions
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "integrations_admin_all" on public.integration_logs;
create policy "integrations_admin_all" on public.integration_logs
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "settings_admin_all" on public.system_settings;
create policy "settings_admin_all" on public.system_settings
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

-- Storage buckets (run in dashboard if needed):
-- product-images (public read), gallery (public read)
