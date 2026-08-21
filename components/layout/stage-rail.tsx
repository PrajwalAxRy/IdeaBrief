'use client';

import { APP_CHROME } from '@/lib/content/app';
import { useRunProgress } from '@/lib/hooks/use-run-progress';
import { type RunSegment, type StageKey, getStageStates } from '@/lib/run-stage';
import type { RunStatus } from '@/lib/schemas/run';
import Link from 'next/link';

type LockedHintKey = keyof typeof APP_CHROME.lockedHints;

function lockedHint(key: StageKey): string | undefined {
  return key in APP_CHROME.lockedHints ? APP_CHROME.lockedHints[key as LockedHintKey] : undefined;
}

/**
 * Primary navigation, and honest about where you are (D19).
 *
 * A client leaf because the reachability floor widens from `localStorage`
 * after mount — `'use client'` costs nothing here, since `RunHeader` above it
 * is already a client component and the four page bodies below the chrome stay
 * server-rendered. That is standing rule 22 working as intended: the boundary
 * sits at the leaf that actually needs storage.
 *
 * Locked segments carry **no affordance at all** — dim text, a hollow node, no
 * hover rule, no `aria-disabled`, no pointer feedback. Only the `title`. Never
 * a disabled link.
 *
 * On `/sources` no segment is active and nothing is `aria-current`: sources is
 * the evidence layer, not a stage (D16).
 */
export function StageRail({
  slug,
  status,
  segment,
}: { slug: string; status: RunStatus; segment: RunSegment }) {
  const progress = useRunProgress(slug);
  const states = getStageStates(status, segment, progress);

  return (
    <nav aria-label="Run stages">
      <ol className="ob-stage-rail">
        {APP_CHROME.stages.map((stage) => {
          const key = stage.key as StageKey;
          const state = states[key];
          const content = (
            <>
              <span className="ob-stage-node" aria-hidden="true" />
              <span className="ob-stage-label">{stage.label}</span>
            </>
          );

          return (
            <li key={key}>
              {state === 'locked' ? (
                <span className="ob-stage" data-state="locked" title={lockedHint(key)}>
                  {content}
                </span>
              ) : (
                <Link
                  href={`/r/${slug}/${key}`}
                  className="ob-stage"
                  data-state={state}
                  aria-current={state === 'active' ? 'page' : undefined}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
