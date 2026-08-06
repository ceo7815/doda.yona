"use client";

import { useMemo } from "react";
import { PageHero } from "@/components/brand/page-hero";
import { SectionBanner } from "@/components/brand/ornaments";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import {
  MobileOrderBar,
  OrderSidebar,
} from "@/components/menu/order-sidebar";
import { ScrollToTopFab } from "@/components/menu/scroll-to-top-fab";
import { RESTAURANT, type MenuCategory, type MenuItem } from "@/data/catalog";

function MenuCategoryBlock({
  category,
  items,
}: {
  category: MenuCategory;
  items: MenuItem[];
}) {
  return (
    <section
      id={category.slug}
      aria-labelledby={`heading-${category.slug}`}
      className="menu-category scroll-mt-[calc(var(--header-height)+5.5rem)] sm:scroll-mt-28"
    >
      <div id={`heading-${category.slug}`}>
        <SectionBanner title={category.name} />
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-7 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
        {items.map((item) => (
          <li key={item.id}>
            <MenuItemCard item={item} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}

type MenuPageClientProps = {
  categories: MenuCategory[];
  items: MenuItem[];
};

export default function MenuPageClient({
  categories,
  items,
}: MenuPageClientProps) {
  const grouped = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          items: items
            .filter((i) => i.categoryId === category.id)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        }))
        .filter((group) => group.items.length > 0),
    [categories, items],
  );

  return (
    <div className="pb-mobile-order lg:pb-16">
      <div id="menu-top" className="scroll-mt-[calc(var(--header-height)+0.5rem)]">
      <PageHero
        eyebrow={RESTAURANT.kashrutShort}
        title="תפריט והזמנות"
        subtitle={`${RESTAURANT.tagline} · ${items.length} מנות · משלוחים ולקחת`}
      >
        <nav
          aria-label="קטגוריות בתפריט"
          className="mx-auto mt-5 grid w-full max-w-md grid-cols-2 gap-1.5 sm:mt-7 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-3"
        >
          {grouped.map(({ category, items: categoryItems }) => (
            <a
              key={category.id}
              href={`#${category.slug}`}
              className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg bg-brand-900 px-2 py-1.5 text-[0.7rem] font-extrabold leading-tight text-gold-400 shadow-sm ring-1 ring-gold-500/35 transition-[background-color,transform] hover:bg-brand-800 hover:text-gold-300 active:scale-[0.98] sm:min-h-12 sm:gap-2 sm:rounded-xl sm:px-6 sm:py-2.5 sm:text-base sm:shadow-[var(--shadow-md)] sm:ring-gold-500/40"
            >
              <span
                className="hidden h-5 w-1 shrink-0 rounded-full bg-gold-500 sm:block"
                aria-hidden
              />
              <span className="text-center">{category.name}</span>
              <span className="rounded bg-gold-500/15 px-1 py-0.5 text-[0.58rem] font-bold tracking-wide text-gold-300 sm:rounded-md sm:px-1.5 sm:text-[0.65rem]">
                {categoryItems.length}
              </span>
            </a>
          ))}
        </nav>
      </PageHero>
      </div>

      <div className="surface-paper w-full px-3 pt-6 pb-8 sm:px-6 sm:pt-10 lg:px-8 xl:px-10">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,22rem)] lg:items-stretch lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,24rem)]">
          <div className="min-w-0 space-y-14">
            {grouped.map(({ category, items: categoryItems }) => (
              <MenuCategoryBlock
                key={category.id}
                category={category}
                items={categoryItems}
              />
            ))}

            <p className="rounded-2xl border border-border bg-brand-50/60 px-5 py-4 text-center text-sm font-medium text-ink-muted">
              {RESTAURANT.dineInNote}
              <span className="mx-2 text-gold-600" aria-hidden>
                ·
              </span>
              המחירים יעודכנו כשיסופקו מהעסק
            </p>
          </div>

          <div className="relative hidden min-h-0 lg:block">
            <OrderSidebar />
          </div>
        </div>
      </div>

      <MobileOrderBar />
      <ScrollToTopFab />
    </div>
  );
}
