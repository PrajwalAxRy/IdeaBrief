import { AppBackdrop } from '@/components/layout/app-backdrop';
import { SegmentedControl } from '@/components/layout/segmented-control';
import { JourneyChart } from '@/components/roadmap/journey-chart';
import { MoneyBlock } from '@/components/roadmap/money-block';
import { OpenQuestions } from '@/components/roadmap/open-questions';
import { RoadmapExit } from '@/components/roadmap/roadmap-exit';
import { SetupList } from '@/components/roadmap/setup-list';
import { StepSection } from '@/components/roadmap/step-section';
import { TripwirePanel } from '@/components/roadmap/tripwire-panel';
import { MetaLine } from '@/components/ui/meta-line';
import { SectionLabel } from '@/components/ui/section-label';
import { ROADMAP } from '@/lib/content/app';
import { getBrief, getEvidence, getRoadmap } from '@/lib/db/queries';
import { waitWeeks } from '@/lib/run-plan';
import { isThinEvidence } from '@/lib/thin-evidence';

/**
 * The roadmap — rebuilt in A17.
 *
 * **The complaint this page answers.** The A16 version was accurate and
 * unreadable: fourteen bars on six tracks, six full-height question cards, a
 * photo band and a cost table, 7,200px tall at 1440. Every individual piece was
 * defensible and the whole thing bombarded a reader who is here for orientation,
 * not execution.
 *
 * **The shape now.** Five steps, one row each, on a light card the eye can
 * actually track across. Clicking a bar scrolls to that step's section rather
 * than swapping a panel in place, so the URL-less navigation still matches where
 * the reader is and Back still works. The admin came off the chart into a flat
 * list. The questions came down to a question and a consequence. Nothing was
 * added.
 *
 * **What it costs, in honesty.** The one thing genuinely lost is the fieldwork
 * detail — who to ask, where to find them, how many conversations. That was
 * real, and it is gone on purpose: this is the overview that makes someone think
 * critically about the journey, and they do the deep dive themselves.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [brief, roadmap] = await Promise.all([getBrief(slug), getRoadmap(slug)]);
  const wait = waitWeeks(roadmap);
  const description = `${roadmap.phases.length} steps, ${roadmap.open_questions.length} open questions, and the ${wait.low}–${wait.high} weeks of waiting nobody warns you about.`;
  const title = `What happens next — ${brief.one_liner.value}`;
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
  const wait = waitWeeks(roadmap);

  return (
    <>
      <AppBackdrop variant="roadmap" />

      <div className="ob-container ob-roadmap">
        <header className="ob-roadmap-head">
          <h1 className="ob-h1">{ROADMAP.h1}</h1>
          <p className="ob-lead">{ROADMAP.lead}</p>
          {/* The lesson, composed from the setup items rather than typed, so
              the number can never drift from the rows it sums. */}
          <p className="ob-roadmap-crit">{ROADMAP.journey.criticalPath(wait.low, wait.high)}</p>
          <MetaLine
            parts={[
              `${roadmap.phases.length} STEPS`,
              `${roadmap.open_questions.length} OPEN QUESTIONS`,
              `${wait.low}–${wait.high} WEEKS OF WAITING`,
            ]}
          />
        </header>

        {/* A wrapper, not a primitive override: `.ob-segmented` is A2's and a
            primitive that hardcodes `position: sticky` is a primitive that
            cannot be used anywhere else. */}
        <div className="ob-roadmap-nav">
          <SegmentedControl items={[...ROADMAP.nav]} />
        </div>

        <section className="ob-roadmap-section" id="journey" aria-labelledby="journey-h">
          <SectionLabel as="h2" id="journey-h" index="01">
            The journey
          </SectionLabel>
          <JourneyChart phases={roadmap.phases} milestones={roadmap.milestones} />
        </section>

        <section className="ob-roadmap-section" id="steps" aria-labelledby="steps-h">
          <SectionLabel as="h2" id="steps-h" index="02">
            The five steps
          </SectionLabel>
          <div className="ob-step-stack">
            {roadmap.phases.map((phase, index) => (
              <StepSection key={phase.id} phase={phase} index={index} />
            ))}
          </div>
        </section>

        <section
          className="ob-roadmap-section"
          id="open-questions"
          aria-labelledby="open-questions-h"
        >
          <SectionLabel as="h2" id="open-questions-h" index="03">
            {ROADMAP.questions.label}
          </SectionLabel>
          <p className="ob-roadmap-sublead">{ROADMAP.questions.lead}</p>
          <OpenQuestions questions={roadmap.open_questions} brief={brief} slug={slug} />
        </section>

        <section className="ob-roadmap-section" id="setup" aria-labelledby="setup-h">
          <SectionLabel as="h2" id="setup-h" index="04">
            {ROADMAP.setup.label}
          </SectionLabel>
          <p className="ob-roadmap-sublead">{ROADMAP.setup.lead}</p>
          <SetupList items={roadmap.setup} />
          <p className="ob-setup-total">{ROADMAP.setup.total(wait.low, wait.high, wait.count)}</p>
        </section>

        <section className="ob-roadmap-section" id="money" aria-labelledby="money-h">
          <SectionLabel as="h2" id="money-h" index="05">
            {ROADMAP.money.label}
          </SectionLabel>
          <MoneyBlock money={roadmap.money} />
        </section>

        <TripwirePanel tripwires={roadmap.tripwires} thin={isThin} />

        <RoadmapExit slug={slug} />
      </div>
    </>
  );
}
