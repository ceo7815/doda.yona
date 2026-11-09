import type { Metadata } from "next";
import { PageHero } from "@/components/brand/page-hero";
import { SectionHeading } from "@/components/brand/ornaments";
import { Container } from "@/components/ui/container";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { CategoryNav } from "@/components/menu/category-nav";
import { OrderButton } from "@/components/site/order-button";
import { Reveal } from "@/components/site/reveal";
import { RESTAURANT } from "@/data/catalog";
import { getOrderLink, toTelHref } from "@/lib/site-settings";
import { getCatalog } from "@/services/catalog";
import { getSiteSettings } from "@/services/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "התפריט",
  description: `התפריט של ${RESTAURANT.name} — מרקים תימניים, עיקריות, מאפים ותוספות. ${RESTAURANT.locationLabel}.`,
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const [catalog, settings] = await Promise.all([getCatalog(), getSiteSettings()]);
  const order = getOrderLink(settings);

  const groups = catalog.categories
    .map((category) => ({
      category,
      items: catalog.items
        .filter((i) => i.categoryId === category.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div>
      <PageHero
        priority
        eyebrow={settings.business.kashrut}
        title="התפריט"
        subtitle={`${RESTAURANT.tagline} · ${catalog.items.length} מנות`}
      >
        <div className="mt-6 flex justify-center">
          <OrderButton order={order} className="min-h-12 px-8 text-base" />
        </div>
      </PageHero>

      <CategoryNav
        categories={groups.map(({ category, items }) => ({
          slug: category.slug,
          name: category.name,
          count: items.length,
        }))}
      />

      <div className="surface-paper pb-16 pt-8 sm:pt-12">
        <Container className="space-y-16 sm:space-y-20">
          {groups.map(({ category, items }, groupIndex) => (
            <section
              key={category.id}
              id={category.slug}
              aria-labelledby={`heading-${category.slug}`}
              className="menu-category"
            >
              <SectionHeading id={`heading-${category.slug}`} title={category.name} />
              <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item, index) => (
                  <Reveal as="li" key={item.id} delay={(index % 4) * 60}>
                    <MenuItemCard item={item} priority={groupIndex === 0 && index < 2} />
                  </Reveal>
                ))}
              </ul>
            </section>
          ))}

          <Reveal>
            <div className="mx-auto max-w-2xl rounded-[1.75rem] bg-brand-900 px-6 py-9 text-center shadow-[var(--shadow-lg)] sm:px-10">
              <p className="eyebrow text-gold-500">מוכנים להזמין?</p>
              <h2 className="mt-2 text-2xl font-black text-gold-300 sm:text-3xl">
                משלוח, איסוף או שולחן
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-brand-200 sm:text-base">
                {order.isPhoneFallback
                  ? "התקשרו ונשמח לקבל את ההזמנה שלכם."
                  : "ההזמנה והמחירים המעודכנים — במערכת ההזמנות של המסעדה."}{" "}
                {settings.business.dineInNote}
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <OrderButton order={order} className="min-h-12 w-full max-w-xs px-8 sm:w-auto" />
                {order.isPhoneFallback ? null : (
                  <a
                    href={toTelHref(settings.business.phoneDisplay)}
                    className="btn-ghost-gold min-h-12 w-full max-w-xs px-8 sm:w-auto"
                  >
                    <span dir="ltr">{settings.business.phoneDisplay}</span>
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </Container>
      </div>
    </div>
  );
}
