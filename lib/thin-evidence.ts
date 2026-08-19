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
