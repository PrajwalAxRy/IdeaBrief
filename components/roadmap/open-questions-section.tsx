'use client';

import { CopyButton } from '@/components/ui/copy-button';
import { SectionLabel } from '@/components/ui/section-label';
import { Well } from '@/components/ui/well';
import { readBriefPatch, unknownKeys } from '@/lib/brief-state';
import { META_SEPARATOR, ROADMAP, buildScriptText, numberWord } from '@/lib/content/app';
import { BRIEF } from '@/lib/content/app';
import type { Brief, BriefFieldKey } from '@/lib/schemas/brief';
import type { OpenQuestion, Roadmap, RoadmapStep } from '@/lib/schemas/roadmap';
import { useEffect, useState } from 'react';
import { OpenQuestionCard } from './open-question-card';
import { RoadmapProvider } from './roadmap-context';

/** Floats a promoted question above the rest while preserving relative order. */
const PROMOTION_OFFSET = 100;

interface OpenQuestionsSectionProps {
  questions: OpenQuestion[];
  /** Question id → the steps naming it, already partitioned. */
  edges: Record<string, { governs: RoadmapStep[]; tripwire: RoadmapStep | null }>;
  fanOutMax: number;
  brief: Brief;
  slug: string;
  /** The `FieldworkBand`, server-rendered — the section's closing content. */
  fieldwork: React.ReactNode;
  /** `02 BUILD ROADMAP`, server-rendered. A **sibling** section, rendered
   *  inside the provider so the dependency chips can reach both halves —
   *  `RoadmapProvider` emits no element of its own. */
  children: React.ReactNode;
}

/**
 * The open-question composition, and the owner of D10's promotion pass.
 *
 * **Promote, never fabricate — and promote on what the *user* marked, not on
 * what the run already knew.** The promotion set is `unknownKeys(brief, patch)`
 * **minus the fields whose server status is already `unknown`**. The fixture
 * ships `who_decides`, `what_makes_this_different` and `how_customers_find_it`
 * unknown, and those three are *why* Q01–Q03 exist — promoting them would count
 * the same fact twice and would put the three lowest-fan-out questions on top
 * of a page nobody has touched. So on a clean load there is no promotion, no
 * badge, no `ALSO UNKNOWN` well, and the order is the authored one.
 *
 * Mark `assumptions` unknown in Define and Q04 floats to the top: that reorder
 * is D10 working, visible, once, in response to something you did one screen
 * ago.
 *
 * **Hydration.** The server renders the authored order because it cannot read
 * `localStorage`. The re-sort happens in an effect, and only when the promotion
 * set is non-empty.
 */
export function OpenQuestionsSection({
  questions,
  edges,
  fanOutMax,
  brief,
  slug,
  fieldwork,
  children,
}: OpenQuestionsSectionProps) {
  const [promotedKeys, setPromotedKeys] = useState<BriefFieldKey[]>([]);

  useEffect(() => {
    const patch = readBriefPatch(slug);
    if (!patch) return;
    setPromotedKeys(unknownKeys(brief, patch).filter((key) => brief[key].status !== 'unknown'));
  }, [slug, brief]);

  const promotedSet = new Set(promotedKeys);
  const byBriefField = new Map(
    questions
      .filter((question) => question.brief_field !== null)
      .map((question) => [question.brief_field as BriefFieldKey, question]),
  );

  /* Effective sort key = priority - 100 when promoted, which floats the
     promoted group above the rest while preserving relative order inside each
     group. Badge and promotion share one trigger; a badge that does not float,
     or a float with no badge, is a bug. */
  const ordered = [...questions].sort((a, b) => {
    const keyOf = (q: OpenQuestion) =>
      q.brief_field !== null && promotedSet.has(q.brief_field)
        ? q.priority - PROMOTION_OFFSET
        : q.priority;
    return keyOf(a) - keyOf(b) || a.number - b.number;
  });

  /* A field with a question promotes; a field without one has nowhere to go
     and is named honestly rather than given an invented script. */
  const orphanKeys = promotedKeys.filter((key) => !byBriefField.has(key));

  const allScripts = ordered
    .map(
      (question) =>
        `${question.id}. ${question.question}\n${buildScriptText(question.script.lines)}`,
    )
    .join('\n\n');

  return (
    <RoadmapProvider defaultExpandedId={ordered[0].id} order={ordered.map((q) => q.id)}>
      <section
        className="ob-roadmap-section"
        id="open-questions"
        aria-labelledby="open-questions-h"
      >
        <SectionLabel as="h2" id="open-questions-h" index="01">
          Open questions
        </SectionLabel>

        {orphanKeys.length > 0 && (
          <Well className="ob-also-unknown">
            <p className="ob-meta">{ROADMAP.alsoUnknown.label}</p>
            <p className="ob-oq-note">
              {ROADMAP.alsoUnknown.line(
                numberWord(orphanKeys.length),
                orphanKeys.map((key) => BRIEF.fieldLabels[key].toLowerCase()).join(META_SEPARATOR),
              )}
            </p>
          </Well>
        )}

        <div className="ob-oq-stack">
          {ordered.map((question) => {
            const promoted =
              question.brief_field !== null && promotedSet.has(question.brief_field)
                ? { label: BRIEF.fieldLabels[question.brief_field] }
                : undefined;
            return (
              <OpenQuestionCard
                key={question.id}
                question={question}
                governs={edges[question.id]?.governs ?? []}
                tripwire={edges[question.id]?.tripwire ?? null}
                fanOutMax={fanOutMax}
                promoted={promoted}
              />
            );
          })}
        </div>

        <div className="ob-oq-stack flex justify-end">
          <CopyButton variant="button" label={ROADMAP.copyAll} text={allScripts} />
        </div>

        {fieldwork}
      </section>

      {children}
    </RoadmapProvider>
  );
}

/** Re-exported so the page can type its own edge map without importing the schema twice. */
export type QuestionEdges = OpenQuestionsSectionProps['edges'];
export type { Roadmap };
