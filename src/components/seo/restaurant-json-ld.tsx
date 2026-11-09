import { getPublicEnv } from "@/lib/env";
import { RESTAURANT } from "@/data/catalog";
import { getOrderLink, type SiteSettings } from "@/lib/site-settings";

/**
 * Schema.org Restaurant — רק נתונים אמיתיים מהעסק.
 * שעות פעילות אינן נכללות כ-openingHoursSpecification כי הן טקסט חופשי מהאדמין.
 */
export function RestaurantJsonLd({
  settings,
  restaurantName,
}: {
  settings: SiteSettings;
  restaurantName: string;
}) {
  const base = getPublicEnv().NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const order = getOrderLink(settings);
  const sameAs = Object.values(settings.social).filter(Boolean);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurantName,
    description: settings.seo.description,
    servesCuisine: ["תימני", "Yemenite"],
    telephone: settings.business.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.business.street.replace(/^רחוב\s+/, ""),
      addressLocality: settings.business.city,
      addressRegion: settings.business.neighborhood || undefined,
      addressCountry: "IL",
    },
    acceptsReservations: true,
    hasMenu: base ? `${base}/menu` : undefined,
    url: base || undefined,
    image: base ? `${base}/brand/home-hero.webp` : undefined,
    potentialAction: order.isPhoneFallback
      ? undefined
      : {
          "@type": "OrderAction",
          target: order.href,
        },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    keywords: `${RESTAURANT.kashrutShort}, ${RESTAURANT.locationLabel}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
