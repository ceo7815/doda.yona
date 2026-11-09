import type { Metadata } from "next";
import { PageHero } from "@/components/brand/page-hero";
import { AboutContent } from "@/components/about/about-content";
import { ABOUT_PAGE, RESTAURANT } from "@/data/catalog";
import { getOrderLink } from "@/lib/site-settings";
import { getSiteSettings } from "@/services/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "הסיפור שלנו",
  description: `${ABOUT_PAGE.heroTitle}. ${ABOUT_PAGE.tagline}`,
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <div>
      <PageHero priority eyebrow={RESTAURANT.locationLabel} title="הסיפור שלנו" subtitle={settings.about.heroTitle} />
      <AboutContent about={settings.about} order={getOrderLink(settings)} />
    </div>
  );
}
