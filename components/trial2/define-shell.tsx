'use client';

import { RichText } from '@/components/trial2/rich-text';
import {
  IDEA,
  SCRIPTED_REPLY,
  SCRIPTED_SUMMARY_POINT,
  SUMMARY_POINTS,
  type SummaryPoint,
  TRANSCRIPT,
  type Turn,
} from '@/lib/content/trial2';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

type Stage = 'define' | 'validate' | 'roadmap';

const STAGES: { id: Stage; num: string; name: string; note: string }[] = [
  { id: 'define', num: '01', name: 'Define', note: 'In progress' },
  { id: 'validate', num: '02', name: 'Validate', note: 'Not started' },
  { id: 'roadmap', num: '03', name: 'Roadmap', note: 'Not started' },
];

/** Characters per tick of the scripted reply. Slow enough to read, fast enough
 *  that nobody waits — the reply lands in a little over three seconds. */
const STREAM_CHARS = 4;
const STREAM_TICK = 16;

export function DefineShell({
  rail,
  validatePreview,
  roadmapPreview,
}: {
  rail: ReactNode;
  validatePreview: ReactNode;
  roadmapPreview: ReactNode;
}) {
  const [stage, setStage] = useState<Stage>('define');

  return (
    <div className="ad-root">
      <header className="ad-topbar">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span className="ad-wordmark">Groundwork</span>
          <span className="ad-meta">Trial 2</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Not accent, and not pulsing. "Saved" is a settled state, not a
              live one — the accent's three jobs are link, active/live and focal
              point, and a status that has finished happening is none of them. */}
          <span className="ad-topbar-status">
            <span className="ad-dot ad-dot-settled" aria-hidden="true" />
            <span className="ad-meta-sm" style={{ color: 'var(--ad-body)' }}>
              Draft saved
            </span>
          </span>
          {/* The screen's only other button-shaped control. The one PRIMARY is
              the composer's Send, and holding this one back to secondary is
              what keeps that true at every scroll position. */}
          <button type="button" className="ad-btn ad-btn-secondary">
            Share
          </button>
        </div>
      </header>

      <StageRail stage={stage} onStage={setStage} />

      <main className="ad-shell">
        <aside className="ad-col ad-col-rail" aria-label="Previous ideas">
          {rail}
        </aside>

        <section
          className="ad-col ad-col-main"
          aria-label={STAGES.find((s) => s.id === stage)?.name}
        >
          {stage === 'define' ? <Define /> : null}
          {stage === 'validate' ? validatePreview : null}
          {stage === 'roadmap' ? roadmapPreview : null}
        </section>

        <aside className="ad-col ad-col-summary" aria-label="Summary so far">
          <Summary />
        </aside>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stage rail — the primary navigation                                        */
/* -------------------------------------------------------------------------- */

function StageRail({ stage, onStage }: { stage: Stage; onStage: (s: Stage) => void }) {
  return (
    <nav className="ad-stagerail" aria-label="Stages">
      {STAGES.map((s) => {
        const live = s.id === stage;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onStage(s.id)}
            aria-current={live ? 'page' : undefined}
            className={`ad-stage${live ? ' ad-stage-live' : ''}`}
          >
            <span className="ad-stage-num" aria-hidden="true">
              {s.num}
            </span>
            <span>
              <span className="ad-stage-name">{s.name}</span>
              <span className="ad-stage-note">{live ? 'Viewing' : s.note}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Define — transcript + composer                                             */
/* -------------------------------------------------------------------------- */

/**
 * The screen's one mechanic. Sending appends the turn, then the scripted reply
 * arrives character-by-character behind exactly the interface a streamed
 * response would satisfy — the swap to a real `useChat` is a change of source,
 * not of shape.
 *
 * The transcript and the summary talk to each other over a DOM CustomEvent
 * rather than through lifted state. That is deliberate: the two panels are
 * siblings in a three-column shell, and hoisting the whole transcript into the
 * shell to feed one summary row would pull every keystroke's re-render up to
 * the top of the tree. The event is the seam a real run stream would replace.
 */
function Define() {
  const [turns, setTurns] = useState<Turn[]>(TRANSCRIPT);
  const [streaming, setStreaming] = useState('');
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const turnCount = useRef(TRANSCRIPT.length);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the point is to react to length and stream progress, not to identity
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns.length, streaming]);

  useEffect(() => {
    const held = timers.current;
    return () => {
      for (const t of held) clearTimeout(t);
    };
  }, []);

  const commit = useCallback(() => {
    setStreaming('');
    setTurns((prev) => [
      ...prev,
      { id: `t-reply-${prev.length}`, role: 'agent', paragraphs: SCRIPTED_REPLY },
    ]);
    turnCount.current += 1;
    setBusy(false);
    // The count travels with the event so the summary's figure stays honest
    // without either panel owning the other's state. It is a ref rather than
    // `turns.length` read inside the updater — Strict Mode double-invokes state
    // updaters in dev, and a dispatch in there would fire the event twice.
    window.dispatchEvent(
      new CustomEvent('trial2:summary-point', { detail: { turns: turnCount.current } }),
    );
  }, []);

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text || busy) return;

    setDraft('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setBusy(true);
    setTurns((prev) => [
      ...prev,
      { id: `t-user-${prev.length}`, role: 'user', paragraphs: [text] },
    ]);
    turnCount.current += 1;

    const full = SCRIPTED_REPLY.join('\n\n');

    // Reduced motion resolves to the full static state rather than a frozen
    // partial one — a half-written sentence is worse than no animation.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      commit();
      return;
    }

    let i = 0;
    const step = () => {
      i += STREAM_CHARS;
      if (i >= full.length) {
        commit();
        return;
      }
      setStreaming(full.slice(0, i));
      timers.current.push(setTimeout(step, STREAM_TICK));
    };
    timers.current.push(setTimeout(step, 380));
  }, [draft, busy, commit]);

  return (
    <>
      <div className="ad-scroll" ref={scrollRef}>
        <div className="ad-thread">
          <div className="ad-ideahead">
            <span className="ad-meta">Working idea</span>
            <h1 className="ad-h2" style={{ marginTop: 10 }}>
              {IDEA.title}
            </h1>
            <p className="ad-sub" style={{ marginTop: 12, color: 'var(--ad-body)' }}>
              {IDEA.oneLine}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              {IDEA.chips.map((chip) => (
                <span key={chip} className="ad-chip">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {turns.map((turn) => (
            <TurnBlock key={turn.id} turn={turn} />
          ))}

          {streaming ? (
            <article className="ad-turn-agent">
              <div className="ad-turn-role">
                <span className="ad-dot" aria-hidden="true" />
                <span className="ad-meta" style={{ color: 'var(--ad-accent-text)' }}>
                  Groundwork · writing
                </span>
              </div>
              <div className="ad-turn-body" aria-live="polite">
                {streaming.split('\n\n').map((para, i, all) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: paragraphs of one streaming string, append-only
                  <p key={i}>
                    <RichText text={para} />
                    {i === all.length - 1 ? <span className="ad-caret" aria-hidden="true" /> : null}
                  </p>
                ))}
              </div>
            </article>
          ) : null}
        </div>
      </div>

      <div className="ad-composer-wrap">
        <div className="ad-composer-inner">
          <div className="ad-composer">
            <textarea
              ref={textareaRef}
              rows={1}
              value={draft}
              disabled={busy}
              placeholder="Answer, push back, or add what you know…"
              aria-label="Message"
              onChange={(e) => {
                setDraft(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 168)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            {/* The one primary button on the screen. */}
            <button
              type="button"
              className="ad-btn ad-btn-primary"
              onClick={send}
              disabled={busy || !draft.trim()}
            >
              {busy ? 'Thinking…' : 'Send'}
            </button>
          </div>

          <div className="ad-composer-foot">
            <p className="ad-hint" style={{ margin: 0 }}>
              Enter to send · “I don’t know” is a fine answer.
            </p>
            <button type="button" className="ad-btn-link">
              Approve the brief
              <span className="ad-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TurnBlock({ turn }: { turn: Turn }) {
  const user = turn.role === 'user';
  return (
    <article className={user ? 'ad-turn-user' : 'ad-turn-agent'}>
      <div className="ad-turn-role">
        <span className="ad-meta">{user ? 'You' : 'Groundwork'}</span>
      </div>
      <div className="ad-turn-body">
        {turn.paragraphs.map((para) => (
          <p key={para.slice(0, 32)}>
            <RichText text={para} />
          </p>
        ))}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary                                                                    */
/* -------------------------------------------------------------------------- */

const KIND_LABEL: Record<SummaryPoint['kind'], string> = {
  confirmed: 'Settled',
  open: 'Still open',
  ruled: 'Ruled out',
};

/**
 * Everything talked about so far, kept as three lists rather than a paragraph.
 *
 * The ruled-out row is load-bearing, not decoration: a summary where every
 * assumption was confirmed is evidence that nothing was actually tested. It
 * recedes by strikethrough and a faint mark, never by `--ad-critical` — a
 * discarded assumption is a non-event, not the user's fault, and red would also
 * collide with the accent's hue.
 */
function Summary() {
  const [points, setPoints] = useState<SummaryPoint[]>(SUMMARY_POINTS);
  const [turns, setTurns] = useState(TRANSCRIPT.length);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    const onPoint = (e: Event) => {
      setPoints((prev) =>
        prev.some((p) => p.id === SCRIPTED_SUMMARY_POINT.id)
          ? prev
          : [...prev, SCRIPTED_SUMMARY_POINT],
      );
      const detail = (e as CustomEvent<{ turns: number }>).detail;
      if (detail?.turns) setTurns(detail.turns);
      setLanded(true);
    };
    window.addEventListener('trial2:summary-point', onPoint);
    return () => window.removeEventListener('trial2:summary-point', onPoint);
  }, []);

  const groups: SummaryPoint['kind'][] = ['confirmed', 'open', 'ruled'];
  const counts = {
    turns: String(turns),
    settled: String(points.filter((p) => p.kind === 'confirmed').length),
    open: String(points.filter((p) => p.kind === 'open').length),
  };

  return (
    <>
      <div className="ad-colhead">
        {/* The summary column is linen, where `--ad-muted` is 4.44:1. */}
        <span className="ad-meta ad-on-linen">Summary so far</span>
        {/* Neutral, not accent: a provenance label is not a link, an active
            state or a focal point. */}
        <span className="ad-chip">Auto</span>
      </div>

      <div className="ad-scroll">
        <div className="ad-sumbody">
          <div className="ad-card">
            <div className="ad-figrow">
              {[
                { value: counts.turns, label: 'Turns' },
                { value: counts.settled, label: 'Settled' },
                { value: counts.open, label: 'Open' },
              ].map((fig) => (
                <div key={fig.label} className="ad-fig">
                  <span className="ad-fig-num">{fig.value}</span>
                  <span className="ad-meta-sm" style={{ color: 'var(--ad-muted)' }}>
                    {fig.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {groups.map((kind) => {
            const rows = points.filter((p) => p.kind === kind);
            if (!rows.length) return null;
            return (
              <div key={kind} className="ad-card">
                <div className="ad-card-label">
                  <span className="ad-meta">{KIND_LABEL[kind]}</span>
                  <span
                    className={
                      kind === 'confirmed'
                        ? 'ad-chip ad-chip-positive'
                        : kind === 'open'
                          ? 'ad-chip ad-chip-caution'
                          : 'ad-chip'
                    }
                  >
                    {rows.length}
                  </span>
                </div>

                {rows.map((point) => {
                  const isNew = landed && point.id === SCRIPTED_SUMMARY_POINT.id;
                  return (
                    <div
                      key={point.id}
                      className={`ad-sumrow ad-sumrow-${kind}${isNew ? ' ad-sumrow-new' : ''}`}
                    >
                      <span className="ad-sumrow-mark" aria-hidden="true" />
                      <span>{kind === 'ruled' ? <s>{point.text}</s> : point.text}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <p className="ad-xs" style={{ color: 'var(--ad-body)', margin: '2px 4px 0' }}>
            Rewritten after every turn. Nothing is added that you did not say or confirm.
          </p>
        </div>
      </div>
    </>
  );
}
