"use client";

import Link from "next/link";
import {
  Accessibility,
  Contrast,
  Eye,
  Link2,
  Minus,
  MousePointer2,
  Pause,
  Plus,
  RotateCcw,
  Type,
  Underline,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/components/accessibility/accessibility-provider";
import type { A11yContrast } from "@/components/accessibility/a11y-types";

const CONTRAST_OPTIONS: { value: A11yContrast; label: string }[] = [
  { value: "default", label: "רגיל" },
  { value: "high", label: "ניגודיות גבוהה" },
  { value: "grayscale", label: "גווני אפור" },
  { value: "invert", label: "היפוך צבעים" },
];

export function AccessibilityFab() {
  const { settings, setSettings, reset, panelOpen, setPanelOpen } =
    useAccessibility();

  return (
    <div className="no-print fixed start-auto end-auto left-3 top-1/2 z-[60] -translate-y-1/2 sm:left-4">
      <button
        type="button"
        onClick={() => setPanelOpen(!panelOpen)}
        className={cn(
          "inline-flex size-12 items-center justify-center rounded-full border border-gold-500/40 bg-brand-900 text-gold-400 shadow-[0_8px_28px_rgb(20_13_8/0.35)] transition-[background-color,transform,box-shadow] hover:bg-brand-800 hover:text-gold-300 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] active:scale-95 sm:size-14",
          panelOpen && "ring-2 ring-gold-500/50",
        )}
        aria-expanded={panelOpen}
        aria-controls="a11y-panel"
        aria-label={panelOpen ? "סגירת תפריט נגישות" : "פתיחת תפריט נגישות"}
      >
        {panelOpen ? (
          <X className="size-5 sm:size-6" aria-hidden />
        ) : (
          <Accessibility className="size-5 sm:size-6" aria-hidden />
        )}
      </button>

      {panelOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[-1] cursor-default bg-brand-900/35 backdrop-blur-[2px]"
            aria-label="סגירת תפריט נגישות"
            onClick={() => setPanelOpen(false)}
          />
          <div
            id="a11y-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-panel-title"
            className="fixed left-16 top-1/2 z-10 w-[min(19rem,calc(100vw-5rem))] -translate-y-1/2 rounded-2xl border border-gold-500/30 bg-brand-900 p-4 text-brand-50 shadow-[0_16px_48px_rgb(20_13_8/0.45)] sm:left-[4.75rem] sm:w-80 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-bold tracking-[0.18em] text-gold-500">
                  התאמות
                </p>
                <h2
                  id="a11y-panel-title"
                  className="mt-0.5 text-lg font-extrabold text-gold-400"
                >
                  נגישות באתר
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-lg text-brand-200 transition-colors hover:bg-white/10 hover:text-gold-400"
                aria-label="סגור"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="mt-4 max-h-[min(70dvh,28rem)] space-y-4 overflow-y-auto pe-1">
              <section>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gold-400">
                  <Type className="size-3.5" aria-hidden />
                  גודל טקסט
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-xl border border-brand-700 bg-brand-800 text-gold-400 disabled:opacity-40"
                    onClick={() =>
                      setSettings({
                        fontStep: Math.max(0, settings.fontStep - 1) as
                          | 0
                          | 1
                          | 2
                          | 3,
                      })
                    }
                    disabled={settings.fontStep === 0}
                    aria-label="הקטנת טקסט"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-16 flex-1 text-center text-sm font-semibold text-brand-100">
                    {100 + settings.fontStep * 12.5}%
                  </span>
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-xl border border-brand-700 bg-brand-800 text-gold-400 disabled:opacity-40"
                    onClick={() =>
                      setSettings({
                        fontStep: Math.min(3, settings.fontStep + 1) as
                          | 0
                          | 1
                          | 2
                          | 3,
                      })
                    }
                    disabled={settings.fontStep === 3}
                    aria-label="הגדלת טקסט"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </section>

              <section>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gold-400">
                  <Contrast className="size-3.5" aria-hidden />
                  ניגודיות וצבע
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {CONTRAST_OPTIONS.map((option) => {
                    const selected = settings.contrast === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSettings({ contrast: option.value })}
                        className={cn(
                          "min-h-10 rounded-xl border px-2 text-xs font-bold transition-colors",
                          selected
                            ? "border-gold-500/55 bg-gold-500/15 text-gold-400"
                            : "border-brand-700 bg-brand-800/70 text-brand-100 hover:border-gold-500/30",
                        )}
                        aria-pressed={selected}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-1.5">
                <ToggleRow
                  icon={<Link2 className="size-3.5" aria-hidden />}
                  label="הדגשת קישורים"
                  checked={settings.highlightLinks}
                  onChange={(checked) =>
                    setSettings({ highlightLinks: checked })
                  }
                />
                <ToggleRow
                  icon={<Underline className="size-3.5" aria-hidden />}
                  label="קו תחתון לקישורים"
                  checked={settings.underlineLinks}
                  onChange={(checked) =>
                    setSettings({ underlineLinks: checked })
                  }
                />
                <ToggleRow
                  icon={<Eye className="size-3.5" aria-hidden />}
                  label="גופן קריא"
                  checked={settings.readableFont}
                  onChange={(checked) =>
                    setSettings({ readableFont: checked })
                  }
                />
                <ToggleRow
                  icon={<Pause className="size-3.5" aria-hidden />}
                  label="עצירת אנימציות"
                  checked={settings.stopAnimations}
                  onChange={(checked) =>
                    setSettings({ stopAnimations: checked })
                  }
                />
                <ToggleRow
                  icon={<MousePointer2 className="size-3.5" aria-hidden />}
                  label="סמן גדול"
                  checked={settings.bigCursor}
                  onChange={(checked) => setSettings({ bigCursor: checked })}
                />
                <ToggleRow
                  icon={<Type className="size-3.5" aria-hidden />}
                  label="ריווח מוגדל"
                  checked={settings.largeSpacing}
                  onChange={(checked) =>
                    setSettings({ largeSpacing: checked })
                  }
                />
              </section>

              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-700 bg-brand-800 text-sm font-bold text-gold-400 transition-colors hover:border-gold-500/40 hover:bg-brand-700"
              >
                <RotateCcw className="size-4" aria-hidden />
                איפוס הגדרות
              </button>

              <Link
                href="/accessibility"
                onClick={() => setPanelOpen(false)}
                className="block text-center text-xs font-semibold text-gold-400 underline-offset-2 hover:underline"
              >
                להצהרת הנגישות
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border px-3 text-start text-sm font-semibold transition-colors",
        checked
          ? "border-gold-500/45 bg-gold-500/12 text-gold-300"
          : "border-brand-700 bg-brand-800/50 text-brand-100 hover:border-gold-500/25",
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-gold-500" : "bg-brand-700",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-brand-950 transition-[left]",
            checked ? "left-5" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}
