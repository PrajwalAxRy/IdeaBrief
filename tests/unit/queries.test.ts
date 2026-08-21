import {
  getBrief,
  getDiscarded,
  getEvidence,
  getReport,
  getRoadmap,
  getRun,
  runExists,
} from '@/lib/db/queries';
import { describe, expect, it } from 'vitest';

const SLUG = 'sms-rebooking-4f2a';

describe('lib/db/queries — the fake-but-typed seam', () => {
  it('every query is async and resolves a Zod-validated, fully typed object', async () => {
    const [run, brief, evidence, report, roadmap] = await Promise.all([
      getRun(SLUG),
      getBrief(SLUG),
      getEvidence(SLUG),
      getReport(SLUG),
      getRoadmap(SLUG),
    ]);

    expect(run.status).toBe('complete');
    expect(brief.one_liner.status).toBe('filled');
    expect(evidence).toHaveLength(47);

    // No `any`, no optional-chaining guesswork needed at the call site.
    expect(report.summary.text.length).toBeGreaterThan(0);
    expect(report.dimensions.PRACTICAL.confidence).toBe('thin');
    expect(report.competitors[2].moat).toBeUndefined();

    expect(roadmap.open_questions).toHaveLength(6);
    expect(roadmap.steps).toHaveLength(5);
  });

  it('getDiscarded resolves 18 Zod-validated records', async () => {
    const discarded = await getDiscarded(SLUG);
    expect(discarded).toHaveLength(18);
    expect(discarded[0].id).toBe('DS_01');
    expect(discarded[0].discard_reason).toBe('excerpt_not_found_on_page');
    await expect(getDiscarded('')).rejects.toThrow();
  });

  it('rejects an empty slug rather than silently returning fixture data', async () => {
    await expect(getRun('')).rejects.toThrow();
  });

  /**
   * A14 added `runExists` because the invalid-run page — the surface that
   * exists precisely because the slug is the whole access model — was
   * unreachable: nothing called `notFound()`, so every slug rendered the
   * fixture run in full. These assertions are what keep it reachable, because
   * the exit test that navigates to `/r/definitely-not-a-run` would otherwise
   * pass against a fully-rendered report.
   */
  describe('runExists — what makes the invalid-run page reachable', () => {
    it('accepts the canonical fixture slug', async () => {
      await expect(runExists(SLUG)).resolves.toBe(true);
    });

    it('accepts a slug `createRun` could have minted (10 lowercase hex)', async () => {
      await expect(runExists('4f2ab9c1de')).resolves.toBe(true);
      await expect(runExists('0123456789')).resolves.toBe(true);
    });

    it('rejects a truncated, mistyped or invented slug', async () => {
      await expect(runExists('definitely-not-a-run')).resolves.toBe(false);
      await expect(runExists('sms-rebooking')).resolves.toBe(false);
      await expect(runExists('4f2ab9c1d')).resolves.toBe(false);
      await expect(runExists('4f2ab9c1def')).resolves.toBe(false);
      await expect(runExists('4F2AB9C1DE')).resolves.toBe(false);
      await expect(runExists('')).resolves.toBe(false);
    });
  });
});
