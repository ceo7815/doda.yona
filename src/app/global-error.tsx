"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error.digest ?? error.name);
  }, [error]);

  return (
    <html lang="he" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1rem",
          background: "#fffdf9",
          color: "#1c1410",
          fontFamily: "Heebo, Segoe UI, Tahoma, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>משהו השתבש</h1>
        <p style={{ maxWidth: "28rem", textAlign: "center", color: "#5c4f45" }}>
          אירעה שגיאה בלתי צפויה. אפשר לנסות שוב, או לחזור לעמוד הבית.
        </p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: "2.75rem",
              padding: "0 1rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#95653c",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            נסו שוב
          </button>
          {/* global-error מחוץ לעץ הרגיל — קישור מלא לרענון מלא */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: "2.75rem",
              padding: "0 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d4c4b0",
              color: "#1c1410",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            לעמוד הבית
          </a>
        </div>
      </body>
    </html>
  );
}
