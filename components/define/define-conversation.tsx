'use client';

import { markRunStarted, readStoredIdeaText } from '@/app/actions/create-run';
import { BRIEF, DEFINE, META_SEPARATOR, SUPPORTING } from '@/lib/content/app';
import { formatClockTime } from '@/lib/format';
import { useBriefState } from '@/lib/hooks/use-brief-state';
import { upsertRecentRun } from '@/lib/hooks/use-recent-runs';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { BRIEF_FIELD_KEYS, type Brief, type BriefFieldKey } from '@/lib/schemas/brief';
import type { Conversation } from '@/lib/schemas/conversation';
import type { Run } from '@/lib/schemas/run';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ApproveButton } from './approve-button';
import { BriefPanel } from './brief-panel';
import { BriefProgress } from './brief-progress';
import { Composer } from './composer';
import { ConsequenceLine } from './consequence-line';
import { DefineHandoff } from './define-handoff';
import { DontKnowButton } from './dont-know-button';
import type { ConversationMessage } from './message-stream';
import { MessageStream } from './message-stream';

/* The landing page's tuned typewriter values (motion.md §5b). A rest before
   each AI turn, then a hold after it, so the reader lands on the question
   rather than being handed the next one mid-sentence. */
const AI_MS_PER_CHAR = 15;
const USER_MS_PER_CHAR = 24;
const REST_MS = 420;
const HOLD_SHORT_MS = 460;
const HOLD_LONG_MS = 900;
const HOLD_THRESHOLD_CHARS = 120;

const APPROVE_SPINNER_MS = 600;
const APPROVE_NOTE_MS = 500;

/** What the AI turn currently in flight is, so `finishTurn` never has to read
 *  the transcript to work out what just finished. */
type InFlight =
  | { kind: 'seed' }
  | { kind: 'scripted'; index: number }
  | { kind: 'ack' }
  | { kind: 'closing' };

interface DefineConversationProps {
  slug: string;
  run: Run;
  brief: Brief;
  conversation: Conversation;
  /** `?sendfail=1` — the QA affordance for the failed-send state (A14). */
  sendFail?: boolean;
}

/** Under `?sendfail=1`, this send is the one that fails. */
const SENDFAIL_ON_ATTEMPT = 3;

/**
 * The Define controller: turn sequencing, which brief fields are revealed, and
 * the approve/lock/redirect flow.
 *
 * **Input can never be dropped.** The old `pendingSendRef` held exactly one
 * buffered message, so a second send while the AI was typing silently
 * overwrote the first. There is no buffer slot now: `handleSend` appends the
 * user's turn to the transcript **immediately, always**, and if the AI is busy
 * it increments a counter that the turn's completion drains. Two sends while a
 * turn streams produce two visible user turns and two answers, in order.
 *
 * **The conversation has a real end state.** Once the script runs out the
 * composer is *replaced*, not disabled; anything sent after that is answered
 * from a cycled closing-line fixture that fills no field and advances nothing.
 */
export function DefineConversation({
  slug,
  run,
  brief,
  conversation,
  sendFail = false,
}: DefineConversationProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { turns, closing, dontKnowAcks } = conversation;

  const briefState = useBriefState(slug, brief, () => readStoredIdeaText(slug));

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [resting, setResting] = useState(false);
  const [activeChips, setActiveChips] = useState<string[] | null>(null);
  const [conversationClosed, setConversationClosed] = useState(false);
  const [composerReopened, setComposerReopened] = useState(false);
  const [approved, setApproved] = useState(false);
  const [approving, setApproving] = useState(false);
  /** Whether the first question has landed — `I don't know` needs a field to
   *  mark, and a control that silently does nothing is worse than one that
   *  says why it can't. */
  const [askAvailable, setAskAvailable] = useState(false);
  /** `?sendfail=1` only. Set when a send is rejected; cleared by the next one. */
  const [sendFailed, setSendFailed] = useState(false);
  /** Bumped by `Retry`; `Composer` re-submits its own value when it changes. */
  const [retrySignal, setRetrySignal] = useState(0);

  const sendAttemptsRef = useRef(0);

  const turnIndexRef = useRef(0);
  const aiBusyRef = useRef(false);
  const pendingTurnsRef = useRef(0);
  const closingIndexRef = useRef(0);
  const ackIndexRef = useRef(0);
  /** The field the last completed AI turn asked about — what `I don't know`
   *  marks. `null` before the first question, which is when the button is
   *  unavailable rather than a no-op that looks broken. */
  const currentAskRef = useRef<BriefFieldKey | null>(null);
  const inFlightRef = useRef<InFlight | null>(null);
  const seqRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const transcriptColRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  /* Held in a ref so `finishTurn` stays stable — `TypingBody` re-runs its tick
     effect when `onDone` changes identity. */
  const revealRef = useRef(briefState.reveal);
  revealRef.current = briefState.reveal;

  const nextKey = useCallback(() => {
    seqRef.current += 1;
    return `${slug}-${seqRef.current}`;
  }, [slug]);

  /**
   * Appends the assistant entry **when the turn starts**, carrying its full
   * text plus `streaming: true`. One element, one entrance — there is no
   * separate streaming node to unmount and replace, which is what used to make
   * every AI turn animate in twice.
   */
  const beginAiTurn = useCallback(
    (text: string, flight: InFlight) => {
      aiBusyRef.current = true;
      inFlightRef.current = flight;
      setResting(true);
      setActiveChips(null);

      timerRef.current = setTimeout(
        () => {
          setResting(false);
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              text,
              streaming: true,
              key: `${slug}-ai-${seqRef.current++}`,
              msPerChar: AI_MS_PER_CHAR,
            },
          ]);
        },
        reducedRef.current ? 0 : REST_MS,
      );
    },
    [slug],
  );

  /** The next thing the AI says: the next scripted question if there is one,
   *  otherwise a cycled closing line that fills nothing. */
  const answerNext = useCallback(() => {
    const index = turnIndexRef.current;
    if (index < turns.length) {
      beginAiTurn(turns[index].text, { kind: 'scripted', index });
      return;
    }
    const line = closing[closingIndexRef.current % closing.length];
    closingIndexRef.current += 1;
    beginAiTurn(line, { kind: 'closing' });
  }, [beginAiTurn, closing, turns]);

  /* Seeds the user's own idea as the first turn, typed in after mount. Reading
     `localStorage` here rather than in a `useState` initialiser is what keeps
     the server HTML and the first client render identical (R8). */
  useEffect(() => {
    inFlightRef.current = { kind: 'seed' };
    aiBusyRef.current = true;
    setMessages([
      {
        role: 'user',
        text: readStoredIdeaText(slug) ?? run.idea_text,
        streaming: true,
        key: `${slug}-seed`,
        msPerChar: USER_MS_PER_CHAR,
      },
    ]);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [slug, run.idea_text]);

  /**
   * Stable across the whole session — `TypingBody` re-runs its tick effect
   * whenever `onDone` changes identity, and a handler that changed per render
   * would keep resetting the character timer.
   */
  const finishTurn = useCallback(
    (message: ConversationMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m.key === message.key ? { ...m, streaming: false } : m)),
      );

      const flight = inFlightRef.current;
      inFlightRef.current = null;
      if (flight === null) return;

      if (flight.kind === 'seed') {
        answerNext();
        return;
      }

      const hold = reducedRef.current
        ? 0
        : message.text.length >= HOLD_THRESHOLD_CHARS
          ? HOLD_LONG_MS
          : HOLD_SHORT_MS;

      timerRef.current = setTimeout(() => {
        if (flight.kind === 'scripted') {
          const turn = turns[flight.index];
          /* One key per dispatch — the action carries a `key`, not an array. */
          for (const key of turn.fills) revealRef.current(key);
          currentAskRef.current = turn.fills[0] ?? null;
          setAskAvailable(currentAskRef.current !== null);
          setActiveChips(turn.chips ?? null);
          turnIndexRef.current = flight.index + 1;
          if (turnIndexRef.current >= turns.length) setConversationClosed(true);
        }
        aiBusyRef.current = false;

        /* An acknowledgement is a beat, not a turn: the next scripted question
           follows it directly rather than waiting for another user message. */
        if (flight.kind === 'ack' && turnIndexRef.current < turns.length) {
          answerNext();
          return;
        }

        /* R7: take focus only when it is not already somewhere deliberate.
           Focus is never pulled out of the aside column mid-edit. */
        const active = document.activeElement;
        if (!active || active === document.body || transcriptColRef.current?.contains(active)) {
          composerRef.current?.focus();
        }

        if (pendingTurnsRef.current > 0) {
          pendingTurnsRef.current -= 1;
          answerNext();
        }
      }, hold);
    },
    [answerNext, turns],
  );

  /**
   * The single funnel for both entry points — `Composer`'s send button and
   * `MessageStream`'s suggestion chips.
   *
   * **It returns whether the send was accepted, and that return value is what
   * protects the user's text.** `Composer` clears its field only on `true`; a
   * rejected send leaves the textarea exactly as it was typed. Never losing
   * user input is a standing product promise, and this is the only surface
   * that exercises it.
   *
   * On rejection **no user turn is appended**: nothing was sent, so nothing
   * happened, and a turn on screen would claim otherwise.
   */
  const handleSend = useCallback(
    (text: string): boolean => {
      sendAttemptsRef.current += 1;

      if (sendFail && sendAttemptsRef.current === SENDFAIL_ON_ATTEMPT) {
        setSendFailed(true);
        return false;
      }

      setSendFailed(false);
      setMessages((prev) => [...prev, { role: 'user', text, key: nextKey() }]);
      setActiveChips(null);
      if (aiBusyRef.current) {
        pendingTurnsRef.current += 1;
        return true;
      }
      answerNext();
      return true;
    },
    [answerNext, nextKey, sendFail],
  );

  /**
   * `Retry` re-submits **the composer's own current value** rather than a copy
   * the controller stashed. That is the whole point: the text never left the
   * field, so there is exactly one place it lives and no way for a retry to
   * append a turn while the field still holds the same words. The signal is a
   * counter because the same text may be retried more than once.
   */
  const handleRetrySend = useCallback(() => {
    setRetrySignal((n) => n + 1);
  }, []);

  /** R5: mark the field the last question asked about, say so in the
   *  transcript in the user's own words, then play a transient acknowledgement
   *  that fills nothing and advances nothing. */
  const handleDontKnow = useCallback(() => {
    const key = currentAskRef.current;
    if (key === null) return;
    briefState.markUnknown(key);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: DEFINE.composer.dontKnow, key: nextKey() },
    ]);
    setActiveChips(null);
    const ack = dontKnowAcks[ackIndexRef.current % dontKnowAcks.length];
    ackIndexRef.current += 1;
    if (aiBusyRef.current) {
      pendingTurnsRef.current += 1;
      return;
    }
    beginAiTurn(ack, { kind: 'ack' });
  }, [beginAiTurn, briefState.markUnknown, dontKnowAcks, nextKey]);

  function handleApprove() {
    setApproving(true);
    const now = new Date().toISOString();
    setTimeout(() => {
      setApproving(false);
      setApproved(true);
      briefState.approve(now);
      markRunStarted(slug);
      upsertRecentRun({
        slug,
        oneLiner: briefState.brief.one_liner.value,
        stage: 'validating',
        updatedAt: now,
      });
    }, APPROVE_SPINNER_MS);
  }

  const streaming = resting || messages.some((message) => message.streaming);
  const showComposer = !approved && (!conversationClosed || composerReopened);

  return (
    <div className="ob-define">
      <div className="ob-define-band">
        <h1 className="ob-h2">{DEFINE.title}</h1>
        <BriefProgress
          answered={briefState.answered}
          total={BRIEF_FIELD_KEYS.length}
          unknown={briefState.unknown.length}
        />
      </div>

      <div className="ob-define-split">
        <div className="ob-define-col" ref={transcriptColRef}>
          {approved ? (
            <DefineHandoff
              slug={slug}
              reduced={reduced}
              onAdvance={() => router.push(`/r/${slug}/validate`)}
            />
          ) : (
            <>
              <MessageStream
                messages={messages}
                resting={resting}
                chips={activeChips}
                reduced={reduced}
                onChipClick={handleSend}
                onTurnDone={finishTurn}
              />

              {showComposer ? (
                <Composer
                  ref={composerRef}
                  streaming={streaming}
                  onSend={handleSend}
                  retrySignal={retrySignal}
                  notice={
                    sendFailed ? (
                      <div className="ob-send-error" role="alert">
                        <p>{SUPPORTING.sendFailed.line}</p>
                        <button type="button" className="ob-btn-bare" onClick={handleRetrySend}>
                          {SUPPORTING.sendFailed.retry}
                        </button>
                      </div>
                    ) : null
                  }
                  dontKnow={<DontKnowButton onClick={handleDontKnow} available={askAvailable} />}
                />
              ) : (
                <div className="ob-define-closed">
                  <p className="ob-meta">{DEFINE.closed.marker}</p>
                  <p className="ob-define-closed-line">{DEFINE.closed.line}</p>
                  <button
                    type="button"
                    className="ob-btn ob-btn-ghost ob-btn-sm"
                    onClick={() => setComposerReopened(true)}
                  >
                    {DEFINE.closed.reopen}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="ob-define-aside">
          <div className="ob-define-aside-head">
            {/* **A real `<h2>` wearing `.ob-eyebrow`'s register** (C17): Define's
                outline is h1 `What are you building?` → h2 `THE BRIEF`. The
                class is styling and the element is structure; `.ob-meta` sets
                family, size, weight, tracking, transform and colour in
                `@layer components`, so promoting the `<p>` changes the outline
                and not one rendered pixel. A15 asserts this. */}
            <h2 className="ob-meta">{DEFINE.briefHead}</h2>
            {briefState.approvedAt && (
              <p className="ob-meta">
                {BRIEF.approvedPrefix} {formatClockTime(briefState.approvedAt)}
                {META_SEPARATOR}
                {BRIEF.approvedSuffix}
              </p>
            )}
          </div>

          <div className="ob-define-aside-scroll">
            <BriefPanel
              brief={briefState.brief}
              revealed={briefState.revealed}
              unknown={briefState.unknown}
              edited={briefState.edited}
              approved={approved}
              onEdit={briefState.edit}
            />
          </div>

          {!approved && briefState.coreFilled && (
            <div className="ob-define-aside-foot">
              <ConsequenceLine unanswered={briefState.unanswered} />
              <ApproveButton pending={approving} onClick={handleApprove} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
