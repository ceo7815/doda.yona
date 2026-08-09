"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatMenuPrice } from "@/data/catalog";
import { useCart } from "@/stores/cart";
import { cn } from "@/lib/utils";

function OrderLines({ compact = false }: { compact?: boolean }) {
  const { getLineItems, setQuantity, removeItem } = useCart();
  const lines = getLineItems();

  if (lines.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-border text-center",
          compact ? "px-4 py-8" : "px-5 py-12",
        )}
        role="status"
      >
        <ShoppingBag className="size-8 text-gold-600/70" aria-hidden />
        <p className="mt-3 text-sm font-bold text-brand-900">ההזמנה ריקה</p>
        <p className="mt-1 max-w-[16rem] text-xs font-light leading-relaxed text-ink-muted">
          הוסיפו מנות מהתפריט — הן יופיעו כאן מיד.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {lines.map(({ lineKey, item, quantity, addonNotes }) => (
        <li
          key={lineKey}
          className="rounded-xl border border-border/80 bg-surface-elevated px-3 py-3 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-brand-900">
                {item.name}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-gold-700">
                {formatMenuPrice(item.priceAgorot)}
              </p>
              {addonNotes ? (
                <p className="mt-1 line-clamp-2 text-[0.65rem] font-light leading-snug text-ink-muted">
                  {addonNotes}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => removeItem(lineKey)}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-brand-100 hover:text-danger"
              aria-label={`הסרת ${item.name}`}
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5">
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-brand-50 text-brand-900 transition-colors hover:border-gold-500/50"
              onClick={() => setQuantity(lineKey, quantity - 1)}
              aria-label="הפחתה"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="min-w-7 text-center text-sm font-bold text-brand-900">
              {quantity}
            </span>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-brand-50 text-brand-900 transition-colors hover:border-gold-500/50"
              onClick={() => setQuantity(lineKey, quantity + 1)}
              aria-label="הוספה"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function OrderFooter() {
  const { totalItems, getLineItems } = useCart();
  const lines = getLineItems();
  const totalAgorot = lines.reduce(
    (sum, { item, quantity }) => sum + (item.priceAgorot ?? 0) * quantity,
    0,
  );

  return (
    <div className="mt-auto border-t border-border pt-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink-muted">
          {totalItems > 0 ? `${totalItems} פריטים` : "אין פריטים"}
        </span>
        <span className="font-extrabold text-gold-700">
          {totalItems === 0 ? "—" : formatMenuPrice(totalAgorot)}
        </span>
      </div>
      <Link
        href="/cart"
        className={cn(
          "btn-deep mt-4 w-full",
          totalItems === 0 && "pointer-events-none opacity-45",
        )}
        aria-disabled={totalItems === 0}
      >
        להמשך הזמנה
      </Link>
    </div>
  );
}

/** סיידבר הזמנה sticky — מוצג בצד שמאל בדסקטופ (RTL) */
export function OrderSidebar() {
  const { totalItems } = useCart();

  return (
    <aside
      aria-label="ההזמנה שלי"
      className="surface-paper sticky top-[calc(var(--header-height)+1.75rem)] z-20 flex max-h-[calc(100dvh-var(--header-height)-2.5rem)] w-full flex-col rounded-2xl border border-border p-5 shadow-[var(--shadow-md)]"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.2em] text-gold-700">
            הזמנה חיה
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-brand-900">
            ההזמנה שלי
          </h2>
        </div>
        {totalItems > 0 ? (
          <span className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-full bg-brand-900 px-2 text-sm font-extrabold text-gold-400">
            {totalItems}
          </span>
        ) : null}
      </div>

      <div className="order-scroll min-h-0 flex-1 overflow-y-auto pe-1">
        <OrderLines />
      </div>
      <OrderFooter />
    </aside>
  );
}

/** סרגל הזמנה תחתון במובייל */
export function MobileOrderBar() {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="border-t border-border bg-surface-elevated/95 shadow-[0_-8px_30px_rgb(20_13_8/0.18)] backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2.5">
            <span className="relative inline-flex size-10 items-center justify-center rounded-xl bg-brand-900 text-gold-400">
              <ShoppingBag className="size-4" aria-hidden />
              {totalItems > 0 ? (
                <span className="absolute -top-1 -start-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[0.65rem] font-extrabold text-brand-950">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : null}
            </span>
            <span className="text-start">
              <span className="block text-sm font-extrabold text-brand-900">
                ההזמנה שלי
              </span>
              <span className="block text-xs font-medium text-ink-muted">
                {totalItems > 0 ? `${totalItems} פריטים · כל אזור נתניה` : "הוסיפו מנות מהתפריט"}
              </span>
            </span>
          </span>
          <ChevronUp
            className={cn(
              "size-5 shrink-0 text-gold-700 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        {open ? (
          <div className="flex max-h-[min(65dvh,26rem)] flex-col border-t border-border px-4 pb-3 pt-3">
            <div className="order-scroll min-h-0 flex-1 overflow-y-auto">
              <OrderLines compact />
            </div>
            <OrderFooter />
          </div>
        ) : (
          <div className="px-4 pb-3">
            <Link
              href={totalItems > 0 ? "/cart" : "/menu"}
              className="btn-deep min-h-12 w-full"
            >
              {totalItems > 0 ? "להמשך הזמנה" : "בחרו מנות"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
