'use client';

import { RestIndicator } from '@/components/ui/rest-indicator';
import { useEffect, useRef, useState } from 'react';
import { Message } from './message';
import { SuggestionChip } from './suggestion-chip';

interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface MessageStreamProps {
  messages: ConversationMessage[];
  /** The AI turn currently being revealed character-by-character, if any. */
  streamingText: string | null;
  /** Three-dot rest indicator — the AI turn hasn't started streaming yet. */
  resting: boolean;
  chips: string[] | null;
  onChipClick: (text: string) => void;
}

/**
 * Typeset transcript, not bubbles. Handles streaming append, scroll
 * anchoring, and the "user scrolled up" suspension with the `↓ New message`
 * pill — this column is its own scrollable region (see the height set by
 * `DefineConversation`), independent of the page's own scroll.
 */
export function MessageStream({
  messages,
  streamingText,
  resting,
  chips,
  onChipClick,
}: MessageStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [showNewMessagePill, setShowNewMessagePill] = useState(false);

  function isAtBottom(el: HTMLDivElement) {
    return el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  }

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = isAtBottom(el);
    setUserScrolledUp(!atBottom);
    if (atBottom) setShowNewMessagePill(false);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages.length/streamingText/resting are re-run triggers (new content arriving), not values read in the body
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!userScrolledUp) {
      el.scrollTop = el.scrollHeight;
    } else {
      setShowNewMessagePill(true);
    }
  }, [messages.length, streamingText, resting, userScrolledUp]);

  function scrollToBottom() {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    setUserScrolledUp(false);
    setShowNewMessagePill(false);
  }

  return (
    <div className="relative flex h-full flex-col">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="message-stream flex flex-1 flex-col gap-8 overflow-y-auto"
      >
        {messages.map((message, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the transcript is append-only and never reordered
          <Message key={index} role={message.role} text={message.text} />
        ))}

        {resting && (
          <div className="message">
            <span className="message-role-marker">
              <span className="message-marker-glyph--ai">▸</span> AI
            </span>
            <RestIndicator />
          </div>
        )}

        {streamingText !== null && (
          // biome-ignore lint/a11y/useValidAriaRole: `role` is Message's own prop (conversation turn role), not an HTML aria-role passthrough
          <Message role="assistant" text={streamingText} />
        )}

        {chips && chips.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-0">
            {chips.map((chip) => (
              <SuggestionChip key={chip} text={chip} onClick={() => onChipClick(chip)} />
            ))}
          </div>
        )}
      </div>

      {showNewMessagePill && (
        <button type="button" className="new-message-pill" onClick={scrollToBottom}>
          ↓ New message
        </button>
      )}
    </div>
  );
}
