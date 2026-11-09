import { Container } from "@/components/ui/container";
import { LoadingRegion } from "@/components/skeletons/page-skeletons";

export default function DishLoading() {
  return (
    <LoadingRegion label="טוען מנה…">
      <Container className="page-pad-top pb-14">
        <div className="skeleton mb-6 h-5 w-28" />
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="skeleton aspect-[4/3] !rounded-[1.5rem] lg:order-2" />
          <div className="space-y-4 lg:order-1 lg:pt-4">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-12 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton mt-6 h-24 w-full" />
            <div className="skeleton mt-6 h-13 w-48" />
          </div>
        </div>
      </Container>
    </LoadingRegion>
  );
}
