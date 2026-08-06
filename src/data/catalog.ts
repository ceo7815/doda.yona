/**
 * פרטי מסעדה ומטען מותג — לפי חומרי הלקוח + הסכם.
 * מחיר 0 / null מוצג כ־₪0.00 עד שיסופק מחיר אמיתי.
 */

export const RESTAURANT = {
  name: "דודה יונה",
  tagline: "מאכלים תימניים אותנטיים",
  founder: "רחמים חוכימה",
  kashrut: "כשר למהדרין • גלאט כשר",
  kashrutShort: "גלאט כשר",
  neighborhood: "כרם התימנים",
  city: "נתניה",
  street: "רחוב אלכסנדר ינאי 16",
  addressFull: "רחוב אלכסנדר ינאי 16, נתניה",
  locationLabel: "כרם התימנים, נתניה",
  services: ["משלוחים", "לקחת"] as const,
  dineInNote: "אפשרות לאכול במקום בהזמנה מראש",
  mapsQuery: "אלכסנדר ינאי 16 נתניה",
} as const;

/** סיפור המותג — ניתן לעדכן לפי נוסח שיאשר רחמים */
export const BRAND_STORY = {
  homeTeaser:
    "מאחורי הקדרות והלחוח עומד רחמים חוכימה — איש שמטבח תימן הוא לו לא מקצוע בלבד, אלא אהבה של חיים. בכל מרק שמבעבע לאט, בכל סחוג שנכתש ביד, חי הזיכרון של בית חם ושל דודה יונה.",
  aboutEyebrow: "הסיפור שלנו",
  aboutSubtitle: "אהבה למטבח, מורשת של טעמים, ולב פתוח לכל אורח",
  sections: [
    {
      title: "בשם דודה יונה",
      body: "״דודה יונה״ איננה רק שם על שלט — היא זיכרון חי של שולחן עמוס, של ריח הילבה בבוקר ושל יד שאוהבת לבשל. המסעדה נושאת את השם הזה כמחווה לאותה אהבה ביתית: אוכל שמחמם את הלב עוד לפני שהוא מגיע לצלחת.",
      imagePath: "/brand/kubaneh-feature.png",
      imageAlt: "קובנה משובחת של דודה יונה",
    },
    {
      title: "רחמים חוכימה — איש המטבח",
      body: "רחמים חוכימה גדל אל תוך ריחות המטבח התימני. מה שהתחיל כגעגוע לטעמים של הבית הפך לשליחות: לשמר את המסורת בדיוק כפי שנמסרה — בלי קיצורי דרך, בלי ויתורים על האיכות. עבורו המטבח הוא מקום של כבוד: שם מערבבים סבלנות עם תבלינים, ושם הופכים חומרי גלם פשוטים לסעודה שמספרת סיפור.",
      imagePath: "/menu/meurav-maafim-temani.png",
      imageAlt: "מעורב מאפים תימניים",
    },
    {
      title: "אהבה שמבושלת לאט",
      body: "יש אוכל שמכינים מהר — ויש אוכל שמכינים מאהבה. אצל רחמים הכול מתחיל מהאש הקטנה: מרקים שמתבשלים שעות עד שהבשר מתרכך והטעם מעמיק, לחוח שנאפה רגע לפני ההגשה, סחוג וחילבה שנכתשים כמו פעם. כל מנה היא הזמנה לעצור רגע, לנשום את הריח, ולהרגיש בבית — גם אם הגעתם רק למשלוח.",
      imagePath: "/menu/marak-temani.png",
      imageAlt: "מרק תימני על האש",
    },
    {
      title: "מכרם התימנים, בלב נתניה",
      body: "באלכסנדר ינאי 16, בכרם התימנים בנתניה, נפתח הבית הזה לאורחים. כאן אפשר להזמין למשלוח או לאיסוף עצמי, וגם לאכול במקום בהזמנה מראש — בכשרות למהדרין, בגלאט כשר, ובאותה חמימות שמלווה את רחמים בכל יום במטבח.",
      imagePath: "/menu/jachnun-parve.png",
      imageAlt: "ג'חנון טרי מהמטבח",
    },
  ],
  closingQuote:
    "״כשאדם מבשל מאהבה — האורח מרגיש את זה בביס הראשון.״",
} as const;

export type MenuCategoryId = "soups" | "mains" | "pastries" | "sides";

export type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: MenuCategoryId | string;
  priceAgorot: number | null;
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
    categoryId: "soups",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 1,
    imagePath: "/menu/marak-temani.png",
  },
  {
    id: "soup-meurav-keves",
    slug: "marak-meurav-keves",
    name: "מרק מעורב תימני",
    description:
      "מרק מעורב תימני עם כבש ומוח עצם של דודה יונה — עשיר ומבושל לאט.",
    categoryId: "soups",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 2,
    imagePath: "/menu/marak-meurav-keves.png",
  },
  {
    id: "soup-gulash",
    slug: "marak-gulash-temani",
    name: "מרק גולש תימני",
    description: "מרק גולש תימני — בשר ותפוחי אדמה ברוטב עשיר ומסורתי.",
    categoryId: "soups",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 3,
    imagePath: "/menu/marak-gulash-temani.png",
  },
  {
    id: "soup-bone-marrow",
    slug: "marak-moach-etzem",
    name: "מרק מוח עצם",
    description:
      "מרק מוח עצם — בתוספת חילבה, סחוג, סלוף או לחוח וירקות.",
    categoryId: "soups",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 4,
    imagePath: "/menu/marak-moach-etzem-tosafot.png",
  },
  {
    id: "soup-lamb-roast",
    slug: "basar-keves-tzaluy",
    name: "בשר כבש צלוי משובח",
    description: "בשר כבש צלוי משובח — עסיסי ומבושל לאט במסורת הבית.",
    categoryId: "soups",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 5,
    imagePath: "/menu/basar-keves-tzaluy.png",
  },
  {
    id: "main-steak",
    slug: "steak-bakar",
    name: "סטק בקר",
    description: "סטק בקר עם ירקות מבושלים — בתוספת אורז או קוסקוס.",
    categoryId: "mains",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 1,
    imagePath: "/menu/steak-bakar.png",
  },
  {
    id: "main-lamb-chops",
    slug: "tzlaot-keves",
    name: "צלעות כבש",
    description: "צלעות כבש על הגריל — מוגשות עם תוספות.",
    categoryId: "mains",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 2,
    imagePath: "/menu/tzlaot-keves.png",
  },
  {
    id: "main-fish",
    slug: "dag-temani",
    name: "דג תימני משובח",
    description: "דג תימני משובח — מוגש עם תוספות ירקות ועוד.",
    categoryId: "mains",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 3,
    imagePath: "/menu/dag-temani.png",
  },
  {
    id: "soup-shwaya",
    slug: "shwaya",
    name: "מרק שוויה תימני אסלי",
    description: "מרק שוויה תימני אסלי — תבשיל בשר עשיר במסורת הבית.",
    categoryId: "soups",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 9,
    imagePath: "/menu/shwaya.png",
  },
  {
    id: "soup-chicken",
    slug: "marak-of",
    name: "מרק עוף",
    description:
      "טרי ובריא — מרק עוף בתוספת חילבה, סחוג, סלוף או לחוח וירקות.",
    categoryId: "soups",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 10,
    imagePath: "/menu/marak-of.png",
  },
  {
    id: "soup-oxtail",
    slug: "marak-zanav",
    name: "מרק זנב שור",
    description: "מרק זנב שור — עשיר ומבושל לאט, מוגש עם תוספות.",
    categoryId: "soups",
    priceAgorot: 0,
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
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 12,
    imagePath: "/menu/marak-regel.png",
  },
  {
    id: "soup-leg-spicy",
    slug: "marak-regel-pikanti",
    name: "מרק רגל פיקנטי",
    description:
      "מרק רגל פיקנטי עם אורז, תפוח אדמה, גזר וגרגרי חומוס.",
    categoryId: "soups",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ", "פיקנטי"],
    sortOrder: 13,
    imagePath: "/menu/marak-regel-pikanti.png",
  },
  {
    id: "soup-beef-beans",
    slug: "marak-sheuit",
    name: "מרק שעועית",
    description:
      "מרק שעועית מזינה ומשובחת — בתוספת חילבה, סחוג, סלוף וירקות.",
    categoryId: "soups",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 14,
    imagePath: "/menu/marak-sheuit.png",
  },
  {
    id: "soup-beans-lamb",
    slug: "marak-sheuit-taleh",
    name: "מרק שעועית וטלה",
    description: "מרק שעועית וטלה — עשיר ומבושל לאט עם ירקות.",
    categoryId: "soups",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 15,
    imagePath: "/menu/marak-sheuit-taleh.png",
  },
  {
    id: "soup-beef",
    slug: "marak-basar",
    name: "מרק בשר",
    description: "מרק בשר קלאסי עם ירקות.",
    categoryId: "soups",
    priceAgorot: 0,
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
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 1,
    imagePath: "/menu/meurav-maafim-temani.png",
  },
  {
    id: "pastry-jachnun",
    slug: "jachnun-parve",
    name: "ג'חנון פרווה",
    description: "ג'חנונים פרווה מתוקים של דודה יונה — מוגשים עם תוספות.",
    categoryId: "pastries",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["פרווה"],
    sortOrder: 2,
    imagePath: "/menu/jachnun-parve.png",
  },
  {
    id: "pastry-kubaneh",
    slug: "kubaneh",
    name: "קובנה משובחת",
    description: "קובנות לשבתות ואירועים — בהזמנה מראש.",
    categoryId: "pastries",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["הזמנה מראש"],
    sortOrder: 3,
    imagePath: "/menu/kubaneh-shabbat.png",
  },
  {
    id: "pastry-sabaya",
    slug: "sabaya-meshubachat",
    name: "סאבייה משובחת",
    description:
      "סאבייה משובחת פרווה של דודה יונה — שכבות דקיקות וזהובות, לשבתות ואירועים. בהזמנה מראש.",
    categoryId: "pastries",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["פרווה", "הזמנה מראש"],
    sortOrder: 4,
    imagePath: "/menu/sabaya-meshubachat.png",
  },
  {
    id: "pastry-zalabiya",
    slug: "zalabiya",
    name: "זלביות",
    description: "זלביות — מאפה תימני משובח, זהוב ופריך.",
    categoryId: "pastries",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 5,
    imagePath: "/menu/zalabiya.png",
  },
  {
    id: "pastry-malawach-ziva",
    slug: "malawach-ziva",
    name: "ארוחת מלווח וזיוות",
    description:
      "ארוחת מלווח וזיוות — מוגשת עם ביצים, רסק עגבניות ותוספות.",
    categoryId: "pastries",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 6,
    imagePath: "/menu/malawach-ziva.png",
  },
  {
    id: "pastry-malawach",
    slug: "malawach-temani",
    name: "מלווח תימני מקורי",
    description: "מלווח תימני מקורי — מוגש עם תוספות.",
    categoryId: "pastries",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["מומלץ"],
    sortOrder: 7,
    imagePath: "/menu/malawach-ziva.png",
  },
  {
    id: "pastry-saluf",
    slug: "saluf",
    name: "סלוף טרי למשפחה",
    description:
      "סלוף טרי למשפחה ליום שישי — בהזמנה מראש של 10 חתיכות ומעלה, החל מיום רביעי.",
    categoryId: "pastries",
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: true,
    badges: ["הזמנה מראש", "מ־10 חתיכות"],
    sortOrder: 8,
    imagePath: "/menu/saluf-mishpacha.png",
  },
  {
    id: "pastry-lachuch-family",
    slug: "lachuch-mishpacha-shishi",
    name: "לחוח למשפחה — יום שישי",
    description:
      "כמות לחוח למשפחה ליום שישי. בהזמנה מראש בימי רביעי–חמישי.",
    categoryId: "pastries",
    priceAgorot: 0,
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
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 1,
    imagePath: "/menu/hummus-meurav.png",
  },
  {
    id: "side-lachuch",
    slug: "lachuch",
    name: "לחוח",
    description: "לחם תימני ספוגי וטרי.",
    categoryId: "sides",
    priceAgorot: 0,
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
    priceAgorot: 0,
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
    priceAgorot: 0,
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
    priceAgorot: 0,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 5,
  },
];

/** סדר מומלצים בדף הבית — מנות פופולריות קודם */
const HOME_FEATURED_SLUGS = [
  "jachnun-parve",
  "kubaneh",
  "meurav-maafim-temani",
  "marak-temani",
] as const;

export function getFeaturedItems(limit = 4): MenuItem[] {
  const available = MENU_ITEMS.filter((i) => i.isAvailable);
  const bySlug = new Map(available.map((item) => [item.slug, item]));

  const curated = HOME_FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (item): item is MenuItem => Boolean(item),
  );

  if (curated.length >= limit) {
    return curated.slice(0, limit);
  }

  const curatedIds = new Set(curated.map((item) => item.id));
  const extras = available
    .filter((item) => item.isFeatured && !curatedIds.has(item.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return [...curated, ...extras].slice(0, limit);
}

export function getItemsByCategory(categoryId: string): MenuItem[] {
  return MENU_ITEMS.filter((i) => i.categoryId === categoryId).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

export function formatMenuPrice(priceAgorot: number | null | undefined): string {
  const agorot = priceAgorot ?? 0;
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(agorot / 100);
}
