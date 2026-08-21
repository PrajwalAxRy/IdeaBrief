import { REPORT } from '@/lib/content/app';
import type { Competitor } from '@/lib/schemas/report';

const FIELDS = ['moat', 'take_from_them', 'ignore'] as const;

/**
 * §04 — one full-measure row per competitor, separated by a hairline.
 *
 * **No 2-column grid, so no orphaned third card; no `.meta-line`, so no
 * ellipsised price.** `price` is the single most decision-relevant field on
 * this card and it used to be clipped by `white-space: nowrap` in a 600px
 * column (R21). It is now a field, at reading size, wrapping freely.
 *
 * **No accordion.** Hiding four fields behind a per-card click is a barrier
 * over content the reader came for.
 *
 * **Field-rendered, never prose.** A missing optional renders
 * `not established from available evidence` — never omitted, never guessed.
 * FrontDeskPro's `moat` and `ignore` are absent on purpose and both must be
 * visible on screen.
 */
export function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <article className="ob-comp-row">
      <div className="ob-comp-head">
        <div>
          {/* **`<h3>`, not `<h4>` (A15).** The competitors section's own heading
              is the `<h2>`, and there is no intervening level between it and a
              competitor name — so an `<h4>` here was a real 2→4 skip in the
              document outline, at `ChairSync`. C17's table said h4 ×3 on the
              assumption of a nesting this section does not have; the table is
              amended in the same commit rather than the markup being bent to
              fit it. Size is unchanged: `.ob-h3` is the class, and heading
              *size* is a class while heading *level* is structure. */}
          <h3 className="ob-h3">{competitor.name}</h3>
          <p className="ob-meta">{competitor.geography}</p>
        </div>
        <p className="ob-body">{competitor.difference_from_idea}</p>
        <p className="ob-comp-price">{competitor.price}</p>
      </div>

      <div className="ob-comp-fields">
        {FIELDS.map((field) => (
          <div key={field} className="contents">
            <p className="ob-comp-key ob-meta">{REPORT.competitor.keys[field]}</p>
            <p className={competitor[field] ? 'ob-body' : 'ob-comp-missing'}>
              {competitor[field] ?? REPORT.competitor.missing}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
