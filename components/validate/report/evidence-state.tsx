import { META_SEPARATOR, REPORT } from '@/lib/content/app';
import { DIMENSION_LABEL, type Dimension } from '@/lib/schemas/evidence';
import type { ReactNode } from 'react';

interface EvidenceStateProps {
  strong: Dimension[];
  thin: Dimension[];
  contested: Dimension[];
  /** A10 fills this with `DimensionStrip`; A9 reserves its exact height. */
  strip: ReactNode;
  /** A10 fills this with the overall `StanceBar`. */
  stance: ReactNode;
  footer: string;
}

function Cell({ label, dimensions }: { label: string; dimensions: Dimension[] }) {
  return (
    <div>
      <p className="ob-estate-key ob-meta">{label}</p>
      <p className="ob-estate-value">
        {dimensions.length === 0
          ? REPORT.evidenceState.empty
          : dimensions.map((d) => DIMENSION_LABEL[d]).join(META_SEPARATOR)}
      </p>
    </div>
  );
}

/**
 * D7 — the report's opening band. What the evidence is strong on, thin on, and
 * actively contests, **stated as properties of the evidence, never as a
 * judgement of the idea.** No verdict, no score, no gate.
 *
 * The three lists come from `deriveEvidenceState(report, evidence)` and this
 * component never re-implements the rule. A dimension may appear in two lists —
 * PROBLEM and MONEY both do — and a dimension may land in none; that is the
 * honest result and is not suppressed. An empty list reads `nothing yet`, never
 * a blank cell.
 */
export function EvidenceState({
  strong,
  thin,
  contested,
  strip,
  stance,
  footer,
}: EvidenceStateProps) {
  return (
    <>
      <div className="ob-estate">
        <Cell label={REPORT.evidenceState.keys.strong} dimensions={strong} />
        <hr className="ob-rule-v" />
        <Cell label={REPORT.evidenceState.keys.thin} dimensions={thin} />
        <hr className="ob-rule-v" />
        <Cell label={REPORT.evidenceState.keys.contested} dimensions={contested} />
      </div>

      {/* The sentence this whole band exists for. Directly beneath the
          three-up, full measure, never above it and never a tooltip. */}
      <p className="ob-estate-note">{REPORT.evidenceState.note}</p>

      {strip}
      {stance}

      <p className="ob-meta">{footer}</p>
    </>
  );
}
