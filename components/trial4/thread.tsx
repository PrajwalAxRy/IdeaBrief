'use client';

import type { Turn } from '@/lib/content/trial4';
import { useEffect, useRef } from 'react';

type Props = {
  title: string;
  filled: number;
  total: number;
  turns: Turn[];
  /** The reply currently arriving, or `null` when nothing is in flight. */
  streaming: string | null;
  /** The seed under the composer for the next scripted step, if there is one. */
  seed: string | null;
  draft: string;
  onDraft: (value: string) => void;
  onSend: (text: string) => void;
  onApprove: () => void;
  onOpenResearch: () => void;
  /** The script has run out — the composer becomes the approve hand-off. */
  ready: boolean;
  /** The brief has been approved. The hand-off settles; the primary goes away. */
  approved: boolean;
};

/**
 * The centre column: the Define conversation.
 *
 * **`'use client'` is here for one reason** — the transcript has to follow the
 * text as it streams, and that needs a ref and a layout effect. Everything else
 * in the column is presentational. The alternative was pushing the scroll into
 * `Workspace`, which would mean a ref threaded through props to reach a DOM
 * node two levels down.
 *
 * Nothing here calls a model. The reply arriving character-by-character is a
 * fixed string from `lib/content/trial4.ts` being revealed on a timer.
 */
export function Thread({
  title,
  filled,
  total,
  turns,
  streaming,
  seed,
  draft,
  onDraft,
  onSend,
  onApprove,
  onOpenResearch,
  ready,
  approved,
}: Props) {
  const scroll = useRef<HTMLDivElement>(null);

  /* Turns already on screen at mount are not "arriving" and must not animate in
     — otherwise the page loads with six bubbles sliding up at once, which reads
     as a loading state the route does not have. Captured once, deliberately. */
  const settledCount = useRef(turns.length);

  /* Follow the text down. `scroll-behavior: smooth` lives on `.t4-scroll` and
     is pinned to `auto` under reduced motion — a smooth scroll is neither a
     transition nor an animation, so the global blanket cannot reach it. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: the turn count and the stream are re-run triggers (new content arriving), not values the body reads — it writes to the DOM
  useEffect(() => {
    const node = scroll.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [turns.length, streaming]);

  const submit = () => {
    const text = draft.trim();
    if (text.length > 0) onSend(text);
  };

  return (
    <>
      <div className="t4-head">
        <span className="ob-sub t4-thread-title">{title}</span>
        <span className="ob-meta">{`${filled} of ${total} fields`}</span>
      </div>

      <div className="t4-scroll" ref={scroll}>
        <div className="t4-thread">
          {turns.map((turn, index) => (
            <div
              /* Turns are append-only and never reordered, so the index is a
                 stable identity here — two identical replies are still two
                 different turns and must not share a key. */
              // biome-ignore lint/suspicious/noArrayIndexKey: append-only log
              key={index}
              className={`t4-turn${index >= settledCount.current ? ' t4-turn-in' : ''}`}
              data-role={turn.role}
            >
              <span className="ob-meta">{turn.role === 'user' ? 'You' : 'Groundwork'}</span>
              <p className={`ob-bubble ob-bubble-${turn.role === 'user' ? 'user' : 'ai'}`}>
                {turn.text}
              </p>
            </div>
          ))}

          {streaming !== null ? (
            <div className="t4-turn" data-role="assistant">
              <span className="ob-meta">Groundwork</span>
              <p className="ob-bubble ob-bubble-ai" aria-live="polite">
                {streaming}
                <span className="ob-caret" aria-hidden="true" />
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="t4-foot">
        <div className="t4-foot-inner">
          {ready ? (
            /* The one primary button on the screen. The composer is replaced
               rather than joined — a live Send beside a live Approve is how the
               "exactly one primary per viewport" rule usually gets broken. */
            <div className="t4-approve" data-approved={approved}>
              <div>
                <p className="ob-sm t4-approve-line">
                  {approved
                    ? 'Brief approved. Research is running against all nine fields.'
                    : 'Nine fields, all yours. Approve the brief and research starts.'}
                </p>
                <p className="ob-meta mt-1.5">
                  {approved ? 'Findings appear under Validate' : 'Nothing in it was invented'}
                </p>
              </div>

              {approved ? (
                <button type="button" className="ob-btn ob-btn-ghost" onClick={onOpenResearch}>
                  Open research
                </button>
              ) : (
                <button type="button" className="ob-btn ob-btn-primary" onClick={onApprove}>
                  Approve brief
                </button>
              )}
            </div>
          ) : (
            <>
              {seed !== null ? (
                <div className="t4-seeds">
                  <span className="ob-meta">Try</span>
                  <button
                    type="button"
                    className="ob-seed"
                    onClick={() => onSend(seed)}
                    disabled={streaming !== null}
                  >
                    {seed}
                  </button>
                </div>
              ) : null}

              <div className="ob-composer">
                <div className="t4-composer-row">
                  <textarea
                    rows={2}
                    value={draft}
                    placeholder="Answer in your own words…"
                    aria-label="Your reply"
                    disabled={streaming !== null}
                    onChange={(event) => onDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        submit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="ob-btn ob-btn-primary"
                    disabled={streaming !== null || draft.trim().length === 0}
                    onClick={submit}
                  >
                    Send
                  </button>
                </div>
              </div>

              <p className="ob-meta mt-2.5">Enter to send · Shift + Enter for a new line</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
