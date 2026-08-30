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
} from '@/lib/content/trial4';
import { useCallback, useMemo, useState } from 'react';
import { BriefRail } from './brief-rail';
import { SessionRail } from './session-rail';
import { StagePreview } from './stage-preview';
import { StageRail } from './stage-rail';
import { Thread } from './thread';
import { useScriptedReply } from './use-scripted-reply';

/**
 * `/trial4` — a three-column Obsidian workspace: previous conversations, the
 * Define conversation, and the brief filling in as it is answered.
 *
 * **The client boundary is here and in `Thread`, and nowhere else.** The state
 * that makes the route interactive — which stage is on screen, how far the
 * script has run, what is streaming, what just landed — is genuinely shared
 * across all three columns, so splitting it would mean lifting it back here.
 * `Thread` carries a second boundary only because following streamed text down
 * a scroll container needs a ref on a DOM node it owns.
 *
 * **Stage navigation swaps the centre column in place.** The rails never move,
 * so Define → Validate → Roadmap reads as changing view on one run rather than
 * as leaving the page — and there are no dead links to two routes that do not
 * exist. The trade is that the previewed stages have no URL of their own, which
 * is the right trade for a preview.
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
      if (pending !== null || stepIndex >= SCRIPT.length) return;
      setTurns((current) => [...current, { role: 'user', text }]);
      setPending(stepIndex);
      setDraft('');
    },
    [pending, stepIndex],
  );

  /* Approving is the only thing on this page that moves the run forward, and it
     lands the reader on the stage that just unlocked. */
  const onApprove = useCallback(() => {
    setApproved(true);
    setView('validate');
  }, []);

  const fields = useMemo(
    () =>
      SUMMARY_FIELDS.map((field) => ({
        ...field,
        value: field.value ?? values[field.key] ?? null,
      })),
    [values],
  );

  const filled = fields.filter((field) => field.value !== null).length;

  const activeTitle =
    CHAT_SESSIONS.find((session) => session.id === activeChat)?.title ?? CHAT_SESSIONS[0].title;

  /* Where the run *is*, as opposed to what is on screen. */
  const runStage: Stage = approved ? 'validate' : 'define';

  return (
    <div className="t4-app">
      <header className="t4-bar">
        <div className="t4-bar-left">
          <span className="ob-sub">Groundwork</span>
          <span className="ob-meta">{RUN_META.id}</span>
        </div>

        <StageRail view={view} runStage={runStage} onView={setView} />

        <div className="t4-bar-right">
          <span className="ob-meta">{approved ? 'Brief approved' : RUN_META.status}</span>
          <button type="button" className="ob-btn ob-btn-ghost ob-btn-sm">
            Share
          </button>
        </div>
      </header>

      <div className="t4-body">
        <SessionRail
          sessions={CHAT_SESSIONS}
          activeId={activeChat}
          runStage={runStage}
          onSelect={setActiveChat}
        />

        <main className="t4-col t4-main">
          {view === 'define' ? (
            <Thread
              title={activeTitle}
              filled={filled}
              total={fields.length}
              turns={turns}
              streaming={pending === null ? null : streaming}
              seed={SCRIPT[stepIndex]?.seed ?? null}
              draft={draft}
              onDraft={setDraft}
              onSend={onSend}
              onApprove={onApprove}
              onOpenResearch={() => setView('validate')}
              ready={stepIndex >= SCRIPT.length}
              approved={approved}
            />
          ) : (
            <StagePreview
              preview={view === 'validate' ? VALIDATE_PREVIEW : ROADMAP_PREVIEW}
              queued={approved && view === 'validate'}
              onBack={() => setView('define')}
            />
          )}
        </main>

        <BriefRail fields={fields} freshKey={freshKey} />
      </div>
    </div>
  );
}
