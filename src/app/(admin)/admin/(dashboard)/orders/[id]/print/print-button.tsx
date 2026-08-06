"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded border px-4 py-2 font-bold"
    >
      הדפסה
    </button>
  );
}
