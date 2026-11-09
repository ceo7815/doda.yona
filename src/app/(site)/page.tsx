import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";
import { HomeHero } from "@/components/home/home-hero";
import { FeaturedSection } from "@/components/home/featured-section";
import { OrderCtaSection } from "@/components/home/order-cta-section";
import { Reveal } from "@/components/site/reveal";
import { getRestaurantName } from "@/lib/env";
import { getOrderLink, toTelHref } from "@/lib/site-settings";
import { getFeaturedMenuItems } from "@/services/catalog";
import { getSiteSettings } from "@/services/content";

export const revalidate = 300;

export default async function HomePage() {
  const name = getRestaurantName();
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getFeaturedMenuItems(4),
  ]);
  const order = getOrderLink(settings);

  return (
    <div>
      <HomeHero
        restaurantName={name}
        order={order}
        telHref={toTelHref(settings.business.phoneDisplay)}
        phoneDisplay={settings.business.phoneDisplay}
      />

      <FeaturedSection
        items={featured}
        title={settings.home.featuredTitle}
        subtitle={settings.home.featuredSubtitle}
      />

      <section className="relative overflow-hidden border-t border-border bg-surface-elevated section-y">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 text-center lg:order-1 lg:text-start">
            <p className="eyebrow text-gold-700">הסיפור שלנו</p>
            <h2 className="mt-2 text-balance text-[1.65rem] font-black leading-tight tracking-tight text-brand-900 sm:text-4xl">
              {settings.home.storyTitle}
              <br />
              <span className="text-gold-700">{settings.home.storyHighlight}</span>
            </h2>
            <GoldFlourish className="mx-auto mt-4 lg:mx-0" />
            <p className="mx-auto mt-5 max-w-lg text-pretty text-[0.95rem] font-light leading-[1.9] text-ink-muted sm:text-lg lg:mx-0">
              {settings.home.storyTeaser}
            </p>
            <Link
              href="/about"
              className="link-underline mt-7 inline-flex min-h-11 items-center text-sm font-bold text-brand-900 sm:text-base"
            >
              לקרוא את הסיפור המלא
            </Link>
          </Reveal>

          <Reveal className="order-1 lg:order-2" delay={120}>
            <div className="float-soft relative mx-auto w-full max-w-[18rem] sm:max-w-sm">
              <div
                className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gold-500/20 blur-3xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-gold-500/25 shadow-[var(--shadow-lg)]">
                <Image
                  src="/brand/kubaneh-feature.webp"
                  alt="קובנה משובחת של דודה יונה"
                  width={900}
                  height={783}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 640px) 288px, 384px"
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <OrderCtaSection settings={settings} order={order} />
    </div>
  );
}
