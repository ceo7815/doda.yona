"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PageHero } from "@/components/brand/page-hero";
import { DishMedia } from "@/components/brand/dish-media";
import { Container } from "@/components/ui/container";
import { formatMenuPrice, RESTAURANT } from "@/data/catalog";
import { useCart } from "@/stores/cart";
import type { DeliveryZoneOption } from "@/types/domain";
import { CheckoutForm } from "./checkout-form";

type CartPageClientProps = {
  zones: DeliveryZoneOption[];
};

export default function CartPageClient({ zones }: CartPageClientProps) {
  const { getLineItems, setQuantity, removeItem, totalItems } = useCart();
  const lines = getLineItems();

  return (
    <div className="pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <PageHero
        title="סל מוצרים"
        subtitle={
          totalItems > 0
            ? `${totalItems} פריטים בסל`
            : "בחרו מנות מהתפריט והוסיפו לסל"
        }
      />

      <div className="surface-paper w-full px-3 py-6 sm:px-6 sm:py-12 lg:px-8 xl:px-10">
        <Container>
          {lines.length === 0 ? (
            <div
              className="mx-auto max-w-lg rounded-2xl border border-dashed border-border-strong bg-surface-elevated px-5 py-14 text-center sm:px-6 sm:py-16"
              role="status"
            >
              <p className="text-xl font-extrabold text-brand-900">הסל ריק</p>
              <p className="mx-auto mt-2 max-w-md text-sm font-light text-ink-muted">
                עדיין לא הוספתם מנות. עיינו בתפריט והוסיפו להזמנה.
              </p>
              <Link href="/menu" className="btn-gold mt-8 inline-flex w-full max-w-xs justify-center px-8">
                לתפריט
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,22rem)] lg:gap-10">
              <div className="min-w-0 space-y-3 sm:space-y-4">
                <div className="rounded-2xl border border-gold-500/25 bg-gold-500/10 px-3 py-2.5 text-center text-xs font-semibold leading-snug text-brand-900 sm:px-4 sm:py-3 sm:text-start sm:text-sm">
                  אזור המשלוחים:{" "}
                  <span className="font-extrabold text-gold-700">
                    כל אזור נתניה
                  </span>
                  <span className="mx-1.5 text-gold-600" aria-hidden>
                    ·
                  </span>
                  {RESTAURANT.dineInNote}
                </div>

                <ul className="space-y-2.5 sm:space-y-3">
                  {lines.map(({ item, quantity }) => (
                    <li
                      key={item.id}
                      className="flex gap-2.5 rounded-2xl border border-border/80 bg-surface-elevated p-2.5 shadow-[var(--shadow-card)] sm:gap-4 sm:p-4"
                    >
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-brand-100 sm:size-28">
                        <DishMedia
                          name={item.name}
                          imagePath={item.imagePath}
                          className="!aspect-auto h-full min-h-0 w-full"
                          sizes="112px"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h2 className="line-clamp-2 text-sm font-extrabold leading-snug text-brand-900 sm:text-lg">
                              {item.name}
                            </h2>
                            <p className="mt-0.5 text-sm font-bold text-gold-700">
                              {formatMenuPrice(item.priceAgorot)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.slug)}
                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-brand-100 hover:text-danger"
                            aria-label={`הסרת ${item.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-brand-50 text-brand-900 transition-colors hover:border-gold-500/40"
                            onClick={() => setQuantity(item.slug, quantity - 1)}
                            aria-label="הפחתה"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="min-w-8 text-center text-sm font-bold text-brand-900">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-brand-50 text-brand-900 transition-colors hover:border-gold-500/40"
                            onClick={() => setQuantity(item.slug, quantity + 1)}
                            aria-label="הוספה"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="h-fit rounded-2xl border border-brand-800 bg-brand-900 p-4 text-brand-50 shadow-[var(--shadow-md)] sm:p-6 lg:sticky lg:top-[calc(var(--header-height)+1.25rem)]">
                <p className="text-[0.65rem] font-bold tracking-[0.2em] text-gold-500">
                  הזמנה
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-gold-400 sm:text-xl">
                  סיכום והזמנה
                </h2>
                <p className="mt-2 text-sm font-light text-brand-200">
                  {totalItems} פריטים · מלאו את הפרטים לשליחת ההזמנה
                </p>
                <p className="mt-3 rounded-xl border border-gold-500/25 bg-brand-950/50 px-3 py-2 text-xs font-medium leading-relaxed text-gold-300">
                  אזור משלוחים: כל אזור נתניה
                </p>
                <CheckoutForm zones={zones} />
                <Link
                  href="/menu"
                  className="mt-4 block min-h-11 py-2 text-center text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
                >
                  חזרה לתפריט
                </Link>
              </aside>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
