"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import {
  calcAddonTotalAgorot,
  getItemFreeAddons,
  getItemPaidAddons,
} from "@/data/addons";
import {
  formatMenuPrice,
  MENU_CATEGORIES,
  type MenuCategory,
  type MenuItem,
} from "@/data/catalog";
import { DishMedia } from "@/components/brand/dish-media";
import { DishVideo } from "@/components/menu/dish-video";
import { GoldFlourish } from "@/components/brand/ornaments";
import { Container } from "@/components/ui/container";
import { useCartActions } from "@/stores/cart";
import { cn } from "@/lib/utils";

type MenuItemDetailClientProps = {
  item: MenuItem;
  category: MenuCategory | null;
  categories: MenuCategory[];
};

export function MenuItemDetailClient({
  item,
  category,
  categories,
}: MenuItemDetailClientProps) {
  const { addItem } = useCartActions();
  const [selectedFree, setSelectedFree] = useState<string[]>([]);
  const [selectedPaid, setSelectedPaid] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  const freeAddons = useMemo(() => getItemFreeAddons(item), [item]);
  const paidAddons = useMemo(() => getItemPaidAddons(item), [item]);

  const addonTotal = calcAddonTotalAgorot(selectedPaid);
  const unitTotal = (item.priceAgorot ?? 0) + addonTotal;

  const toggleFree = (id: string) => {
    setSelectedFree((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const togglePaid = (id: string) => {
    setSelectedPaid((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const onAdd = () => {
    if (!item.isAvailable) return;
    addItem(item.slug, 1, {
      freeAddonIds: selectedFree,
      paidAddonIds: selectedPaid,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const otherCategories = categories.filter((c) => c.id !== category?.id);

  return (
    <div className="pb-mobile-order lg:pb-16">
      <Container className="page-pad-top pb-10 pt-6 sm:pb-14">
        <Link
          href="/menu"
          className="mb-5 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-gold-700 transition-colors hover:text-brand-900"
        >
          <ArrowRight className="size-4" aria-hidden />
          חזרה לתפריט
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-1 space-y-4 lg:order-2">
            <DishMedia
              name={item.name}
              imagePath={item.imagePath}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-[4/3] rounded-2xl shadow-[var(--shadow-md)] sm:aspect-[5/4]"
            />
            {item.videoUrl ? (
              <DishVideo url={item.videoUrl} title={`סרטון — ${item.name}`} />
            ) : null}
          </div>

          <div className="order-2 lg:order-1">
            {category ? (
              <p className="text-xs font-bold tracking-[0.2em] text-gold-700">
                {category.name}
              </p>
            ) : null}
            <h1 className="mt-2 text-2xl font-black tracking-tight text-brand-900 sm:text-4xl">
              {item.name}
            </h1>
            <GoldFlourish className="mt-3" />

            {item.badges?.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {item.badges.map((badge) => (
                  <li
                    key={badge}
                    className="rounded-md bg-brand-100/90 px-2 py-0.5 text-xs font-semibold text-brand-800"
                  >
                    {badge}
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-4 text-sm font-light leading-relaxed text-ink-muted sm:text-base">
              {item.longDescription ?? item.description}
            </p>

            <p className="mt-4 inline-flex rounded-xl bg-gold-500/15 px-3 py-1.5 text-lg font-extrabold text-gold-700">
              {formatMenuPrice(item.priceAgorot)}
              {addonTotal > 0 ? (
                <span className="ms-2 text-sm font-semibold text-ink-muted">
                  + {formatMenuPrice(addonTotal)} תוספות
                </span>
              ) : null}
            </p>

            {freeAddons.length > 0 ? (
              <section className="mt-6">
                <h2 className="text-sm font-extrabold text-brand-900">
                  תוספות על חשבון הבית
                </h2>
                <p className="mt-1 text-xs font-light text-ink-muted">
                  בחרו תוספות חינם — סמנו ✓
                </p>
                <ul className="mt-3 space-y-2">
                  {freeAddons.map((addon) => {
                    const checked = selectedFree.includes(addon.id);
                    return (
                      <li key={addon.id}>
                        <button
                          type="button"
                          onClick={() => toggleFree(addon.id)}
                          className={cn(
                            "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border px-3 text-sm font-semibold transition-colors",
                            checked
                              ? "border-gold-500/50 bg-gold-500/12 text-brand-900"
                              : "border-border bg-surface-elevated text-ink-muted hover:border-gold-500/30",
                          )}
                          aria-pressed={checked}
                        >
                          <span>{addon.name}</span>
                          <span className="flex items-center gap-2">
                            <span className="text-xs font-bold text-success">
                              חינם
                            </span>
                            <span
                              className={cn(
                                "inline-flex size-5 items-center justify-center rounded border",
                                checked
                                  ? "border-gold-600 bg-gold-500 text-brand-900"
                                  : "border-border bg-white",
                              )}
                            >
                              {checked ? (
                                <Check className="size-3.5" aria-hidden />
                              ) : null}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {paidAddons.length > 0 ? (
              <section className="mt-6">
                <h2 className="text-sm font-extrabold text-brand-900">
                  תוספות בתשלום
                </h2>
                <p className="mt-1 text-xs font-light text-ink-muted">
                  סמנו ✓ לבחירה
                </p>
                <ul className="mt-3 space-y-2">
                  {paidAddons.map((addon) => {
                    const checked = selectedPaid.includes(addon.id);
                    return (
                      <li key={addon.id}>
                        <button
                          type="button"
                          onClick={() => togglePaid(addon.id)}
                          className={cn(
                            "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border px-3 text-sm font-semibold transition-colors",
                            checked
                              ? "border-gold-500/50 bg-gold-500/12 text-brand-900"
                              : "border-border bg-surface-elevated text-ink-muted hover:border-gold-500/30",
                          )}
                          aria-pressed={checked}
                        >
                          <span>{addon.name}</span>
                          <span className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gold-700">
                              {formatMenuPrice(addon.priceAgorot)}
                            </span>
                            <span
                              className={cn(
                                "inline-flex size-5 items-center justify-center rounded border",
                                checked
                                  ? "border-gold-600 bg-gold-500 text-brand-900"
                                  : "border-border bg-white",
                              )}
                            >
                              {checked ? (
                                <Check className="size-3.5" aria-hidden />
                              ) : null}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            <div className="mt-8 space-y-3">
              {item.isAvailable ? (
                <button
                  type="button"
                  onClick={onAdd}
                  className={cn(
                    "btn-deep inline-flex w-full min-h-12 items-center justify-center gap-2 sm:max-w-sm",
                    added && "bg-success text-white hover:bg-success",
                  )}
                >
                  {added ? (
                    <>
                      <Check className="size-4" aria-hidden />
                      נוסף להזמנה
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" aria-hidden />
                      הוספה לסל · {formatMenuPrice(unitTotal)}
                    </>
                  )}
                </button>
              ) : (
                <p className="rounded-xl bg-brand-100 px-4 py-3 text-center text-sm font-semibold text-ink-muted">
                  המנה אינה זמינה כרגע
                </p>
              )}
              <Link
                href="/cart"
                className="block text-center text-sm font-semibold text-gold-700 underline-offset-4 hover:underline sm:text-start"
              >
                מעבר לסל ההזמנה
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-12 border-t border-border pt-8 sm:mt-14">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-lg font-extrabold text-brand-900 sm:text-xl">
              עוד מהתפריט
            </h2>
            <GoldFlourish className="mx-auto mt-3" />
            <nav
              aria-label="קטגוריות נוספות"
              className="mt-6 flex flex-col items-center gap-3"
            >
              <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                {otherCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/menu#${cat.slug}`}
                      className="inline-flex min-h-11 min-w-[5.5rem] items-center justify-center rounded-xl border border-brand-900/10 bg-brand-900/[0.03] px-4 text-sm font-extrabold text-brand-900 transition-colors hover:border-gold-500/35 hover:bg-gold-500/10"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/menu"
                className="btn-deep inline-flex w-full max-w-xs items-center justify-center px-6 sm:max-w-sm"
              >
                לכל התפריט והזמנות
              </Link>
            </nav>
          </div>
        </section>
      </Container>
    </div>
  );
}
