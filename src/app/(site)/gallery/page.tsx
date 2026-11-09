import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/brand/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/site/reveal";
import { OrderButton } from "@/components/site/order-button";
import { RESTAURANT } from "@/data/catalog";
import { getOrderLink } from "@/lib/site-settings";
import { getGalleryImages } from "@/services/gallery";
import { getSiteSettings } from "@/services/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "גלריה",
  description: `תמונות מהמטבח של ${RESTAURANT.name} — ${RESTAURANT.tagline}.`,
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const [images, settings] = await Promise.all([getGalleryImages(), getSiteSettings()]);
  const order = getOrderLink(settings);

  return (
    <div>
      <PageHero priority eyebrow={RESTAURANT.locationLabel} title="גלריה" subtitle="טעימה מהמטבח ומהאווירה של דודה יונה" />

      <div className="surface-paper pb-16 pt-10 sm:pt-14">
        <Container>
          <ul className="gallery-masonry columns-2 gap-3 sm:gap-4 lg:columns-3">
            {images.map((image, index) => (
              <Reveal as="li" key={image.id} delay={(index % 3) * 70} className="mb-3 break-inside-avoid sm:mb-4">
                <figure className="group relative overflow-hidden rounded-2xl bg-brand-100 shadow-[var(--shadow-card)]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={600}
                    sizes="(max-width: 1024px) 50vw, 380px"
                    priority={index < 2}
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {image.title ? (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/85 to-transparent px-3 pb-2.5 pt-8 text-sm font-bold text-brand-50">
                      {image.title}
                    </figcaption>
                  ) : null}
                </figure>
              </Reveal>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <OrderButton order={order} className="min-h-12 px-9" />
          </div>
        </Container>
      </div>
    </div>
  );
}
