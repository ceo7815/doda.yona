/**
 * פרטי מסעדה ומטען מותג — לפי חומרי הלקוח + הסכם.
 * ברירות מחדל סטטיות — האתר נופל אליהן כשאין חיבור למסד הנתונים.
 * מחירים והזמנות מנוהלים במערכת הקופה של המסעדה, לא באתר.
 */

export const RESTAURANT = {
  name: "דודה יונה",
  tagline: "מאכלים תימניים אותנטיים",
  kashrut: "כשר למהדרין • גלאט כשר",
  kashrutShort: "גלאט כשר",
  neighborhood: "כרם התימנים",
  city: "נתניה",
  street: "רחוב אלכסנדר ינאי 16",
  addressFull: "רחוב אלכסנדר ינאי 16, נתניה",
  locationLabel: "כרם התימנים, נתניה",
  phoneDisplay: "053-6206603",
  phoneTel: "0536206603",
  services: ["משלוחים", "לקחת הביתה", "לאכול במקום"] as const,
  dineInNote: "אפשרות לאכול במקום בהזמנה מראש",
  mapsQuery: "אלכסנדר ינאי 16 נתניה",
} as const;

/** תוכן עמוד «הסיפור שלנו» — נוסח מאושר לקוח */
export const ABOUT_PAGE = {
  heroTitle: "הסיפור של דודה יונה כרם התימנים נתניה",
  heroSubtitle: "דודה יונה – מסעדה תימנית אותנטית",
  tagline: "הטעמים של כרם התימנים – עכשיו אצלכם בצלחת",
  intro:
    "ברוכים הבאים לדודה יונה, הבית של המטבח התימני האותנטי. אצלנו תיהנו ממרקים עשירים, מאפים מסורתיים, תבלינים מקוריים ומאכלים המוכנים באהבה לפי מתכונים שעוברים מדור לדור.",
  soups: {
    title: "תפריט המרקים",
    items: [
      "מרק בשר תימני",
      "מרק רגל",
      "מרק זנב שור",
      "מרק עוף",
      "מרק בשר",
      "מרק שעועית עם בשר",
      "מרק ירקות",
      "מרק ראש",
      "שוויה",
    ],
    note: "כל מרק מוגש עם אפשרות לתוספות: חילבה • סחוג • ירקות טריים • לחוח • סלוף — ללא תשלום נוסף",
  },
  pastries: {
    title: "מאפים ומאכלים תימניים",
    items: [
      "קובנה בטעמים – כולל ביצה, רסק עגבניות וסחוג",
      "קובנה משפחתית גדולה (פרווה) לשבת – בהזמנה מראש עד יום רביעי",
      "גחנון תוצרת בית – כולל ביצה, רסק עגבניות וסחוג",
      "סלוף, לחוח ומלווח תימני טרי – אפייה במקום",
      "סבייה קטנה או גדולה – בהזמנה מראש עד יום רביעי",
      "קעקות תימניות",
      "סיר חמין לשבת – בהזמנה מראש עד יום רביעי",
      "תבלינים תימניים מיוחדים ומשובחים",
    ],
  },
  infoSections: [
    {
      title: "מחירים והזמנות",
      body: "המחירים המעודכנים וההזמנות מתבצעים דרך מערכת ההזמנות של המסעדה.",
    },
    {
      title: "משלוחים",
      body: "משלוחים מהירים לאזור נתניה והסביבה.",
    },
    {
      title: "איסוף עצמי",
      body: "ניתן להזמין מראש ולאסוף מהמסעדה ללא המתנה.",
    },
    {
      title: "ישיבה במקום",
      body: "ניתן להזמין מקום מראש וליהנות מחוויית אירוח תימנית אותנטית.",
    },
  ],
  catering: {
    title: "קייטרינג",
    body: "קייטרינג למאכלים תימניים אותנטיים לאירועי שמחה, שבתות, בריתות, אזכרות ובתי אבל – במחירים מיוחדים ובהתאמה אישית.",
  },
  closingTitle: "דודה יונה",
  closingBody: "הטעם התימני האמיתי – מסורת, איכות ואהבה בכל מנה.",
} as const;

/** סיפור המותג — תקציר לדף הבית */
export const BRAND_STORY = {
  homeTeaser:
    "ברוכים הבאים לדודה יונה, הבית של המטבח התימני האותנטי — מרקים עשירים, מאפים מסורתיים וטעמים שעוברים מדור לדור.",
  aboutEyebrow: "הסיפור שלנו",
  aboutSubtitle: "דודה יונה – מסעדה תימנית אותנטית",
} as const;

export type MenuCategoryId = "soups" | "mains" | "pastries" | "sides";

export type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** טקסט מורחב לעמוד המנה */
  longDescription?: string | null;
  categoryId: MenuCategoryId | string;
  isAvailable: boolean;
  isFeatured: boolean;
  badges?: string[];
  sortOrder: number;
  imagePath?: string | null;
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: "soups", name: "מרקים", slug: "merakim", sortOrder: 1 },
  { id: "mains", name: "עיקריות", slug: "ikarot", sortOrder: 2 },
  { id: "pastries", name: "מאפים תימניים", slug: "maafim-temaniim", sortOrder: 3 },
  { id: "sides", name: "תוספות", slug: "tosafot", sortOrder: 4 },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "soup-temani",
    slug: "marak-temani",
    name: "מרק תימני משובח",
    description:
      "מרק תימני משובח עם תוספות: חילבה, סחוג, לחוח, סלוף וירקות.",
    longDescription:
      "מרק תימני קלאסי של דודה יונה — מבושל לאט על האש, עשיר ומלא בטעם. מוגש עם תוספות על חשבון הבית: חילבה, סחוג, לחוח, סלוף וירקות. מושלם למשלוח או לאיסוף.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 1,
    imagePath: "/menu/marak-temani.webp",
  },
  {
    id: "soup-meurav-keves",
    slug: "marak-meurav-keves",
    name: "מרק מעורב תימני",
    description:
      "מרק מעורב תימני עם כבש ומוח עצם של דודה יונה — עשיר ומבושל לאט.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 2,
    imagePath: "/menu/marak-meurav-keves.webp",
  },
  {
    id: "soup-gulash",
    slug: "marak-gulash-temani",
    name: "מרק גולש תימני",
    description: "מרק גולש תימני — בשר ותפוחי אדמה ברוטב עשיר ומסורתי.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 3,
    imagePath: "/menu/marak-gulash-temani.webp",
  },
  {
    id: "soup-bone-marrow",
    slug: "marak-moach-etzem",
    name: "מרק מוח עצם",
    description:
      "מרק מוח עצם — בתוספת חילבה, סחוג, סלוף או לחוח וירקות.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 4,
    imagePath: "/menu/marak-moach-etzem-tosafot.webp",
  },
  {
    id: "soup-lamb-roast",
    slug: "basar-keves-tzaluy",
    name: "בשר כבש צלוי משובח",
    description: "בשר כבש צלוי משובח — עסיסי ומבושל לאט במסורת הבית.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 5,
    imagePath: "/menu/basar-keves-tzaluy.webp",
  },
  {
    id: "main-steak",
    slug: "steak-bakar",
    name: "סטק בקר",
    description: "סטק בקר עם ירקות מבושלים — בתוספת אורז או קוסקוס.",
    categoryId: "mains",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 1,
    imagePath: "/menu/steak-bakar.webp",
  },
  {
    id: "main-lamb-chops",
    slug: "tzlaot-keves",
    name: "צלעות כבש",
    description: "צלעות כבש על הגריל — מוגשות עם תוספות.",
    categoryId: "mains",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 2,
    imagePath: "/menu/tzlaot-keves.webp",
  },
  {
    id: "main-fish",
    slug: "dag-temani",
    name: "דג תימני משובח",
    description: "דג תימני משובח — מוגש עם תוספות ירקות ועוד.",
    categoryId: "mains",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 3,
    imagePath: "/menu/dag-temani.webp",
  },
  {
    id: "soup-shwaya",
    slug: "shwaya",
    name: "מרק שוויה תימני אסלי",
    description: "מרק שוויה תימני אסלי — תבשיל בשר עשיר במסורת הבית.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 9,
    imagePath: "/menu/shwaya.webp",
  },
  {
    id: "soup-chicken",
    slug: "marak-of",
    name: "מרק עוף",
    description:
      "טרי ובריא — מרק עוף בתוספת חילבה, סחוג, סלוף או לחוח וירקות.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 10,
    imagePath: "/menu/marak-of.webp",
  },
  {
    id: "soup-oxtail",
    slug: "marak-zanav",
    name: "מרק זנב שור",
    description: "מרק זנב שור — עשיר ומבושל לאט, מוגש עם תוספות.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 11,
  },
  {
    id: "soup-leg",
    slug: "marak-regel",
    name: "מרק רגל",
    description:
      "מרק רגל תימני — בתוספת ירקות, חילבה, סחוג, סלוף או לחוח.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 12,
    imagePath: "/menu/marak-regel.webp",
  },
  {
    id: "soup-leg-spicy",
    slug: "marak-regel-pikanti",
    name: "מרק רגל פיקנטי",
    description:
      "מרק רגל פיקנטי עם אורז, תפוח אדמה, גזר וגרגרי חומוס.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ", "פיקנטי"],
    sortOrder: 13,
    imagePath: "/menu/marak-regel-pikanti.webp",
  },
  {
    id: "soup-beef-beans",
    slug: "marak-sheuit",
    name: "מרק שעועית",
    description:
      "מרק שעועית מזינה ומשובחת — בתוספת חילבה, סחוג, סלוף וירקות.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 14,
    imagePath: "/menu/marak-sheuit.webp",
  },
  {
    id: "soup-beans-lamb",
    slug: "marak-sheuit-taleh",
    name: "מרק שעועית וטלה",
    description: "מרק שעועית וטלה — עשיר ומבושל לאט עם ירקות.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 15,
    imagePath: "/menu/marak-sheuit-taleh.webp",
  },
  {
    id: "soup-beef",
    slug: "marak-basar",
    name: "מרק בשר",
    description: "מרק בשר קלאסי עם ירקות.",
    categoryId: "soups",
    isAvailable: true,
    isFeatured: false,
    sortOrder: 16,
  },
  {
    id: "pastry-meurav-maafim",
    slug: "meurav-maafim-temani",
    name: "מעורב מאפים תימניים",
    description:
      "מגש מאפים תימניים מסורתיים: ג'חנונים, זלביות וסאבייה — מוגש עם תוספות ביצים, סחוג ורסק עגבניות.",
    categoryId: "pastries",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 1,
    imagePath: "/menu/meurav-maafim-temani.webp",
  },
  {
    id: "pastry-jachnun",
    slug: "jachnun-parve",
    name: "ג'חנון פרווה",
    description: "ג'חנונים פרווה מתוקים של דודה יונה — מוגשים עם תוספות.",
    longDescription:
      "ג'חנונים פרווה מתוקים, אפויים בזהירות עד לרכות מושלמת. מוגשים עם ביצים, סחוג ורסק עגבניות על חשבון הבית — חוויה תימנית אותנטית.",
    categoryId: "pastries",
    isAvailable: true,
    isFeatured: true,
    badges: ["פרווה"],
    sortOrder: 2,
    imagePath: "/menu/jachnun-parve.webp",
  },
  {
    id: "pastry-kubaneh",
    slug: "kubaneh",
    name: "קובנה משובחת",
    description: "קובנות לשבתות ואירועים — בהזמנה מראש.",
    categoryId: "pastries",
    isAvailable: true,
    isFeatured: true,
    badges: ["הזמנה מראש"],
    sortOrder: 3,
    imagePath: "/menu/kubaneh-shabbat.webp",
  },
  {
    id: "pastry-sabaya",
    slug: "sabaya-meshubachat",
    name: "סאבייה משובחת",
    description:
      "סאבייה משובחת פרווה של דודה יונה — שכבות דקיקות וזהובות, לשבתות ואירועים. בהזמנה מראש.",
    categoryId: "pastries",
    isAvailable: true,
    isFeatured: true,
    badges: ["פרווה", "הזמנה מראש"],
    sortOrder: 4,
    imagePath: "/menu/sabaya-meshubachat.webp",
  },
  {
    id: "pastry-zalabiya",
    slug: "zalabiya",
    name: "זלביות",
    description: "זלביות — מאפה תימני משובח, זהוב ופריך.",
    categoryId: "pastries",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 5,
    imagePath: "/menu/zalabiya.webp",
  },
  {
    id: "pastry-malawach-ziva",
    slug: "malawach-ziva",
    name: "ארוחת מלווח וזיוות",
    description:
      "ארוחת מלווח וזיוות — מוגשת עם ביצים, רסק עגבניות ותוספות.",
    categoryId: "pastries",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 6,
    imagePath: "/menu/malawach-ziva.webp",
  },
  {
    id: "pastry-malawach",
    slug: "malawach-temani",
    name: "מלווח תימני מקורי",
    description: "מלווח תימני מקורי — מוגש עם תוספות.",
    categoryId: "pastries",
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 7,
    imagePath: "/menu/malawach-ziva.webp",
  },
  {
    id: "pastry-saluf",
    slug: "saluf",
    name: "סלוף טרי למשפחה",
    description:
      "סלוף טרי למשפחה ליום שישי — בהזמנה מראש של 10 חתיכות ומעלה, החל מיום רביעי.",
    categoryId: "pastries",
    isAvailable: true,
    isFeatured: true,
    badges: ["הזמנה מראש", "מ־10 חתיכות"],
    sortOrder: 8,
    imagePath: "/menu/saluf-mishpacha.webp",
  },
  {
    id: "pastry-lachuch-family",
    slug: "lachuch-mishpacha-shishi",
    name: "לחוח למשפחה — יום שישי",
    description:
      "כמות לחוח למשפחה ליום שישי. בהזמנה מראש בימי רביעי–חמישי.",
    categoryId: "pastries",
    isAvailable: true,
    isFeatured: true,
    badges: ["הזמנה מראש"],
    sortOrder: 9,
  },
  {
    id: "side-hummus-meurav",
    slug: "hummus-meurav",
    name: "מעורב חומוס",
    description: "מעורב חומוס עם פול ופלפל תימני.",
    categoryId: "sides",
    isAvailable: true,
    isFeatured: false,
    sortOrder: 1,
    imagePath: "/menu/hummus-meurav.webp",
  },
  {
    id: "side-lachuch",
    slug: "lachuch",
    name: "לחוח",
    description: "לחם תימני ספוגי וטרי.",
    categoryId: "sides",
    isAvailable: true,
    isFeatured: false,
    sortOrder: 2,
  },
  {
    id: "side-schug",
    slug: "schug",
    name: "סחוג אדום או ירוק",
    description: "סחוג תימני חריף — אדום או ירוק.",
    categoryId: "sides",
    isAvailable: true,
    isFeatured: false,
    sortOrder: 3,
  },
  {
    id: "side-hilba",
    slug: "hilba",
    name: "חילבה",
    description: "ממרח חילבה מסורתי.",
    categoryId: "sides",
    isAvailable: true,
    isFeatured: false,
    sortOrder: 4,
  },
  {
    id: "side-salad",
    slug: "salat-yerakot-temani",
    name: "סלט ירקות תימני",
    description: "סלט ירקות טרי בסגנון תימני.",
    categoryId: "sides",
    isAvailable: true,
    isFeatured: false,
    sortOrder: 5,
  },
];

/** תוספות על חשבון הבית לפי קטגוריה (לפי חומרי הלקוח) — מוצג כ«מוגש עם» */
const SERVED_WITH_BY_CATEGORY: Record<string, string[]> = {
  soups: ["חילבה", "סחוג", "לחוח", "סלוף", "ירקות"],
  merakim: ["חילבה", "סחוג", "לחוח", "סלוף", "ירקות"],
  pastries: ["ביצה", "סחוג", "רסק עגבניות"],
  "maafim-temaniim": ["ביצה", "סחוג", "רסק עגבניות"],
};

export function getServedWith(categoryKey: string | null | undefined): string[] {
  if (!categoryKey) return [];
  return SERVED_WITH_BY_CATEGORY[categoryKey] ?? [];
}
