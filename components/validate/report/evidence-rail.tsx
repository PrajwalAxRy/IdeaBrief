'use client';

import { useEvidence } from '@/components/validate/evidence/evidence-context';
import { citationNumberForFindingId } from '@/lib/citations';
import { REPORT } from '@/lib/content/app';
import { formatDate, formatDomain } from '@/lib/format';
import { DIMENSION_LABEL, type Dimension, type Finding } from '@/lib/schemas/evidence';
import Link from 'next/link';

/**
 * The uncited-findings surface. **23 of 47 findings are quoted nowhere in the
 * report** — they were verified and then never used, and until now the only
 * place they existed was `/sources`.
 *
 * Classes are `.ob-erail*`, deliberately **not** `.ob-rail*`, which A13 takes
 * for the explorer's facet rail in §14.
 *
 * A row is a real `<button>`, never `role="button"` on a div (R12). The client
 * boundary is here, at the leaf that needs the drawer, so `DimensionSection`
 * and everything above it stay server-rendered.
 *
 * A dimension with nothing uncited renders **no rail at all** — that is not a
 * hole, it means the paragraph used everything it had.
 */
export function EvidenceRail({
  dimension,
  findings,
  cap,
  slug,
}: {
  dimension: Dimension;
  /** The uncited findings for this dimension, in corpus order. */
  findings: Finding[];
  /** `standard` density caps the rail and links out for the rest. */
  cap?: number;
  slug: string;
}) {
  const { openById } = useEvidence();
  if (findings.length === 0) return null;

  const shown = cap === undefined ? findings : findings.slice(0, cap);
  const remaining = findings.length - shown.length;
  const href = `/r/${slug}/sources?dim=${dimension}`;

  return (
    <div className="ob-erail">
      <p className="ob-erail-head ob-meta">
        {REPORT.evidenceRail.head} · {findings.length}
      </p>

      {shown.map((finding) => (
        <button
          key={finding.id}
          type="button"
          className="ob-erail-row"
          onClick={() => openById(finding.id)}
        >
          {/* Outside running prose, so a bracketed numeral is legal here (C12). */}
          <span className="ob-meta">
            [{String(citationNumberForFindingId(finding.id)).padStart(2, '0')}]
          </span>
          <span className="ob-erail-text">{finding.text}</span>
          <span className="ob-meta">
            {formatDomain(finding.source_url)} · {formatDate(finding.source_date)}
          </span>
        </button>
      ))}

      <p className="ob-erail-foot">
        <Link className="ob-text-action" href={href}>
          {remaining > 0
            ? REPORT.evidenceRail.more(remaining)
            : REPORT.evidenceRail.all(findings.length, DIMENSION_LABEL[dimension])}
        </Link>
      </p>
    </div>
  );
}
