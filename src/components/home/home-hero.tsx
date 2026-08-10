"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { RESTAURANT } from "@/data/catalog";

/** גרפיקת פתיחה ממותגת — דודה יונה (כוללת לוגו וכיתוב) */
export const HOME_HERO_IMAGE = "/brand/home-hero.png";

/** יחס התמונה המקורית — 1024×524 */
const HOME_HERO_WIDTH = 1024;
const HOME_HERO_HEIGHT = 524;

gsap.registerPlugin(useGSAP);

type HomeHeroProps = {
  restaurantName: string;
};

export function HomeHero({ restaurantName }: HomeHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from(".hero-media", {
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative bg-brand-900" aria-label="פתיחה">
      <div className="hero-media w-full leading-none">
        <Image
          src={HOME_HERO_IMAGE}
          alt={`${restaurantName} — ${RESTAURANT.tagline}. ${RESTAURANT.locationLabel}. ${RESTAURANT.kashrut}`}
          width={HOME_HERO_WIDTH}
          height={HOME_HERO_HEIGHT}
          priority
          className="h-auto w-full"
          sizes="100vw"
          quality={90}
        />
      </div>

      <h1 className="sr-only">
        {restaurantName} — {RESTAURANT.tagline}
      </h1>
    </section>
  );
}
