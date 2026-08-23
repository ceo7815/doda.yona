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

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/menu") {
      return pathname === "/menu" || pathname.startsWith("/menu/");
    }
    return pathname.startsWith(href);
  }

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50">
      <div className="hidden justify-center px-4 pt-4 lg:flex">
        <div
          className={cn(
            "w-fit max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border transition-[background-color,box-shadow,border-color] duration-300",
            "backdrop-blur-xl backdrop-saturate-150",
            scrolled
              ? "border-gold-500/25 bg-brand-900/85 shadow-[0_12px_40px_rgb(31_20_12/0.35)]"
              : "border-white/20 bg-brand-900/40 shadow-[0_8px_24px_rgb(31_20_12/0.12)]",
          )}
        >
          <div className="flex h-[var(--header-height)] items-center justify-start gap-16 px-8 xl:gap-20">
            <Link
              href="/"
              className="flex min-w-0 shrink flex-col items-center text-center"
            >
              <span className="truncate text-3xl font-black tracking-tight text-gold-gradient">
                {restaurantName}
              </span>
              <span className="mt-0.5 max-w-[14rem] text-xs font-medium leading-snug tracking-[0.04em] text-brand-100/90">
                {RESTAURANT.tagline}
              </span>
            </Link>

            <nav className="flex items-center gap-1" aria-label="ניווט ראשי">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
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

            <Link
              href="/cart"
              aria-label={`סל מוצרים${totalItems > 0 ? `, ${totalItems} פריטים` : ""}`}
              className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 text-brand-900 shadow-sm transition-colors hover:bg-gold-400"
            >
              <ShoppingBag className="size-5" aria-hidden />
              <span className="text-base font-bold">סל מוצרים</span>
              {totalItems > 0 ? (
                <span className="absolute -top-1.5 -start-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand-900 px-1 text-[0.7rem] font-bold text-gold-400">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          className="absolute top-[max(0.7rem,env(safe-area-inset-top))] start-3 z-20 inline-flex size-11 items-center justify-center rounded-xl border border-gold-500/35 bg-brand-900/55 text-gold-400 shadow-[0_8px_24px_rgb(31_20_12/0.28)] backdrop-blur-md"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "סגור תפריט" : "פתח תפריט"}</span>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          {!open && totalItems > 0 ? (
            <span className="absolute -bottom-1 -end-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[0.6rem] font-bold text-brand-900">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          ) : null}
        </button>

        {open ? (
          <div
            id="mobile-nav"
            className="fixed inset-0 z-10 bg-brand-900/96 pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))]"
          >
            <nav className="flex h-full flex-col gap-1 overflow-y-auto px-5 pb-8" aria-label="ניווט מובייל">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
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
                href="/cart"
                className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gold-500/40 px-4 text-base font-bold text-gold-400"
                onClick={() => setOpen(false)}
              >
                <ShoppingBag className="size-5" aria-hidden />
                סל מוצרים
                {totalItems > 0 ? ` (${totalItems})` : ""}
              </Link>
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
