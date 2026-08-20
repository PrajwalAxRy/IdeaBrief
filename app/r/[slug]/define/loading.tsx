import { PageContainer } from '@/components/layout/page-container';
import { TwoColumn } from '@/components/layout/two-column';
import { FieldSkeleton, Skeleton, SkeletonText } from '@/components/ui/skeleton';

const FIELD_LABELS = [
  'One-liner',
  'Product',
  'Customer',
  'Who decides',
  'Problem',
  'First version scope',
];

/**
 * Route-level Suspense fallback — "h1 + one AI skeleton; composer live"
 * (12-states.md), even though the fixture resolves near-instantly. The
 * Brief Panel's own pending-field shimmer already *is* its empty state
 * (12.3: "distinguish pending from empty"), so this mirrors that shape too.
 */
export default function DefineLoading() {
  return (
    <PageContainer variant="app" className="py-12">
      <div className="flex flex-col gap-8">
        <Skeleton height={44} width="50%" />
        <TwoColumn
          sidebarWidth={400}
          main={
            <div className="flex flex-col gap-8">
              <SkeletonText lines={4} />
              <Skeleton height={56} />
            </div>
          }
          sidebar={
            <div className="flex flex-col gap-6">
              <Skeleton height={16} width="20%" />
              {FIELD_LABELS.map((label) => (
                <FieldSkeleton key={label} label={label} />
              ))}
            </div>
          }
        />
      </div>
    </PageContainer>
  );
}
