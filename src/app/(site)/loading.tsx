import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <Container className="py-16" aria-busy="true" aria-live="polite">
      <p className="text-ink-muted">טוען…</p>
    </Container>
  );
}
