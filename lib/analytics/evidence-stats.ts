import { extractCitationNumbers } from '../citations';
import { formatDomain } from '../format';
import { DIMENSIONS, type Dimension, type Evidence, type Finding } from '../schemas/evidence';
import type { Report } from '../schemas/report';

/**
 * Pure rollups over the verified corpus. Every figure in the app reads from
 * here or from ./report-figures.ts; **no component computes a statistic.**
 *
 * The exported surface is frozen (C10). If a figure needs a different return
 * shape, the signature here and its test change — a second name with a new
 * spelling never appears in `components/figures/`.
 *
 * These are pure functions over data the page already fetched, so none of them
 * gets a `lib/db/queries.ts` entry. Putting a derivation behind an
 * `async (slug) => Promise<T>` would fake a network round-trip that will never
 * exist.
 */

export interface StanceCounts {
  supports: number;
  neutral: number;
  /**
   * The schema value is `challenges`; the word the reader sees is `Contests`.
   * This is the one place that translation happens — `STANCE_LABEL` is the
   * map, and nothing downstream translates it again.
   */
  contests: number;
}

function tally(findings: Finding[]): StanceCounts {
  return {
    supports: findings.filter((f) => f.stance === 'supports').length,
    neutral: findings.filter((f) => f.stance === 'neutral').length,
    contests: findings.filter((f) => f.stance === 'challenges').length,
  };
}

export function stanceOverall(evidence: Evidence): StanceCounts {
  return tally(evidence);
}

export function stanceByDimension(evidence: Evidence): Record<Dimension, StanceCounts> {
  return Object.fromEntries(
    DIMENSIONS.map((dimension) => [
      dimension,
      tally(evidence.filter((f) => f.dimension === dimension)),
    ]),
  ) as Record<Dimension, StanceCounts>;
}

export interface RecencyTick {
  id: string;
  date: string;
  cited: boolean;
}

/**
 * One tick per finding, ascending by date. The strip computes positions from
 * the returned min and max; there is no stored offset, because an offset baked
 * into the data cannot be re-scoped when the strip is drawn per dimension.
 *
 * `cited` is carried instead of `stance` deliberately — the strip doubles as a
 * picture of how much of the corpus the prose actually uses, and a second
 * variable across 47 ticks is unreadable.
 */
export function recencyTicks(
  evidence: Evidence,
  report: Report,
  dimension?: Dimension,
): RecencyTick[] {
  const cited = citedFindingIds(report);
  return evidence
    .filter((f) => (dimension ? f.dimension === dimension : true))
    .slice()
    .sort((a, b) => a.source_date.localeCompare(b.source_date))
    .map((f) => ({ id: f.id, date: f.source_date, cited: cited.has(f.id) }));
}

/**
 * Counts **findings, not unique URLs** — the question is how much of the
 * evidence comes from how few places. Sorted by count then domain name, so
 * ties are deterministic. No `share` field and no `limit` argument: the figure
 * takes its own head and tail.
 */
export function domainConcentration(evidence: Evidence): { domain: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const finding of evidence) {
    const domain = formatDomain(finding.source_url);
    counts.set(domain, (counts.get(domain) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain));
}

/**
 * Every `[n]` the report's **running prose** quotes — the summary and the five
 * dimension paragraphs.
 *
 * Deliberately not the surprises panel and not the capability cells. "Cited"
 * here means *the report says this out loud in a sentence*, because the one
 * consumer of the inverse is `EvidenceRail`, which hangs under a dimension's
 * paragraph and surfaces the findings that paragraph didn't quote. A citation
 * buried in a matrix cell is data the reader can look up, not prose that used
 * the finding, and counting it would shrink the rail's job to nothing.
 */
function reportCitationNumbers(report: Report): Set<number> {
  const numbers = new Set<number>();
  const add = (text: string) => {
    for (const n of extractCitationNumbers(text)) numbers.add(n);
  };

  add(report.summary.text);
  for (const dimension of DIMENSIONS) add(report.dimensions[dimension].prose.text);

  return numbers;
}

/**
 * The 23 uncited findings are `EvidenceRail`'s entire reason to exist —
 * findings the run verified and the report never quotes. The split is asserted
 * here so no page recounts it.
 */
export function citationCoverage(
  report: Report,
  evidence: Evidence,
): { cited: Set<number>; uncited: Set<number> } {
  const quoted = reportCitationNumbers(report);
  const cited = new Set<number>();
  const uncited = new Set<number>();

  for (const finding of evidence) {
    const n = Number(finding.id.replace('EV_', ''));
    if (quoted.has(n)) cited.add(n);
    else uncited.add(n);
  }

  return { cited, uncited };
}

export function citedFindingIds(report: Report): Set<string> {
  const quoted = reportCitationNumbers(report);
  return new Set([...quoted].map((n) => `EV_${String(n).padStart(2, '0')}`));
}

/**
 * D7's band. Strong / thin / contested are pure functions of counts,
 * confidence and stance — all already validated. Storing them would let the
 * band drift from the numbers printed beside it, and a stored editorial
 * sentence is a verdict wearing a description's clothes.
 *
 * Thresholds, stated once and nowhere else:
 *   strong    — confidence === 'solid'
 *   thin      — confidence === 'thin' || count < 3
 *   contested — contests >= 2 || contests / count >= 0.15
 *
 * A dimension may legitimately appear in two lists — PROBLEM and MONEY do —
 * and that is the honest result, not a bug to suppress. A dimension may also
 * land in none: DEMAND_SIGNALS sits at 1 contest in 7 (0.143), six thousandths
 * under the ratio threshold. That edge is deliberate and must not be rounded
 * up or patched — seven findings at mixed confidence with one challenger is
 * genuinely neither strong nor thin, and a band that forces all five
 * dimensions into a bucket is a scorecard.
 */
export function deriveEvidenceState(
  report: Report,
  evidence: Evidence,
): { strong: Dimension[]; thin: Dimension[]; contested: Dimension[] } {
  const stances = stanceByDimension(evidence);
  const strong: Dimension[] = [];
  const thin: Dimension[] = [];
  const contested: Dimension[] = [];

  for (const dimension of DIMENSIONS) {
    const { confidence } = report.dimensions[dimension];
    const count = evidence.filter((f) => f.dimension === dimension).length;
    const { contests } = stances[dimension];

    if (confidence === 'solid') strong.push(dimension);
    if (confidence === 'thin' || count < 3) thin.push(dimension);
    if (contests >= 2 || (count > 0 && contests / count >= 0.15)) contested.push(dimension);
  }

  return { strong, thin, contested };
}
