import {
  VALIDATE_SESSION,
  VALIDATE_STAGE_MS,
  VALIDATE_VERIFY_MS,
  validateTotalMs,
} from '@/lib/content/landing';
import { describe, expect, it } from 'vitest';

const { chart, competitors, rows, stats } = VALIDATE_SESSION;

describe('validate session — timing', () => {
  it('sums every stage into the total, so one pass is one number', () => {
    expect(validateTotalMs).toBe(
      VALIDATE_STAGE_MS.wake +
        VALIDATE_STAGE_MS.model +
        VALIDATE_STAGE_MS.field +
        VALIDATE_STAGE_MS.verify,
    );
    for (const ms of Object.values(VALIDATE_STAGE_MS)) expect(ms).toBeGreaterThan(0);
  });

  it('runs long enough to read and short enough to sit through', () => {
    /* Pillar 01's session lands at ~14s. Pillar 02 used to run shorter than
       that on the theory that it's denser per beat, but the scan card needs
       five real seconds to read as genuinely working the field rather than a
       flicker, so this one now runs well past it. Both still play once and
       rest, so neither is a loop the visitor has to escape. */
    expect(validateTotalMs).toBeGreaterThan(9_000);
    expect(validateTotalMs).toBeLessThan(19_000);
  });

  it('opens on a frame with no data, so the panel is an instrument first', () => {
    expect(VALIDATE_STAGE_MS.wake).toBeGreaterThan(0);
    expect(VALIDATE_STAGE_MS.wake).toBeLessThan(VALIDATE_STAGE_MS.model);
  });

  it('fits the settle and every row inside the verify stage', () => {
    /* The rows resolve one at a time INSIDE `verify`. If the stage ends first
       the card rests mid-sequence, which is the one state it must never hold —
       and `verify` now runs BEFORE `field`, so an overrun would be cut off by
       the competitors landing rather than by the scene coming to rest. */
    const needed = VALIDATE_VERIFY_MS.settle + (rows.length - 1) * VALIDATE_VERIFY_MS.row;
    expect(needed).toBeLessThan(VALIDATE_STAGE_MS.verify);
  });

  it('lets the stack settle before the first row resolves', () => {
    expect(VALIDATE_VERIFY_MS.settle).toBeGreaterThan(VALIDATE_VERIFY_MS.row);
  });
});

describe('validate session — shape', () => {
  it('ends the series on the number the callout claims', () => {
    expect(chart.series.length).toBeGreaterThan(1);
    expect(Math.max(...chart.series)).toBe(chart.series.at(-1));
  });

  it('draws the projection against a baseline of the same length', () => {
    expect(chart.baseline).toHaveLength(chart.series.length);
    /* The baseline is the do-nothing case, so it must never outrun the
       projection — the whole point of drawing it is the gap. */
    for (const [i, v] of chart.baseline.entries()) {
      expect(v).toBeLessThanOrEqual(chart.series[i] ?? 0);
    }
  });

  it('opens the cone around the final value rather than above or below it', () => {
    expect(chart.cone.high).toBeGreaterThan(1);
    expect(chart.cone.low).toBeLessThan(1);
    expect(chart.cone.low).toBeGreaterThan(0);
  });

  it('pairs every competitor with the row it collapses into', () => {
    /* `Field` maps card `i` onto row `i`. An extra competitor would animate
       into a row that does not exist. */
    expect(competitors.length).toBeGreaterThanOrEqual(2);
    expect(rows.length).toBe(competitors.length + 1);
  });

  it('gives every competitor the same metric labels in the same order', () => {
    /* Three cards side by side are a COMPARISON, and only if they answer the
       same questions in the same order — otherwise they are three unrelated
       profiles that happen to be adjacent, and the reader has to re-orient at
       each one. A card missing a row would also come up short against the
       fixed pane height and silently clip its own last line. */
    const shape = competitors[0]?.metrics.map((m) => m.label).join('|');
    expect(shape).toBeTruthy();
    for (const c of competitors) {
      expect(c.metrics.map((m) => m.label).join('|')).toBe(shape);
      for (const m of c.metrics) expect(m.value.trim()).not.toBe('');
    }
  });

  it('keeps every coverage bar inside its track', () => {
    for (const c of competitors) {
      expect(c.coverage).toBeGreaterThan(0);
      expect(c.coverage).toBeLessThanOrEqual(1);
    }
  });

  it('has no empty text anywhere', () => {
    const strings = [
      chart.label,
      chart.caption,
      VALIDATE_SESSION.footnote,
      ...chart.ticks,
      ...stats.map((s) => s.label),
      ...competitors.flatMap((c) => [c.name, c.since, c.price, c.gap]),
      ...rows.flatMap((r) => [r.tag, r.text]),
    ];
    for (const s of strings) expect(s.trim()).not.toBe('');
  });
});

describe('validate session — what the card is allowed to claim', () => {
  /* This block is the one deliberate exception to executive_summary.md in the
     repo, and it is scoped to this card — a landing surface, agreed while the
     real Validate page is still being built. These are the guardrails that keep
     the exception from widening. */

  it('never resolves every assumption, so it cannot read as a verdict', () => {
    /* Four identical blue chips in a column would claim a certainty the product
       refuses to manufacture. At least one claim always goes to the roadmap. */
    const open = rows.filter((r) => r.state === 'open');
    expect(open.length).toBeGreaterThanOrEqual(1);
    expect(rows.some((r) => r.state === 'verified')).toBe(true);
  });

  it('sends the unresolved claim somewhere rather than dropping it', () => {
    for (const row of rows) {
      if (row.state === 'open') expect(row.note?.trim()).toBeTruthy();
    }
  });

  it('keeps the dental thread continuous with the verification section', () => {
    /* Pillar 02 and the section below it are one narrative. The shared page
       count is what stops them reading as two unrelated demos. */
    /* Matched on the NUMBERS, not the phrasing — the caption has to fit on one
       line beside the status and the replay control, so the wording is free to
       get shorter. `31` and `9` are what tie this scene to `EVIDENCE_DEMO` and
       `VERIFICATION_COUNTERS` below it, and those are not free to change. */
    expect(VALIDATE_SESSION.footnote).toMatch(/\b31 pages\b/);
    expect(VALIDATE_SESSION.footnote).toMatch(/\b9 discarded\b/);
  });

  it('names no real company', () => {
    /* Invented names only. A real competitor named next to an invented price
       and an invented weakness is a factual claim about someone else's product. */
    const names = competitors.map((c) => c.name.toLowerCase()).join(' ');
    for (const real of ['weave', 'nexhealth', 'dentrix', 'g2', 'basecamp', 'reddit']) {
      expect(names).not.toContain(real);
    }
  });
});
