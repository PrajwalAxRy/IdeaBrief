import { AppBackdrop } from '@/components/layout/app-backdrop';
import { SegmentedControl } from '@/components/layout/segmented-control';
import { FieldworkBand } from '@/components/roadmap/fieldwork-band';
import { OpenQuestionsSection } from '@/components/roadmap/open-questions-section';
import { RoadmapExit } from '@/components/roadmap/roadmap-exit';
import { RoadmapTimeline } from '@/components/roadmap/roadmap-timeline';
import { TripwirePanel } from '@/components/roadmap/tripwire-panel';
import { MetaLine } from '@/components/ui/meta-line';
import { SectionLabel } from '@/components/ui/section-label';
import { ROADMAP, numberWord } from '@/lib/content/app';
import { getBrief, getRoadmap } from '@/lib/db/queries';
import { getEvidence } from '@/lib/db/queries';
import { fanOut, isOnAxis, planHorizon, planSpans } from '@/lib/run-plan';
import type { RoadmapStep } from '@/lib/schemas/roadmap';
import { isThinEvidence } from '@/lib/thin-evidence';

/**
 * The counts here are C5's and are **the same numbers the run header and the
 * page meta line carry** — `4 BUILD STEPS · 1 TRIPWIRE`, never "five build
 * steps". A15 asserts all three read the same.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [brief, roadmap] = await Promise.all([getBrief(slug), getRoadmap(slug)]);
  const steps = roadmap.steps.filter(isOnAxis).length;
  const description = `${numberWord(roadmap.open_questions.length)} open questions and a ${numberWord(steps).toLowerCase()}-step build plan.`;
  const title = `What to do next — ${brief.one_liner.value}`;
  return {
    title,
    description,
    openGraph: { title, description, images: ['/og/roadmap.png'] },
  };
}

export default async function RoadmapPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ thin?: string; broken?: string }>;
}) {
  const { slug } = await params;

  const { thin: thinParam, broken } = await searchParams;

  // Prototype-only QA affordance for exercising this route's segment-scoped
  // error boundary (roadmap/error.tsx) — see the P10 build log.
  if (broken === '1') {
    throw new Error('Prototype-only QA trigger for the roadmap error boundary (?broken=1).');
  }

  const [roadmap, brief, evidence] = await Promise.all([
    getRoadmap(slug),
    getBrief(slug),
    getEvidence(slug),
  ]);

  const isThin = thinParam === '1' || isThinEvidence(evidence);
  const accentPhase = isThin ? 'WHAT_WOULD_CHANGE_THIS_PLAN' : 'FIRST_THING_TO_BUILD';

  /* The edges are `fanOut`'s, partitioned by `isOnAxis` — no component recounts
     them, and there is no second name for the same arithmetic (C10). */
  const edgeMap = fanOut(roadmap);
  const edges = Object.fromEntries(
    Object.entries(edgeMap).map(([id, steps]) => [
      id,
      {
        governs: steps.filter(isOnAxis),
        tripwire: steps.find((step) => !isOnAxis(step)) ?? null,
      },
    ]),
  ) as Record<string, { governs: RoadmapStep[]; tripwire: RoadmapStep | null }>;

  const fanOutMax = Math.max(...Object.values(edgeMap).map((steps) => steps.length));

  /* Every count on this line is derived. `4 BUILD STEPS · 1 TRIPWIRE` is the
     same count the run header and the OG description carry (C5), so there is no
     second number to argue with. */
  const spans = planSpans(roadmap);
  const tripwires = roadmap.steps.filter((step) => !isOnAxis(step));
  /* The schema guarantees exactly one; `?? null` is for the type, not for a
     case the fixture can reach. */
  const tripwire = tripwires[0] ?? null;

  return (
    <>
      <AppBackdrop variant="roadmap" />

      <div className="ob-container ob-roadmap">
        <header className="ob-roadmap-head">
          <h1 className="ob-h1">{ROADMAP.h1}</h1>
          <p className="ob-lead">{ROADMAP.lead}</p>
          <MetaLine
            parts={[
              `${roadmap.open_questions.length} OPEN QUESTIONS`,
              `${spans.length} BUILD STEPS`,
              `${tripwires.length} TRIPWIRE${tripwires.length === 1 ? '' : 'S'}`,
              `${planHorizon(roadmap)} WEEKS`,
            ]}
          />
        </header>

        {/* A wrapper, not a primitive override: `.ob-segmented` is A2's and a
            primitive that hardcodes `position: sticky` is a primitive that
            cannot be used anywhere else. This is the half of R9 A4 did not own. */}
        <div className="ob-roadmap-nav">
          <SegmentedControl items={[...ROADMAP.nav]} />
        </div>

        <OpenQuestionsSection
          questions={roadmap.open_questions}
          edges={edges}
          fanOutMax={fanOutMax}
          brief={brief}
          slug={slug}
          fieldwork={<FieldworkBand />}
        >
          {/* §02, the time-scaled plan. On this route there is no separate
              headline, so per C17 the `02 BUILD ROADMAP` eyebrow **is** the
              section's `<h2>`; the four step names and the tripwire heading are
              the last five of the route's eleven `<h3>`s. Heading size is a
              class, heading level is structure. */}
          <section
            className="ob-roadmap-section"
            id="build-roadmap"
            aria-labelledby="build-roadmap-h"
          >
            <SectionLabel as="h2" id="build-roadmap-h" index="02">
              Build roadmap
            </SectionLabel>

            {/* Under thin evidence the tripwire renders *above* the axis and no
                lane takes the lead fill — `accentPhase` points off the axis, so
                `lead` is false for all four bars without a second branch. */}
            {isThin && tripwire ? <TripwirePanel step={tripwire} thin /> : null}

            <RoadmapTimeline
              spans={spans}
              horizon={planHorizon(roadmap)}
              accentPhase={accentPhase}
            />

            {!isThin && tripwire ? <TripwirePanel step={tripwire} /> : null}

            <RoadmapExit slug={slug} />
          </section>
        </OpenQuestionsSection>
      </div>
    </>
  );
}
