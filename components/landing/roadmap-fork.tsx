import {
  FORK,
  FORK_STAGE_MS,
  FORK_TOTAL_WEEKS,
  type ForkBranch,
} from '@/lib/content/roadmap-experiment';
import { useInView } from '@/lib/hooks/use-in-view';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

/* ------------------------------------------------------------ geometry --- */

/**
 * The scene is a fixed-pixel diagram, so the connector's SVG coordinates and
 * the branches' CSS `top` values are the SAME numbers in the SAME space. Every
 * one of them is derived here rather than typed twice.
 *
 * `SPINE_Y` is also where the ask column centres, because the ask column is
 * `top: 0; bottom: 0` with `justify-content: center` in a `SCENE_H`-tall box.
 * Move `SCENE_H` and the spine has to move with it or the rail leaves the
 * question's edge at an angle.
 */
const SCENE_H = 470;
const CONNECTOR_W = 150;
const SPINE_Y = SCENE_H / 2;
/** Vertical centre of each branch's head row — where its rail terminates. */
const YES_TOP = 40;
const NO_TOP = 268;
const HEAD_H = 26;
const yesY = YES_TOP + HEAD_H / 2;
const noY = NO_TOP + HEAD_H / 2;

/**
 * Right-angle rails with 10px corners, not curves.
 *
 * A cardinal spline was tried first and read as a chart annotation. Obsidian's
 * first rule about structure is that hairlines *are* the layout — a fork drawn
 * as a circuit trace states "one input, two discrete outputs" in a way a smooth
 * bezier cannot, and it is the same line vocabulary as every rule on the page.
 *
 * The arc sweep flags are not interchangeable: each corner turns a specific
 * direction, and flipping one produces a 270° loop rather than a quarter turn.
 */
const RAIL = {
  yes: `M0 ${SPINE_Y} H50 A10 10 0 0 0 60 ${SPINE_Y - 10} V${yesY + 10} A10 10 0 0 1 70 ${yesY} H${CONNECTOR_W}`,
  no: `M0 ${SPINE_Y} H50 A10 10 0 0 1 60 ${SPINE_Y + 10} V${noY - 10} A10 10 0 0 0 70 ${noY} H${CONNECTOR_W}`,
} as const;

/* --------------------------------------------------------------- stages --- */

const STAGES = ['wake', 'ask', 'split', 'yes', 'no', 'rest'] as const;
type Stage = (typeof STAGES)[number];

const STAGE_HOLD: Record<Stage, number | null> = {
  wake: FORK_STAGE_MS.wake,
  ask: FORK_STAGE_MS.ask,
  split: FORK_STAGE_MS.split,
  yes: FORK_STAGE_MS.yes,
  no: FORK_STAGE_MS.no,
  rest: null,
};

const STAGE_LABEL: Record<Stage, string> = {
  wake: 'Open questions',
  ask: 'Open question 01',
  split: 'Two futures',
  yes: 'If the list exists',
  no: 'If it does not',
  rest: 'Unresolved',
};

/**
 * **Concept A** — the roadmap as a fork: one unanswered question, and the two
 * different products that come out of the two possible answers.
 *
 * **No `'use client'` on purpose.** The page carries the directive, so
 * everything it imports is already in the client graph — the same arrangement
 * `Pillars` has with `IdeaSession` and `ValidateSession`, and the reason
 * neither of those spends a name from the allowlist in CLAUDE.md.
 *
 * **A third register, deliberately.** 01 is a card that lives (time). 02 is a
 * lit volume with depth and glass (space). This is neither: a hairline
 * blueprint on bare canvas, no box, no glass, no bloom, no ambient drift. Three
 * cards in a row would make the section monotonous; a card, a volume and a
 * diagram gives it a cadence.
 *
 * **It ends unresolved, and that is the whole argument.** 01 closes on a press
 * and 02 closes on the field landing. This one draws both futures and then just
 * holds them, because the product's position is that nothing is invented to
 * fill a field and "I don't know" is a real answer. A roadmap figure that
 * resolved would be making a claim the product refuses to make.
 *
 * **Blue appears only under the cursor.** At rest the scene is entirely
 * achromatic — none of blue's three jobs applies to an unanswered question.
 * Hovering a branch makes it the live one, which is the third job, and it is
 * the only blue in the figure.
 *
 * **Hover is emphasis, never disclosure.** Both branches are fully legible at
 * rest; hovering dims the *other* one rather than revealing anything in this
 * one. So there is nothing a keyboard or touch visitor cannot read, which is
 * what lets the branches stay non-focusable depictions rather than becoming
 * buttons that do nothing — the same call `IdeaSession` makes for its two
 * closing CTAs.
 */
export function RoadmapFork() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3, once: false });
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const [hot, setHot] = useState<string | null>(null);

  const playing = inView && !reduced;
  const stage: Stage = STAGES[index] ?? 'rest';

  /* Under reduced motion the diagram is complete and settled from first paint —
     never a frozen partial state, and never nothing. Everything visible reads
     `at`; only the timer chain reads `index`. */
  const at = reduced ? STAGES.length - 1 : index;
  const shownStage: Stage = STAGES[at] ?? 'rest';
  const asked = at >= 1;
  const railed = at >= 2;
  const done = at >= 5;

  const replay = useCallback(() => {
    setIndex(0);
    setRunId((n) => n + 1);
    setHot(null);
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
        className="rx-fork"
        ref={ref}
        data-asked={asked}
        data-railed={railed}
        data-hot={hot ?? undefined}
        style={{ height: `${SCENE_H}px` }}
      >
        {/* The diagram rebuilds itself on replay, so it is hidden from assistive
            tech; the static summary below — derived from the same objects, so it
            cannot drift — is what gets read. */}
        <div className="rx-fork-plane" aria-hidden="true" key={runId}>
          <div className="rx-ask" style={{ width: '250px' }}>
            <span className="ob-meta rx-ask-eyebrow">{FORK.eyebrow}</span>
            <p className="rx-ask-question">{FORK.question}</p>
            <span className="ob-meta rx-ask-band">{FORK.band}</span>
            <span className="rx-ask-hinge">{FORK.hinge}</span>
          </div>

          <svg
            className="rx-connector"
            width={CONNECTOR_W}
            height={SCENE_H}
            viewBox={`0 0 ${CONNECTOR_W} ${SCENE_H}`}
            role="presentation"
            style={{ left: '250px' }}
          >
            <path className="rx-rail" data-answer="yes" d={RAIL.yes} pathLength="1" />
            <path className="rx-rail" data-answer="no" d={RAIL.no} pathLength="1" />
            {/* The fork point itself. Drawn last so it sits over both rails. */}
            <circle className="rx-node" cx="50" cy={SPINE_Y} r="2.5" />
          </svg>

          {FORK.branches.map((branch, i) => (
            <Branch
              key={branch.answer}
              branch={branch}
              top={i === 0 ? YES_TOP : NO_TOP}
              shown={at >= 3 + i}
              onEnter={() => setHot(branch.answer.toLowerCase())}
              onLeave={() => setHot(null)}
            />
          ))}
        </div>
      </div>

      <div className="rx-caption rx-caption-bleed">
        <span className="flex items-center gap-2">
          <span className={done ? 'rx-rest-dot' : 'ob-dot'} aria-hidden="true" />
          <span className="ob-meta rx-stage" key={STAGE_LABEL[shownStage]}>
            {STAGE_LABEL[shownStage]}
          </span>
        </span>

        <span className="rx-footnote">{FORK.footnote}</span>

        {reduced ? null : (
          <button
            type="button"
            className="ob-btn ob-btn-bare ob-meta rx-replay gap-2"
            onClick={replay}
          >
            <RotateCcw size={12} aria-hidden="true" />
            {FORK.replayLabel}
          </button>
        )}
      </div>

      <p className="sr-only">
        {FORK.eyebrow}: {FORK.question} {FORK.band}.{' '}
        {FORK.branches
          .map(
            (b) =>
              `If ${b.answer.toLowerCase()}: ${b.reading}. ${b.steps
                .map((s) => `${s.span}, ${s.label}`)
                .join('. ')}. ${b.cost}. ${b.verdict}`,
          )
          .join(' ')}{' '}
        {FORK.footnote}
      </p>
    </div>
  );
}

/**
 * One future. The step list is the plan; the ruler under it is the only place
 * the two branches are measured against each other.
 *
 * **The ruler exists because the step labels could not carry the length.** A
 * gantt on a shared twelve-week scale gives the one-week blocks about 28px of
 * track, which fits no label at any size this system permits. Twelve hairline
 * cells state the same fact — four filled against twelve — in a row that reads
 * at a glance and needs no axis.
 *
 * **Two elements, two jobs.** The outer node carries the hover dim at
 * `--ob-base`; the inner carries the entrance at `--ob-enter`. On one node the
 * hover would inherit the 900ms entrance duration and read as lag.
 */
function Branch({
  branch,
  top,
  shown,
  onEnter,
  onLeave,
}: {
  branch: ForkBranch;
  top: number;
  shown: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const weeks = branch.steps.reduce((sum, step) => sum + step.weeks, 0);

  return (
    <div
      className="rx-branch"
      data-answer={branch.answer.toLowerCase()}
      data-in={shown}
      style={{ top: `${top}px` }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <div className="rx-branch-in">
        <div className="rx-branch-head" style={{ height: `${HEAD_H}px` }}>
          <span className="rx-answer">{branch.answer}</span>
          <span className="rx-reading">{branch.reading}</span>
          <span className="ob-meta rx-cost">{branch.cost}</span>
        </div>

        <ul className="rx-steps">
          {branch.steps.map((step, i) => (
            <li className="rx-step" key={step.label} style={{ '--i': i } as React.CSSProperties}>
              <span className="ob-meta rx-step-span">{step.span}</span>
              <span className="rx-step-label">{step.label}</span>
            </li>
          ))}
        </ul>

        <div className="rx-ruler">
          {Array.from({ length: FORK_TOTAL_WEEKS }, (_, i) => (
            <span
              className="rx-cell"
              // biome-ignore lint/suspicious/noArrayIndexKey: the cells are a ruler — position IS the identity, and there is nothing else to key on.
              key={i}
              data-on={i < weeks}
              style={{ '--i': i } as React.CSSProperties}
            />
          ))}
        </div>

        <p className="rx-verdict">{branch.verdict}</p>
      </div>
    </div>
  );
}
