import { Container } from "@/components/ui/container";
import { HeroSkeleton, LoadingRegion } from "@/components/skeletons/page-skeletons";

const HEIGHTS = ["h-56", "h-72", "h-48", "h-64", "h-80", "h-52"];

export default function GalleryLoading() {
  return (
    <LoadingRegion label="טוען גלריה…">
      <HeroSkeleton />
      <Container className="columns-2 gap-3 py-12 lg:columns-3">
        {HEIGHTS.map((h, i) => (
          <div key={i} className={`skeleton mb-3 w-full ${h}`} />
        ))}
      </Container>
    </LoadingRegion>
  );
}
