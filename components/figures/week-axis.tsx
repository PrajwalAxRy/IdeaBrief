import type { ReactNode } from 'react';

/**
 * The roadmap's shared week ruler.
 *
 * **CSS grid, not SVG and not absolute percentages**: `PlanBar` must share this
 * coordinate space and carries text, and a grid gives both the ruler and the
 * bars one set of tracks rather than two coordinate systems that agree by
 * arithmetic.
 *
 * Weeks are **1-indexed**, always, and `weeks` comes from
 * `planHorizon(roadmap)` — the horizon is never passed as a literal. A12
 * amended this signature from A3's pre-C5 shape (`{ weeks, children }` is what
 * survived; the 0-indexed start and the `weeks={14}` style-guide fixture went
 * with the old model).
 *
 * **The content box is 1120px inside `.ob-container`, so a track is 93.33px,
 * not 100.** Every assertion about this axis is a **ratio**, never a pixel.
 *
 * `--ob-plan-cols` is written inline here and read by both `.ob-week-axis` and
 * `.ob-week-lanes`. **Its `, 12` fallback in the stylesheet is not optional** —
 * an undefined custom property voids the entire declaration and you get a
 * one-column grid with no error (pitfalls §3).
 *
 * `WeekAxis` and `PlanBar` are **exempt from the `Figure`-needs-a-citation
 * rule**: they are layout derived from the plan, not marks derived from
 * evidence.
 *
 * Not blue.
 */
export function WeekAxis({
  weeks,
  caption,
  children,
}: {
  weeks: number;
  /** Composed from `planSpans` by the caller; never typed. */
  caption?: string;
  children?: ReactNode;
}) {
  return (
    <div className="ob-week-axis-wrap" style={{ ['--ob-plan-cols' as string]: String(weeks) }}>
      {caption ? <p className="ob-week-caption ob-meta">{caption}</p> : null}
      <div className="ob-week-axis" aria-hidden="true">
        {Array.from({ length: weeks }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length, never-reordered ruler
          <span key={i} className="ob-week-tick">
            <span className="ob-week-label ob-meta">W{i + 1}</span>
          </span>
        ))}
      </div>
      {children ? <div className="ob-week-lanes">{children}</div> : null}
    </div>
  );
}
