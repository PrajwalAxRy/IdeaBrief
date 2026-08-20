'use client';

import { createRun } from '@/app/actions/create-run';
import { CHAT_SCRIPT, CHAT_SECTION, type ChatTurn } from '@/lib/content/landing';
import { useInView } from '@/lib/hooks/use-in-view';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHead } from './section-head';

const SHORTCUT_HINT_AT = 16;

/**
 * The closing section: a scripted exchange that types itself when it scrolls
 * into view, sitting directly above the live composer that actually starts a
 * run. Demo and call-to-action are the same surface, so the page has exactly
 * one input rather than a hero box competing with a preview.
 *
 * The composer is real — it calls `createRun` and navigates to /r/[slug]/define,
 * the same path the old entry box used.
 */
export function CofounderChat() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const [reduced, setReduced] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const advance = useCallback(() => setTurnIndex((i) => i + 1), []);

  const replay = useCallback(() => {
    setTurnIndex(0);
    setRunId((n) => n + 1);
  }, []);

  const playing = inView && !reduced;
  const settled = reduced || turnIndex >= CHAT_SCRIPT.length;
  const completed = settled ? CHAT_SCRIPT : CHAT_SCRIPT.slice(0, turnIndex);
  const typing = playing && !settled ? CHAT_SCRIPT[turnIndex] : undefined;

  return (
    <section id="start" className="ob-section" aria-labelledby="chat-headline">
      <div className="ob-container">
        <SectionHead
          index="03"
          id="chat-headline"
          eyebrow={CHAT_SECTION.eyebrow}
          headlineLines={['Talk to it.']}
          lead={CHAT_SECTION.lead}
          className="max-w-[62ch]"
        />

        {/* Narrower than the container: a conversation at full 1200px width
            stops reading as a conversation. */}
        <ScrollReveal delay={140} className="mx-auto mt-20 max-w-[900px]">
          <div className="ob-frag" ref={ref}>
            <div className="ob-frag-bar">
              <span className="ob-meta ob-meta-bright flex items-center gap-2.5">
                <span className="ob-dot" aria-hidden="true" />
                Define
              </span>
              <button type="button" className="ob-btn ob-btn-bare ob-meta gap-2" onClick={replay}>
                <RotateCcw size={12} aria-hidden="true" />
                {CHAT_SECTION.replayLabel}
              </button>
            </div>

            {/* Height is reserved for the finished transcript, so nothing below
                moves as turns arrive. */}
            <div
              className="flex min-h-[520px] flex-col gap-4 p-8"
              aria-live="polite"
              aria-atomic="false"
            >
              {completed.map((turn, i) => (
                <Bubble key={`${runId}-${i}-${turn.text.slice(0, 12)}`} turn={turn} />
              ))}
              {typing ? (
                <TypingBubble key={`${runId}-typing-${turnIndex}`} turn={typing} onDone={advance} />
              ) : null}
            </div>

            <div className="ob-frag-foot p-8">
              <Composer />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={220}>
          {/* Sentence case, not the mono meta layer — it is a full sentence and
              uppercase mono at this length is unreadable. */}
          <p className="ob-body mx-auto mt-8 max-w-[62ch] text-center text-[15px]">
            {CHAT_SECTION.footnote}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Bubble({ turn, children }: { turn: ChatTurn; children?: React.ReactNode }) {
  return (
    <div className={`ob-bubble ${turn.role === 'user' ? 'ob-bubble-user' : 'ob-bubble-ai'}`}>
      {children ?? turn.text}
    </div>
  );
}

/**
 * Owns the per-character state so only this node re-renders while typing —
 * the rest of the section renders once per completed turn.
 */
function TypingBubble({ turn, onDone }: { turn: ChatTurn; onDone: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= turn.text.length) {
      /* Beat between turns — longer after the assistant, so its answer lands. */
      const hold = window.setTimeout(onDone, turn.role === 'user' ? 460 : 900);
      return () => window.clearTimeout(hold);
    }
    const speed = turn.role === 'user' ? 24 : 15;
    const tick = window.setTimeout(() => setCount((c) => c + 1), speed);
    return () => window.clearTimeout(tick);
  }, [count, turn, onDone]);

  return (
    <Bubble turn={turn}>
      {turn.text.slice(0, count)}
      <span className="ob-caret" aria-hidden="true" />
    </Bubble>
  );
}

/** The live entry point. Same path the run pages already expect. */
function Composer() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    const slug = createRun(trimmed);
    router.push(`/r/${slug}/define`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  }

  function applySeed(text: string) {
    setValue(text);
    const el = textareaRef.current;
    el?.focus();
    requestAnimationFrame(() => el?.setSelectionRange(text.length, text.length));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="ob-composer p-5">
        <label className="sr-only" htmlFor="idea">
          Describe your idea
        </label>
        <textarea
          id="idea"
          ref={textareaRef}
          rows={3}
          value={value}
          disabled={submitting}
          placeholder={CHAT_SECTION.composerPlaceholder}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="ob-meta">
            {value.trim().length >= SHORTCUT_HINT_AT ? CHAT_SECTION.hint : ''}
          </span>
          <button
            type="button"
            className="ob-btn ob-btn-primary"
            onClick={submit}
            disabled={!value.trim() || submitting}
          >
            {submitting ? CHAT_SECTION.submittingLabel : CHAT_SECTION.submitLabel}
            <ArrowUpRight size={16} className="ob-arrow" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="ob-meta">{CHAT_SECTION.seedsLabel}</span>
        {CHAT_SECTION.seeds.map((seed) => (
          <button type="button" key={seed} className="ob-seed" onClick={() => applySeed(seed)}>
            {seed}
          </button>
        ))}
      </div>
    </div>
  );
}
