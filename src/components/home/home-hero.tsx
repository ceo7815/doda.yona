"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/container";
import { GoldFlourish } from "@/components/brand/ornaments";
import { RESTAURANT } from "@/data/catalog";

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

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-media", { scale: 1.08, duration: 1.6 }, 0)
        .from(".hero-kashrut", { y: 18, opacity: 0, duration: 0.6 }, 0.25)
        .from(".hero-title", { y: 36, opacity: 0, duration: 0.9 }, 0.35)
        .from(".hero-flourish", { scaleX: 0, opacity: 0, duration: 0.5 }, 0.7)
        .from(".hero-tagline", { y: 14, opacity: 0, duration: 0.6 }, 0.75)
        .from(".hero-cta", { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.95);
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100dvh] min-h-[100svh] overflow-hidden"
      aria-label="פתיחה"
    >
      <div className="hero-media absolute inset-0">
        <Image
          src="/brand/hero-food.png"
          alt={`${RESTAURANT.name} — ${RESTAURANT.tagline}`}
          fill
          priority
          className="object-cover object-[center_35%] sm:object-center"
          sizes="100vw"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(20_13_8/0.72)_0%,rgb(20_13_8/0.5)_38%,rgb(20_13_8/0.28)_62%,rgb(20_13_8/0.12)_82%,transparent_100%)]"
        aria-hidden
      />

      <Container className="relative flex min-h-[100dvh] min-h-[100svh] flex-col justify-end pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-28 sm:justify-center sm:pb-20 sm:pt-32">
        <div className="mx-auto w-full max-w-xl text-center sm:mx-0 sm:-translate-y-6 sm:text-start">
          <p className="hero-kashrut text-xs font-bold tracking-[0.3em] text-gold-400 sm:text-sm [text-shadow:0_2px_12px_rgb(0_0_0/0.85)]">
            {RESTAURANT.kashrutShort}
          </p>

          <h1 className="hero-title mt-2 text-[clamp(2.6rem,12vw,5.5rem)] font-black leading-[0.95] tracking-tight text-gold-400 [text-shadow:0_2px_4px_rgb(0_0_0/0.9),0_8px_28px_rgb(0_0_0/0.65)]">
            {restaurantName}
          </h1>

          <div className="hero-flourish mx-auto mt-3 origin-center sm:mx-0 sm:mt-4 sm:origin-right">
            <GoldFlourish className="mx-auto h-5 w-40 text-gold-500 sm:mx-0 sm:h-6 sm:w-48" />
          </div>

          <p className="hero-tagline mt-3 text-base font-light leading-relaxed text-white sm:mt-4 sm:text-xl [text-shadow:0_2px_14px_rgb(0_0_0/0.9)]">
            {RESTAURANT.tagline}
          </p>

          <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              href="/menu"
              className="hero-cta btn-gold min-h-12 w-full px-8 text-base sm:min-h-14 sm:w-auto sm:text-lg"
            >
              לתפריט ולהזמנה
            </Link>
            <Link
              href="/about"
              className="hero-cta btn-ghost-gold min-h-12 w-full bg-brand-900/45 px-8 text-base backdrop-blur-sm sm:min-h-14 sm:w-auto sm:text-lg"
            >
              הסיפור שלנו
            </Link>
          </div>

          <p className="hero-cta mx-auto mt-5 max-w-xs text-sm font-medium leading-snug text-white sm:mx-0 sm:mt-6 sm:max-w-none [text-shadow:0_2px_12px_rgb(0_0_0/0.9)]">
            {RESTAURANT.addressFull}
            <span className="mx-2 text-gold-400" aria-hidden>
              ·
            </span>
            {RESTAURANT.services.join(" · ")}
          </p>
        </div>
      </Container>
    </section>
  );
}
