import { briefFixture } from '../fixtures/brief';
import {
  closingLinesFixture,
  conversationFixture,
  dontKnowAcksFixture,
} from '../fixtures/conversation';
import { discardedFixture } from '../fixtures/discarded';
import { evidenceFixture } from '../fixtures/evidence';
import { reportFixture } from '../fixtures/report';
import { roadmapFixture } from '../fixtures/roadmap';
import { runFixture } from '../fixtures/run';
import { runEventsFixture } from '../fixtures/run-events';
import { type RunSummary, computeRunSummary } from '../run-summary';
import { type Brief, BriefSchema } from '../schemas/brief';
import { type Conversation, ConversationSchema } from '../schemas/conversation';
import {
  type Discarded,
  DiscardedSchema,
  type Evidence,
  EvidenceSchema,
} from '../schemas/evidence';
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
 *
 * `getConversation` and `getRunSummary` extend the P2 seam list (originally
 * getRun/getBrief/getEvidence/getReport/getRoadmap) — both additive,
 * non-breaking gap-fills needed by P3's Meta Line and P5's Define page. See
 * the P3 build log entry.
 */

async function requireSlug(slug: string): Promise<void> {
  if (!slug) throw new Error('getRun/getBrief/etc. require a non-empty slug');
}

/** `createRun` mints these: `crypto.randomUUID()` stripped and sliced to 10. */
const GENERATED_SLUG = /^[0-9a-f]{10}$/;

/**
 * **Does a run exist at this slug?** Later a `SELECT 1 FROM runs WHERE slug = $1`;
 * today the honest fixture equivalent.
 *
 * A14 added this because the invalid-run page — the surface the plan calls the
 * most important one in that phase, since the slug is the entire access model —
 * was **structurally unreachable**: nothing in the tree called `notFound()`, so
 * `/r/definitely-not-a-run` rendered the fixture run in full. An exit test that
 * navigates there and asserts an Obsidian 404 would have passed against a
 * fully-rendered report, which is the exact shape of a check that measures air.
 *
 * Two slugs are real: the canonical fixture's, and anything `createRun` could
 * have minted in this browser. The prototype has one run and no server-side
 * record of user-created ones, so shape is the only honest server-side answer
 * for the second class — a real backend replaces this whole body with a lookup
 * and the call site does not change.
 */
export async function runExists(slug: string): Promise<boolean> {
  if (!slug) return false;
  return slug === runFixture.slug || GENERATED_SLUG.test(slug);
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

/**
 * The 18 excerpts that failed verification — D15's trust claim.
 *
 * Wired in two places, and both are load-bearing: `app/r/[slug]/layout.tsx`
 * so `EvidenceProvider` can hold the records (the drawer opens on a discard
 * row), and `app/r/[slug]/sources/page.tsx` so the explorer can render them.
 */
export async function getDiscarded(slug: string): Promise<Discarded> {
  await requireSlug(slug);
  return DiscardedSchema.parse(discardedFixture);
}

export async function getReport(slug: string): Promise<Report> {
  await requireSlug(slug);
  return ReportSchema.parse(reportFixture);
}

export async function getRoadmap(slug: string): Promise<Roadmap> {
  await requireSlug(slug);
  return RoadmapSchema.parse(roadmapFixture);
}

/** Returns the scripted turns **and** the closing lines that answer anything
 *  said after the script ends — both Zod-parsed at the seam. */
export async function getConversation(slug: string): Promise<Conversation> {
  await requireSlug(slug);
  return ConversationSchema.parse({
    turns: conversationFixture,
    closing: closingLinesFixture,
    dontKnowAcks: dontKnowAcksFixture,
  });
}

/** Derived Meta Line stats — not a raw fixture, so no Zod schema of its own (see module doc). */
export async function getRunSummary(slug: string): Promise<RunSummary> {
  await requireSlug(slug);
  return computeRunSummary(evidenceFixture, runEventsFixture, discardedFixture);
}
