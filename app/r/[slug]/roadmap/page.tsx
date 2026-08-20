import { BackLink } from '@/components/layout/back-link';
import { PageContainer } from '@/components/layout/page-container';
import { SegmentedControl } from '@/components/layout/segmented-control';
import { OpenQuestionCard } from '@/components/roadmap/open-question-card';
import { RoadmapProvider } from '@/components/roadmap/roadmap-context';
import { RoadmapTimeline } from '@/components/roadmap/roadmap-timeline';
import { CopyButton } from '@/components/ui/copy-button';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { Divider } from '@/components/ui/divider';
import { SectionLabel } from '@/components/ui/section-label';
import { getBrief, getEvidence, getRoadmap } from '@/lib/db/queries';
import type { OpenQuestion } from '@/lib/schemas/roadmap';
import { isThinEvidence } from '@/lib/thin-evidence';

/** "Copy all scripts" — the whole interview guide in one paste, question headings only, still no markdown. */
function buildAllScriptsText(questions: OpenQuestion[]): string {
  return questions
    .map(
      (question) =>
        `Q${question.number}. ${question.question}\n${question.script.lines.join('\n')}`,
    )
    .join('\n\n');
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

  // Same prototype-only QA affordance as /validate?thin=1 (see the P8 build log) — proves the
  // thin-evidence variant without a second, hand-maintained fixture that could drift.
  const isThin = thinParam === '1' || isThinEvidence(evidence);
  const accentPhase = isThin ? 'WHAT_WOULD_CHANGE_THIS_PLAN' : 'FIRST_THING_TO_BUILD';
  const firstQuestionId = roadmap.open_questions[0].id;
  const allScriptsText = buildAllScriptsText(roadmap.open_questions);

  return (
    <PageContainer variant="app" className="py-16">
      <div className="mx-auto flex w-full max-w-roadmap flex-col gap-10">
        <BackLink href={`/r/${slug}/validate`}>Back to the report</BackLink>

        <header className="flex flex-col gap-3">
          <DisplayHeadline as="h1" muted="What to do" bright="next." />
          <p style={{ color: 'var(--text-body)' }}>{brief.one_liner.value}</p>
        </header>

        <RoadmapProvider defaultExpandedId={firstQuestionId}>
          <SegmentedControl
            items={[
              { id: 'open-questions', label: 'Open questions' },
              { id: 'build-roadmap', label: 'Build roadmap' },
            ]}
          />

          <section id="open-questions" className="roadmap-section flex flex-col gap-6">
            <SectionLabel>Open questions</SectionLabel>
            <p style={{ color: 'var(--text-body)' }}>
              {roadmap.open_questions.length < 4
                ? `Only ${roadmap.open_questions.length} things were genuinely unresolved after the research.`
                : `${roadmap.open_questions.length} things the web can't tell you. Ordered by how much the answer would change your plan.`}
            </p>
            {isThin && (
              <p style={{ color: 'var(--text-body)' }}>
                The web didn&rsquo;t have much on this, which makes these conversations the fastest
                way to learn anything real.
              </p>
            )}

            <div className="flex flex-col gap-4">
              {roadmap.open_questions.map((question) => (
                <OpenQuestionCard key={question.id} question={question} roadmap={roadmap} />
              ))}
            </div>

            <div className="flex justify-end">
              <CopyButton variant="button" label="Copy all scripts" text={allScriptsText} />
            </div>
          </section>

          <Divider />

          <section id="build-roadmap" className="roadmap-section flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <SectionLabel>Build roadmap</SectionLabel>
              <p style={{ color: 'var(--text-body)' }}>
                How to actually make this — specific to your idea, and honest about what to leave
                out.
              </p>
            </div>
            <RoadmapTimeline steps={roadmap.steps} accentPhase={accentPhase} />
          </section>
        </RoadmapProvider>
      </div>
    </PageContainer>
  );
}
