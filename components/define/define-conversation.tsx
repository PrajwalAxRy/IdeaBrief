'use client';

import { markRunStarted, readStoredIdeaText } from '@/app/actions/create-run';
import { TwoColumn } from '@/components/layout/two-column';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { upsertRecentRun } from '@/lib/hooks/use-recent-runs';
import type { Brief, BriefFieldKey } from '@/lib/schemas/brief';
import type { ConversationTurn } from '@/lib/schemas/conversation';
import type { Run } from '@/lib/schemas/run';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BriefPanel } from './brief-panel';
import { Composer } from './composer';
import { MessageStream } from './message-stream';

const REST_MS = 700;
const CHARS_PER_TICK = 2;
const TICK_MS = 16;
const APPROVE_SPINNER_MS = 300;
const APPROVE_NOTE_MS = 500;

interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface DefineConversationProps {
  slug: string;
  run: Run;
  brief: Brief;
  conversation: ConversationTurn[];
}

function resolveIdeaText(slug: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return readStoredIdeaText(slug) ?? fallback;
}

/**
 * The shared state controller for the Define conversation and Brief Panel —
 * the logged 14th `'use client'` component (see the P5 build log). Owns the
 * turn sequencing, the character-stream reveal, which brief fields are
 * revealed, and the approve/lock/redirect flow. Field-level editing state
 * lives in `BriefPanel` itself, not here.
 */
export function DefineConversation({ slug, run, brief, conversation }: DefineConversationProps) {
  const router = useRouter();
  const [ideaText] = useState(() => resolveIdeaText(slug, run.idea_text));
  const [messages, setMessages] = useState<ConversationMessage[]>(() => [
    { role: 'user', text: ideaText },
  ]);
  const [resting, setResting] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [revealedFields, setRevealedFields] = useState<Set<BriefFieldKey>>(
    () => new Set<BriefFieldKey>(['one_liner']),
  );
  const [activeChips, setActiveChips] = useState<string[] | null>(null);
  const [approved, setApproved] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approvedAt, setApprovedAt] = useState<string | null>(null);

  const turnIndexRef = useRef(0);
  const aiBusyRef = useRef(false);
  const pendingSendRef = useRef<string | null>(null);
  const restTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    startAiTurn(0);
    return () => {
      if (restTimerRef.current) clearTimeout(restTimerRef.current);
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
    // Runs exactly once on mount to kick off the scripted conversation.
  }, []);

  function startAiTurn(index: number) {
    if (index >= conversation.length) return;
    aiBusyRef.current = true;
    setResting(true);
    setActiveChips(null);

    restTimerRef.current = setTimeout(() => {
      setResting(false);
      const fullText = conversation[index].text;
      let shown = 0;
      setStreamingText('');

      streamTimerRef.current = setInterval(() => {
        shown += CHARS_PER_TICK;
        if (shown >= fullText.length) {
          if (streamTimerRef.current) clearInterval(streamTimerRef.current);
          finishAiTurn(index, fullText);
        } else {
          setStreamingText(fullText.slice(0, shown));
        }
      }, TICK_MS);
    }, REST_MS);
  }

  function finishAiTurn(index: number, fullText: string) {
    const turn = conversation[index];
    setMessages((prev) => [...prev, { role: 'assistant', text: fullText }]);
    setStreamingText(null);
    setRevealedFields((prev) => new Set([...prev, ...turn.fills]));
    setActiveChips(turn.chips ?? null);
    turnIndexRef.current = index + 1;
    aiBusyRef.current = false;
    composerRef.current?.focus();

    if (pendingSendRef.current !== null) {
      const buffered = pendingSendRef.current;
      pendingSendRef.current = null;
      sendUserTurn(buffered);
    }
  }

  function sendUserTurn(text: string) {
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setActiveChips(null);
    const nextIndex = turnIndexRef.current;
    if (nextIndex < conversation.length) {
      startAiTurn(nextIndex);
    }
  }

  function handleSend(text: string) {
    if (aiBusyRef.current) {
      pendingSendRef.current = text;
      return;
    }
    sendUserTurn(text);
  }

  function handleDontKnow() {
    handleSend("I don't know");
  }

  function handleApprove() {
    setApproving(true);
    const now = new Date().toISOString();
    setTimeout(() => {
      setApproving(false);
      setApproved(true);
      setApprovedAt(now);
      markRunStarted(slug);
      upsertRecentRun({ slug, oneLiner: ideaText, stage: 'validating', updatedAt: now });
      setTimeout(() => {
        router.push(`/r/${slug}/validate`);
      }, APPROVE_NOTE_MS);
    }, APPROVE_SPINNER_MS);
  }

  return (
    <div className="flex flex-col gap-8">
      <DisplayHeadline as="h1" muted="Let's work out" bright="what you're building." />

      <TwoColumn
        sidebarWidth={400}
        main={
          <div className="flex flex-col" style={{ height: 'calc(100vh - 420px)', minHeight: 480 }}>
            <MessageStream
              messages={messages}
              streamingText={streamingText}
              resting={resting}
              chips={approved ? null : activeChips}
              onChipClick={handleSend}
            />
            {approved ? (
              <p className="pt-4" style={{ color: 'var(--text-tertiary)' }}>
                This page is your run. Bookmark it — there's no login to get back.
              </p>
            ) : (
              <Composer
                ref={composerRef}
                streaming={resting || streamingText !== null}
                onSend={handleSend}
                onDontKnow={handleDontKnow}
              />
            )}
          </div>
        }
        sidebar={
          <BriefPanel
            brief={brief}
            oneLinerOverride={ideaText}
            revealedFields={revealedFields}
            approved={approved}
            approving={approving}
            approvedAt={approvedAt}
            onApprove={handleApprove}
          />
        }
      />
    </div>
  );
}
