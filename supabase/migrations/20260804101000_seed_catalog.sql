-- Seed catalog (idempotent by slug)

-- Rename legacy "מיוחדים" → מאפים תימניים (before insert, avoids slug/PK clashes)
update public.categories
set name = 'מאפים תימניים',
    slug = 'maafim-temaniim',
    sort_order = 2,
    deleted_at = null
where id = '11111111-1111-1111-1111-111111111003'
   or slug = 'meyuhadim';

insert into public.categories (id, name, slug, sort_order, is_active)
values
  ('11111111-1111-1111-1111-111111111001', 'מרקים', 'merakim', 1, true),
  ('11111111-1111-1111-1111-111111111004', 'עיקריות', 'ikarot', 2, true),
  ('11111111-1111-1111-1111-111111111003', 'מאפים תימניים', 'maafim-temaniim', 3, true),
  ('11111111-1111-1111-1111-111111111002', 'תוספות', 'tosafot', 4, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  sort_order = excluded.sort_order,
  is_active = true,
  deleted_at = null;

insert into public.products (
  category_id, name, slug, description, price_agorot,
  is_available, is_featured, sort_order, badges, image_path
) values
  ('11111111-1111-1111-1111-111111111001', 'מרק תימני משובח', 'marak-temani', 'מרק תימני משובח עם תוספות: חילבה, סחוג, לחוח, סלוף וירקות.', 0, true, true, 1, array['מומלץ'], '/menu/marak-temani.webp'),
  ('11111111-1111-1111-1111-111111111001', 'מרק מעורב תימני', 'marak-meurav-keves', 'מרק מעורב תימני עם כבש ומוח עצם של דודה יונה — עשיר ומבושל לאט.', 0, true, true, 2, array['מומלץ'], '/menu/marak-meurav-keves.webp'),
  ('11111111-1111-1111-1111-111111111001', 'מרק גולש תימני', 'marak-gulash-temani', 'מרק גולש תימני — בשר ותפוחי אדמה ברוטב עשיר ומסורתי.', 0, true, true, 3, array['מומלץ'], '/menu/marak-gulash-temani.webp'),
  ('11111111-1111-1111-1111-111111111001', 'מרק מוח עצם', 'marak-moach-etzem', 'מרק מוח עצם — בתוספת חילבה, סחוג, סלוף או לחוח וירקות.', 0, true, true, 4, array['מומלץ'], '/menu/marak-moach-etzem-tosafot.webp'),
  ('11111111-1111-1111-1111-111111111001', 'בשר כבש צלוי משובח', 'basar-keves-tzaluy', 'בשר כבש צלוי משובח — עסיסי ומבושל לאט במסורת הבית.', 0, true, true, 5, array['מומלץ'], '/menu/basar-keves-tzaluy.webp'),
  ('11111111-1111-1111-1111-111111111004', 'סטק בקר', 'steak-bakar', 'סטק בקר עם ירקות מבושלים — בתוספת אורז או קוסקוס.', 0, true, true, 1, array['מומלץ'], '/menu/steak-bakar.webp'),
  ('11111111-1111-1111-1111-111111111004', 'צלעות כבש', 'tzlaot-keves', 'צלעות כבש על הגריל — מוגשות עם תוספות.', 0, true, true, 2, array['מומלץ'], '/menu/tzlaot-keves.webp'),
  ('11111111-1111-1111-1111-111111111004', 'דג תימני משובח', 'dag-temani', 'דג תימני משובח — מוגש עם תוספות ירקות ועוד.', 0, true, true, 3, array['מומלץ'], '/menu/dag-temani.webp'),
  ('11111111-1111-1111-1111-111111111001', 'מרק שוויה תימני אסלי', 'shwaya', 'מרק שוויה תימני אסלי — תבשיל בשר עשיר במסורת הבית.', 0, true, true, 6, array['מומלץ'], '/menu/shwaya.webp'),
  ('11111111-1111-1111-1111-111111111001', 'מרק עוף', 'marak-of', 'טרי ובריא — מרק עוף בתוספת חילבה, סחוג, סלוף או לחוח וירקות.', 0, true, true, 7, array['מומלץ'], '/menu/marak-of.webp'),
  ('11111111-1111-1111-1111-111111111001', 'מרק זנב שור', 'marak-zanav', 'מרק זנב שור — עשיר ומבושל לאט, מוגש עם תוספות.', 0, true, true, 8, array['מומלץ'], null),
  ('11111111-1111-1111-1111-111111111001', 'מרק רגל', 'marak-regel', 'מרק רגל תימני — בתוספת ירקות, חילבה, סחוג, סלוף או לחוח.', 0, true, true, 9, array['מומלץ'], '/menu/marak-regel.webp'),
  ('11111111-1111-1111-1111-111111111001', 'מרק רגל פיקנטי', 'marak-regel-pikanti', 'מרק רגל פיקנטי עם אורז, תפוח אדמה, גזר וגרגרי חומוס.', 0, true, true, 10, array['מומלץ','פיקנטי'], '/menu/marak-regel-pikanti.webp'),
  ('11111111-1111-1111-1111-111111111001', 'מרק שעועית', 'marak-sheuit', 'מרק שעועית מזינה ומשובחת — בתוספת חילבה, סחוג, סלוף וירקות.', 0, true, true, 11, array['מומלץ'], '/menu/marak-sheuit.webp'),
  ('11111111-1111-1111-1111-111111111001', 'מרק שעועית וטלה', 'marak-sheuit-taleh', 'מרק שעועית וטלה — עשיר ומבושל לאט עם ירקות.', 0, true, true, 12, array['מומלץ'], '/menu/marak-sheuit-taleh.webp'),
  ('11111111-1111-1111-1111-111111111001', 'מרק בשר', 'marak-basar', 'מרק בשר קלאסי עם ירקות.', 0, true, false, 13, '{}', null),
  ('11111111-1111-1111-1111-111111111003', 'מעורב מאפים תימניים', 'meurav-maafim-temani', 'מגש מאפים תימניים מסורתיים: ג''חנונים, זלביות וסאבייה — מוגש עם תוספות ביצים, סחוג ורסק עגבניות.', 0, true, true, 1, array['מומלץ'], '/menu/meurav-maafim-temani.webp'),
  ('11111111-1111-1111-1111-111111111003', 'ג''חנון פרווה', 'jachnun-parve', 'ג''חנונים פרווה מתוקים של דודה יונה — מוגשים עם תוספות.', 0, true, true, 2, array['פרווה'], '/menu/jachnun-parve.webp'),
  ('11111111-1111-1111-1111-111111111003', 'קובנה משובחת', 'kubaneh', 'קובנות לשבתות ואירועים — בהזמנה מראש.', 0, true, true, 3, array['הזמנה מראש'], '/menu/kubaneh-shabbat.webp'),
  ('11111111-1111-1111-1111-111111111003', 'סאבייה משובחת', 'sabaya-meshubachat', 'סאבייה משובחת פרווה של דודה יונה — שכבות דקיקות וזהובות, לשבתות ואירועים. בהזמנה מראש.', 0, true, true, 4, array['פרווה','הזמנה מראש'], '/menu/sabaya-meshubachat.webp'),
  ('11111111-1111-1111-1111-111111111003', 'זלביות', 'zalabiya', 'זלביות — מאפה תימני משובח, זהוב ופריך.', 0, true, true, 5, array['מומלץ'], '/menu/zalabiya.webp'),
  ('11111111-1111-1111-1111-111111111003', 'ארוחת מלווח וזיוות', 'malawach-ziva', 'ארוחת מלווח וזיוות — מוגשת עם ביצים, רסק עגבניות ותוספות.', 0, true, true, 6, array['מומלץ'], '/menu/malawach-ziva.webp'),
  ('11111111-1111-1111-1111-111111111003', 'מלווח תימני מקורי', 'malawach-temani', 'מלווח תימני מקורי — מוגש עם תוספות.', 0, true, true, 7, array['מומלץ'], '/menu/malawach-ziva.webp'),
  ('11111111-1111-1111-1111-111111111003', 'סלוף טרי למשפחה', 'saluf', 'סלוף טרי למשפחה ליום שישי — בהזמנה מראש של 10 חתיכות ומעלה, החל מיום רביעי.', 0, true, true, 8, array['הזמנה מראש','מ־10 חתיכות'], '/menu/saluf-mishpacha.webp'),
  ('11111111-1111-1111-1111-111111111003', 'לחוח למשפחה — יום שישי', 'lachuch-mishpacha-shishi', 'כמות לחוח למשפחה ליום שישי. בהזמנה מראש בימי רביעי–חמישי.', 0, true, true, 9, array['הזמנה מראש'], null),
  ('11111111-1111-1111-1111-111111111002', 'מעורב חומוס', 'hummus-meurav', 'מעורב חומוס עם פול ופלפל תימני.', 0, true, false, 1, '{}', '/menu/hummus-meurav.webp'),
  ('11111111-1111-1111-1111-111111111002', 'לחוח', 'lachuch', 'לחם תימני ספוגי וטרי.', 0, true, false, 2, '{}', null),
  ('11111111-1111-1111-1111-111111111002', 'סחוג אדום או ירוק', 'schug', 'סחוג תימני חריף — אדום או ירוק.', 0, true, false, 3, '{}', null),
  ('11111111-1111-1111-1111-111111111002', 'חילבה', 'hilba', 'ממרח חילבה מסורתי.', 0, true, false, 4, '{}', null),
  ('11111111-1111-1111-1111-111111111002', 'סלט ירקות תימני', 'salat-yerakot-temani', 'סלט ירקות טרי בסגנון תימני.', 0, true, false, 5, '{}', null)
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price_agorot = excluded.price_agorot,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order,
  badges = excluded.badges,
  image_path = excluded.image_path,
  deleted_at = null;

-- Soft-delete legacy items if present
update public.products
set deleted_at = now(),
    is_available = false
where slug in ('saluf-o-lachuch', 'marak-basar-sheuit')
  and deleted_at is null;

insert into public.delivery_zones (
  id, name, delivery_fee_agorot, min_order_agorot, estimated_minutes, is_active, sort_order
)
values (
  '22222222-2222-2222-2222-222222222001',
  'כל אזור נתניה',
  0,
  null,
  45,
  true,
  1
)
on conflict (id) do update set
  name = excluded.name,
  is_active = true,
  deleted_at = null,
  sort_order = excluded.sort_order;

insert into public.system_settings (key, value, description)
values
  ('restaurant.phone', '""'::jsonb, 'טלפון עסקי'),
  ('restaurant.hours', '"יפורסם בקרוב"'::jsonb, 'שעות פעילות')
on conflict (key) do nothing;

insert into public.site_content (key, title, body, metadata)
values
  ('home.hero', 'דודה יונה', 'מאכלים תימניים אותנטיים', '{"kashrut":"גלאט כשר"}')
on conflict (key) do nothing;
