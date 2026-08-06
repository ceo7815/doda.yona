import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/brand/page-hero";
import { DishMedia } from "@/components/brand/dish-media";
import { getFeaturedItems, RESTAURANT } from "@/data/catalog";

export const metadata: Metadata = {
  title: "גלריה",
  description: `תמונות מ${RESTAURANT.name} — ${RESTAURANT.tagline}.`,
};

export default function GalleryPage() {
  const featured = getFeaturedItems(4);

  return (
    <div>
      <PageHero
        title="גלריה"
        subtitle="טעימה מהאווירה — תמונות מנות מלאות יגיעו בקרוב"
      />
      <Container className="surface-paper space-y-10 py-14">
        <figure className="overflow-hidden border border-border shadow-md">
          <Image
            src="/brand/menu-flyer.png"
            alt={`תפריט גרפי של ${RESTAURANT.name}`}
            width={1200}
            height={1600}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
          <figcaption className="bg-brand-900 px-5 py-4 text-sm font-light text-brand-200">
            חומר המותג שסופק על ידי העסק
          </figcaption>
        </figure>

        <div>
          <h2 className="text-center text-2xl font-extrabold text-brand-900">
            מנות מהתפריט
          </h2>
          <div className="gold-rule mx-auto mt-3" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <li key={item.id} className="border border-border">
                <DishMedia name={item.name} imagePath={item.imagePath} />
                <p className="bg-surface-elevated px-3 py-3 text-center text-sm font-bold text-brand-900">
                  {item.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
