"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage } from "@/lib/admin/image-upload";
import { resolveMediaUrl } from "@/lib/media";

/** בחירת תמונה למנה: העלאה עם דחיסה, תצוגה מקדימה, ושדה נסתר עם הנתיב */
export function ImagePicker({
  name,
  defaultPath,
  label = "תמונה",
}: {
  name: string;
  defaultPath?: string | null;
  label?: string;
}) {
  const [path, setPath] = useState(defaultPath ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = resolveMediaUrl(path);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setPath(await uploadImage(file, "dishes"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "ההעלאה נכשלה.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-bold text-brand-900">{label}</span>
      <input type="hidden" name={name} value={path} />
      <div className="flex items-center gap-4">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-xl border border-border bg-brand-50">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- תצוגה מקדימה בלבד באדמין
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-xs text-ink-muted">אין תמונה</span>
          )}
          {busy ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="size-6 animate-spin text-brand-800" aria-hidden />
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border-strong bg-white px-4 text-sm font-bold text-brand-900 hover:border-gold-500 disabled:opacity-50"
          >
            <ImagePlus className="size-4" aria-hidden />
            {path ? "החלפת תמונה" : "העלאת תמונה"}
          </button>
          {path ? (
            <button
              type="button"
              onClick={() => setPath("")}
              className="inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-danger"
            >
              <X className="size-4" aria-hidden />
              הסרת תמונה
            </button>
          ) : null}
          <p className="text-xs text-ink-muted">JPG / PNG / WebP — נדחס אוטומטית</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {error ? (
        <p className="text-xs font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
