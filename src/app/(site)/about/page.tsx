import type { Metadata } from "next";
import { PageHero } from "@/components/brand/page-hero";
import { AboutContent } from "@/components/about/about-content";
import { ABOUT_PAGE, RESTAURANT } from "@/data/catalog";

export const metadata: Metadata = {
  title: "הסיפור שלנו",
  description: `${ABOUT_PAGE.heroTitle}. ${ABOUT_PAGE.tagline}`,
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        priority
        eyebrow={RESTAURANT.locationLabel}
        title="הסיפור שלנו"
        subtitle={ABOUT_PAGE.heroTitle}
      />

      <AboutContent content={ABOUT_PAGE} />
    </div>
  );
}
