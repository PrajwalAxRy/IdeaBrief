import {
  OPEN_QUESTIONS,
  type OpenQuestion,
  SORT,
  SORT_ROW_GAP,
  SORT_ROW_H,
  SORT_STAGE_MS,
  TOP_SCRIPT,
} from '@/lib/content/roadmap-experiment';
import { useInView } from '@/lib/hooks/use-in-view';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

/** Row height plus the gap under it — one row's worth of travel. */
const PITCH = SORT_ROW_H + SORT_ROW_GAP;
const LIST_H = OPEN_QUESTIONS.length * PITCH - SORT_ROW_GAP;

const STAGES = ['wake', 'land', 'measure', 'sort', 'open', 'rest'] as const;
type Stage = (typeof STAGES)[number];

const STAGE_HOLD: Record<Stage, number | null> = {
  wake: SORT_STAGE_MS.wake,
  land: SORT_STAGE_MS.land,
  measure: SORT_STAGE_MS.measure,
  sort: SORT_STAGE_MS.sort,
  open: SORT_STAGE_MS.open,
  rest: null,
};

const STAGE_LABEL: Record<Stage, string> = {
  wake: 'Open questions',
  land: 'Five unresolved',
  measure: 'Weighing each answer',
  sort: 'Reordering',
  open: 'Ask this one first',
  rest: 'Ready to ask',
};

/**
 * **Concept B** — the roadmap as a list that sorts itself, then opens.
 *
 * **No `'use client'` on purpose.** The page carries the directive, so
 * everything it imports is already in the client graph — the same arrangement
 * `Pillars` has with `IdeaSession` and `ValidateSession`.
 *
 * **The sort IS the proof line.** Pillar 03's proof reads "ordered by how much
 * the answer would change the plan", and nothing currently on the page shows
 * an ordering. The list arrives in the order the run produced it, measures, and
 * then physically reorders — which is the claim, performed, in about a second.
 *
 * **Then it opens, so the figure carries both lists.** A sort on its own is a
 * bar chart animating, and it would leave the interview script — the most
 * concrete thing the roadmap produces — off screen entirely. The winner
 * expanding into its script is what makes the sort *lead somewhere*.
 *
 * **The bars carry no numbers, and that is not an oversight.** Pillar 02's own
 * proof line is "no score, no verdict, no fake percentage", and the executive
 * summary forbids inventing a figure to fill a field. A relative bar under an
 * axis label that names it as relative is defensible; the moment it grows a
 * `0.94` next to it, this figure contradicts the sentence two panels above it.
 *
 * **Two transform owners, on two elements.** The row owns the sort travel; the
 * inner owns the entrance. Sharing one node would make the entrance and the
 * reorder overwrite each other — `pitfalls.md` §4, and the same split
 * `ValidateSession` uses for `.ob-vf-bob` inside `.ob-vf-strip`.
 *
 * **DOM order never changes.** Rows stay in the order the run produced them and
 * travel to their sorted slot on a transform. Re-sorting the array instead
 * would move real nodes, which cannot be animated and would re-fire every
 * entrance the moment the sort landed.
 */
export function RoadmapSort() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3, once: false });
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [runId, setRunId] = useState(0);

  const playing = inView && !reduced;
  const stage: Stage = STAGES[index] ?? 'rest';

  /* Under reduced motion the list is sorted, measured and open from first
     paint. Everything visible reads `at`; only the timer chain reads `index`. */
  const at = reduced ? STAGES.length - 1 : index;
  const shownStage: Stage = STAGES[at] ?? 'rest';
  const landed = at >= 1;
  const measured = at >= 2;
  const sorted = at >= 3;
  const opened = at >= 4;
  const done = at >= 5;

  /** Original index → sorted rank. Computed once; the data never changes. */
  const rank = useMemo(() => {
    const order = OPEN_QUESTIONS.map((q, i) => ({ i, impact: q.impact })).sort(
      (a, b) => b.impact - a.impact,
    );
    const out = new Array<number>(OPEN_QUESTIONS.length);
    order.forEach((entry, position) => {
      out[entry.i] = position;
    });
    return out;
  }, []);

  const top = useMemo(() => {
    const winner = rank.findIndex((r) => r === 0);
    return OPEN_QUESTIONS[winner];
  }, [rank]);

  const peak = useMemo(() => Math.max(...OPEN_QUESTIONS.map((q) => q.impact)), []);

  const replay = useCallback(() => {
    setIndex(0);
    setRunId((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const hold = STAGE_HOLD[stage];
    if (hold === null) return;
    const timer = window.setTimeout(() => setIndex((i) => i + 1), hold);
    return () => window.clearTimeout(timer);
  }, [playing, stage]);

  return (
    <div className="rx-scene">
      <div
        className="rx-sort"
        ref={ref}
        data-landed={landed}
        data-measured={measured}
        data-sorted={sorted}
        data-opened={opened}
      >
        {/* Rebuilt on replay, so hidden from assistive tech; the static summary
            below is derived from the same array and cannot drift. */}
        <div aria-hidden="true" key={runId}>
          <div className="rx-sort-head">
            <span className="ob-meta">{SORT.eyebrow}</span>
            <span className="ob-meta rx-sort-axis">{SORT.axis}</span>
          </div>

          <div className="rx-sort-list" style={{ height: `${LIST_H}px` }}>
            {OPEN_QUESTIONS.map((question, i) => (
              <Row
                key={question.id}
                question={question}
                i={i}
                rank={rank[i] ?? i}
                sorted={sorted}
                peak={peak}
              />
            ))}
          </div>

          {/* Space is reserved from first paint, so the script arriving never
              moves the caption under it. */}
          <div className="rx-script" data-open={opened}>
            <span className="ob-meta rx-script-label">{SORT.scriptLabel}</span>
            <ol className="rx-script-lines">
              {TOP_SCRIPT.map((line, i) => (
                <li
                  className="rx-script-line"
                  key={line}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <span className="ob-meta rx-script-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
            <div className="rx-script-meta">
              <span className="ob-chip">{top?.ask}</span>
              <span className="ob-chip">6–8 conversations</span>
              <span className="ob-chip">{top?.blocks}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rx-caption">
        <span className="flex items-center gap-2">
          <span className={done ? 'rx-rest-dot' : 'ob-dot'} aria-hidden="true" />
          <span className="ob-meta rx-stage" key={STAGE_LABEL[shownStage]}>
            {STAGE_LABEL[shownStage]}
          </span>
        </span>

        <span className="rx-footnote">{SORT.footnote}</span>

        {reduced ? null : (
          <button
            type="button"
            className="ob-btn ob-btn-bare ob-meta rx-replay gap-2"
            onClick={replay}
          >
            <RotateCcw size={12} aria-hidden="true" />
            {SORT.replayLabel}
          </button>
        )}
      </div>

      <p className="sr-only">
        {SORT.footnote}{' '}
        {[...OPEN_QUESTIONS]
          .sort((a, b) => b.impact - a.impact)
          .map((q, i) => `${i + 1}. ${q.text} ${q.band}. Ask ${q.ask}. ${q.blocks}.`)
          .join(' ')}{' '}
        {SORT.scriptLabel} for {top?.text} {TOP_SCRIPT.join(' ')}
      </p>
    </div>
  );
}

/**
 * One question.
 *
 * `--to` is the travel, in rows, from where it was produced to where it
 * belongs. The rank numeral flips with it rather than after it — a row that
 * arrives in position two still reading `04` reads as a rendering bug.
 */
function Row({
  question,
  i,
  rank,
  sorted,
  peak,
}: {
  question: OpenQuestion;
  i: number;
  rank: number;
  sorted: boolean;
  peak: number;
}) {
  const slot = sorted ? rank : i;

  return (
    <div
      className="rx-row"
      data-top={sorted && rank === 0}
      style={
        {
          '--i': i,
          '--from': `${i * PITCH}px`,
          '--to': `${(slot - i) * PITCH}px`,
        } as React.CSSProperties
      }
    >
      <div className="rx-row-inner">
        <span className="ob-meta rx-rank">{String(slot + 1).padStart(2, '0')}</span>
        <span className="rx-row-text">{question.text}</span>
        <span className="rx-bar">
          <span className="rx-bar-fill" style={{ width: `${(question.impact / peak) * 100}%` }} />
        </span>
        <span className="ob-meta rx-band">{question.band}</span>
      </div>
    </div>
  );
}
