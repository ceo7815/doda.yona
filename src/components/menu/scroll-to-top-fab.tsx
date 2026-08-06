"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ScrollToTopFabProps = {
  /** מזהה אלמנט ליעד הגלילה — ברירת מחדל ראש התפריט */
  targetId?: string;
};

export function ScrollToTopFab({ targetId = "menu-top" }: ScrollToTopFabProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      className={cn(
        "no-print fixed z-[45] inline-flex size-12 items-center justify-center rounded-full border border-gold-500/40 bg-brand-900 text-gold-400 shadow-[0_8px_28px_rgb(20_13_8/0.35)] transition-[opacity,transform,background-color] hover:bg-brand-800 hover:text-gold-300 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] active:scale-95",
        "bottom-[calc(var(--mobile-order-bar)+env(safe-area-inset-bottom,0px)+0.85rem)] end-3 sm:end-5 lg:bottom-8",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
      aria-label="חזרה לראש התפריט"
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  );
}
