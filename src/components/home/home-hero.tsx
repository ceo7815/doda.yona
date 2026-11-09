import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { RESTAURANT } from "@/data/catalog";
import type { OrderLink } from "@/lib/site-settings";
import { OrderButton } from "@/components/site/order-button";

/** גרפיקת פתיחה ממותגת — דודה יונה (כוללת לוגו וכיתוב) */
export const HOME_HERO_IMAGE = "/brand/home-hero.webp";
const HOME_HERO_WIDTH = 1024;
const HOME_HERO_HEIGHT = 524;

type HomeHeroProps = {
  restaurantName: string;
  order: OrderLink;
  telHref: string;
  phoneDisplay: string;
};

export function HomeHero({ restaurantName, order, telHref, phoneDisplay }: HomeHeroProps) {
  return (
    <section className="relative bg-brand-900" aria-labelledby="home-title">
      <div className="hero-media relative w-full overflow-hidden leading-none">
        <Image
          src={HOME_HERO_IMAGE}
          alt={`${restaurantName} — ${RESTAURANT.tagline}. ${RESTAURANT.locationLabel}. ${RESTAURANT.kashrut}`}
          width={HOME_HERO_WIDTH}
          height={HOME_HERO_HEIGHT}
          priority
          fetchPriority="high"
          className="hero-image h-auto w-full"
          sizes="100vw"
          quality={80}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-brand-900/80 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 -mt-px bg-brand-900 px-4 pb-7 pt-5 sm:pb-9 sm:pt-6">
        <div className="hero-cta mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h1 id="home-title" className="text-balance text-lg font-bold text-brand-50 sm:text-2xl">
            <span className="sr-only">{restaurantName} — </span>
            {RESTAURANT.tagline} בלב {RESTAURANT.locationLabel}
          </h1>
          <div className="grid w-full max-w-md grid-cols-[1.35fr_1fr] gap-2.5 sm:flex sm:max-w-none sm:justify-center sm:gap-3">
            <OrderButton order={order} className="min-h-12 whitespace-nowrap px-4 text-base sm:px-7" />
            <Link href="/menu" className="btn-ghost-gold min-h-12 whitespace-nowrap px-4 text-base sm:px-7">
              לתפריט המלא
            </Link>
          </div>
          <a
            href={telHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-200 transition-colors hover:text-gold-300"
          >
            <Phone className="size-4 text-gold-500" aria-hidden />
            או חייגו: <span dir="ltr" className="font-bold text-gold-300">{phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
