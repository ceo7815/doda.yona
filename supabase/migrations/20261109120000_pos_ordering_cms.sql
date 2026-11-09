-- דודה יונה — מעבר להזמנות דרך הקופה + ניהול תוכן מלא לבעלים
-- ההזמנות, המחירים והתשלום מנוהלים במערכת הקופה של המסעדה; האתר מציג תדמית ותפריט.

-- 1) הסרת טבלאות ההזמנות/משלוחים/תשלום (לא בשימוש עוד)
drop table if exists public.integration_logs cascade;
drop table if exists public.payment_transactions cascade;
drop table if exists public.notification_logs cascade;
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.customer_addresses cascade;
drop table if exists public.customers cascade;
drop table if exists public.delivery_zones cascade;

drop type if exists public.order_fulfillment_type;
drop type if exists public.order_status;
drop type if exists public.payment_status;
drop type if exists public.payment_method;
drop type if exists public.notification_channel;
drop type if exists public.notification_status;
drop type if exists public.integration_provider;

delete from public.system_settings where key in ('restaurant.phone', 'restaurant.hours');

-- 2) מנות: בלי מחירים באתר; is_available = «מוצגת באתר»
alter table public.products drop column if exists price_agorot;
comment on column public.products.is_available is 'מוצגת באתר';
comment on column public.products.is_featured is 'מומלצת בדף הבית';

update public.products
set image_path = regexp_replace(image_path, '\.png$', '.webp')
where image_path like '/menu/%.png';

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select to anon, authenticated
  using (deleted_at is null and is_available = true);

-- 3) תוכן האתר: מסמך אחד key='site' (metadata jsonb). רשומת התחלה ריקה —
--    האתר משלים ברירות מחדל מחומרי הלקוח שבקוד.
delete from public.site_content where key = 'home.hero';
insert into public.site_content (key, title, metadata)
values ('site', 'תוכן והגדרות האתר', '{}'::jsonb)
on conflict (key) do nothing;

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

drop trigger if exists gallery_images_set_updated_at on public.gallery_images;
create trigger gallery_images_set_updated_at before update on public.gallery_images
  for each row execute function public.set_updated_at();

create index if not exists gallery_images_active_idx
  on public.gallery_images (sort_order)
  where deleted_at is null and is_active = true;

-- 4) אחסון תמונות (מנות + גלריה): bucket ציבורי לקריאה, כתיבה למנהלים בלבד
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/webp', 'image/jpeg', 'image/png', 'image/avif'])
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_active_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_active_admin())
  with check (bucket_id = 'media' and public.is_active_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_active_admin());
