'use client';

import { readBriefPatch, unknownKeys } from '@/lib/brief-state';
import { ROADMAP } from '@/lib/content/app';
import type { Brief, BriefFieldKey } from '@/lib/schemas/brief';
import type { OpenQuestion } from '@/lib/schemas/roadmap';
import { useEffect, useState } from 'react';

/** Floats a promoted question above the rest while preserving relative order. */
const PROMOTION_OFFSET = 100;

/**
 * The open questions, as a list — question, and what turns on the answer.
 *
 * **A17 cut this from six cards to six rows.** The predecessor carried who to
 * ask, where to find them, how many conversations, a fan-out meter, dependency
 * chips into the chart and a citation row, in an expanding card roughly 340px
 * tall. All of it was true; none of it belongs in an overview whose job is to
 * make someone think, not to brief them for fieldwork. What is left is the
 * question and one sentence on what changes depending on the answer.
 *
 * **D10's promotion pass is the one piece of machinery that survived**, because
 * it is invisible until it fires. The promotion set is `unknownKeys(brief,
 * patch)` minus the fields whose server status is already `unknown` — the
 * fixture ships three fields unknown and those three are *why* Q01–Q03 exist,
 * so promoting them would count the same fact twice. On a clean load there is
 * no promotion, no tag, and the order is the authored one. Mark `assumptions`
 * unknown in Define and Q04 floats to the top with a tag saying why.
 *
 * **Hydration.** The server renders the authored order because it cannot read
 * `localStorage`; the re-sort happens in an effect, and only when the promotion
 * set is non-empty.
 */
export function OpenQuestions({
  questions,
  brief,
  slug,
}: {
  questions: OpenQuestion[];
  brief: Brief;
  slug: string;
}) {
  const [promotedKeys, setPromotedKeys] = useState<BriefFieldKey[]>([]);

  useEffect(() => {
    const patch = readBriefPatch(slug);
    if (!patch) return;
    setPromotedKeys(unknownKeys(brief, patch).filter((key) => brief[key].status !== 'unknown'));
  }, [slug, brief]);

  const promotedSet = new Set(promotedKeys);

  /* Effective sort key = priority - 100 when promoted, which floats the
     promoted group above the rest while preserving relative order inside each
     group. Tag and promotion share one trigger; a tag that does not float, or a
     float with no tag, is a bug. */
  const ordered = [...questions].sort((a, b) => {
    const keyOf = (q: OpenQuestion) =>
      q.brief_field !== null && promotedSet.has(q.brief_field)
        ? q.priority - PROMOTION_OFFSET
        : q.priority;
    return keyOf(a) - keyOf(b) || a.number - b.number;
  });

  return (
    <ol className="ob-oq-list">
      {ordered.map((question, index) => {
        const promoted = question.brief_field !== null && promotedSet.has(question.brief_field);
        return (
          <li className="ob-oq-row" key={question.id}>
            <p className="ob-oq-num ob-meta" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </p>
            <div className="ob-oq-text">
              <p className="ob-oq-q">{question.question}</p>
              <p className="ob-oq-why">{question.why_it_matters}</p>
              {promoted && <p className="ob-oq-promoted ob-meta">{ROADMAP.promotedTag}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
