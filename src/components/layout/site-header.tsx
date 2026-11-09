"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESTAURANT } from "@/data/catalog";
import type { OrderLink } from "@/lib/site-settings";
import { OrderButton } from "@/components/site/order-button";
import { NAV_ITEMS } from "@/components/layout/nav-items";

type SiteHeaderProps = {
  restaurantName: string;
  order: OrderLink;
  telHref: string;
  phoneDisplay: string;
};

export function SiteHeader({
  restaurantName,
  order,
  telHref,
  phoneDisplay,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  // התפריט נסגר אוטומטית במעבר עמוד: פתוח רק בנתיב שבו נפתח
  const open = openPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50">
      {/* דסקטופ */}
      <div className="hidden justify-center px-4 pt-4 lg:flex">
        <div
          className={cn(
            "w-full max-w-6xl rounded-2xl border transition-[background-color,box-shadow,border-color] duration-300",
            "backdrop-blur-xl backdrop-saturate-150",
            scrolled
              ? "border-gold-500/25 bg-brand-900/90 shadow-[0_12px_40px_rgb(31_20_12/0.35)]"
              : "border-white/15 bg-brand-900/80 shadow-[0_8px_24px_rgb(31_20_12/0.18)]",
          )}
        >
          <div className="flex h-[var(--header-height)] items-center justify-between gap-6 px-6 xl:px-8">
            <Link href="/" className="flex shrink-0 flex-col items-start leading-none">
              <span className="text-[1.7rem] font-black tracking-tight text-gold-gradient">
                {restaurantName}
              </span>
              <span className="mt-1 text-[0.7rem] font-medium tracking-[0.08em] text-brand-100/85">
                {RESTAURANT.tagline}
              </span>
            </Link>

            <nav className="flex items-center gap-0.5" aria-label="ניווט ראשי">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "nav-link relative rounded-lg px-3.5 py-2 text-[0.95rem] font-semibold whitespace-nowrap transition-colors",
                      active
                        ? "text-gold-400"
                        : "text-brand-50/90 hover:text-gold-300",
                    )}
                    data-active={active || undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <a
                href={telHref}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-brand-50/90 transition-colors hover:text-gold-300"
                aria-label={`חיוג למסעדה ${phoneDisplay}`}
              >
                <Phone className="size-4 text-gold-400" aria-hidden />
                <span dir="ltr">{phoneDisplay}</span>
              </a>
              <OrderButton order={order} className="min-h-11 px-5 text-[0.95rem]" />
            </div>
          </div>
        </div>
      </div>

      {/* מובייל */}
      <div
        className={cn(
          "flex items-center justify-between px-3 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow] duration-300 lg:hidden",
          scrolled || open
            ? "bg-brand-900/95 shadow-[0_6px_24px_rgb(31_20_12/0.3)] backdrop-blur-md"
            : "bg-gradient-to-b from-brand-900/70 to-transparent",
        )}
      >
        <Link
          href="/"
          className={cn(
            "flex min-h-14 flex-col justify-center leading-none transition-opacity duration-300",
            pathname === "/" && !scrolled && !open && "pointer-events-none opacity-0",
          )}
          onClick={() => setOpenPath(null)}
        >
          <span className="text-xl font-black tracking-tight text-gold-gradient">
            {restaurantName}
          </span>
          <span className="mt-0.5 text-[0.62rem] font-medium tracking-[0.06em] text-brand-100/85">
            {RESTAURANT.locationLabel}
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-xl border border-gold-500/35 bg-brand-900/60 text-gold-400 backdrop-blur-md"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          <span className="sr-only">{open ? "סגירת התפריט" : "פתיחת התפריט"}</span>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="mobile-nav-panel fixed inset-x-0 bottom-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-10 bg-brand-900/97 backdrop-blur-md lg:hidden"
        >
          <nav
            className="flex h-full flex-col gap-1 overflow-y-auto px-5 pt-4 pb-[calc(var(--mobile-order-bar)+2rem)]"
            aria-label="ניווט מובייל"
          >
            {NAV_ITEMS.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ "--i": index } as React.CSSProperties}
                  className={cn(
                    "mobile-nav-item flex min-h-14 items-center justify-between rounded-xl border-b border-white/5 px-4 text-xl font-bold transition-colors",
                    active ? "text-gold-400" : "text-brand-50 hover:text-gold-300",
                  )}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpenPath(null)}
                >
                  {item.label}
                  {active ? (
                    <span className="size-1.5 rounded-full bg-gold-500" aria-hidden />
                  ) : null}
                </Link>
              );
            })}
            <div className="mt-6 grid gap-3">
              <OrderButton order={order} className="min-h-13 w-full text-base" />
              <a
                href={telHref}
                className="btn-ghost-gold min-h-13 w-full gap-2 text-base"
              >
                <Phone className="size-4" aria-hidden />
                <span dir="ltr">{phoneDisplay}</span>
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
