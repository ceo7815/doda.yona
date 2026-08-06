import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";
import { PageHero } from "@/components/brand/page-hero";
import { StoryChapter } from "@/components/about/story-chapter";
import { BRAND_STORY, RESTAURANT } from "@/data/catalog";

export const metadata: Metadata = {
  title: "הסיפור שלנו",
  description: `הסיפור של ${RESTAURANT.founder} ו${RESTAURANT.name} — אהבה למטבח התימני ב${RESTAURANT.locationLabel}.`,
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        priority
        eyebrow={RESTAURANT.founder}
        title="הסיפור שלנו"
        subtitle={BRAND_STORY.aboutSubtitle}
      />

      <section className="surface-paper border-b border-border/80 py-10 sm:py-16">
        <Container className="max-w-3xl text-center">
          <p className="text-xs font-bold tracking-[0.22em] text-gold-700">
            {RESTAURANT.founder}
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-brand-900 sm:text-4xl">
            סיפור שנכתב על האש
          </h2>
          <GoldFlourish className="mx-auto mt-4" />
          <p className="mt-5 text-base font-light leading-relaxed text-ink-muted sm:mt-6 sm:text-xl">
            בלב {RESTAURANT.locationLabel} ניצב בית קטן עם לב גדול —{" "}
            {RESTAURANT.name}. כאן המטבח אינו רק מקום עבודה; הוא במה של זיכרון,
            של מסורת תימנית ושל אהבה שרחמים חוכימה מבשל בכל יום מחדש.
          </p>
        </Container>
      </section>

      <section className="surface-paper py-12 sm:py-20">
        <Container className="space-y-14 sm:space-y-20 lg:space-y-28">
          {BRAND_STORY.sections.map((section, index) => (
            <StoryChapter
              key={section.title}
              index={index}
              title={section.title}
              body={section.body}
              imagePath={section.imagePath}
              imageAlt={section.imageAlt}
              reverse={index % 2 === 1}
              floating={index === 0}
            />
          ))}
        </Container>
      </section>

      <section className="surface-deep py-12 pb-[max(3rem,env(safe-area-inset-bottom))] sm:py-20">
        <Container className="max-w-2xl text-center">
          <p className="text-lg font-light leading-relaxed text-gold-300 sm:text-2xl">
            {BRAND_STORY.closingQuote}
          </p>
          <p className="mt-5 text-sm font-bold tracking-wide text-gold-500 sm:mt-6">
            — {RESTAURANT.founder}, {RESTAURANT.name}
          </p>
          <GoldFlourish className="mx-auto mt-5 text-gold-500 sm:mt-6" />
          <p className="mt-6 text-sm font-semibold text-brand-200 sm:mt-8">
            {RESTAURANT.kashrut}
          </p>
          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <Link href="/menu" className="btn-gold w-full sm:w-auto">
              לתפריט
            </Link>
            <Link href="/contact" className="btn-ghost-gold w-full sm:w-auto">
              איך מגיעים
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
