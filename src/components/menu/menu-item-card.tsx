"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import type { MenuItem } from "@/data/catalog";
import { formatMenuPrice } from "@/data/catalog";
import { DishMedia } from "@/components/brand/dish-media";
import { useCartActions } from "@/stores/cart";
import { cn } from "@/lib/utils";

type MenuItemCardProps = {
  item: MenuItem;
  className?: string;
  showMedia?: boolean;
  /** כרטיס צפוף יותר לדף הזמנות עם סיידבר */
  compact?: boolean;
};

export function MenuItemCard({
  item,
  className,
  showMedia = true,
  compact = false,
}: MenuItemCardProps) {
  const { addItem } = useCartActions();
  const [added, setAdded] = useState(false);

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item.isAvailable) return;
    addItem(item.slug, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-border/70 bg-surface-elevated",
        "shadow-[var(--shadow-card)]",
        compact
          ? "transition-colors duration-200 hover:border-gold-500/35"
          : "transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-[var(--shadow-md)]",
        className,
      )}
    >
      <Link
        href={`/menu/${item.slug}`}
        className="flex min-h-0 flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
      >
        {showMedia ? (
          <div className="relative overflow-hidden">
            <DishMedia
              name={item.name}
              imagePath={item.imagePath}
              sizes={
                compact
                  ? "(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  : undefined
              }
              className={cn(
                !compact &&
                  "transition-transform duration-500 ease-out group-hover:scale-[1.03]",
                compact && "aspect-[5/3]",
              )}
            />
          </div>
        ) : null}

        <div
          className={cn(
            "flex flex-1 flex-col",
            compact ? "gap-1.5 p-2.5 sm:gap-2 sm:p-4" : "gap-3 p-5 sm:p-6",
          )}
        >
          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
            <div className="min-w-0">
              <h3
                className={cn(
                  "font-extrabold leading-tight tracking-tight text-brand-900",
                  compact
                    ? "line-clamp-2 text-[0.82rem] sm:text-base"
                    : "text-xl",
                )}
              >
                {item.name}
              </h3>
              {item.badges?.length ? (
                <ul
                  className={cn(
                    "flex flex-wrap gap-1",
                    compact ? "mt-1" : "mt-2.5",
                  )}
                >
                  {item.badges.map((badge) => (
                    <li
                      key={badge}
                      className="rounded-md bg-brand-100/90 px-1.5 py-0.5 text-[0.58rem] font-semibold tracking-wide text-brand-800 sm:px-2 sm:text-[0.62rem]"
                    >
                      {badge}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <p className="shrink-0 rounded-md bg-gold-500/15 px-1.5 py-0.5 text-[0.65rem] font-bold text-gold-700 sm:px-2 sm:text-xs">
              {formatMenuPrice(item.priceAgorot)}
            </p>
          </div>

          <p
            className={cn(
              "flex-1 font-light text-ink-muted",
              compact
                ? "line-clamp-2 text-[0.68rem] leading-snug sm:text-xs"
                : "text-sm leading-relaxed",
            )}
          >
            {item.description}
          </p>
        </div>
      </Link>

      <div className="mt-auto flex flex-col items-center gap-1.5 px-2.5 pb-2.5 pt-0 sm:gap-2 sm:px-4 sm:pb-4">
        {!compact ? (
          <p className="text-[0.7rem] font-medium tracking-wide text-ink-muted">
            משלוח · לקחת
          </p>
        ) : null}
        {item.isAvailable ? (
          <button
            type="button"
            onClick={onAdd}
            className={cn(
              "inline-flex w-full max-w-none items-center justify-center gap-1 rounded-full font-bold sm:max-w-[14rem] sm:gap-1.5 sm:text-sm",
              "shadow-sm transition-[background-color,transform,box-shadow] duration-200",
              "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]",
              compact
                ? "min-h-9 px-2 text-[0.72rem] sm:min-h-11 sm:px-5"
                : "min-h-12 px-6 text-sm",
              added
                ? "bg-success text-white"
                : "bg-brand-900 text-gold-400 hover:bg-brand-800 hover:shadow-md active:scale-[0.98]",
            )}
          >
            {added ? (
              <>
                <Check className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">נוסף</span>
              </>
            ) : (
              <>
                <Plus className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">
                  <span className="sm:hidden">הוספה</span>
                  <span className="hidden sm:inline">הוספה להזמנה</span>
                </span>
              </>
            )}
          </button>
        ) : (
          <span className="rounded-full bg-brand-100 px-3 py-1.5 text-xs font-semibold text-ink-muted sm:px-4 sm:py-2 sm:text-sm">
            אזל
          </span>
        )}
        <Link
          href={`/menu/${item.slug}`}
          className="text-[0.68rem] font-semibold text-gold-700 underline-offset-2 hover:underline sm:text-xs"
        >
          פרטי המנה
        </Link>
      </div>
    </article>
  );
}
