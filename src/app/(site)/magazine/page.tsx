import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/brand/page-hero";
import { GoldFlourish } from "@/components/brand/ornaments";
import { RESTAURANT } from "@/data/catalog";

export const metadata: Metadata = {
  title: "מגזין דודה יונה",
  description: `מגזין דודה יונה — סיפורים, מתכונים וטעמים מהמטבח התימני של ${RESTAURANT.name}.`,
  // לא באפיון ועדיין ללא מאמרים מלאים — מחוץ לניווט ולמנועי החיפוש עד שיוחלט
  robots: { index: false, follow: true },
};

const ARTICLES = [
  {
    id: "kubaneh-story",
    title: "הסוד מאחורי הקובנה של דודה יונה",
    excerpt:
      "איך קובנה אחת הופכת לבוקר שלם — על האש, על הסבלנות, ועל הזיכרון שמבשלים יחד.",
    image: "/brand/kubaneh-feature.webp",
    tag: "מסורת",
  },
  {
    id: "schug-guide",
    title: "מדריך קצר לסחוג תימני",
    excerpt:
      "מה ההבדל בין סחוג ירוק לסחוג אדום, ואיך מגישים אותו לצד מרקים ומאפים.",
    image: "/menu/marak-temani.webp",
    tag: "טיפים",
  },
  {
    id: "shabbat-table",
    title: "שולחן שבת תימני בבית",
    excerpt:
      "מעורב מאפים, ביצים, רסק עגבניות — איך בונים שולחן שמרגיש כמו בכרם התימנים.",
    image: "/menu/meurav-maafim-temani.webp",
    tag: "שבת",
  },
  {
    id: "soup-tradition",
    title: "למה מרק תימני מתבשל כל כך לאט",
    excerpt:
      "מרק שמבשלים שעות — על הבשר, על העצם, ועל הטעם שאי אפשר למהר.",
    image: "/menu/marak-meurav-keves.webp",
    tag: "מרקים",
  },
] as const;

export default function MagazinePage() {
  return (
    <div>
      <PageHero
        priority
        eyebrow={RESTAURANT.name}
        title="מגזין דודה יונה"
        subtitle="סיפורים, טעמים ומסורת מהמטבח התימני — מאהבה שנולדה בבית"
      />

      <div className="surface-paper w-full px-3 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-light leading-relaxed text-ink-muted sm:text-base">
              כאן נפרסם מדי פעם סיפורים מהמטבח, מתכונים, טיפים להגשה
              ומאחורי הקלעים של {RESTAURANT.name}. המגזין יתעדכן בהמשך.
            </p>
          </div>

          <ul className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2 sm:gap-6">
            {ARTICLES.map((article) => (
              <li
                key={article.id}
                className="overflow-hidden rounded-2xl border border-border/80 bg-surface-elevated shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-100">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-[0.65rem] font-bold tracking-[0.18em] text-gold-700">
                    {article.tag}
                  </p>
                  <h2 className="mt-1.5 text-lg font-extrabold leading-snug text-brand-900">
                    {article.title}
                  </h2>
                  <GoldFlourish className="mt-2" />
                  <p className="mt-3 text-sm font-light leading-relaxed text-ink-muted">
                    {article.excerpt}
                  </p>
                  <p className="mt-4 text-xs font-semibold text-gold-700">
                    בקרוב — מאמר מלא
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-brand-900/10 bg-brand-900 px-5 py-8 text-center sm:px-8">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] text-gold-500">
              רוצים להזמין?
            </p>
            <h3 className="mt-2 text-xl font-black text-gold-400">
              מהמגזין ישר לתפריט
            </h3>
            <p className="mt-3 text-sm font-light text-brand-200">
              משלוח, איסוף או ישיבה במקום — דרך מערכת ההזמנות של המסעדה או בטלפון.
            </p>
            <Link href="/menu" className="btn-gold mt-6 inline-flex px-8">
              לתפריט
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
