import Link from "next/link";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";
import { HomeHero } from "@/components/home/home-hero";
import { HeroMenuTransition } from "@/components/home/hero-menu-transition";
import { FeaturedSection } from "@/components/home/featured-section";
import { FloatingFeatureImage } from "@/components/home/floating-feature-image";
import { OrderCtaSection } from "@/components/home/order-cta-section";
import { BRAND_STORY, RESTAURANT, getFeaturedItems } from "@/data/catalog";
import { getRestaurantName } from "@/lib/env";

export default function HomePage() {
  const name = getRestaurantName();
  const featured = getFeaturedItems(4);

  return (
    <div>
      <HomeHero restaurantName={name} />
      <HeroMenuTransition restaurantName={name} />

      <section className="border-y border-brand-800 bg-brand-900 py-8 sm:py-11">
        <Container>
          <ul className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:gap-6">
            <li>
              <p className="text-[0.68rem] font-bold tracking-[0.22em] text-gold-500 sm:text-xs">
                <Link
                  href="/menu"
                  className="transition-colors hover:text-gold-400"
                >
                  לתפריט והזמנות
                </Link>
              </p>
              <p className="mt-1.5 text-sm font-semibold leading-snug sm:mt-2 sm:text-lg">
                <a
                  href={`tel:${RESTAURANT.phoneTel}`}
                  className="text-brand-50 transition-colors hover:text-gold-300"
                  dir="ltr"
                >
                  {RESTAURANT.phoneDisplay}
                </a>
              </p>
            </li>
            <li>
              <p className="text-[0.68rem] font-bold tracking-[0.22em] text-gold-500 sm:text-xs">
                משלוחים
              </p>
              <p className="mt-1.5 text-xs font-semibold leading-snug text-brand-50 sm:mt-2 sm:text-lg">
                לקחת הביתה
              </p>
            </li>
            <li>
              <p className="text-[0.68rem] font-bold tracking-[0.22em] text-gold-500 sm:text-xs">
                אוכל במקום
              </p>
              <p className="mt-1.5 text-xs font-semibold leading-snug text-brand-50 sm:mt-2 sm:text-lg">
                לאכול במקום
              </p>
            </li>
          </ul>
        </Container>
      </section>

      <FeaturedSection items={featured} />

      <section className="relative overflow-hidden border-t border-border">
        <div className="surface-paper absolute inset-0" aria-hidden />
        <Container className="relative grid items-center gap-6 py-10 sm:gap-12 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-start">
            <p className="text-xs font-bold tracking-[0.22em] text-gold-700">
              הסיפור שלנו
            </p>
            <h2 className="mt-3 text-xl font-black tracking-tight text-brand-900 sm:text-4xl">
              {name}
              <br />
              <span className="text-gold-700">ואהבה שנולדה במטבח</span>
            </h2>
            <GoldFlourish className="mx-auto mt-4 lg:mx-0" />
            <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-ink-muted sm:mt-5 sm:text-lg lg:mx-0">
              {BRAND_STORY.homeTeaser}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex min-h-11 items-center border-b-2 border-gold-600 pb-1 text-sm font-bold text-brand-900 transition-colors hover:text-gold-700 sm:mt-8"
            >
              לקרוא את הסיפור המלא
            </Link>
          </div>

          <FloatingFeatureImage
            src="/brand/kubaneh-feature.png"
            alt="קובנה משובחת של דודה יונה"
            className="mx-auto max-w-[16rem] sm:max-w-sm"
          />
        </Container>
      </section>

      <OrderCtaSection />
    </div>
  );
}
