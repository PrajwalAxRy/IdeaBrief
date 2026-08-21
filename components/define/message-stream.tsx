'use client';

import { RestIndicator } from '@/components/ui/rest-indicator';
import { DEFINE } from '@/lib/content/app';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from './message';
import { SuggestionChip } from './suggestion-chip';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
  streaming?: boolean;
  /** Stable across the turn's life — `TypingBody`'s reset key. */
  key: string;
  msPerChar?: number;
}

interface MessageStreamProps {
  messages: ConversationMessage[];
  /** Three-dot rest indicator — the AI turn hasn't started typing yet. */
  resting: boolean;
  chips: string[] | null;
  reduced: boolean;
  onChipClick: (text: string) => void;
  /** Receives the whole message so the controller never has to read the
   *  transcript back to work out what finished. */
  onTurnDone: (message: ConversationMessage) => void;
}

/**
 * The transcript's scrollport.
 *
 * **R11 is fixed structurally.** The `↓ New message` pill used to be a
 * *sibling* of the scroll container, so `position: sticky` had no scrollport
 * and it became a static flex item squeezing the transcript. It is now
 * absolutely positioned against `.ob-define-scrollwrap`, outside the column
 * grid entirely, so it cannot take space from anything.
 *
 * **Scroll follow never re-renders React** (motion.md §7): `onGrow` writes
 * `scrollTop` straight to the node. The 48px "user scrolled up" suspension
 * gates both that and the pill.
 */
export function MessageStream({
  messages,
  resting,
  chips,
  reduced,
  onChipClick,
  onTurnDone,
}: MessageStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [showNewMessagePill, setShowNewMessagePill] = useState(false);
  const suspendedRef = useRef(false);
  suspendedRef.current = userScrolledUp;

  function isAtBottom(el: HTMLDivElement) {
    return el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = isAtBottom(el);
    setUserScrolledUp(!atBottom);
    if (atBottom) setShowNewMessagePill(false);
  }

  /** Stable, and writes to the DOM directly — never through state. */
  const stickToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (suspendedRef.current) {
      setShowNewMessagePill(true);
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages.length and resting are re-run triggers (new content arriving), not values read in the body
  useEffect(() => {
    stickToBottom();
  }, [messages.length, resting, stickToBottom]);

  function scrollToBottom() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    setUserScrolledUp(false);
    setShowNewMessagePill(false);
  }

  return (
    <div className="ob-define-scrollwrap">
      {/* One announcement per **completed** turn, at the moment it arrives, and
          none per character. The visible transcript is hidden from the
          accessibility tree so a typing paragraph is never read letter by
          letter; `RestIndicator` keeps its own "AI is composing" label, so
          previously only the *waiting* was announced and never the answer. */}
      <div className="sr-only" role="log" aria-live="polite" aria-relevant="additions">
        {messages
          .filter((message) => !message.streaming)
          .map((message) => (
            <p key={message.key}>
              {message.role === 'assistant' ? 'Groundwork: ' : 'You: '}
              {message.text}
            </p>
          ))}
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="ob-define-scroll" aria-hidden="true">
        <div className="ob-define-thread">
          {messages.map((message) => (
            <Message
              key={message.key}
              typingKey={message.key}
              role={message.role}
              text={message.text}
              streaming={message.streaming}
              msPerChar={message.msPerChar}
              reduced={reduced}
              onDone={() => onTurnDone(message)}
              onGrow={stickToBottom}
            />
          ))}

          {resting && (
            <div className="ob-msg" data-role="assistant">
              <p className="ob-msg-role">{DEFINE.roles.assistant}</p>
              <RestIndicator />
            </div>
          )}

          {chips && chips.length > 0 && (
            <div className="ob-define-chips gap-2">
              {chips.map((chip) => (
                <SuggestionChip key={chip} text={chip} onClick={() => onChipClick(chip)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showNewMessagePill && (
        <button type="button" className="ob-define-newmsg" onClick={scrollToBottom}>
          {DEFINE.newMessage}
        </button>
      )}
    </div>
  );
}
