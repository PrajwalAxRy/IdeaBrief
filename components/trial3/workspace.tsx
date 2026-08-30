'use client';

import {
  CHAT_SESSIONS,
  OPENING_TURNS,
  ROADMAP_PREVIEW,
  RUN_META,
  SCRIPT,
  SUMMARY_FIELDS,
  type Stage,
  type Turn,
  VALIDATE_PREVIEW,
} from '@/lib/content/trial3';
import { useCallback, useMemo, useState } from 'react';
import { ChatRail } from './chat-rail';
import { DefineThread } from './define-thread';
import { StagePreview } from './stage-preview';
import { StageRail } from './stage-rail';
import { SummaryRail } from './summary-rail';
import { useScriptedReply } from './use-scripted-reply';

/**
 * `/trial3` — a three-column workspace: previous chats, the Define
 * conversation, and a live summary of everything said so far.
 *
 * **The client boundary is here and nowhere else.** Every child is a
 * presentational leaf; the state that makes this route interactive — which
 * stage is being viewed, how far the script has run, what is currently
 * streaming — is genuinely shared across all three columns, so splitting it
 * would mean lifting it back here anyway. The five imported components carry
 * no `'use client'` of their own.
 *
 * **Stage navigation swaps the centre column in place.** The rails never move,
 * so Define → Validate → Roadmap reads as switching view on one run rather
 * than as leaving the page — and there are no dead links to two routes that
 * don't exist. The trade is that the locked stages have no URL of their own,
 * which is the right trade for a preview.
 *
 * Nothing here calls a model. `SCRIPT` is a fixed exchange and
 * `useScriptedReply` only controls the speed the fixed text arrives at.
 */
export function Workspace() {
  const [view, setView] = useState<Stage>('define');
  const [activeChat, setActiveChat] = useState(CHAT_SESSIONS[0].id);
  const [turns, setTurns] = useState<Turn[]>(OPENING_TURNS);
  const [stepIndex, setStepIndex] = useState(0);
  const [pending, setPending] = useState<number | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [freshKey, setFreshKey] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [approved, setApproved] = useState(false);

  const pendingStep = pending === null ? null : SCRIPT[pending];

  const onSettled = useCallback(() => {
    if (pending === null) return;
    const step = SCRIPT[pending];
    setTurns((current) => [...current, { role: 'assistant', text: step.reply }]);
    setValues((current) => ({ ...current, [step.fills]: step.value }));
    setFreshKey(step.fills);
    setStepIndex(pending + 1);
    setPending(null);
  }, [pending]);

  const streaming = useScriptedReply(pendingStep?.reply ?? null, onSettled);

  const onSend = useCallback(
    (text: string) => {
      if (text === '__approve__') {
        setApproved(true);
        setView('validate');
        return;
      }
      if (pending !== null || stepIndex >= SCRIPT.length) return;
      setTurns((current) => [...current, { role: 'user', text }]);
      setPending(stepIndex);
      setDraft('');
    },
    [pending, stepIndex],
  );

  const fields = useMemo(
    () =>
      SUMMARY_FIELDS.map((field) => ({
        ...field,
        value: field.value ?? values[field.key] ?? null,
      })),
    [values],
  );

  const activeTitle =
    CHAT_SESSIONS.find((session) => session.id === activeChat)?.title ?? CHAT_SESSIONS[0].title;

  /* Where the run *is*, as opposed to what is on screen. Approving the brief
     moves it forward one stage — the only thing on this page that does. */
  const runStage: Stage = approved ? 'validate' : 'define';

  /* The open conversation's row in the left rail reports the run's stage, not
     a stored one — otherwise approving the brief moves the stage rail forward
     and leaves the rail claiming DEFINE two columns away. */
  const sessions = useMemo(
    () =>
      CHAT_SESSIONS.map((session) =>
        session.id === activeChat ? { ...session, stage: runStage } : session,
      ),
    [activeChat, runStage],
  );

  return (
    <div className="au-ws au-layer">
      <header className="au-ws-bar">
        <span className="au-sub" style={{ color: 'var(--au-text)' }}>
          Groundwork
        </span>

        <StageRail view={view} runStage={runStage} onView={setView} />

        <div className="flex items-center justify-end gap-4">
          <span className="au-meta au-meta-sm">
            {RUN_META.id} · {approved ? 'Approved' : RUN_META.status}
          </span>
          <button type="button" className="au-btn au-btn-ghost">
            Share
          </button>
        </div>
      </header>

      <div className="au-ws-body">
        <ChatRail sessions={sessions} activeId={activeChat} onSelect={setActiveChat} />

        <main className="au-ws-main">
          {view === 'define' ? (
            <DefineThread
              title={activeTitle}
              turns={turns}
              streaming={pending === null ? null : streaming}
              seed={SCRIPT[stepIndex]?.seed ?? null}
              draft={draft}
              onDraft={setDraft}
              onSend={onSend}
              approved={approved}
              ready={stepIndex >= SCRIPT.length}
            />
          ) : (
            <StagePreview
              preview={view === 'validate' ? VALIDATE_PREVIEW : ROADMAP_PREVIEW}
              queued={approved && view === 'validate'}
              onBack={() => setView('define')}
            />
          )}
        </main>

        <SummaryRail fields={fields} freshKey={freshKey} />
      </div>
    </div>
  );
}
