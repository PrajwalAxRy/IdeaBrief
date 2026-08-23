import type { Ambush, Phase, Roadmap, SetupItem } from './schemas/roadmap';

/**
 * The roadmap's journey model (A17, superseding A16's track/bar model).
 *
 * Geometry here is a fraction-to-percentage conversion and nothing more —
 * `Phase.start` / `Phase.end` are already fractions of the journey in the
 * fixture, so there is no layout decision being smuggled into the data layer.
 *
 * What this module does own is every number the page prints, so a count can
 * never be authored in two places and drift.
 */

export interface PhaseSpan {
  /** Left edge, as a percentage of the chart width. */
  leftPct: number;
  /** Width, as a percentage of the chart width. Open phases run to the edge. */
  widthPct: number;
  openEnded: boolean;
}

export function phaseSpan(phase: Phase): PhaseSpan {
  const openEnded = phase.end === null;
  const end = phase.end ?? 1;
  return {
    leftPct: phase.start * 100,
    widthPct: (end - phase.start) * 100,
    openEnded,
  };
}

/**
 * `"2–3 weeks"` · `"2 weeks"` · `null` when there is no queue to wait in.
 *
 * Formatted here rather than in the component, because nothing downstream of
 * the seam formats a number. An en dash, not a hyphen.
 */
export function waitLabel(item: SetupItem): string | null {
  if (item.wait_low === null || item.wait_high === null) return null;
  if (item.wait_low === item.wait_high) {
    return `${item.wait_low} ${item.wait_low === 1 ? 'week' : 'weeks'}`;
  }
  return `${item.wait_low}–${item.wait_high} weeks`;
}

export interface WaitTotal {
  low: number;
  high: number;
  /** How many setup items are a queue rather than an errand. */
  count: number;
}

/**
 * The headline insight, derived rather than asserted: how many weeks of this
 * plan belong to a carrier, a software vendor and the state.
 *
 * **After A17 this sums `setup` alone**, and the number went down — the two
 * phase-level waits it used to include (interview scheduling, waiting for real
 * cancellations to happen) are real, but they are not queues anyone can join
 * early, so counting them alongside a carrier registration blurred the one
 * actionable point. What is left is the number a founder can actually do
 * something about: start these now and they cost nothing, start them when you
 * need them and they cost two months.
 */
export function waitWeeks(roadmap: Roadmap): WaitTotal {
  return roadmap.setup.reduce<WaitTotal>(
    (acc, item) => {
      if (item.wait_low === null || item.wait_high === null) return acc;
      return {
        low: acc.low + item.wait_low,
        high: acc.high + item.wait_high,
        count: acc.count + 1,
      };
    },
    { low: 0, high: 0, count: 0 },
  );
}

/** Every ambush on the page, flattened — phases first, then setup. */
export function allAmbushes(roadmap: Roadmap): Ambush[] {
  return [...roadmap.phases, ...roadmap.setup].flatMap((owner) => owner.ambushes);
}

/**
 * The ambushes that came out of the research run and therefore carry a chip.
 * On this fixture there are exactly two, because the run's `PRACTICAL`
 * dimension is `thin` — which is the honest number, not a shortfall.
 */
export function citedAmbushes(roadmap: Roadmap): Ambush[] {
  return allAmbushes(roadmap).filter((ambush) => ambush.source === 'run');
}

/** Phase id → phase, for the chart's jump links. */
export function phaseById(roadmap: Roadmap, id: string): Phase | undefined {
  return roadmap.phases.find((phase) => phase.id === id);
}

/** The DOM id of a phase's section. One definition, used by both directions. */
export function phaseAnchor(phaseId: string): string {
  return `step-${phaseId.toLowerCase()}`;
}
