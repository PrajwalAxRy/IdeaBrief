interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * A reserved block. **It does not shimmer** — A14 stripped the animation from
 * `.ob-skeleton` in §3, because a 1.6s infinite pulse is neither ambient
 * (20–50s) nor structural (150–900ms) and it claims work is happening on a
 * block that is simply waiting. The class name is unchanged.
 */
export function Skeleton({ width = '100%', height = 16, className = '' }: SkeletonProps) {
  return (
    <div
      className={['ob-skeleton', className].filter(Boolean).join(' ')}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * A blank sized by **the line box of whatever text element wraps it**, rather
 * than by a number typed at the call site.
 *
 * This is the difference between a fallback that reserves the right space and
 * one that is quietly 15px short. A `<div style={{ height: 21 }}>` standing in
 * for a 21px `.ob-lead` reserves 21px, but the paragraph it replaces is 31.5px
 * tall because `.ob-lead`'s line-height is 1.5 — and the same arithmetic error
 * on a mono line (12px text, 16.8px line box) is what pushed the report's
 * sticky index down by exactly 15.3px on first paint.
 *
 * Wrap it in the real element (`<p className="ob-lead">`) and `height: 1em`
 * keeps the block inside the strut, so the element's own line-height sets the
 * height. It cannot drift, because it is reading the same rule the loaded page
 * reads.
 */
export function SkeletonInline({ width }: { width: string | number }) {
  return (
    <span
      className="ob-skel"
      style={{ display: 'inline-block', width, height: '1em', verticalAlign: 'middle' }}
      aria-hidden="true"
    />
  );
}

/** Uniform bars look synthetic; these are the widths every prose stub uses. */
const LINE_WIDTHS = ['100%', '92%', '96%', '80%', '88%'];

/**
 * Multi-line prose stub. Emits `.ob-skel-line`, which A15's exit test counts
 * and asserts reports `animationName: 'none'`.
 */
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
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length, never-reordered decorative placeholder list
          key={index}
          className="ob-skel-line"
          style={{ width: LINE_WIDTHS[index % LINE_WIDTHS.length] }}
        />
      ))}
    </div>
  );
}

/**
 * One pending brief field.
 *
 * **The label is real text, not a grey bar.** It is knowable before the data
 * arrives, and a reader who can already see `Who decides` knows what is
 * coming — which is the whole difference between a skeleton and a placeholder.
 * Only the value is blank.
 */
export function FieldSkeleton({
  label,
  width = '62%',
  className = '',
}: { label: string; width?: string | number; className?: string }) {
  return (
    <div className={['ob-skel-field', className].filter(Boolean).join(' ')}>
      <span className="ob-meta">{label}</span>
      <div className="ob-skel" style={{ width }} aria-hidden="true" />
    </div>
  );
}
