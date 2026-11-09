"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { uploadImage } from "@/lib/admin/image-upload";
import { FormMessage } from "@/components/admin/ui";
import { addGalleryImages } from "./actions";

export function GalleryUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [dragging, setDragging] = useState(false);
  const router = useRouter();
  const busy = progress !== null || pending;

  async function handle(files: FileList | null) {
    const list = Array.from(files ?? []).filter((f) => f.type.startsWith("image/")).slice(0, 30);
    if (list.length === 0) return;
    setResult(null);
    const uploaded: { path: string; alt: string }[] = [];
    try {
      for (const [i, file] of list.entries()) {
        setProgress(`מעלה ${i + 1} מתוך ${list.length}…`);
        uploaded.push({
          path: await uploadImage(file, "gallery"),
          alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").slice(0, 120),
        });
      }
    } catch (e) {
      setResult({ ok: false, message: e instanceof Error ? e.message : "ההעלאה נכשלה." });
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    if (uploaded.length === 0) return;
    startTransition(async () => {
      setResult(await addGalleryImages(uploaded));
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handle(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging ? "border-gold-500 bg-gold-500/10" : "border-border-strong bg-white/70 hover:border-gold-500 hover:bg-gold-500/5"
        } disabled:opacity-60`}
      >
        {busy ? <Loader2 className="size-7 animate-spin text-brand-800" aria-hidden /> : <Upload className="size-7 text-gold-700" aria-hidden />}
        <span className="text-base font-extrabold text-brand-900">{progress ?? (pending ? "שומר…" : "העלאת תמונות לגלריה")}</span>
        <span className="text-sm text-ink-muted">לחצו לבחירה או גררו לכאן · אפשר כמה תמונות יחד · נדחס אוטומטית</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => void handle(e.target.files)}
      />
      {result ? <FormMessage ok={result.ok} message={result.message} /> : null}
    </div>
  );
}
