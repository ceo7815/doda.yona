"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

/**
 * מפת Google נטענת רק בלחיצה — חוסך כ-1MB של סקריפטים בטעינת העמוד.
 */
export function MapEmbed({ query, title }: { query: string; title: string }) {
  const [show, setShow] = useState(false);
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=he&z=16&output=embed`;

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/80 bg-brand-100 shadow-[var(--shadow-card)] sm:aspect-[21/8]">
      {show ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button
          type="button"
          onClick={() => setShow(true)}
          className="map-placeholder absolute inset-0 flex flex-col items-center justify-center gap-3 text-brand-900"
        >
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-900 text-gold-400 shadow-[var(--shadow-md)]">
            <MapPin className="size-6" aria-hidden />
          </span>
          <span className="text-base font-extrabold">הצגת המפה</span>
          <span className="text-sm text-ink-muted">{query}</span>
        </button>
      )}
    </div>
  );
}
