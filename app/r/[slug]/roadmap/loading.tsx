import { PageContainer } from '@/components/layout/page-container';
import { Card } from '@/components/ui/card';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const COLLAPSED_ROW_COUNT = 5;
const STEP_COUNT = 5;

/** Route-level Suspense fallback — "1 expanded + 5 rows + 5 steps" (08's Loading state). */
export default function RoadmapLoading() {
  return (
    <PageContainer variant="app" className="py-16">
      <div className="mx-auto flex w-full max-w-roadmap flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Skeleton height={16} width={140} />
          <Skeleton height={56} width="70%" />
          <Skeleton height={16} width="40%" />
        </div>

        <Skeleton height={44} width={280} />

        <div className="flex flex-col gap-4">
          <Card padding="feature" className="flex flex-col gap-4">
            <SkeletonText lines={5} />
          </Card>
          {Array.from({ length: COLLAPSED_ROW_COUNT }, (_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative placeholder row
            <Card key={index} padding="feature">
              <Skeleton height={20} width="60%" />
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          {Array.from({ length: STEP_COUNT }, (_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative placeholder row
            <div key={index} className="flex flex-col gap-2">
              <Skeleton height={16} width="25%" />
              <SkeletonText lines={2} />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
