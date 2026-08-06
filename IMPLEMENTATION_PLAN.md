# דודה יונה — תוכנית מימוש

---

## מצב נוכחי (סקירה)

| פריט | סטטוס |
|------|--------|
| קוד / Next.js | **ריק** — תיקייה ללא קבצים |
| מסד נתונים | לא הוגדר |
| Auth | לא הוגדר |
| מיתוג | אין לוגו/צבעים/תמונות סופיים |

---

## ארכיטקטורה מומלצת

```
┌─────────────────────────────────────────────────────────┐
│  Next.js App Router (RTL, Mobile First)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Public Site  │  │ Admin (/admin)│  │ API / Actions │  │
│  │ Server Comp. │  │ Protected    │  │ Zod validated │  │
│  └──────────────┘  └──────────────┘  └───────┬───────┘  │
└──────────────────────────────────────────────┼──────────┘
                                               │
                    ┌──────────────────────────▼──────────┐
                    │  Domain Services                     │
                    │  orders · catalog · customers · cms   │
                    └──────────────────────────┬──────────┘
                                               │
         ┌─────────────┬───────────────┬───────┴────────┐
         ▼             ▼               ▼                ▼
   PaymentAdapter  WhatsAppAdapter  EmailAdapter   PosAdapter
   (demo/real)     (demo/real)      (demo/real)    (demo only)
                                               │
                    ┌──────────────────────────▼──────────┐
                    │  Supabase                            │
                    │  Postgres + Auth + Storage + RLS     │
                    └─────────────────────────────────────┘
```

### עקרונות

1. **Server Components** לתוכן ציבורי; Client רק לסל, טפסים, אינטראקציה
2. **Server Actions** לפעולות עסקיות עם Zod
3. **Adapters** לכל אינטגרציה חיצונית — מימוש Demo כברירת מחדל
4. **Snapshots** בהזמנות (שם מנה, מחיר) — מחיר משתנה לא משנה הזמנות קיימות
5. **Idempotency key** ביצירת הזמנה
6. **כסף באגורות**

---

## מבנה תיקיות מומלץ

```
doda-yona/
├── PROJECT_SPEC.md
├── DATABASE_SCHEMA.md
├── IMPLEMENTATION_PLAN.md
├── .env.example
├── public/
├── supabase/
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (site)/           # אתר ציבורי
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   ├── menu/
│   │   │   ├── gallery/
│   │   │   ├── contact/
│   │   │   ├── cart/
│   │   │   └── order/[publicId]/
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── login/
│   │   │       └── ...
│   │   ├── api/              # webhooks בלבד כשצריך
│   │   ├── layout.tsx        # root: lang=he dir=rtl
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/               # design system
│   │   ├── layout/           # header, footer, nav
│   │   ├── menu/
│   │   ├── cart/
│   │   └── admin/
│   ├── lib/
│   │   ├── supabase/         # client, server, middleware
│   │   ├── auth/
│   │   ├── validations/      # zod schemas
│   │   ├── money.ts
│   │   ├── phone.ts
│   │   └── errors.ts
│   ├── services/
│   │   ├── catalog.ts
│   │   ├── orders.ts
│   │   ├── customers.ts
│   │   └── content.ts
│   ├── integrations/
│   │   ├── payment/
│   │   ├── whatsapp/
│   │   ├── email/
│   │   └── pos/
│   ├── stores/               # cart (client)
│   ├── types/
│   └── styles/
│       └── tokens.css
└── package.json
```

---

## שלבי פיתוח

### שלב 1 — תשתית ✅ הושלם
- Next.js + TS + Tailwind + RTL
- Design tokens + UI בסיסי
- Layout אתר + שלד אדמין
- Supabase clients (browser/server/middleware)
- Auth מנהלים + הגנת נתיבים
- `.env.example`, error boundaries, עמודי שגיאה בעברית
- Adapters: Payment / WhatsApp / Email / POS (Demo)
- Migration ראשונית: `admin_users`
- Build / tsc / lint ירוקים (אומת)

### שלב 2 — ניהול תפריט
- Migrations: categories, products
- Admin CRUD + Storage תמונות
- עמוד תפריט ציבורי

### שלב 3 — סל והזמנות
- Cart store, checkout, delivery zones
- יצירת הזמנה + idempotency
- מעקב הזמנה + ניהול סטטוסים

### שלב 4 — מטבח והתראות
- מסך הזמנות, הדפסה
- Email + WhatsApp adapters + notification_logs

### שלב 5 — CRM
- זיהוי לפי טלפון, כרטיס לקוח, היסטוריה

### שלב 6 — תוכן, SEO, נגישות
- CMS, גלריה, metadata, schema, sitemap, accessibility

### שלב 7 — אינטגרציות
- Payment interface + webhooks
- POS adapter (demo)
- בדיקות אינטגרציה

### שלב 8 — בדיקות והשקה
- תרחישי קצה מהאפיון
- Deployment (Vercel + Supabase)

---

## שאלות חובה לפני חיבור אמיתי

### סליקה
1. איזה ספק? (Cardcom / Tranzila / אחר)
2. האם תשלום אונליין חובה בעת ההזמנה, או גם מזומן/אשראי במשלוח?
3. מסמכי API, מפתחות sandbox, מבנה Webhook וחתימה
4. האם נדרש 3DS / token / iframe?
5. מדיניות החזרים וביטולים

### WhatsApp
1. איזה ספק? (Meta Cloud API / Twilio / Green API / אחר)
2. מספר עסקי מאומת + תבניות הודעות מאושרות
3. האם לשלוח גם ללקוח וגם לבעל העסק?
4. תוכן התבניות בעברית לאישור

### קופה רושמת (POS)
1. שם הספק + מסמכי API
2. Authentication וסביבת בדיקות
3. מיפוי מוצרים (ברקוד / SKU / מזהה פנימי)
4. האם ההעברה סינכרונית או בתור?
5. מה קורה כשכשל — רק Log (כפי באפיון) או ניסיון חוזר?

### עסקי / תוכן
1. כתובת מדויקת, טלפון, שעות פעילות, עיר (ל-SEO מקומי)
2. אזורי משלוח ומחירי מינימום
3. לוגו, צבעי מותג, תמונות מנות
4. מייל לקבלת התראות הזמנות
5. מדיניות פרטיות / תנאי שימוש (טקסט משפטי)

---

## קריטריוני קבלה לכל שלב

- `npm run build` עובר
- `npm run lint` עובר
- TypeScript ללא שגיאות
- RTL תקין במסכים שנבנו
- אין שימוש ב-service role בצד לקוח
- הודעות שגיאה בעברית למשתמש
