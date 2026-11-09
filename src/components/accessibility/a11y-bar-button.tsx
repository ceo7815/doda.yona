"use client";

import { Accessibility, X } from "lucide-react";
import { useAccessibility } from "@/components/accessibility/accessibility-provider";

/** כפתור נגישות בתוך פס הפעולות במובייל — במקום כפתור צף שמסתיר תוכן */
export function A11yBarButton() {
  const { panelOpen, setPanelOpen } = useAccessibility();
  return (
    <button
      type="button"
      onClick={() => setPanelOpen(!panelOpen)}
      aria-expanded={panelOpen}
      aria-controls="a11y-panel"
      aria-label={panelOpen ? "סגירת תפריט נגישות" : "פתיחת תפריט נגישות"}
      className="inline-flex min-h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold-500/40 text-gold-300 active:scale-[0.98]"
    >
      {panelOpen ? <X className="size-5" aria-hidden /> : <Accessibility className="size-5" aria-hidden />}
    </button>
  );
}
