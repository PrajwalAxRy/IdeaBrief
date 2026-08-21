import { roadmapFixture } from '@/lib/fixtures/roadmap';
import { fanOut, isOnAxis, planHorizon, planSpans } from '@/lib/run-plan';
import { describe, expect, it } from 'vitest';

describe('run-plan — the roadmap week model', () => {
  it('planHorizon is 12 weeks', () => {
    expect(planHorizon(roadmapFixture)).toBe(12);
  });

  it('the four build spans tile W1-W2, W3-W6, W7-W11 and W12 onward', () => {
    const spans = planSpans(roadmapFixture);
    expect(spans).toHaveLength(4);
    expect(spans.map((s) => [s.step.id, s.startWeek, s.endWeek])).toEqual([
      ['S01', 1, 2],
      ['S02', 3, 6],
      ['S03', 7, 11],
      ['S04', 12, null],
    ]);
  });

  it('S04 is open-ended — duration_weeks is null and endWeek is null', () => {
    const s04 = planSpans(roadmapFixture).find((s) => s.step.id === 'S04');
    expect(s04?.step.duration_weeks).toBeNull();
    expect(s04?.endWeek).toBeNull();
    expect(s04?.openEnded).toBe(true);
  });

  it('isOnAxis excludes the tripwire and includes all four build steps', () => {
    const onAxis = roadmapFixture.steps.filter(isOnAxis).map((s) => s.id);
    expect(onAxis).toEqual(['S01', 'S02', 'S03', 'S04']);
    const tripwire = roadmapFixture.steps.filter((s) => s.kind === 'tripwire');
    expect(tripwire.map((s) => s.id)).toEqual(['S05']);
    expect(tripwire.filter(isOnAxis)).toEqual([]);
  });

  it('fanOut is Q01 2, Q02 1, Q03 1, Q04 2, Q05 1, Q06 3', () => {
    const counts = Object.fromEntries(
      Object.entries(fanOut(roadmapFixture)).map(([id, steps]) => [id, steps.length]),
    );
    expect(counts).toEqual({ Q01: 2, Q02: 1, Q03: 1, Q04: 2, Q05: 1, Q06: 3 });
  });

  it('sorting by fan-out descending, ties by rank, reproduces the priority order', () => {
    const edges = fanOut(roadmapFixture);
    const byFanOut = [...roadmapFixture.open_questions]
      .sort((a, b) => edges[b.id].length - edges[a.id].length || a.priority - b.priority)
      .map((q) => q.id);
    const byPriority = [...roadmapFixture.open_questions]
      .sort((a, b) => a.priority - b.priority)
      .map((q) => q.id);

    /* Not a coincidence to be preserved by hand — it is why FanOutMeter's
       caption and the card order read off the same data with no second
       source. */
    expect(byFanOut).toEqual(byPriority);
    expect(byPriority).toEqual(['Q06', 'Q01', 'Q04', 'Q02', 'Q05', 'Q03']);
  });
});
