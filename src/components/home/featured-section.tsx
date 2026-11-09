import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/brand/ornaments";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Reveal } from "@/components/site/reveal";
import type { MenuItem } from "@/data/catalog";

type FeaturedSectionProps = {
  items: MenuItem[];
  title: string;
  subtitle: string;
};

export function FeaturedSection({ items, title, subtitle }: FeaturedSectionProps) {
  if (items.length === 0) return null;
  return (
    <section className="surface-paper section-y" aria-labelledby="featured-title">
      <Container>
        <Reveal>
          <SectionHeading id="featured-title" eyebrow="מהמטבח של דודה יונה" title={title} subtitle={subtitle} />
        </Reveal>

        <ul className="mt-9 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal as="li" key={item.id} delay={index * 80}>
              <MenuItemCard item={item} />
            </Reveal>
          ))}
        </ul>

        <div className="mt-9 text-center sm:mt-12">
          <Link href="/menu" className="btn-deep min-h-12 w-full max-w-xs px-8 sm:w-auto">
            לכל המנות בתפריט
          </Link>
        </div>
      </Container>
    </section>
  );
}
