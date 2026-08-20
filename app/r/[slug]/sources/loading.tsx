import { PageContainer } from '@/components/layout/page-container';
import { Skeleton } from '@/components/ui/skeleton';

const ROW_COUNT = 8;

function SourceRowSkeleton() {
  return (
    <div className="finding-row flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton height={12} width="18%" />
        <Skeleton height={12} width={80} />
      </div>
      <Skeleton height={16} width="70%" />
      <Skeleton height={14} width="45%" />
    </div>
  );
}

/** Route-level Suspense fallback — 8 skeleton rows (09.1), matching the flat, dense list shape. */
export default function SourcesLoading() {
  return (
    <PageContainer variant="app" className="flex flex-col gap-8 py-12">
      <Skeleton height={16} width={140} />
      <div className="flex flex-col gap-2">
        <Skeleton height={16} width="30%" />
        <Skeleton height={16} width="55%" />
      </div>
      <div className="sources-rows">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative placeholder row
          <SourceRowSkeleton key={index} />
        ))}
      </div>
    </PageContainer>
  );
}
