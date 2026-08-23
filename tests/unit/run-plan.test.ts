import { roadmapFixture } from '@/lib/fixtures/roadmap';
import {
  allAmbushes,
  citedAmbushes,
  phaseAnchor,
  phaseById,
  phaseSpan,
  waitLabel,
  waitWeeks,
} from '@/lib/run-plan';
import { describe, expect, it } from 'vitest';

const phase = (id: string) => {
  const found = phaseById(roadmapFixture, id);
  if (!found) throw new Error(`no phase ${id}`);
  return found;
};

const setup = (id: string) => {
  const found = roadmapFixture.setup.find((s) => s.id === id);
  if (!found) throw new Error(`no setup item ${id}`);
  return found;
};

describe('run-plan — the journey model', () => {
  /* The chart is one level deep and stays that way. Seven rows is where it
     stopped being readable last time; the schema caps it at six and this
     asserts the fixture actually spends five. */
  it('is five phases, in start order', () => {
    expect(roadmapFixture.phases).toHaveLength(5);
    const starts = roadmapFixture.phases.map((p) => p.start);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });

  it('gives every phase its own tint, since tint is how a bar names its section', () => {
    const tints = roadmapFixture.phases.map((p) => p.tint);
    expect(new Set(tints).size).toBe(tints.length);
  });

  /* The geometry is a fraction-to-percent conversion and nothing more. These
     are ratios, never pixels — the container width is not this module's
     business and has changed twice already. */
  it('phaseSpan converts fractions to percentages and runs open phases to the edge', () => {
    const dated = phaseSpan(phase('P2'));
    expect(dated.leftPct).toBeCloseTo(10, 6);
    expect(dated.widthPct).toBeCloseTo(20, 6);
    expect(dated.openEnded).toBe(false);

    const open = phaseSpan(phase('P4'));
    expect(open.openEnded).toBe(true);
    expect(open.leftPct + open.widthPct).toBeCloseTo(100, 6);
  });

  /**
   * The rule the whole model rests on, and the reason A17 moved the waits into
   * `setup`: a number may only appear on time the founder does not control. A
   * phase has no field to put one in, so this asserts the shape rather than the
   * value — if `wait_low` ever appears on a phase, the page has started lying
   * about build estimates again.
   */
  it('no phase carries a week number anywhere', () => {
    for (const p of roadmapFixture.phases) {
      expect(p).not.toHaveProperty('wait_low');
      expect(p).not.toHaveProperty('weeks_low');
      expect(JSON.stringify(p)).not.toMatch(/\b\d+\s*weeks?\b/i);
    }
  });

  it('collapses an equal range to a single number, and skips an errand entirely', () => {
    expect(waitLabel(setup('S4'))).toBe('2 weeks');
    expect(waitLabel(setup('S2'))).toBe('2–3 weeks');
    expect(waitLabel(setup('S1'))).toBeNull();
  });

  /* The headline insight is derived, never authored — three setup items are
     queues somebody else controls, summing to 6-8 weeks of calendar the
     founder cannot compress but can start early. */
  it('waitWeeks sums only the queues, and only from setup', () => {
    expect(waitWeeks(roadmapFixture)).toEqual({ low: 6, high: 8, count: 3 });
  });

  it('every setup item that claims a wait contributes to that sum', () => {
    const queues = roadmapFixture.setup.filter((s) => s.wait_low !== null);
    expect(queues).toHaveLength(waitWeeks(roadmapFixture).count);
  });

  /**
   * Exactly two ambushes cite, because the run's PRACTICAL dimension came back
   * thin with two verified findings. A third citation here means someone
   * invented research the run did not do.
   */
  it('exactly the run-sourced ambushes carry citations', () => {
    const cited = citedAmbushes(roadmapFixture);
    expect(cited.map((a) => a.id)).toEqual(['A10', 'A11']);
    expect(cited.map((a) => a.citation_id)).toEqual([46, 47]);
    for (const ambush of allAmbushes(roadmapFixture)) {
      expect(ambush.citation_id !== undefined).toBe(ambush.source === 'run');
    }
  });

  /* Not a quota — the opposite. A step with nothing surprising on it is an
     honest step, and forcing two per step is what manufactures filler. */
  it('leaves at least one phase and one setup item with no ambush at all', () => {
    expect(roadmapFixture.phases.filter((p) => p.ambushes.length === 0).length).toBeGreaterThan(0);
    expect(roadmapFixture.setup.filter((s) => s.ambushes.length === 0).length).toBeGreaterThan(0);
  });

  /* One definition of a phase's DOM id, used by the chart's jump link and the
     section's own attribute. Two spellings is a link that scrolls nowhere. */
  it('derives one anchor per phase', () => {
    expect(phaseAnchor('P3')).toBe('step-p3');
    const anchors = roadmapFixture.phases.map((p) => phaseAnchor(p.id));
    expect(new Set(anchors).size).toBe(anchors.length);
  });
});
