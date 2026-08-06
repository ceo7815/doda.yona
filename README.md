# דודה יונה — מאכלי תימן מסורתיים

אתר תדמית, תפריט דיגיטלי ומערכת הזמנות למסעדה תימנית.

## טכנולוגיות

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
- Zod + React Hook Form (בשלבים הבאים לטפסים מורכבים)

## התחלה מהירה

```bash
cp .env.example .env.local
npm install
npm run dev
```

מלאו ב-`.env.local` את פרטי פרויקט ה-Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (שרת בלבד)

לאחר מכן הריצו את המיגרציה ב-`supabase/migrations/`.

## סקריפטים

| פקודה | תיאור |
|--------|--------|
| `npm run dev` | שרת פיתוח |
| `npm run build` | בנייה לפרודקשן |
| `npm run start` | הרצת build |
| `npm run lint` | ESLint |
| `npm run typecheck` | בדיקת TypeScript |

## תיעוד

- [`PROJECT_SPEC.md`](./PROJECT_SPEC.md) — אפיון
- [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) — סכמת DB
- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — תוכנית שלבים

## אבטחה

- אין לחשוף `SUPABASE_SERVICE_ROLE_KEY` לדפדפן
- אזור `/admin` מוגן ב-middleware + בדיקת הרשאות בשרת
- אינטגרציות (סליקה / WhatsApp / קופה) במצב Demo עד בחירת ספק
