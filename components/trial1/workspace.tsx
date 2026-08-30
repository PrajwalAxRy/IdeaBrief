'use client';

import { ChatRail } from '@/components/trial1/chat-rail';
import { Composer } from '@/components/trial1/composer';
import { SummaryPanel } from '@/components/trial1/summary-panel';
import { ThreadPending, ThreadTurn } from '@/components/trial1/thread';
import { CHATS, DEFAULT_CHAT_ID, SCRIPTED_REPLY, type Turn } from '@/lib/content/trial1';
import { useEffect, useRef, useState } from 'react';

/** How long the scripted reply pretends to think. */
const REPLY_DELAY_MS = 900;

/**
 * The three panes and the state they share.
 *
 * This is the page's only client boundary, and it is drawn here rather than
 * further down because all three panes read one piece of state — which chat is
 * open. Pushing the boundary to the leaves would mean either a context or three
 * separate islands re-deriving the same thing, both of which cost more than the
 * one `useState` they would be avoiding.
 *
 * It returns a fragment of three grid items, not a wrapper. `.rl-app` is the
 * grid and its columns are declared once; an extra `<div>` here would collapse
 * all three panes into a single column with no error and no obvious cause.
 *
 * Nothing streams and nothing is generated — sending appends the typed text and
 * then a fixture on a `setTimeout`, the same shape as the research run in the
 * main app (CLAUDE.md, "The three seams").
 */
export function Workspace() {
  const [activeId, setActiveId] = useState(DEFAULT_CHAT_ID);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  /** Turns added during this session, keyed by chat. The fixture is untouched. */
  const [appended, setAppended] = useState<Record<string, Turn[]>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chat = CHATS.find((candidate) => candidate.id === activeId) ?? CHATS[0];
  const turns = [...chat.turns, ...(appended[chat.id] ?? [])];

  /* Pin to the newest turn on send, on reply, and on switching chat. Switching
     is the one people forget: without `activeId` in the deps you land halfway
     up a conversation you have never seen. */
  /* All three deps are triggers rather than inputs — the effect reads the DOM
     node, not them. Drop any one and the pane silently stops following:
     `activeId` is the easy one to miss, and without it switching chat lands you
     halfway up a conversation you have never seen. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: deps are scroll triggers, not read
  useEffect(() => {
    const pane = scrollRef.current;
    if (!pane) return;
    pane.scrollTop = pane.scrollHeight;
  }, [turns.length, pending, activeId]);

  /* A reply in flight when the component unmounts would fire into nothing and
     warn. Clearing on unmount is the whole fix. */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleSend() {
    const text = draft.trim();
    if (!text || pending) return;

    const userTurn: Turn = {
      id: `local-${chat.id}-${turns.length}`,
      role: 'user',
      paragraphs: [text],
    };

    setAppended((current) => ({
      ...current,
      [chat.id]: [...(current[chat.id] ?? []), userTurn],
    }));
    setDraft('');
    setPending(true);

    timerRef.current = setTimeout(() => {
      setAppended((current) => ({
        ...current,
        [chat.id]: [
          ...(current[chat.id] ?? []),
          { ...SCRIPTED_REPLY, id: `reply-${chat.id}-${turns.length}` },
        ],
      }));
      setPending(false);
    }, REPLY_DELAY_MS);
  }

  return (
    <>
      <ChatRail
        chats={CHATS}
        activeId={chat.id}
        onSelect={(id) => {
          if (timerRef.current) clearTimeout(timerRef.current);
          setPending(false);
          setActiveId(id);
        }}
      />

      <main className="rl-thread">
        <div ref={scrollRef} className="rl-thread__scroll">
          <div className="rl-thread__measure">
            {/* The conversation's own header. It gives the thread a top edge and
                names what is being defined, so the pane does not simply start
                mid-sentence when you scroll to the top. */}
            <div className="mb-7">
              <p className="rl-meta mb-2">Define</p>
              <h1 className="rl-h2">{chat.title}</h1>
            </div>

            {turns.map((turn) => (
              <ThreadTurn key={turn.id} turn={turn} />
            ))}

            {pending ? <ThreadPending /> : null}
          </div>
        </div>

        <Composer value={draft} onChange={setDraft} onSend={handleSend} disabled={pending} />
      </main>

      <SummaryPanel summary={chat.summary} />
    </>
  );
}
