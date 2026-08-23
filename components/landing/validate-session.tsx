import {
  VALIDATE_SESSION,
  VALIDATE_STAGE_MS,
  VALIDATE_VERIFY_MS,
  type ValidateRow,
} from '@/lib/content/landing';
import { useInView } from '@/lib/hooks/use-in-view';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { Check, ChevronRight, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const { bar, stages, chart, stats, competitors, rows, footnote } = VALIDATE_SESSION;

/* ------------------------------------------------------------ geometry --- */

const VB = { w: 640, h: 210 };
const PAD = 10;
/** Where month 12 sits. Everything right of it is the cone. */
const DATA_W = 470;

const peak = Math.max(...chart.series);
const Y_MAX = peak * chart.cone.high * 1.02;

const x = (i: number, n: number) => PAD + (i / (n - 1)) * (DATA_W - PAD);
const y = (v: number) => VB.h - PAD - (v / Y_MAX) * (VB.h - PAD * 2);

type Pt = { x: number; y: number };
const toPoints = (series: readonly number[]): Pt[] =>
  series.map((v, i) => ({ x: x(i, series.length), y: y(v) }));

/** Cardinal spline through the points, one cubic per segment. */
function spline(pts: Pt[], tension = 0.19): string {
  const first = pts[0];
  if (!first) return '';
  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    if (!p1 || !p2) continue;
    const p0 = pts[i - 1] ?? p1;
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) * tension;
    const c1y = p1.y + (p2.y - p0.y) * tension;
    const c2x = p2.x - (p3.x - p1.x) * tension;
    const c2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/* ---------------------------------------------------------------- stage --- */

/**
 * Order matters and is the whole narrative: the model, then the claims it
 * produced, then the competitive field arriving ON TOP of them. The field used
 * to run second and collapse into the claims; it now closes the scene, so the
 * last plane the reader sees is the evidence rather than the conclusions.
 *
 * Each stage keeps its own duration from `VALIDATE_STAGE_MS`, so reordering
 * here does not change how long a pass takes.
 */
const STAGES = ['wake', 'model', 'verify', 'field', 'rest'] as const;
type Stage = (typeof STAGES)[number];

/**
 * The first strip the competitive field actually lands on.
 *
 * A strip goes out of focus because something is in front of it — so a strip
 * with nothing in front of it stays sharp. The card row sits at y 240; the stack
 * runs `180 + i * 64` at 46px tall, which puts strip 0 at 180–226, clear of it,
 * and every strip after that underneath it. So strip 0 keeps its focus and its
 * crossing over the callout, and the rest sit behind glass.
 *
 * Both numbers live in `.ob-vf-strip` and `.ob-vf-pane`. Move either and this
 * has to be re-derived — it is a fact about the geometry, not a preference.
 */
const FIRST_STRIP_UNDER_FIELD = 1;

/**
 * How long into the model beat the callout arrives.
 *
 * The beat builds in the order the figure would be drawn by hand: the line
 * (1500ms to draw), the head landing on it (1420ms), the cone wiping open from
 * that head (1620ms + 720ms, both in CSS), then this pane. 2460 sits after the
 * cone has finished drawing and still leaves the 3900ms beat enough room for the
 * figures to count up — the count is 1150ms and the entrance 760ms, so it lands
 * with ~270ms to spare. Slide the cone and this has to slide with it.
 *
 * **It is a timer here rather than a `transition-delay` in CSS because it gates
 * the COUNT as well as the entrance.** The count-up runs off this flag; left on
 * `lit`, it would run while the pane was still invisible and the pane would
 * arrive already showing $84k.
 */
const CALLOUT_ENTER_MS = 2460;

const STAGE_HOLD: Record<Stage, number | null> = {
  wake: VALIDATE_STAGE_MS.wake,
  model: VALIDATE_STAGE_MS.model,
  field: VALIDATE_STAGE_MS.field,
  verify: VALIDATE_STAGE_MS.verify,
  rest: null,
};

/**
 * Pillar 02 — Validate as a lit, floating scene rather than a panel.
 *
 * **No `'use client'` on purpose.** `Pillars` already carries the directive, so
 * everything it imports is in the client graph and the hooks below work without
 * spending a fourteenth name from the budgeted allowlist in CLAUDE.md.
 *
 * **There is no card.** No border, no title bar, no footer rule, no box of any
 * kind — the previous build was exactly that and was rejected for it. Objects
 * float free in a lit volume, overlapping and at different depths, and the
 * scene bleeds past its column on both sides so nothing reads as contained.
 *
 * **The bloom is load-bearing, not decoration.** Glass on `#0A0A0B` is just a
 * slightly lighter rectangle; a frosted pane is only legible when there is
 * something behind it worth refracting. `.ob-vf-bloom` is that something, and
 * deleting it does not simplify this scene — it deletes the treatment.
 *
 * **Nothing ever stops moving.** Every floating object carries a perpetual
 * drift. `rest` here means the narration has finished, not that the scene has
 * frozen — that is what "floating" has to mean or it is just a still frame. The
 * periods sit in `motion.md`'s ambient band (20–50s) and the state transforms
 * live on a separate wrapper element, so an entrance never fights a drift.
 *
 * **`--d` names a drift GROUP, not an object.** Objects that have to hold their
 * alignment with each other share one: the three competitor panes, and the
 * callout plus the four strips that overlap it. Inside a group the drift is
 * rigid; the groups drift freely against each other. Giving each object its own
 * phase is what made the row and the stack look hand-placed.
 *
 * **The pointer tilts the volume.** One `pointermove` on the scene, coalesced
 * into a single rAF, writing two custom properties by direct DOM write. React
 * never re-renders for it and there is no scroll listener anywhere here.
 *
 * **Blue is light in this scene, not only a state.** That is a real departure
 * from the three-jobs rule and is why the bloom colours are their own token
 * group: out-of-focus light is not a label on an object, and the moment blue
 * touches an actual object here — the curve's live head, a `Verified` mark —
 * it is back to doing one of its three jobs.
 */
export function ValidateSession() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25, once: false });
  const reduced = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [runId, setRunId] = useState(0);
  const [calloutIn, setCalloutIn] = useState(false);

  const playing = inView && !reduced;
  /* Drives the timer chain: where the run actually is. */
  const stage: Stage = STAGES[index] ?? 'rest';

  /* Drives what is on screen. Under reduced motion the scene is complete and
     settled from first paint — never a frozen partial state, and never nothing.
     Everything visible reads `at`, never `index`. */
  const at = reduced ? STAGES.length - 1 : index;
  const shownStage: Stage = STAGES[at] ?? 'rest';
  const lit = at >= 1;
  /* The curve sinks back the moment a plane arrives in front of it. */
  const receded = at >= 2;
  /* Conclusions land at `verify`. They do not leave or dim when the field lands
     on them — the ones it covers simply go out of focus, because that is what
     being behind a pane of glass looks like. */
  const settled = at >= 2;
  const stripsBehind = at >= 3;
  /* The competitors are the LAST plane and the final state — they arrive at
     `field`, in front of everything, and never recede. */
  const fielded = at >= 3;
  const done = at >= 4;
  const shown = reduced ? rows.length : resolved;

  const replay = useCallback(() => {
    setIndex(0);
    setResolved(0);
    setRunId((n) => n + 1);
  }, []);

  /* The callout is the third thing the model beat draws, after the line and the
     cone. Under reduced motion the whole scene is settled from first paint, so
     it is simply in. */
  useEffect(() => {
    if (reduced) {
      setCalloutIn(true);
      return;
    }
    if (!lit) {
      setCalloutIn(false);
      return;
    }
    if (!playing) return;
    const timer = window.setTimeout(() => setCalloutIn(true), CALLOUT_ENTER_MS);
    return () => window.clearTimeout(timer);
  }, [playing, lit, reduced]);

  useEffect(() => {
    if (!playing) return;
    const hold = STAGE_HOLD[stage];
    if (hold === null) return;
    const timer = window.setTimeout(() => setIndex((i) => i + 1), hold);
    return () => window.clearTimeout(timer);
  }, [playing, stage]);

  /* Each claim resolves one at a time, after the stack has landed. All four at
     once reads as a state change; in turn reads as each claim being checked. */
  useEffect(() => {
    if (!playing || !settled || resolved >= rows.length) return;
    const wait = resolved === 0 ? VALIDATE_VERIFY_MS.settle : VALIDATE_VERIFY_MS.row;
    const timer = window.setTimeout(() => setResolved((n) => n + 1), wait);
    return () => window.clearTimeout(timer);
  }, [playing, settled, resolved]);

  /* Pointer tilt. Pointer events on the scene only, coalesced into one rAF, and
     written straight to the node — this must never cost a React render, and it
     must never become a scroll listener. Recentres on leave so an abandoned
     cursor does not leave the volume permanently skewed. */
  useEffect(() => {
    const el = sceneRef.current;
    if (!el || reduced) return;

    let raf = 0;
    let mx = 0;
    let my = 0;

    const write = () => {
      raf = 0;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      queue();
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
      queue();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      className="ob-vf"
      ref={(node) => {
        sceneRef.current = node;
        ref.current = node;
      }}
    >
      {/* Four lights, all far out of focus. This is what the glass refracts.
          Three are ambient and light the whole volume; the fourth is aimed at
          the one place two panes cross, and only comes up once they are
          crossing. */}
      <div className="ob-vf-bloom" data-lit={lit} data-focus={settled} aria-hidden="true">
        <span className="ob-vf-light ob-vf-light-a" />
        <span className="ob-vf-light ob-vf-light-b" />
        <span className="ob-vf-light ob-vf-light-c" />
        <span className="ob-vf-light ob-vf-light-d" />
        <span className="ob-vf-mesh" />
      </div>

      {/* The animated layer rebuilds itself on replay, so it is hidden from
          assistive tech; the static summary below — derived from the same
          arrays, so it cannot drift — is what gets read. */}
      <div className="ob-vf-volume" aria-hidden="true" key={runId}>
        <Curve lit={lit} receded={receded} />
        <Callout shown={calloutIn} receded={receded} />

        {/* Conclusions first — and the competitors AFTER them, because in a
            `transform-style: flat` volume tree order is the z-order. Swapping
            these two blocks is the whole of "the field lands in front". */}
        {rows.map((row, i) => (
          <Strip
            key={row.text}
            row={row}
            i={i}
            settled={settled}
            behind={stripsBehind && i >= FIRST_STRIP_UNDER_FIELD}
            resolved={i < shown}
          />
        ))}

        {competitors.map((c, i) => (
          <Pane key={c.name} competitor={c} i={i} shown={fielded} />
        ))}
      </div>

      {/* Unboxed: a floating caption line, not a footer bar. */}
      <div className="ob-vf-caption">
        <span className="flex items-center gap-2">
          {done ? (
            <span className="ob-vf-rest-dot" aria-hidden="true" />
          ) : (
            <span className="ob-dot" aria-hidden="true" />
          )}
          <span className="ob-meta ob-vf-stage" key={stages[shownStage]}>
            {done ? bar.done : stages[shownStage]}
          </span>
        </span>

        <span className="ob-meta ob-vf-footnote">{footnote}</span>

        {reduced ? null : (
          <button
            type="button"
            className="ob-btn ob-btn-bare ob-meta ob-vf-replay gap-2"
            onClick={replay}
          >
            <RotateCcw size={12} aria-hidden="true" />
            {bar.replayLabel}
          </button>
        )}
      </div>

      <p className="sr-only">
        {chart.label}: {chart.unit}
        {peak}
        {chart.suffix}
        {chart.per}, {chart.caption}.{' '}
        {stats.map((s) => `${s.label} ${s.prefix}${s.value}${s.suffix}`).join('. ')}. Competitors:{' '}
        {competitors
          .map(
            (c) =>
              `${c.name}, ${c.price}, ${c.metrics.map((m) => `${m.label} ${m.value}`).join(', ')}, ${c.gap}`,
          )
          .join('. ')}
        . Assumptions:{' '}
        {rows.map((r) => `${r.text} — ${r.state}${r.note ? ` ${r.note}` : ''}`).join('. ')}.{' '}
        {footnote}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- curve --- */

/**
 * The projection, with no frame, no axis box and no gridlines — the things that
 * made the old version a chart in a panel. It is a lit filament in the volume:
 * the stroke runs a gradient from almost-invisible at month one to full accent
 * at the head, so the line itself states where the certainty ends.
 *
 * On recede it does not shrink into a corner. It sinks back in z, dims and goes
 * slightly out of focus, becoming part of the light the panes in front of it
 * are refracting. That is the whole reason the scene can keep it.
 */
function Curve({ lit, receded }: { lit: boolean; receded: boolean }) {
  const paths = useMemo(() => {
    const series = toPoints(chart.series);
    const end = series.at(-1) ?? { x: DATA_W, y: y(peak) };
    const line = spline(series);
    const cx = end.x + (VB.w - PAD - end.x) * 0.5;
    const rx = VB.w - PAD;
    const hi = y(peak * chart.cone.high);
    const lo = y(peak * chart.cone.low);
    return {
      line,
      base: spline(toPoints(chart.baseline)),
      high: `M ${end.x} ${end.y} C ${cx} ${end.y}, ${cx} ${hi}, ${rx} ${hi}`,
      low: `M ${end.x} ${end.y} C ${cx} ${end.y}, ${cx} ${lo}, ${rx} ${lo}`,
      area: `${line} L ${end.x} ${VB.h} L ${PAD} ${VB.h} Z`,
      /* High edge out, then the low edge REVERSED — control points swapped, not
         the path string spliced. Splicing gives a self-intersecting bow-tie. */
      wedge: `M ${end.x} ${end.y} C ${cx} ${end.y}, ${cx} ${hi}, ${rx} ${hi} L ${rx} ${lo} C ${cx} ${lo}, ${cx} ${end.y}, ${end.x} ${end.y} Z`,
      end,
    };
  }, []);

  return (
    <div className="ob-vf-curve" data-lit={lit} data-receded={receded}>
      <div className="ob-vf-bob" style={{ '--d': 0 } as React.CSSProperties}>
        <svg className="ob-vf-svg" viewBox={`0 0 ${VB.w} ${VB.h}`} role="presentation">
          <defs>
            {/* Dim at month one, accent at the head. The line reports its own
                confidence, so nothing needs an axis to say it. */}
            <linearGradient id="ob-vf-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--ob-dim)" />
              <stop offset="46%" stopColor="var(--ob-muted)" />
              <stop offset="82%" stopColor="var(--ob-text)" />
              <stop offset="100%" stopColor="var(--ob-accent-bright)" />
            </linearGradient>
            {/* Toned with the blooms: this wash sits under the whole plot, so it
                is a large area of accent and it drove a lot of the scene's
                colour on its own. */}
            <linearGradient id="ob-vf-under" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ob-accent)" stopOpacity="0.13" />
              <stop offset="58%" stopColor="var(--ob-accent)" stopOpacity="0.03" />
              <stop offset="100%" stopColor="var(--ob-accent)" stopOpacity="0" />
            </linearGradient>
            <clipPath id="ob-vf-wipe" clipPathUnits="userSpaceOnUse">
              <rect className="ob-vf-wiper" x="0" y="0" width={VB.w} height={VB.h} />
            </clipPath>
            {/* The cone is REVEALED by a clip, not faded in — it has to draw out
                from the head the way the line draws, and it starts at `DATA_W`
                because that is where the line stops and the cone begins.

                A clip rather than the line's `stroke-dashoffset` trick, because
                the rails carry a dash pattern of their own and `stroke-dasharray`
                cannot do both jobs at once. Clipping also reveals the fill and
                both rails together, which draw-on would not. */}
            <clipPath id="ob-vf-cone-wipe" clipPathUnits="userSpaceOnUse">
              <rect
                className="ob-vf-cone-wiper"
                x={DATA_W}
                y="0"
                width={VB.w - DATA_W}
                height={VB.h}
              />
            </clipPath>
          </defs>

          <g clipPath="url(#ob-vf-wipe)">
            <path className="ob-vf-under" d={paths.area} fill="url(#ob-vf-under)" />
          </g>

          <path className="ob-vf-baseline" d={paths.base} />

          <g clipPath="url(#ob-vf-cone-wipe)">
            <path className="ob-vf-cone-fill" d={paths.wedge} />
            <path className="ob-vf-cone" d={paths.high} pathLength="1" />
            <path className="ob-vf-cone" d={paths.low} pathLength="1" />
          </g>
          <path className="ob-vf-line" d={paths.line} pathLength="1" stroke="url(#ob-vf-stroke)" />
        </svg>

        <span
          className="ob-vf-head"
          style={
            {
              '--hx': `${(paths.end.x / VB.w) * 100}%`,
              '--hy': `${(paths.end.y / VB.h) * 100}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- objects --- */

/**
 * The headline figure, on the only pane that never leaves.
 *
 * It is the LAST of the three things the model beat draws — the line, the cone
 * it opens into, then this. `shown` is not `lit`: it flips `CALLOUT_ENTER_MS`
 * after the beat starts, and it starts the count-up as well as the entrance.
 *
 * The first conclusion strip crosses it and covers its `Payback` row outright.
 * That is intended: the strips are the front plane. This pane keeps the scene's
 * plain glass surface and carries nothing to accommodate the crossing — the
 * occlusion lives on the strip in front of it.
 */
function Callout({ shown, receded }: { shown: boolean; receded: boolean }) {
  const v = useCountUp(peak, shown && !receded, 1150);
  return (
    <div className="ob-vf-callout" data-in={shown}>
      {/* Drifts with the strips (`--d: 5`), not on its own phase — the first
          strip crosses this pane's lower edge, and an overlap whose depth
          changes every few seconds reads as jitter. */}
      <div className="ob-vf-bob ob-vf-glass" style={{ '--d': 5 } as React.CSSProperties}>
        <span className="ob-meta">{chart.label}</span>
        <span className="ob-vf-num">
          <span className="ob-vf-num-unit">{chart.unit}</span>
          {v.toFixed(0)}
          <span className="ob-vf-num-unit">{chart.suffix}</span>
          <span className="ob-vf-num-per">{chart.per}</span>
        </span>
        <span className="ob-meta ob-vf-cap">{chart.caption}</span>
        <span className="ob-vf-hair" />
        <span className="ob-vf-stats">
          {stats.map((s) => (
            <Stat key={s.label} stat={s} run={shown && !receded} />
          ))}
        </span>
      </div>
    </div>
  );
}

function Stat({ stat, run }: { stat: (typeof stats)[number]; run: boolean }) {
  const v = useCountUp(stat.value, run, stat.ms);
  return (
    <span className="ob-vf-stat">
      <span className="ob-meta">{stat.label}</span>
      <span className="ob-vf-stat-num">
        {stat.prefix}
        {v.toFixed(stat.decimals)}
        {stat.suffix}
      </span>
    </span>
  );
}

/**
 * A competitor — the evidence behind the conclusion at the same index, arriving
 * last and closing the scene.
 *
 * **The flight in is dimensional; the landing is a row.** Each card swings in
 * from -520px on an arc, 190ms after the one before it, and lands on the same
 * top, depth and angle as its neighbours — three cards answering the same three
 * questions should line up like a comparison, which is what they are.
 *
 * **It has no receded state, deliberately.** This is the front plane and the
 * last thing that happens; nothing arrives after it to hand off to. The strips
 * it lands on are what recede.
 */
function Pane({
  competitor,
  i,
  shown,
}: {
  competitor: (typeof competitors)[number];
  i: number;
  shown: boolean;
}) {
  return (
    <div className="ob-vf-pane" style={{ '--i': i } as React.CSSProperties} data-in={shown}>
      <div className="ob-vf-bob ob-vf-glass" style={{ '--d': 2 } as React.CSSProperties}>
        <span className="ob-vf-pane-head">
          <span className="ob-vf-pane-name">{competitor.name}</span>
          <span className="ob-meta">{competitor.since}</span>
        </span>
        <span className="ob-vf-pane-price">{competitor.price}</span>
        <span className="ob-vf-bar">
          <span style={{ '--w': `${competitor.coverage * 100}%` } as React.CSSProperties} />
        </span>

        {/* Drill-downs, and **spans rather than buttons on purpose** — this is a
            picture of the app, and a focusable control that does nothing is a
            worse outcome than a depiction that reads as one. Same call
            `IdeaSession` makes for its two closing CTAs. They stagger in after
            the pane lands, so the card is read as a card first and a list of
            findings second. */}
        <span className="ob-vf-metrics">
          {competitor.metrics.map((m, j) => (
            <span
              className="ob-vf-metric"
              key={m.label}
              style={{ '--j': j } as React.CSSProperties}
            >
              <span className="ob-meta ob-vf-metric-label">{m.label}</span>
              <span className="ob-vf-metric-value">{m.value}</span>
              <ChevronRight size={11} aria-hidden="true" className="ob-vf-chev" />
            </span>
          ))}
        </span>

        <span className="ob-vf-pane-gap">{competitor.gap}</span>
      </div>
    </div>
  );
}

/**
 * A conclusion. Focuses in from blur and settles into a square stack: one left
 * edge, one width, one depth, shared with the pane row that arrives after it,
 * because strip `i` is answered by card `i`.
 *
 * It resolves, holds, and then goes OUT OF FOCUS as the competitive field lands
 * in front of it. Not dimmed, not moved, not shrunk — a resolved conclusion that
 * fades reads as switched off, and none of these are. Only the three the card
 * row actually covers defocus; the first one clears the row entirely, so it
 * stays sharp and holds its crossing over the callout. See
 * `FIRST_STRIP_UNDER_FIELD`.
 *
 * The top strip crosses the callout, which is the one overlap in the scene —
 * glass over a lit surface rather than over bare canvas, and the only place the
 * frosting has anything to actually refract. The strips are the front plane, so
 * it covers the callout's last row; the right-edge ramp in `.ob-vf-strip
 * .ob-vf-glass` is what makes that a clean occlusion rather than two rows of
 * type sitting on top of each other.
 *
 * The `Verified` mark and the sheen that crosses the glass are blue doing its
 * verification job, and the fourth strip stays grey because the web could not
 * settle it.
 */
function Strip({
  row,
  i,
  settled,
  behind,
  resolved,
}: {
  row: ValidateRow;
  i: number;
  settled: boolean;
  behind: boolean;
  resolved: boolean;
}) {
  return (
    <div
      className="ob-vf-strip"
      style={{ '--i': i } as React.CSSProperties}
      data-in={settled}
      data-behind={behind}
      data-state={resolved ? row.state : undefined}
    >
      <div className="ob-vf-bob ob-vf-glass" style={{ '--d': 5 } as React.CSSProperties}>
        <span className="ob-meta ob-vf-tag">{row.tag}</span>
        <span className="ob-vf-claim">{row.text}</span>
        {/* The open row's mark IS its destination. A separate note element sat
            between the claim and the mark and pushed the mark out of a 46px
            strip; naming where the claim goes says more than `Unresolved` and
            costs nothing. `note` stays in the data for the spoken summary. */}
        <span className="ob-vf-mark">
          {row.state === 'verified' ? (
            <>
              <Check size={11} aria-hidden="true" />
              Verified
            </>
          ) : (
            (row.note ?? 'Unresolved').replace(/^→\s*/, '')
          )}
        </span>
        <span className="ob-vf-sheen" />
      </div>
    </div>
  );
}

/**
 * Ease-out cubic over `ms`, on one rAF. Snaps to the target the moment `run`
 * goes false — which is both how the number settles when its beat ends and how
 * it is already correct under reduced motion, where `run` is never true.
 */
function useCountUp(to: number, run: boolean, ms: number) {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!run) {
      setV(to);
      return;
    }
    let raf = 0;
    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / ms);
      setV(to * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, run, ms]);

  return v;
}
