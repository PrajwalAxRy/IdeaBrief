import type { Fragment, Turn } from '@/lib/content/trial1';

/**
 * A drawn UI fragment inside an assistant turn.
 *
 * Rule 9: the payload is a drawn fragment before it is prose. "I've written
 * three things into your brief" is a sentence that costs a line and proves
 * nothing; the same three things as labelled rows are the brief, visibly being
 * written. Linen panel on the canvas thread — one tier, so the step is real.
 */
function TurnFragment({ fragment }: { fragment: Fragment }) {
  return (
    <div className="rl-panel p-3">
      <p className="rl-meta-sm rl-on-tint mb-2 px-1">{fragment.title}</p>

      <ul className="flex flex-col gap-1">
        {fragment.kind === 'captured'
          ? fragment.rows.map((row) => (
              <li key={row.label} className="rl-row">
                <span className="rl-meta-sm shrink-0 w-[112px]">{row.label}</span>
                <span className="rl-sm">{row.value}</span>
              </li>
            ))
          : fragment.rows.map((row) => (
              <li key={row.domain} className="rl-row">
                <span className="rl-meta-sm shrink-0 w-[112px]">{row.domain}</span>
                <span className="rl-sm">{row.note}</span>
              </li>
            ))}
      </ul>
    </div>
  );
}

/**
 * One turn.
 *
 * **The two roles are deliberately asymmetric, and this is the invented part of
 * the screen.** Riley specifies cards, panels and rows but says nothing about a
 * chat transcript. Mirrored bubbles — the obvious default — make any product
 * look like a chat toy, and this one is not a chat: the conversation is how a
 * written brief gets made. So the assistant speaks as flat prose directly on the
 * canvas, reading as the document, and the user's turns sit on top of it in
 * paper cards, reading as asides. The measure caps the assistant at 720px and
 * the user at 520px, which also stops a one-line reply stretching to a full
 * viewport width.
 */
export function ThreadTurn({ turn }: { turn: Turn }) {
  if (turn.role === 'user') {
    return (
      <article className="rl-turn rl-turn--user">
        <div className="rl-turn__body">
          {turn.paragraphs.map((text) => (
            <p key={text} className="rl-body">
              {text}
            </p>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article className="rl-turn">
      <div className="rl-turn__label">
        <span className="rl-meta">Groundwork</span>
      </div>

      <div className="rl-turn__body">
        {turn.paragraphs.map((text) => (
          <p key={text} className="rl-body">
            {text}
          </p>
        ))}

        {turn.fragment ? <TurnFragment fragment={turn.fragment} /> : null}

        {turn.chips ? (
          <div className="flex flex-wrap gap-2">
            {turn.chips.map((chip) => (
              <span
                key={chip.label}
                className={`rl-chip${chip.tone && chip.tone !== 'neutral' ? ` rl-chip--${chip.tone}` : ''}`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

/**
 * The pending state.
 *
 * Three dots on `--rl-accent` — the accent's live/active job, and the only
 * moment on this page it appears as a mark in the thread. It occupies a real
 * turn slot with a reserved 20px height, so the reply lands without the thread
 * jumping under the reader.
 */
export function ThreadPending() {
  return (
    <article className="rl-turn" aria-live="polite" aria-label="Groundwork is replying">
      <div className="rl-turn__label">
        <span className="rl-meta">Groundwork</span>
      </div>
      <span className="rl-typing" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </article>
  );
}
