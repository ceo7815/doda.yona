# דודה יונה — מאכלי תימן מסורתיים

אתר תדמית ותפריט דיגיטלי למסעדה תימנית בכרם התימנים, נתניה — עם אזור ניהול שבו בעלי המסעדה עורכים את כל התוכן בלי קוד.

**ההזמנות והמחירים מנוהלים במערכת הקופה של המסעדה.** כל כפתורי «להזמנה» באתר מובילים לדף ההזמנות של הקופה (כתובת אחת שמוגדרת באדמין או ב-`NEXT_PUBLIC_ORDER_URL`). כל עוד לא הוגדרה כתובת — הכפתורים מחייגים למסעדה. התפריט באתר הוא תצוגה בלבד, ללא מחירים.

## טכנולוגיות

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
- Supabase (PostgreSQL + RLS, Auth, Storage)
- Zod

## התחלה מהירה

```bash
cp .env.example .env.local   # ומלאו את פרטי Supabase
npm install
npm run dev
```

הריצו את המיגרציות שב-`supabase/migrations/` לפי הסדר (Supabase CLI: `supabase db push`, או SQL Editor).
את משתמש המנהל הראשון יוצרים ב-Supabase Auth ומוסיפים לטבלה `admin_users` עם `role = 'owner'`.

### משתני סביבה

| משתנה | תיאור |
|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | פרויקט Supabase (anon בלבד) |
| `NEXT_PUBLIC_APP_URL` | כתובת האתר (canonical, sitemap) |
| `NEXT_PUBLIC_ORDER_URL` | ברירת מחדל לקישור ההזמנות (האדמין גובר) |
| `NEXT_PUBLIC_NOINDEX` | `1` בסביבת תצוגה מקדימה — חוסם אינדוקס |
| `NEXT_IMAGE_UNOPTIMIZED` | `1` כשהאירוח לא תומך באופטימיזציית תמונות |

בלי Supabase האתר הציבורי עובד מלא מהתוכן שבקוד (`src/data/catalog.ts`), והאדמין מציג הודעה שהמסד לא מחובר.

## אזור הניהול (`/admin`)

- **מנות** — שם, תיאור, תמונה (נדחסת אוטומטית ל-WebP), קטגוריה, תגיות, מוצגת/מוסתרת, מומלצת בדף הבית
- **קטגוריות** — סדר והסתרה
- **גלריה** — העלאה מרובה, סידור, הסתרה ומחיקה
- **טקסטים באתר** — דף הבית ועמוד «הסיפור שלנו»
- **פרטי העסק ושעות** — טלפון, וואטסאפ, כתובת, מייל, כשרות, שעות פעילות, רשתות חברתיות
- **הזמנות והגדרות** — קישור לדף ההזמנות של הקופה, טקסט הכפתור, תיאור לגוגל

כל שמירה מרעננת מיד את הדפים הציבוריים (ISR + תגיות מטמון).

## סקריפטים

| פקודה | תיאור |
|--------|--------|
| `npm run dev` | שרת פיתוח |
| `npm run build` | בנייה לפרודקשן |
| `npm run start` | הרצת build |
| `npm run lint` | ESLint |
| `npm run typecheck` | בדיקת TypeScript |

## ביצועים

- דפים ציבוריים סטטיים עם ISR (5 דקות) ורענון מיידי בשמירה מהאדמין
- קריאות למסד עם timeout של 4 שניות ונפילה לתוכן שבקוד
- כל התמונות ב-WebP, `next/image` עם AVIF/WebP, cache ארוך לנכסים סטטיים
- בלי ספריות אנימציה — CSS + IntersectionObserver, כיבוד `prefers-reduced-motion`
- מפה נטענת רק בלחיצה; middleware רץ רק על `/admin`

## תיעוד

- [`PROJECT_SPEC.md`](./PROJECT_SPEC.md) — אפיון מקורי
- [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) — סכמת DB מקורית (טבלאות ההזמנות הוסרו במיגרציה `20261109120000_pos_ordering_cms.sql`)
- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — תוכנית שלבים

## אבטחה

- אין שימוש ב-service role באפליקציה; כל הכתיבה דרך session מנהל + RLS (`is_active_admin()`)
- אזור `/admin` מוגן ב-middleware + בדיקת הרשאות בשרת, `noindex` ו-`no-store`
