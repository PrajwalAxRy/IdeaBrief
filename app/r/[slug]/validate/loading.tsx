import { PageContainer } from '@/components/layout/page-container';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

/**
 * Route-level Suspense fallback — matches the Connecting state's shape
 * (phase strip + a few skeleton cards) per 12-states.md, even though the
 * fixture data resolves near-instantly and this rarely has time to paint.
 */
export default function ValidateLoading() {
  return (
    <PageContainer variant="app" className="flex flex-col gap-8 py-12">
      <div className="flex flex-col gap-4">
        <Skeleton height={44} width="55%" />
        <Skeleton height={16} width="35%" />
      </div>
      <div className="grid gap-12" style={{ gridTemplateColumns: '320px 1fr' }}>
        <SkeletonText lines={6} />
        <div className="flex flex-col gap-4">
          <Skeleton height={140} />
          <Skeleton height={140} />
          <Skeleton height={140} />
        </div>
      </div>
    </PageContainer>
  );
}
