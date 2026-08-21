import { buildScriptText } from '@/lib/content/app';
import { evidenceFixture } from '@/lib/fixtures/evidence';
import { roadmapFixture } from '@/lib/fixtures/roadmap';
import { fanOut, isOnAxis } from '@/lib/run-plan';
import { BriefSchema } from '@/lib/schemas/brief';
import { describe, expect, it } from 'vitest';

const questions = roadmapFixture.open_questions;

/**
 * `RoadmapSchema.refine` checks step → question ids and nothing else. A typo'd
 * `citation_id` renders `[99]` and falls silently through `CitationChip`'s
 * not-found branch — the sort of failure that ships. These are the checks that
 * catch it.
 */
describe('roadmap integrity', () => {
  it('every find_them citation_id resolves to a real finding', () => {
    const ids = new Set(evidenceFixture.map((finding) => finding.id));
    for (const question of questions) {
      for (const item of question.find_them) {
        if (item.citation_id === undefined) continue;
        expect(ids.has(`EV_${String(item.citation_id).padStart(2, '0')}`)).toBe(true);
      }
    }
  });

  it('every link item carries a citation and no item carries a url', () => {
    for (const question of questions) {
      for (const item of question.find_them) {
        if (item.type === 'link') expect(item.citation_id).toBeDefined();
        /* There is no `url` on the schema and none in the fixture: the href is
           derived from the cited finding, so the two can never disagree. */
        expect(item).not.toHaveProperty('url');
      }
    }
  });

  it('every non-null brief_field is a key of BriefSchema', () => {
    const keys = new Set(Object.keys(BriefSchema.shape));
    for (const question of questions) {
      if (question.brief_field === null) continue;
      expect(keys.has(question.brief_field)).toBe(true);
    }
  });

  it('priority is a permutation of 1..6 and equals C6', () => {
    const byId = Object.fromEntries(questions.map((q) => [q.id, q.priority]));
    expect(byId).toEqual({ Q06: 1, Q01: 2, Q04: 3, Q02: 4, Q05: 5, Q03: 6 });
    expect([...questions.map((q) => q.priority)].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('fan-out computed from the fixture edges equals C6', () => {
    const counts = Object.fromEntries(
      Object.entries(fanOut(roadmapFixture)).map(([id, steps]) => [id, steps.length]),
    );
    expect(counts).toEqual({ Q01: 2, Q02: 1, Q03: 1, Q04: 2, Q05: 1, Q06: 3 });
  });

  /**
   * The assertion that keeps `FanOutMeter` and the card order honest without a
   * second source of truth: if these two ever disagree, the meter is showing a
   * weight the ordering doesn't act on.
   */
  it('sorting by fan-out desc, ties by priority, reproduces the authored order', () => {
    const edges = fanOut(roadmapFixture);
    const bySort = [...questions]
      .sort((a, b) => edges[b.id].length - edges[a.id].length || a.priority - b.priority)
      .map((q) => q.id);
    const byPriority = [...questions].sort((a, b) => a.priority - b.priority).map((q) => q.id);
    expect(bySort).toEqual(byPriority);
    expect(byPriority).toEqual(['Q06', 'Q01', 'Q04', 'Q02', 'Q05', 'Q03']);
  });

  it('Q01 and Q04 are the two the tripwire also names', () => {
    const edges = fanOut(roadmapFixture);
    const withTripwire = Object.entries(edges)
      .filter(([, steps]) => steps.some((step) => !isOnAxis(step)))
      .map(([id]) => id)
      .sort();
    expect(withTripwire).toEqual(['Q01', 'Q04']);
  });

  it('buildScriptText numbers the lines and the fixture does not', () => {
    for (const question of questions) {
      for (const line of question.script.lines) {
        /* Presentation in a data field: un-restylable, wrong the moment a line
           is inserted, and needing a strip before any other use. */
        expect(line).not.toMatch(/^\d+\.\s/);
      }
      expect(buildScriptText(question.script.lines).startsWith('1. ')).toBe(true);
    }
  });

  it('Q04 links to assumptions and ships the three-question survey', () => {
    const q04 = questions.find((q) => q.id === 'Q04');
    expect(q04?.brief_field).toBe('assumptions');
    expect(q04?.survey?.questions).toHaveLength(3);
    expect(q04?.survey?.note.startsWith('Three-question')).toBe(true);
    for (const question of q04?.survey?.questions ?? []) {
      expect(question.options.length).toBeGreaterThan(0);
    }
  });
});
