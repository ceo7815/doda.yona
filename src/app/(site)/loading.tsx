import { Container } from "@/components/ui/container";
import { HeroSkeleton, LoadingRegion } from "@/components/skeletons/page-skeletons";

export default function Loading() {
  return (
    <LoadingRegion>
      <HeroSkeleton />
      <Container className="max-w-3xl space-y-4 py-14">
        <div className="skeleton mx-auto h-8 w-64" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton mt-8 h-40 w-full" />
      </Container>
    </LoadingRegion>
  );
}
