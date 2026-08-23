"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/container";
import { SectionBanner } from "@/components/brand/ornaments";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import type { MenuItem } from "@/data/catalog";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FeaturedSectionProps = {
  items: MenuItem[];
};

export function FeaturedSection({ items }: FeaturedSectionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from(".featured-item", {
        y: 32,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="surface-paper py-12 sm:py-20 lg:py-24">
      <Container>
        <SectionBanner title="חלק מהתפריט המושלם שלנו" />
        <p className="mx-auto mt-4 max-w-lg px-1 text-center text-sm font-light text-ink-muted sm:mt-5 sm:text-lg">
          המנות שהאורחים חוזרים בשבילן — מרקים עשירים, לחוח טרי ומאפים תימניים.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-12 sm:gap-6 xl:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="featured-item">
              <MenuItemCard item={item} compact />
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center sm:mt-12">
          <Link href="/menu" className="btn-deep w-full max-w-xs px-8 sm:w-auto">
            לתפריט והזמנות אונליין
          </Link>
        </div>
      </Container>
    </section>
  );
}
