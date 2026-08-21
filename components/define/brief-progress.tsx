import { DEFINE } from '@/lib/content/app';

/**
 * `9 of 12 answered · 3 unknown → open questions`, in the band beside the h1.
 *
 * Presentational and stateless — A7 supplies live counts from the brief hook
 * and changes nothing else about this file. The sentence itself is assembled
 * in exactly one place, `DEFINE.progress`.
 *
 * `tabular-nums` so a rising count doesn't jitter the band, and
 * `aria-live="polite"` because the number moving is the feedback that pressing
 * `I don't know` did something.
 */
export function BriefProgress({
  answered,
  total,
  unknown,
}: { answered: number; total: number; unknown: number }) {
  return (
    <p className="ob-brief-progress ob-meta" aria-live="polite">
      {DEFINE.progress(answered, total, unknown)}
    </p>
  );
}
