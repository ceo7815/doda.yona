"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error.digest ?? error.name);
  }, [error]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-[family-name:var(--font-rubik)] text-2xl font-bold">
        אירעה שגיאה
      </h1>
      <p className="mt-2 max-w-md text-ink-muted">
        לא הצלחנו לטעון את העמוד. נסו שוב בעוד רגע.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={reset}>
          נסו שוב
        </Button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-md border border-border-strong px-4 font-semibold"
        >
          לעמוד הבית
        </Link>
      </div>
    </Container>
  );
}
