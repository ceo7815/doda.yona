import { Container } from "@/components/ui/container";
import { CardGridSkeleton, HeroSkeleton, LoadingRegion } from "@/components/skeletons/page-skeletons";

export default function MenuLoading() {
  return (
    <LoadingRegion label="טוען את התפריט…">
      <HeroSkeleton />
      <div className="flex gap-2 overflow-hidden border-b border-border/80 px-3 py-2.5 lg:justify-center">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton h-10 w-24 shrink-0 !rounded-full" />
        ))}
      </div>
      <Container className="py-12">
        <div className="skeleton mx-auto mb-8 h-9 w-40" />
        <CardGridSkeleton count={8} />
      </Container>
    </LoadingRegion>
  );
}
