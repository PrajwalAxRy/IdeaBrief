import {
  SESSION,
  SESSION_LEAD_IN_MS,
  SESSION_POINTER_MS,
  SESSION_PREROLL_HOLD_MS,
  SESSION_SCRIPT,
  SESSION_TYPING_MS,
  type SessionOption,
  type SessionStep,
} from '@/lib/content/landing';
import { useInView } from '@/lib/hooks/use-in-view';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { MousePointer2, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type TurnStep = Extract<SessionStep, { kind: 'turn' }>;
type BulletStep = Extract<SessionStep, { kind: 'bullets' }>;
type FinishStep = Extract<SessionStep, { kind: 'finish' }>;

/** The closing gesture, after the script has run out. */
type Pointer = 'idle' | 'travel' | 'press' | 'done';

/** What every step block needs to know: is it the one currently playing. */
type BlockProps = {
  active: boolean;
  playing: boolean;
  pressed: boolean;
  onDone: () => void;
  pin: () => void;
};

/** Where the pointer enters from, relative to the button it is heading for. */
const POINTER_FROM = { x: 118, y: 96 };

/**
 * Pillar 01 — Define as a live ideating conversation, drawn in code.
 *
 * **No `'use client'` on purpose.** `Pillars` already carries the directive, so
 * everything it imports is in the client graph and the hooks below work without
 * spending a fourteenth name from the budgeted allowlist in CLAUDE.md.
 *
 * **Why code and not a recording.** A capture of the real Define page shipped
 * here briefly and was reverted. It showed the *dental* run fixture, dropping an
 * unrelated second idea into the middle of the arc this pillar shares with
 * section 03 — `CHAT_SCRIPT` is the same fitness idea, a few turns earlier. And
 * a fixed 440px app column captured into a 624px slot made every decision about
 * size, magnification and duration a compromise. Drawn in code, the geometry is
 * free and the narrative is continuous.
 *
 * **The fixed-height scrolling transcript is what makes 624×375 possible.** The
 * full script is roughly three times the card's height, so the viewport is fixed
 * and its content scrolls up as steps land. Card height is constant by
 * construction — there is no layout shift to chase at any point in the run.
 *
 * **It plays once and rests; `Replay` in the card bar is the only way back.**
 * An earlier build looped on its own timer. Looping made the card the loudest
 * thing on a page that already carries two continuous motion sources, and it
 * meant the closing gesture — the pointer pressing `Start the research` — was
 * undone every 13 seconds, which reads as indecision rather than as an ending.
 * Scroll drives only the card's entrance, via the `ScrollReveal` wrapper in
 * `Pillars`; nothing here is scroll-scrubbed. It still pauses when scrolled out
 * of view, so a visitor who leaves mid-run comes back to where they left rather
 * than to a finished card.
 *
 * **Every step stays mounted once it is reachable.** A finished step is the same
 * component in the same DOM position as the playing one, told `active={false}` —
 * not a different component swapped into a "completed" list. That is what keeps
 * the per-item entrance animations from re-firing the moment a step completes.
 *
 * **The pre-roll types too, once.** `SESSION.preroll` used to render as static
 * text ahead of the animated script — true to the "opens mid-conversation"
 * framing, but visibly inert next to everything typing around it. It now runs
 * through the same per-character handshake as a scripted turn, gates
 * `SESSION_LEAD_IN_MS` behind its own completion, and then latches settled for
 * every later replay — see `prerollPlayed` below.
 */
export function IdeaSession() {
  /* `once: false` is what lets the run pause when the card leaves the viewport
     rather than playing to an empty room. */
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35, once: false });
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const [armed, setArmed] = useState(false);
  const [pointer, setPointer] = useState<Pointer>('idle');
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);

  /* The pre-roll types out once, ahead of `armed`. `prerollTurn`/`prerollCount`
     track the line in progress; once it runs past the last line, `prerollPlayed`
     latches true for good — a replay shows both lines settled, never retyped. */
  const [prerollTurn, setPrerollTurn] = useState(0);
  const [prerollCount, setPrerollCount] = useState(0);
  const [prerollPlayed, setPrerollPlayed] = useState(false);

  const playing = inView && !reduced;
  const running = !reduced && armed;
  const scriptDone = stepIndex >= SESSION_SCRIPT.length;
  const active = running && !scriptDone ? SESSION_SCRIPT[stepIndex] : undefined;
  /* Under reduced motion the whole script is present and settled from first
     paint — never a frozen partial state, and never nothing. */
  const reached = reduced ? SESSION_SCRIPT : SESSION_SCRIPT.slice(0, running ? stepIndex + 1 : 0);
  const prerollDone = reduced || prerollPlayed;

  /** Pin the newest block. A direct DOM write, so typing costs no parent render. */
  const pin = useCallback(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const advance = useCallback(() => setStepIndex((i) => i + 1), []);

  /* An explicit click starts immediately — the lead-in rest exists to make the
     card look mid-conversation on arrival, and a delay after a press reads as lag. */
  const replay = useCallback(() => {
    setStepIndex(0);
    setRunId((n) => n + 1);
    setArmed(true);
    setPointer('idle');
    setTarget(null);
  }, []);

  /* The pre-roll types out once, before the lead-in rest starts counting down. */
  useEffect(() => {
    if (!playing || prerollDone) return;
    const turn = SESSION.preroll[prerollTurn];
    if (!turn) {
      setPrerollPlayed(true);
      return;
    }
    pin();
    if (prerollCount >= turn.text.length) {
      const hold = window.setTimeout(() => {
        setPrerollTurn((t) => t + 1);
        setPrerollCount(0);
      }, SESSION_PREROLL_HOLD_MS);
      return () => window.clearTimeout(hold);
    }
    const tick = window.setTimeout(
      () => setPrerollCount((c) => c + 1),
      SESSION_TYPING_MS[turn.role],
    );
    return () => window.clearTimeout(tick);
  }, [playing, prerollDone, prerollTurn, prerollCount, pin]);

  /* The lead-in rest, on the first pass only, and only once the pre-roll has
     finished typing — the rest is what makes the card feel settled, not mid-type. */
  useEffect(() => {
    if (!playing || armed || !prerollDone) return;
    const timer = window.setTimeout(() => setArmed(true), SESSION_LEAD_IN_MS);
    return () => window.clearTimeout(timer);
  }, [playing, armed, prerollDone]);

  /* Steps that only reveal and hold are driven from here; steps that type, or
     land item by item, own their own timing and call `advance` themselves. */
  useEffect(() => {
    if (!playing || !active) return;
    if (active.kind === 'turn' || active.kind === 'bullets') return;
    const timer = window.setTimeout(advance, active.holdMs);
    return () => window.clearTimeout(timer);
  }, [playing, active, advance]);

  /* The script has run out: measure the button and send the pointer for it.
     Measured rather than hard-coded because the button's position depends on
     where the transcript happens to have scrolled to. */
  useEffect(() => {
    if (!playing || !scriptDone || pointer !== 'idle') return;
    const card = cardRef.current;
    const cta = card?.querySelector('.ob-session-cta');
    if (!card || !cta) return;
    const cardBox = card.getBoundingClientRect();
    const ctaBox = cta.getBoundingClientRect();
    setTarget({
      x: ctaBox.left - cardBox.left + ctaBox.width * 0.42,
      y: ctaBox.top - cardBox.top + ctaBox.height * 0.55,
    });
    setPointer('travel');
  }, [playing, scriptDone, pointer]);

  useEffect(() => {
    if (!playing) return;
    if (pointer === 'travel') {
      const timer = window.setTimeout(() => setPointer('press'), SESSION_POINTER_MS.travel);
      return () => window.clearTimeout(timer);
    }
    if (pointer === 'press') {
      const timer = window.setTimeout(() => setPointer('done'), SESSION_POINTER_MS.press);
      return () => window.clearTimeout(timer);
    }
  }, [playing, pointer]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pinning is a DOM write keyed on what just rendered — the step that landed, the pass it belongs to, and the reduced-motion branch that jumps straight to the end.
  useEffect(() => {
    pin();
  }, [pin, stepIndex, runId, reduced]);

  return (
    <div
      className="ob-frag ob-session-card"
      ref={(node) => {
        cardRef.current = node;
        ref.current = node;
      }}
    >
      <div className="ob-frag-bar">
        <span className="ob-meta ob-meta-bright">{SESSION.bar.title}</span>
        <span className="flex items-center gap-4">
          <span className="ob-meta">{SESSION.bar.status}</span>
          {/* Hidden under reduced motion: everything is already shown, so the
              button would be promising motion the visitor asked not to have. */}
          {reduced ? null : (
            <button
              type="button"
              className="ob-btn ob-btn-bare ob-meta ob-session-replay gap-2"
              onClick={replay}
            >
              <RotateCcw size={12} aria-hidden="true" />
              {SESSION.replayLabel}
            </button>
          )}
        </span>
      </div>

      {/* The animated layer is a depiction that rebuilds itself on replay, so it
          is hidden from assistive tech and the static transcript below — derived
          from the same array, so it cannot drift — is what gets read. No
          `aria-live`: this is a picture of a conversation, not a live one. */}
      <div className="ob-session-scroll" ref={scrollerRef} aria-hidden="true">
        <div className="ob-session-flow">
          {SESSION.preroll.map((turn, i) => {
            if (!prerollDone && i > prerollTurn) return null;
            const typing = !prerollDone && i === prerollTurn;
            const text = typing ? turn.text.slice(0, prerollCount) : turn.text;
            return (
              <p
                key={turn.text}
                className={`ob-bubble ob-session-bubble ${
                  turn.role === 'user' ? 'ob-bubble-user' : 'ob-bubble-ai'
                }`}
              >
                {text}
                {typing && prerollCount < turn.text.length ? (
                  <span className="ob-caret" aria-hidden="true" />
                ) : null}
              </p>
            );
          })}

          {reached.map((step, i) => (
            <StepBlock
              key={`${runId}-${stepKey(step)}`}
              step={step}
              active={!reduced && running && i === stepIndex}
              playing={playing}
              pressed={pointer === 'press'}
              onDone={advance}
              pin={pin}
            />
          ))}
        </div>
      </div>

      {/* Sits in the CARD, not the transcript: the transcript scrolls, and an
          absolutely-positioned child there would extend its scrollable area and
          drag the conversation with it. The card clips it, so entering from
          off-frame is free. */}
      {target && pointer !== 'idle' ? (
        <span
          className="ob-session-pointer"
          data-phase={pointer}
          data-paused={!playing || undefined}
          aria-hidden="true"
          style={
            {
              '--ob-ptr-x': `${target.x}px`,
              '--ob-ptr-y': `${target.y}px`,
              '--ob-ptr-from-x': `${target.x + POINTER_FROM.x}px`,
              '--ob-ptr-from-y': `${target.y + POINTER_FROM.y}px`,
              '--ob-ptr-travel': `${SESSION_POINTER_MS.travel}ms`,
            } as React.CSSProperties
          }
        >
          <MousePointer2 size={17} />
        </span>
      ) : null}

      <p className="sr-only">
        {SESSION.preroll.map((turn) => turn.text).join(' ')}{' '}
        {SESSION_SCRIPT.map(readAloud).join(' ')}
      </p>
    </div>
  );
}

/**
 * Stable per-step identity from the step's own words, not its position — so a
 * step keeps its DOM node (and its typed characters) across the render where it
 * stops being the active one. Prefixed by `runId` so a replay remounts everything.
 */
function stepKey(step: SessionStep): string {
  if (step.kind === 'turn') return `turn-${step.text.slice(0, 14)}`;
  if (step.kind === 'bullets') return `bullets-${step.items[0]?.lead ?? ''}`;
  if (step.kind === 'lens') return `lens-${step.text.slice(0, 14)}`;
  return `finish-${step.heading.slice(0, 14)}`;
}

/** The transcript as one string, for the accessibility tree. */
function readAloud(step: SessionStep): string {
  if (step.kind === 'turn') return step.text;
  if (step.kind === 'bullets') return step.items.map((o) => `${o.lead} — ${o.rest}`).join(' ');
  if (step.kind === 'lens') return `${SESSION.lensLabel}: ${step.text}`;
  return `${step.heading} ${step.body} ${step.primary}. ${step.secondary}.`;
}

function StepBlock({ step, ...rest }: BlockProps & { step: SessionStep }) {
  if (step.kind === 'turn') return <TurnBlock step={step} {...rest} />;
  if (step.kind === 'bullets') return <OptionsBlock step={step} {...rest} />;
  if (step.kind === 'lens') return <Lens text={step.text} />;
  return <Finish step={step} pressed={rest.pressed} />;
}

/**
 * Owns the per-character state so only this node re-renders while typing — the
 * card renders once per step. Same handshake as `CofounderChat`'s `TypingBubble`.
 * Once `active` goes false it holds the finished line and runs no timers.
 */
function TurnBlock({ step, active, playing, onDone, pin }: BlockProps & { step: TurnStep }) {
  const [count, setCount] = useState(0);
  const typing = active && count < step.text.length;

  useEffect(() => {
    /* Follow the growing line. This runs per character, but the render it
       follows is this node's alone. */
    pin();
    if (!active || !playing) return;
    if (count >= step.text.length) {
      const hold = window.setTimeout(onDone, step.holdMs);
      return () => window.clearTimeout(hold);
    }
    const tick = window.setTimeout(() => setCount((c) => c + 1), SESSION_TYPING_MS[step.role]);
    return () => window.clearTimeout(tick);
  }, [count, active, playing, step, onDone, pin]);

  const tone = step.role === 'user' ? 'ob-bubble-user' : 'ob-bubble-ai';

  return (
    <p className={`ob-bubble ${tone} ob-session-bubble`}>
      {active ? step.text.slice(0, count) : step.text}
      {typing ? <span className="ob-caret" aria-hidden="true" /> : null}
    </p>
  );
}

/** The three shapes, landing one at a time so each gets its own beat. */
function OptionsBlock({ step, active, playing, onDone, pin }: BlockProps & { step: BulletStep }) {
  const [shown, setShown] = useState(0);
  const visible = active ? shown : step.items.length;

  useEffect(() => {
    pin();
    if (!active || !playing) return;
    if (shown >= step.items.length) {
      const hold = window.setTimeout(onDone, step.holdMs);
      return () => window.clearTimeout(hold);
    }
    const tick = window.setTimeout(() => setShown((n) => n + 1), step.stepMs);
    return () => window.clearTimeout(tick);
  }, [shown, active, playing, step, onDone, pin]);

  return (
    <ul className="ob-session-options">
      {step.items.slice(0, visible).map((option: SessionOption, index: number) => (
        <li className="ob-session-option" key={option.lead}>
          <span className="ob-session-option-letter" aria-hidden="true">
            {String.fromCharCode(65 + index)}
          </span>
          <span className="ob-session-option-body">
            <span className="ob-session-option-lead">{option.lead}</span>
            <span className="ob-session-option-rest"> — {option.rest}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * **Blue's fourth job, chosen deliberately — see the note above
 * `.ob-session-lens` in styles/obsidian.css.** It is an unverified outside
 * opinion, so it never carries a checkmark, a full accent border, or the solid
 * accent fill that means verified on /r/[slug]/validate. A left rule and the
 * 12% wash, and nothing else.
 */
function Lens({ text }: { text: string }) {
  return (
    <aside className="ob-session-lens">
      <span className="ob-meta ob-session-lens-label">{SESSION.lensLabel}</span>
      <p className="ob-session-lens-text">{text}</p>
    </aside>
  );
}

/**
 * A soft nudge, never a gate — it names what is open and lets you go anyway.
 *
 * The two controls are **spans, not buttons**: this is a picture of the app, and
 * a focusable control that does nothing is a worse outcome than a depiction that
 * reads as one. It is also why the closing press is drawn rather than dispatched
 * — there is nothing here to actually click. The filled one is the only solid
 * accent in this viewport; the page's own CTAs are a ghost button in the nav and
 * a primary far below.
 */
function Finish({ step, pressed }: { step: FinishStep; pressed: boolean }) {
  return (
    <div className="ob-session-finish">
      <p className="ob-session-finish-head">{step.heading}</p>
      <p className="ob-session-finish-body">{step.body}</p>
      <div className="ob-session-finish-actions">
        <span className="ob-session-cta" data-pressed={pressed || undefined}>
          {step.primary}
          {/* Mounted only for the press, so the animation restarts on every
              replay rather than needing a key bump. The outer rings are capped
              at 19px by the scroller's clip; this one spreads inside the pill,
              so it is the part that actually reads as large. */}
          {pressed ? (
            <span className="ob-session-cta-ripple" aria-hidden="true">
              <span className="ob-session-cta-ripple-dot" />
            </span>
          ) : null}
        </span>
        <span className="ob-session-cta ob-session-cta-quiet">{step.secondary}</span>
      </div>
    </div>
  );
}
