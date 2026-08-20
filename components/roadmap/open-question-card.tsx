'use client';

import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { CitationChip } from '@/components/validate/evidence/citation-chip';
import { type OpenQuestion, type Roadmap, stepsForQuestion } from '@/lib/schemas/roadmap';
import type { ReactNode } from 'react';
import { ChangesLink } from './dependency-chip';
import { useRoadmapNav } from './roadmap-context';
import { ScriptBlock } from './script-block';

const NO_COMMUNITIES_FALLBACK =
  "We didn't find specific communities for this — start with the general ones and ask who else to talk to.";

function GridRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="oq-grid">
      <span className="oq-label">{label}</span>
      <div className="oq-value">{children}</div>
    </div>
  );
}

/**
 * `FIND THEM` rendering is driven by which optional field a given item
 * actually carries, not its `type` discriminator — the fixture's own `link`
 * items (see lib/fixtures/roadmap.ts) point at a `citation_id`, not a raw
 * `url`, so branching strictly on `type` would render them as inert text.
 * Real URL, when present, wins (external `↗` link); otherwise a citation_id
 * renders the count/label inline with a `CitationChip`; otherwise plain text.
 * Never a fabricated list — an empty array (schema-permitted, unreached by
 * the current fixture) falls back to the honest "we didn't find" sentence.
 */
function FindThemRow({ items }: { items: OpenQuestion['find_them'] }) {
  if (items.length === 0) {
    return <p style={{ color: 'var(--text-tertiary)' }}>{NO_COMMUNITIES_FALLBACK}</p>;
  }

  return (
    <ul className="find-them-list">
      {items.map((item) => (
        <li key={item.label}>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="find-them-link">
              {item.label} ↗
            </a>
          ) : item.citation_id ? (
            <span>
              {item.label} <CitationChip n={item.citation_id} />
            </span>
          ) : (
            <span>{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * The product's most distinctive component — a labelled grid, not prose
 * (08). Reads shared expand/pulse state from `RoadmapProvider` so a
 * Dependency Chip anywhere on the page can force this specific card open.
 * `'use client'` beyond the 13-name allowlist (logged): it calls
 * `useRoadmapNav()` directly, matching the `SourcesList` precedent.
 */
export function OpenQuestionCard({
  question,
  roadmap,
}: { question: OpenQuestion; roadmap: Roadmap }) {
  const { isExpanded, setQuestionOpen, isPulsing } = useRoadmapNav();
  const expanded = isExpanded(question.id);
  const pulsing = isPulsing(`question-${question.id}`);
  const governingPhases = stepsForQuestion(roadmap, question.id).map((step) => step.phase);
  const number = String(question.number).padStart(2, '0');

  const trigger = (
    <div className="oq-trigger-content">
      <span className="oq-number">{number}</span>
      {!expanded && (
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="oq-collapsed-question">{question.question}</span>
          <span className="meta-line">ASK {question.ask}</span>
        </div>
      )}
    </div>
  );

  return (
    <Card
      id={`question-${question.id}`}
      featured={expanded}
      padding="feature"
      className={pulsing ? 'card--pulse' : ''}
    >
      <Accordion
        open={expanded}
        onOpenChange={(next) => setQuestionOpen(question.id, next)}
        title={trigger}
        className="oq-accordion"
      >
        <div className="flex flex-col gap-6 pt-2">
          <GridRow label="Question">
            <span className="oq-value--question">{question.question}</span>
          </GridRow>
          <GridRow label="Why it matters">{question.why_it_matters}</GridRow>
          <GridRow label="Ask">{question.ask}</GridRow>
          <GridRow label="Find them">
            <FindThemRow items={question.find_them} />
          </GridRow>
          <GridRow label="How many">{question.how_many}</GridRow>
          <GridRow label="The script">
            <ScriptBlock
              lines={question.script.lines}
              copyText={question.script.lines.join('\n')}
              primary={expanded}
            />
          </GridRow>
          {question.survey && (
            <GridRow label="The survey">
              <div className="flex flex-col gap-3">
                <ScriptBlock
                  lines={question.survey.questions}
                  copyText={question.survey.questions.join('\n')}
                  copyLabel="Copy survey"
                />
                <p className="meta-line">{question.survey.note}</p>
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                  Surveys are for counting things after interviews have told you what to count.
                </p>
              </div>
            </GridRow>
          )}
          <GridRow label="What you learn">{question.what_you_learn}</GridRow>
          {governingPhases.length > 0 && (
            <div className="pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <ChangesLink phases={governingPhases} />
            </div>
          )}
        </div>
      </Accordion>
    </Card>
  );
}
