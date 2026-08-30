import type { Turn } from '@/lib/content/trial3';
import { type FormEvent, type KeyboardEvent, useEffect, useRef } from 'react';

/**
 * The centre column — the Define conversation.
 *
 * **Only one side of this is a bubble.** The user's own turn sits on
 * `--au-raised`, the single level above a card and the one job that token has;
 * the assistant's turn is plain ink on the paper with a mono label above it.
 * Bubbling both sides would make the page a chat app, and what this is meant
 * to read as is a document being written by two people.
 *
 * Space for the streaming reply is reserved by the turn's own label row, which
 * mounts before the first character arrives — so the composer never jumps when
 * text lands.
 */
export function DefineThread({
  title,
  turns,
  streaming,
  seed,
  draft,
  onDraft,
  onSend,
  approved,
  ready,
}: {
  title: string;
  turns: Turn[];
  streaming: string | null;
  seed: string | null;
  draft: string;
  onDraft: (value: string) => void;
  onSend: (text: string) => void;
  approved: boolean;
  /** The script is exhausted — the composer's action becomes Approve. */
  ready: boolean;
}) {
  const threadRef = useRef<HTMLDivElement>(null);

  // Follow the tail. `streaming` changes on every tick, which is exactly the
  // cadence this needs; there is no smooth-scroll here because the page-level
  // `scroll-behavior: smooth` would fight the timer.
  useEffect(() => {
    const node = threadRef.current;
    if (!node) return;
    if (turns.length === 0 && streaming === null) return;
    node.scrollTop = node.scrollHeight;
  }, [turns, streaming]);

  const busy = streaming !== null;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || ready) return;
    const text = draft.trim() || seed;
    if (text) onSend(text);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit(event);
    }
  }

  return (
    <>
      <div ref={threadRef} className="au-ws-thread" role="log" aria-live="polite">
        <div className="flex items-baseline justify-between gap-6">
          <h2 className="au-h3">{title}</h2>
          <span className="au-meta au-meta-sm">Define</span>
        </div>

        <hr className="au-rule mt-4 mb-8" />

        {turns.map((turn, index) => (
          <article
            // biome-ignore lint/suspicious/noArrayIndexKey: append-only transcript
            key={index}
            className={`au-ws-turn${index >= 5 ? ' au-reveal' : ''}`}
            data-role={turn.role}
          >
            <header className="au-ws-turn-head">
              <span className="au-meta au-meta-xs">
                {turn.role === 'user' ? 'You' : 'Groundwork'}
              </span>
            </header>

            {turn.role === 'user' ? (
              <p className="au-ws-said au-sm">{turn.text}</p>
            ) : (
              <p className="au-body au-ws-body-text">{turn.text}</p>
            )}
          </article>
        ))}

        {streaming !== null ? (
          <article className="au-ws-turn" data-role="assistant">
            <header className="au-ws-turn-head">
              <span className="au-meta au-meta-xs">Groundwork</span>
            </header>
            <p className="au-body au-ws-body-text">
              {streaming}
              <span className="au-caret" aria-hidden="true" />
            </p>
          </article>
        ) : null}

        {approved ? (
          <p className="au-meta au-meta-sm mt-8">Brief approved · research queued</p>
        ) : null}
      </div>

      <div className="au-ws-foot">
        <form className="au-composer" onSubmit={submit}>
          <div className="px-5 pt-4">
            <textarea
              rows={2}
              value={draft}
              placeholder={
                ready
                  ? 'Nine of nine fields. Ready when you are.'
                  : 'Answer, or say you don’t know…'
              }
              onChange={(event) => onDraft(event.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Reply"
              disabled={ready}
            />
          </div>

          <div className="flex items-center justify-between gap-4 px-5 pb-4">
            {/* The seed is withdrawn while a reply is streaming rather than
                merely disabled: left on screen it is the suggestion that was
                just used, and it reads as a stale prompt to repeat yourself.
                Status is what the meta layer is for — a one-word label, not a
                sentence. */}
            <div className="au-ws-seedrow">
              {seed && !ready && !busy ? (
                <button type="button" className="au-seed" onClick={() => onSend(seed)}>
                  {seed}
                </button>
              ) : (
                <span className="au-meta au-meta-xs">
                  {busy ? 'Writing…' : ready ? '9 of 9 fields' : 'Shift + Enter for a new line'}
                </span>
              )}
            </div>

            {/* The one filled button on this screen. When the script runs out
                it becomes Approve rather than gaining a second primary. */}
            <button
              type={ready ? 'button' : 'submit'}
              className="au-btn au-btn-primary"
              disabled={busy || approved}
              onClick={ready ? () => onSend('__approve__') : undefined}
            >
              {approved ? 'Approved' : ready ? 'Approve brief' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
