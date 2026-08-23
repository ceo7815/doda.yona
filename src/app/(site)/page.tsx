import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";
import { HomeHero } from "@/components/home/home-hero";
import { FeaturedSection } from "@/components/home/featured-section";
import { FloatingFeatureImage } from "@/components/home/floating-feature-image";
import { OrderCtaSection } from "@/components/home/order-cta-section";
import { BRAND_STORY, getFeaturedItems } from "@/data/catalog";
import { getRestaurantName } from "@/lib/env";

const HOME_SERVICES_IMAGE = {
  src: "/brand/home-services.png",
  width: 1024,
  height: 152,
} as const;

export default function HomePage() {
  const name = getRestaurantName();
  const featured = getFeaturedItems(4);

  return (
    <div>
      <HomeHero restaurantName={name} />

      <div
        className="flex items-center justify-center bg-brand-900 py-1.5"
        aria-hidden
      >
        <GoldFlourish className="h-2.5 w-24 text-gold-500/55" />
      </div>

      <section className="leading-none" aria-label="שירותים וקייטרינג">
        <Image
          src={HOME_SERVICES_IMAGE.src}
          alt={`${name} — הזמנה אונליין, ישיבה במקום, איסוף עצמי, משלוחים וקייטרינג`}
          width={HOME_SERVICES_IMAGE.width}
          height={HOME_SERVICES_IMAGE.height}
          className="h-auto w-full"
          sizes="100vw"
          quality={90}
        />
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
