import { ChangesLink, DependencyChips } from '@/components/roadmap/dependency-chip';
import { NotInItList } from '@/components/roadmap/not-in-it-list';
import { OpenQuestionCard } from '@/components/roadmap/open-question-card';
import { RoadmapProvider } from '@/components/roadmap/roadmap-context';
import { RoadmapTimeline } from '@/components/roadmap/roadmap-timeline';
import { ScriptBlock } from '@/components/roadmap/script-block';
import { roadmapFixture } from '@/lib/fixtures/roadmap';
import { Row, Section } from '../section';

export function RoadmapSection() {
  const firstQuestion = roadmapFixture.open_questions[0];
  const firstStep = roadmapFixture.steps[1]; // FIRST_THING_TO_BUILD — the one with a cut_list

  return (
    <Section
      id="roadmap"
      title="Roadmap"
      note="components/roadmap/* — wrapped in RoadmapProvider, same as the real /r/[slug]/roadmap page. Dependency chips scroll-jump and pulse within this section only."
    >
      <RoadmapProvider defaultExpandedId={firstQuestion.id}>
        <Row title="RoadmapTimeline (all 5 steps)">
          <div className="w-full max-w-prose">
            <RoadmapTimeline steps={roadmapFixture.steps} accentPhase="FIRST_THING_TO_BUILD" />
          </div>
        </Row>

        <Row title="OpenQuestionCard (expanded by default via defaultExpandedId)">
          <div className="w-full max-w-prose">
            <OpenQuestionCard question={firstQuestion} roadmap={roadmapFixture} />
          </div>
        </Row>

        <Row title="OpenQuestionCard (collapsed)">
          <div className="w-full max-w-prose">
            <OpenQuestionCard
              question={roadmapFixture.open_questions[1]}
              roadmap={roadmapFixture}
            />
          </div>
        </Row>

        <Row title="NotInItList">
          <div className="w-full max-w-prose">
            <NotInItList items={firstStep.cut_list ?? []} />
          </div>
        </Row>

        <Row title="ScriptBlock">
          <div className="w-full max-w-prose">
            <ScriptBlock
              lines={firstQuestion.script.lines}
              copyText={firstQuestion.script.lines.join('\n')}
            />
          </div>
        </Row>

        <Row title="DependencyChips / ChangesLink">
          <div className="flex w-full flex-col gap-3">
            <DependencyChips questionIds={firstStep.dependencies} />
            <ChangesLink phases={['FIRST_THING_TO_BUILD', 'THEN']} />
          </div>
        </Row>
      </RoadmapProvider>
    </Section>
  );
}
