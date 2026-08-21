'use client';

import { DEFINE } from '@/lib/content/app';
import { useEffect, useState } from 'react';
import { TypingBody } from './typing-body';

/**
 * One turn — typeset, not a bubble, and **actually differentiated** (D11).
 *
 * The AI's turns are chalk because they are the document: they are the
 * questions the brief is built from and the only new text on the page. The
 * user's own words are context they already know, so they take the muted body
 * colour, a tighter measure and an indent behind a hairline. That is the same
 * chalk/muted contrast the rest of Obsidian runs on.
 *
 * **The double entrance is fixed structurally.** There is no separate
 * streaming node: the controller appends the assistant turn when it *starts*,
 * carrying its full text plus `streaming: true`, and this component swaps
 * `TypingBody` for plain text inside the **same** `.ob-msg` element. The
 * wrapper never unmounts, so its entrance transition runs exactly once.
 */
export function Message({
  role,
  text,
  streaming = false,
  typingKey,
  msPerChar,
  reduced,
  onDone,
  onGrow,
}: {
  role: 'user' | 'assistant';
  text: string;
  streaming?: boolean;
  typingKey?: string;
  msPerChar?: number;
  reduced?: boolean;
  onDone?: () => void;
  onGrow?: () => void;
}) {
  /* Flipped one rAF after mount so the transition has two frames to run
     against — set in the insertion frame it would never play. */
  const [entering, setEntering] = useState(true);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntering(false));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="ob-msg" data-role={role} data-entering={entering || undefined}>
      <p className="ob-msg-role">
        {role === 'assistant' ? DEFINE.roles.assistant : DEFINE.roles.user}
      </p>
      <p className="ob-msg-body">
        {streaming && typingKey ? (
          <TypingBody
            key={typingKey}
            text={text}
            msPerChar={msPerChar ?? 15}
            reduced={reduced ?? false}
            onDone={onDone ?? (() => {})}
            onGrow={onGrow}
          />
        ) : (
          text
        )}
      </p>
    </div>
  );
}
