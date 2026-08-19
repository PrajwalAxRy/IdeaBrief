import { briefFixture } from '../fixtures/brief';
import { evidenceFixture } from '../fixtures/evidence';
import { reportFixture } from '../fixtures/report';
import { roadmapFixture } from '../fixtures/roadmap';
import { runFixture } from '../fixtures/run';
import { type Brief, BriefSchema } from '../schemas/brief';
import { type Evidence, EvidenceSchema } from '../schemas/evidence';
import { type Report, ReportSchema } from '../schemas/report';
import { type Roadmap, RoadmapSchema } from '../schemas/roadmap';
import { type Run, RunSchema } from '../schemas/run';

/**
 * The prototype's only seam into "the database" — every function here is
 * `async` and Zod-parses before returning, exactly like a real Postgres
 * read would need to validate an LLM-produced payload. Call sites must never
 * know these are fake; no component may import from `lib/fixtures/`
 * directly.
 *
 * The prototype only ever has the one fixture run, so every function
 * ignores `slug` beyond validating it's a non-empty string. Swapping these
 * bodies for real Postgres reads later is a one-file change.
 */

async function requireSlug(slug: string): Promise<void> {
  if (!slug) throw new Error('getRun/getBrief/etc. require a non-empty slug');
}

export async function getRun(slug: string): Promise<Run> {
  await requireSlug(slug);
  return RunSchema.parse(runFixture);
}

export async function getBrief(slug: string): Promise<Brief> {
  await requireSlug(slug);
  return BriefSchema.parse(briefFixture);
}

export async function getEvidence(slug: string): Promise<Evidence> {
  await requireSlug(slug);
  return EvidenceSchema.parse(evidenceFixture);
}

export async function getReport(slug: string): Promise<Report> {
  await requireSlug(slug);
  return ReportSchema.parse(reportFixture);
}

export async function getRoadmap(slug: string): Promise<Roadmap> {
  await requireSlug(slug);
  return RoadmapSchema.parse(roadmapFixture);
}
