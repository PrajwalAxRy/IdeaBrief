'use client';

import { readRunStartedAt } from '@/app/actions/create-run';
import { readBriefPatch } from '@/lib/brief-state';
import type { RunProgress } from '@/lib/run-stage';
import { useEffect, useState } from 'react';

/**
 * What the browser knows about this run that the server fixture cannot.
 *
 * Returns `null` until a mount effect runs — deliberately, and on both sides:
 * SSR and the first client render agree, then the value widens. That is the
 * same shape `useRecentRuns` uses, and it is why the honest `StageRail` can
 * read `localStorage` without a hydration mismatch. `getStageStates` only ever
 * *adds* reachability from this, so the `null` first paint is the safe floor
 * rather than a wrong answer that later corrects itself.
 *
 * `readRunStartedAt` stays as a fallback beside the brief patch so a run
 * approved before `sv.brief.<slug>` existed still reads as approved.
 */
export function useRunProgress(slug: string): RunProgress | null {
  const [progress, setProgress] = useState<RunProgress | null>(null);

  useEffect(() => {
    try {
      const patch = readBriefPatch(slug);
      setProgress({
        briefApproved: patch?.approvedAt != null || readRunStartedAt(slug) !== null,
        briefTouched: patch !== null,
      });
    } catch {
      // Storage disabled — the status-only floor is the honest answer.
    }
  }, [slug]);

  return progress;
}
