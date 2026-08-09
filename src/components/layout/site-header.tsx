"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESTAURANT } from "@/data/catalog";
import { useCart } from "@/stores/cart";

const NAV_ITEMS = [
  { href: "/", label: "דף הבית" },
  { href: "/about", label: "הסיפור שלנו" },
  { href: "/magazine", label: "מגזין דודה יונה" },
  { href: "/menu", label: "תפריט והזמנות" },
  { href: "/contact", label: "צרו קשר" },
] as const;

type SiteHeaderProps = {
  restaurantName: string;
};

export function SiteHeader({ restaurantName }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 flex justify-center px-2.5 pt-[max(0.65rem,env(safe-area-inset-top))] sm:px-4 sm:pt-4">
      <div
        className={cn(
          "w-full overflow-hidden rounded-2xl border transition-[background-color,box-shadow,border-color,width] duration-300 lg:w-fit lg:max-w-[calc(100vw-2rem)]",
          "backdrop-blur-xl backdrop-saturate-150",
          scrolled || open
            ? "border-gold-500/25 bg-brand-900/85 shadow-[0_12px_40px_rgb(31_20_12/0.35)]"
            : "border-white/20 bg-brand-900/40 shadow-[0_8px_24px_rgb(31_20_12/0.12)]",
        )}
      >
        <div className="flex h-[var(--header-height)] items-center justify-between gap-3 px-3 sm:gap-8 sm:px-6 lg:justify-start lg:gap-16 xl:gap-20 lg:px-8">
          <Link
            href="/"
            className="flex min-w-0 shrink flex-col items-start text-start sm:items-center sm:text-center"
          >
            <span className="truncate text-xl font-black tracking-tight text-gold-gradient sm:text-2xl lg:text-3xl">
              {restaurantName}
            </span>
            <span className="mt-0.5 max-w-[11rem] text-[0.62rem] font-medium leading-snug tracking-[0.04em] text-brand-100/90 sm:max-w-[14rem] sm:text-[0.7rem] lg:text-xs">
              {RESTAURANT.tagline}
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="ניווט ראשי"
          >
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : item.href === "/menu"
                    ? pathname === "/menu" || pathname.startsWith("/menu/")
                    : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors xl:px-3.5 xl:text-base",
                    active
                      ? "bg-white/10 text-gold-400"
                      : "text-brand-50/90 hover:bg-white/5 hover:text-gold-300",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/cart"
              aria-label={`סל מוצרים${totalItems > 0 ? `, ${totalItems} פריטים` : ""}`}
              className="relative inline-flex size-11 items-center justify-center rounded-xl bg-gold-500 text-brand-900 shadow-sm transition-colors hover:bg-gold-400 sm:min-h-12 sm:w-auto sm:gap-2 sm:px-5"
            >
              <ShoppingBag className="size-5" aria-hidden />
              <span className="hidden text-sm font-bold sm:inline sm:text-base">
                סל מוצרים
              </span>
              {totalItems > 0 ? (
                <span className="absolute -top-1.5 -start-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand-900 px-1 text-[0.7rem] font-bold text-gold-400">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-gold-400 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "סגור תפריט" : "פתח תפריט"}</span>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="max-h-[min(70dvh,28rem)] overflow-y-auto border-t border-white/10 bg-brand-900/95 lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-3 py-3" aria-label="ניווט מובייל">
              {NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-4 py-3.5 text-lg font-semibold transition-colors",
                      active
                        ? "bg-white/10 text-gold-400"
                        : "text-brand-50 hover:bg-white/5 hover:text-gold-400",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/menu"
                className="btn-gold mt-2 w-full"
                onClick={() => setOpen(false)}
              >
                לתפריט והזמנות
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
