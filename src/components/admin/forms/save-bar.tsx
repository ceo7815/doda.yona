"use client";

import { Check, Loader2 } from "lucide-react";
import { FormMessage } from "@/components/admin/ui";

/** פס שמירה דביק בתחתית הטופס */
export function SaveBar({
  pending,
  ok,
  message,
  disabled,
}: {
  pending: boolean;
  ok: boolean;
  message?: string;
  disabled?: boolean;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 border-t border-border/80 bg-[#f6f1e8]/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <FormMessage ok={ok} message={message} />
        </div>
        <button
          type="submit"
          disabled={pending || disabled}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-900 px-7 text-base font-bold text-gold-400 shadow-md transition-colors hover:bg-brand-800 disabled:opacity-50"
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
          {pending ? "שומר…" : "שמירה"}
        </button>
      </div>
    </div>
  );
}
