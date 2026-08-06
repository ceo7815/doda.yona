import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 font-[family-name:var(--font-rubik)] text-3xl font-bold">
        העמוד לא נמצא
      </h1>
      <p className="mt-2 text-ink-muted">
        הכתובת שביקשתם אינה קיימת או הועברה למקום אחר.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-md bg-brand-600 px-5 font-semibold text-white hover:bg-brand-700"
      >
        חזרה לעמוד הבית
      </Link>
    </Container>
  );
}
