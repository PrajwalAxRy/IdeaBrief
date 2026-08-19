interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

/** Shimmer block. Loading states live with their own component, not a central skeleton file. */
export function Skeleton({ width = '100%', height = 16, className = '' }: SkeletonProps) {
  return (
    <div
      className={['skeleton', className].filter(Boolean).join(' ')}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

const LINE_WIDTHS = ['100%', '92%', '96%', '80%', '88%'];

/** Multi-line prose skeleton — varied line widths, since uniform ones look wrong. */
export function SkeletonText({
  lines = 3,
  className = '',
}: { lines?: number; className?: string }) {
  return (
    <div
      className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length, never-reordered decorative placeholder list
          key={index}
          height={14}
          width={LINE_WIDTHS[index % LINE_WIDTHS.length]}
        />
      ))}
    </div>
  );
}

/** Brief Panel's pending field: label + shimmer. Pair with the `.field-settle` class when the value arrives. */
export function FieldSkeleton({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      <span className="meta-line">{label}</span>
      <Skeleton height={20} width="70%" />
    </div>
  );
}
