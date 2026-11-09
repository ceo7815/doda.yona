"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CategoryNavProps = {
  categories: { slug: string; name: string; count: number }[];
};

/** ניווט קטגוריות דביק עם הדגשת הקטגוריה הנוכחית בגלילה */
export function CategoryNav({ categories }: CategoryNavProps) {
  const [active, setActive] = useState(categories[0]?.slug ?? "");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    if (!list || !el) return;
    // גלילה אופקית בלבד — בלי להזיז את העמוד
    list.scrollTo({
      left: el.offsetLeft - (list.clientWidth - el.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  if (categories.length < 2) return null;

  return (
    <nav
      aria-label="קטגוריות בתפריט"
      className="category-nav sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 border-b border-border/80 bg-surface/92 backdrop-blur-md lg:top-[calc(var(--header-height)+1.25rem)] lg:mx-auto lg:mt-4 lg:max-w-fit lg:rounded-full lg:border lg:shadow-[var(--shadow-md)]"
    >
      <ul
        ref={listRef}
        className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-2.5 lg:px-2 lg:py-2"
      >
        {categories.map((category) => {
          const isActive = active === category.slug;
          return (
            <li key={category.slug} data-slug={category.slug} className="shrink-0">
              <a
                href={`#${category.slug}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-colors",
                  isActive
                    ? "bg-brand-900 text-gold-400 shadow-sm"
                    : "bg-brand-100/70 text-brand-800 hover:bg-brand-200/70",
                )}
              >
                {category.name}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[0.65rem] font-bold",
                    isActive ? "bg-gold-500/20 text-gold-300" : "bg-white/70 text-ink-muted",
                  )}
                >
                  {category.count}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
