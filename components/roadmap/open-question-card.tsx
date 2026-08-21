'use client';

import { FanOutMeter } from '@/components/figures/fan-out-meter';
import { ROADMAP, buildScriptText } from '@/lib/content/app';
import type { OpenQuestion, RoadmapStep } from '@/lib/schemas/roadmap';
import type { ReactNode } from 'react';
import { ChangesLink } from './dependency-chip';
import { FindThemRow } from './find-them-row';
import { useRoadmapNav } from './roadmap-context';
import { ScriptBlock } from './script-block';
import { SurveyBlock } from './survey-block';

interface OpenQuestionCardProps {
  question: OpenQuestion;
  /** The build steps this question governs, already partitioned by `isOnAxis`. */
  governs: RoadmapStep[];
  tripwire: RoadmapStep | null;
  /** The highest total fan-out in the run — the meter's denominator. */
  fanOutMax: number;
  /** D10: this question was promoted because the user marked its brief field unknown. */
  promoted?: { label: string };
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <p className="ob-oq-label">{label}</p>
      <div>{children}</div>
    </>
  );
}

/**
 * The product's most distinctive component — a labelled grid, not prose.
 *
 * **It is a hairline-ruled row, not a card.** No radius, no border box, no
 * `Card` import. Expanded, the surface fill bleeds 24px past the text column
 * while the rules stay put.
 *
 * **R15(b):** the `QUESTION` row *is* the trigger, and it renders collapsed and
 * expanded in the same 160px-labelled grid as every other row. Expanding never
 * removes the landmark, and the question is no longer printed twice on an open
 * card. The collapsible region begins at `WHY IT MATTERS`.
 *
 * **R15(a):** `nowrap` + ellipsis is deleted. Two lines at 23px in a 760px
 * column is ~150 characters, so all six fixture questions (90–140) render
 * whole; the clamp is a guard against a future 200-character question, not a
 * routine truncation.
 *
 * **The mono index is the id, not the ordinal.** `DependencyChip` addresses
 * questions by id, `Copy all scripts` heads each block with the id, and the
 * stack sorts by priority — a positional index would drift against all three.
 */
export function OpenQuestionCard({
  question,
  governs,
  tripwire,
  fanOutMax,
  promoted,
}: OpenQuestionCardProps) {
  const { isExpanded, setQuestionOpen, isPulsing, primaryQuestionId } = useRoadmapNav();
  const expanded = isExpanded(question.id);
  const pulsing = isPulsing(`question-${question.id}`);
  const bodyId = `oq-body-${question.id}`;

  const caption = tripwire
    ? ROADMAP.fanOut.stepsWithTripwire(governs.length)
    : ROADMAP.fanOut.steps(governs.length);

  const changesPhases = [...governs, ...(tripwire ? [tripwire] : [])].map((step) => step.phase);

  return (
    <article
      id={`question-${question.id}`}
      className="ob-oq"
      data-expanded={expanded}
      data-pulse={pulsing ? '' : undefined}
    >
      <div className="ob-oq-grid">
        <Row label={ROADMAP.labels.question}>
          {/* The accordion pattern: the button lives inside the heading, never
              the other way round. */}
          <h3>
            <button
              type="button"
              className="ob-oq-question"
              aria-expanded={expanded}
              aria-controls={bodyId}
              onClick={() => setQuestionOpen(question.id, !expanded)}
            >
              {question.question}
            </button>
          </h3>

          {promoted && (
            <>
              <span className="ob-oq-badge">{ROADMAP.promotedTag}</span>
              <p className="ob-oq-note">{ROADMAP.promotedNote(promoted.label)}</p>
            </>
          )}

          <FanOutMeter
            governs={governs.length}
            tripwire={Boolean(tripwire)}
            max={fanOutMax}
            caption={caption}
          />

          <p className="ob-oq-meta ob-meta">
            {question.id} · {caption}
          </p>

          {/* Sans, because it is a sentence. It used to render through
              `.meta-line`, i.e. uppercase mono at sentence length — mono
              carries no sentences. */}
          <p className="ob-oq-ask">
            <span className="ob-meta">{ROADMAP.askPrefix}</span> {question.ask}
          </p>
        </Row>
      </div>

      {/* `grid-template-rows: 0fr -> 1fr`, and `inert` when closed so a
          collapsed card's controls are not reachable by Tab. */}
      <div className="ob-oq-body" data-open={expanded} id={bodyId}>
        <div className="ob-oq-body-inner" inert={!expanded}>
          <div className="ob-oq-grid">
            <Row label={ROADMAP.labels.why_it_matters}>{question.why_it_matters}</Row>
            <Row label={ROADMAP.labels.ask}>{question.ask}</Row>
            <Row label={ROADMAP.labels.find_them}>
              <FindThemRow items={question.find_them} />
            </Row>
            <Row label={ROADMAP.labels.how_many}>{question.how_many}</Row>
            <Row label={ROADMAP.labels.script}>
              <ScriptBlock
                lines={question.script.lines}
                copyText={buildScriptText(question.script.lines)}
                primary={question.id === primaryQuestionId}
              />
            </Row>
            {question.survey && (
              <Row label={ROADMAP.labels.survey}>
                <SurveyBlock survey={question.survey} />
              </Row>
            )}
            <Row label={ROADMAP.labels.what_you_learn}>{question.what_you_learn}</Row>
          </div>

          <ChangesLink phases={changesPhases} />
        </div>
      </div>
    </article>
  );
}
