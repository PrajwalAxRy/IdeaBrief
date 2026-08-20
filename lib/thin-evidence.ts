import { DIMENSIONS, type Dimension, type Finding } from './schemas/evidence';

const MIN_TOTAL_FINDINGS = 12;
const MIN_FINDINGS_PER_DIMENSION = 2;
const MIN_THIN_DIMENSIONS_TO_TRIGGER = 3;

export function countsByDimension(findings: Finding[]): Record<Dimension, number> {
  const counts = Object.fromEntries(DIMENSIONS.map((dimension) => [dimension, 0])) as Record<
    Dimension,
    number
  >;
  for (const finding of findings) {
    if (finding.verified) counts[finding.dimension] += 1;
  }
  return counts;
}

/**
 * The thin-evidence trigger rule, in exactly one place — used by the report,
 * the roadmap, and potentially the console's early warning. A dimension
 * confidence of "thin" (a report-authoring choice) is independent of this:
 * this flags the whole *run*, not a single dimension.
 */
export function isThinEvidence(findings: Finding[]): boolean {
  const counts = countsByDimension(findings);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const thinDimensions = Object.values(counts).filter(
    (count) => count < MIN_FINDINGS_PER_DIMENSION,
  ).length;
  return total < MIN_TOTAL_FINDINGS || thinDimensions >= MIN_THIN_DIMENSIONS_TO_TRIGGER;
}

export type ThinDimensionOverrides = Partial<
  Record<Dimension, { findings: Finding[]; count: number; sources: number }>
>;

const PREVIEW_FINDINGS_PER_DIMENSION = 1;

/**
 * Prototype-only QA affordance (`/r/[slug]/validate?thin=1`) for exercising
 * the thin-evidence variant without a second, hand-maintained fixture that
 * could drift from the canonical one. Truncates each dimension's *displayed*
 * findings/counts down to `PREVIEW_FINDINGS_PER_DIMENSION`; it never touches
 * the real evidence array passed to `EvidenceProvider`, so every citation
 * chip in the (unchanged) summary/dimension prose still resolves correctly —
 * only the accordions' visible finding lists and Meta Line counts shrink.
 * Not part of the real product; there is no way to reach this from any real
 * UI affordance, only the query param. See the P8 build log.
 */
export function buildThinPreviewOverrides(evidence: Finding[]): ThinDimensionOverrides {
  const overrides: ThinDimensionOverrides = {};
  for (const dimension of DIMENSIONS) {
    const findings = evidence
      .filter((finding) => finding.dimension === dimension)
      .slice(0, PREVIEW_FINDINGS_PER_DIMENSION);
    overrides[dimension] = {
      findings,
      count: findings.length,
      sources: new Set(findings.map((finding) => finding.source_url)).size,
    };
  }
  return overrides;
}
