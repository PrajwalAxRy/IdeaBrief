import { evidenceFixture } from '@/lib/fixtures/evidence';
import { roadmapFixture } from '@/lib/fixtures/roadmap';
import { allAmbushes, waitWeeks } from '@/lib/run-plan';
import { BriefSchema } from '@/lib/schemas/brief';
import { MAX_UNIVERSAL_AMBUSHES } from '@/lib/schemas/roadmap';
import { describe, expect, it } from 'vitest';

const questions = roadmapFixture.open_questions;
const findingIds = new Set(evidenceFixture.map((finding) => finding.id));
const resolves = (citation: number) => findingIds.has(`EV_${String(citation).padStart(2, '0')}`);

/**
 * `RoadmapSchema.refine` checks structural relations — ids are unique, bands
 * are defined, a wait is a pair. It cannot check that a `citation_id` points at
 * a finding that exists, because the schema has no access to the evidence
 * fixture. A typo'd citation renders `[99]` and falls silently through
 * `CitationChip`'s not-found branch — the sort of failure that ships. These are
 * the checks that catch it, plus the content rules no schema can express.
 */
describe('roadmap integrity', () => {
  /**
   * The citation rule for ambushes, end to end: a run-sourced ambush must point
   * at a finding that exists AND that finding must actually be from the
   * PRACTICAL dimension. Citing a MONEY finding for a lead-time warning would
   * resolve, render a chip, and be wrong.
   */
  it('run-sourced ambushes cite real PRACTICAL findings', () => {
    const practical = new Set(
      evidenceFixture.filter((f) => f.dimension === 'PRACTICAL').map((f) => f.id),
    );
    const cited = allAmbushes(roadmapFixture).filter((a) => a.source === 'run');
    expect(cited.length).toBeGreaterThan(0);
    for (const ambush of cited) {
      const id = `EV_${String(ambush.citation_id).padStart(2, '0')}`;
      expect(resolves(ambush.citation_id as number)).toBe(true);
      expect(practical.has(id)).toBe(true);
    }
  });

  it('holds the universal-ambush cap, which is what keeps the page off the listicle path', () => {
    const universal = allAmbushes(roadmapFixture).filter((a) => a.source === 'universal');
    expect(universal.length).toBeLessThanOrEqual(MAX_UNIVERSAL_AMBUSHES);
  });

  it('every brief_field is a real key of the brief schema', () => {
    const keys = new Set(Object.keys(BriefSchema.shape));
    for (const question of questions) {
      if (question.brief_field === null) continue;
      expect(keys.has(question.brief_field)).toBe(true);
    }
  });

  /**
   * The interview script and survey were deleted in A16; the fieldwork detail
   * (who to ask, where to find them, how many) in A17. Both were deliberate,
   * and both are asserted rather than trusted, because "put the script back" is
   * exactly the sort of well-meaning restoration that would re-inflate the
   * page. A question here is a question and a consequence, and nothing else.
   */
  it('carries no fieldwork brief on an open question', () => {
    for (const question of questions) {
      for (const gone of ['script', 'survey', 'what_you_learn', 'ask', 'find_them', 'how_many']) {
        expect(question).not.toHaveProperty(gone);
      }
    }
  });

  /**
   * Every question states a consequence, not a restatement. The cheap failure
   * mode of a two-line question card is a `why_it_matters` that says "this is
   * important to know" — long enough to look written, empty enough to skip.
   */
  it('every question says what changes depending on the answer', () => {
    for (const question of questions) {
      expect(question.question.endsWith('?')).toBe(true);
      expect(question.why_it_matters.length).toBeGreaterThan(60);
      expect(question.why_it_matters).not.toBe(question.question);
    }
  });

  it('milestones describe an outcome, never a date or a week', () => {
    for (const milestone of roadmapFixture.milestones) {
      expect(milestone.label).not.toMatch(/\bweek\b|\bW\d/i);
      expect(milestone.proof.length).toBeGreaterThan(20);
    }
  });

  /**
   * A17's central content rule, asserted rather than trusted: **the only week
   * numbers on this page are queues somebody else controls.** A phase is work
   * the founder does, its duration is unknowable, and a number printed on it is
   * a lie that turns into shame when it slips. The schema gives a phase no
   * field to hold one — this catches the prose route, which is how it would
   * actually come back.
   */
  it('no phase mentions a duration in its prose', () => {
    for (const phase of roadmapFixture.phases) {
      const prose = `${phase.summary} ${phase.starts_when} ${phase.tagline}`;
      expect(prose).not.toMatch(/\b\d+\s*(–|-|to\s)?\s*\d*\s*(week|month|day)s?\b/i);
    }
  });

  /* Every wait belongs to somebody with a name — a carrier, a vendor, a filing
     office. A queue with no owner is an estimate wearing a queue's clothes. */
  it('every setup wait belongs to a queue the founder cannot compress', () => {
    const queues = roadmapFixture.setup.filter((item) => item.wait_low !== null);
    expect(queues.length).toBe(waitWeeks(roadmapFixture).count);
    for (const item of queues) {
      expect(`${item.detail} ${item.when}`.length).toBeGreaterThan(40);
    }
  });

  /* Bands replaced prices so the page cannot rot. The two sanctioned places a
     real figure may appear are the legend, which defines what a band means, and
     the calibration line, whose number IS the insight. */
  it('no cost item quotes a price', () => {
    for (const item of roadmapFixture.money.items) {
      expect(`${item.label} ${item.when}`).not.toMatch(/\$\d/);
    }
  });
});
