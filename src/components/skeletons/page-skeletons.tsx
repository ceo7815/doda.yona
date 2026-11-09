import { Container } from "@/components/ui/container";

export function HeroSkeleton() {
  return (
    <div className="bg-brand-900 page-pad-top pb-12">
      <Container className="flex flex-col items-center gap-3">
        <div className="skeleton h-3 w-24 !bg-white/10" />
        <div className="skeleton h-10 w-56 !bg-white/10" />
        <div className="skeleton h-4 w-72 max-w-full !bg-white/10" />
      </Container>
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="overflow-hidden rounded-2xl border border-border/70 bg-surface-elevated">
          <div className="skeleton aspect-[4/3] !rounded-none" />
          <div className="space-y-2 p-3 sm:p-4">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-2/3" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function LoadingRegion({ children, label = "טוען…" }: { children: React.ReactNode; label?: string }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
