import { getBrief, getEvidence, getReport, getRoadmap, getRun } from '@/lib/db/queries';
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

  it('rejects an empty slug rather than silently returning fixture data', async () => {
    await expect(getRun('')).rejects.toThrow();
  });
});
